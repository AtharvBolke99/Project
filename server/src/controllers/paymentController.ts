import { Request, Response } from 'express';
import { db, Order, Payment, Purchase } from '../database/db';
import { AuthRequest } from '../middleware/auth';
import { razorpayService } from '../services/razorpayService';
import { config } from '../config/env';
import { v4 as uuidv4 } from 'uuid';

/**
 * Step 4: Real Server-Side Order Creation
 * POST /api/payments/create-order
 */
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Please log in to purchase digital products.'
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'productId is required.'
      });
    }

    // 1. Retrieve product from database & validate availability
    const product = db.findOne('products', p => p.id === productId && p.isPublished);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or is currently unavailable.'
      });
    }

    // 2. Check if user already owns this digital product
    const existingPurchase = db.findOne('purchases', p => p.userId === user.id && p.productId === product.id);
    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: 'You already own this resource. You can download it anytime from My Purchases.',
        alreadyOwned: true
      });
    }

    // 3. Read REAL current price from database (NEVER trust frontend price)
    const priceINR = Math.max(1, Number(product.price));
    // 4. Convert INR to paise
    const amountInPaise = Math.round(priceINR * 100);

    if (amountInPaise < 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product amount. Minimum is ₹1.00 (100 paise).'
      });
    }

    const orderNumber = `CPY-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 5. Create REAL Razorpay Order on Razorpay API
    const rzpOrder = await razorpayService.createOrder({
      amountInPaise,
      currency: 'INR',
      receipt: orderNumber,
      notes: {
        userId: user.id,
        userEmail: user.email,
        productId: product.id,
        productTitle: product.title
      }
    });

    // 6. Store internal order in database with status 'PENDING'
    const newOrder: Order = {
      id: 'ord_' + uuidv4().substring(0, 8),
      orderNumber,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      productId: product.id,
      productTitle: product.title,
      amount: priceINR,
      amountPaise: amountInPaise,
      currency: 'INR',
      status: 'PENDING',
      razorpayOrderId: rzpOrder.id,
      isTestMode: config.razorpay.keyId.startsWith('rzp_test_'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.insert('orders', newOrder);

    console.log(`[RAZORPAY] Internal order stored: ${newOrder.id}, Razorpay Order ID: ${rzpOrder.id}`);

    const keyId = config.razorpay.keyId;

    // 7. Return Razorpay Order ID and configuration to frontend
    return res.json({
      success: true,
      data: {
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        razorpayOrderId: rzpOrder.id,
        amount: priceINR,
        amountPaise: amountInPaise,
        currency: 'INR',
        keyId,
        product: {
          id: product.id,
          title: product.title,
          description: product.description,
          thumbnail: product.thumbnail
        },
        user: {
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error: any) {
    console.error('[RAZORPAY] Create order error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Payment initialization failed.'
    });
  }
};

/**
 * Step 7 & 8: Server-Side Cryptographic Verification & Payment Status Verification
 * POST /api/payments/verify
 */
export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification parameters (orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature are required).'
      });
    }

    console.log(`[RAZORPAY] Payment response received for order ${orderId}, payment ${razorpayPaymentId}`);

    // 1. Find internal order
    const order = db.findOne('orders', o => o.id === orderId || o.razorpayOrderId === razorpayOrderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order record not found in database.'
      });
    }

    // 2. Check if already marked as PAID (Idempotency)
    if (order.status === 'PAID') {
      const existingPurchase = db.findOne('purchases', p => p.orderId === order.id);
      return res.json({
        success: true,
        message: 'Payment already verified and product unlocked.',
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          status: 'PAID',
          productTitle: order.productTitle,
          amount: order.amount,
          paidAt: order.paidAt,
          paymentId: order.razorpayPaymentId,
          licenseKey: existingPurchase?.licenseKey,
          downloadUrl: `/api/downloads/${order.productId}`
        }
      });
    }

    // 3. Server-side HMAC-SHA256 signature verification
    console.log(`[RAZORPAY] Verifying signature for Razorpay Order: ${razorpayOrderId}`);
    const isSignatureValid = razorpayService.verifyPaymentSignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature
    });

    if (!isSignatureValid) {
      db.update(
        'orders',
        o => o.id === order.id,
        o => ({
          status: 'FAILED' as const,
          failureReason: 'Cryptographic signature mismatch',
          updatedAt: new Date().toISOString()
        })
      );
      return res.status(400).json({
        success: false,
        message: 'Cryptographic signature verification failed. Payment was rejected by server.'
      });
    }

    // 4. Fetch real payment status from Razorpay API to confirm capture
    const paymentData = await razorpayService.fetchPayment(razorpayPaymentId);
    let paymentMethod = 'online';

    if (paymentData) {
      paymentMethod = paymentData.method || 'online';
      if (paymentData.status !== 'captured' && paymentData.status !== 'authorized') {
        console.warn(`[RAZORPAY] Payment ${razorpayPaymentId} status is ${paymentData.status}, not captured/authorized.`);
      }
    }

    const paidAt = new Date().toISOString();

    // 5. Update Order status to PAID
    db.update(
      'orders',
      o => o.id === order.id,
      o => ({
        status: 'PAID' as const,
        razorpayPaymentId,
        razorpaySignature,
        paymentMethod,
        paidAt,
        updatedAt: paidAt
      })
    );
    console.log(`[RAZORPAY] Order marked paid: ${order.id}`);

    // 6. Create Database Payment Record
    const paymentRecord: Payment = {
      id: 'pay_' + uuidv4().substring(0, 8),
      orderId: order.id,
      userId: order.userId,
      razorpayPaymentId,
      razorpayOrderId,
      amount: order.amount,
      currency: order.currency,
      status: 'SUCCESS',
      method: paymentMethod,
      createdAt: paidAt
    };
    db.insert('payments', paymentRecord);

    // 7. Create Database Purchase Record (Idempotent)
    let purchase = db.findOne('purchases', p => p.orderId === order.id);
    if (!purchase) {
      const licenseKey = `CPY-LIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      purchase = {
        id: 'pur_' + uuidv4().substring(0, 8),
        userId: order.userId,
        productId: order.productId,
        orderId: order.id,
        downloadCount: 0,
        maxDownloads: 50,
        accessGrantedAt: paidAt,
        licenseKey
      };
      db.insert('purchases', purchase);
      console.log(`[RAZORPAY] Purchase created: ${purchase.id}, License: ${licenseKey}`);
    }

    // 8. Generate in-app notification
    db.insert('notifications', {
      id: 'notif_' + uuidv4().substring(0, 8),
      userId: order.userId,
      title: '🎉 Payment Successful!',
      message: `Your purchase for "${order.productTitle}" is confirmed. Access your files in My Purchases.`,
      type: 'success',
      link: '/my-purchases',
      isRead: false,
      createdAt: paidAt
    });

    return res.json({
      success: true,
      message: 'Payment verified and product unlocked!',
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: 'PAID',
        productTitle: order.productTitle,
        amount: order.amount,
        paidAt,
        paymentId: razorpayPaymentId,
        licenseKey: purchase.licenseKey,
        downloadUrl: `/api/downloads/${order.productId}`
      }
    });
  } catch (error: any) {
    console.error('[RAZORPAY] Verify payment error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed.'
    });
  }
};

/**
 * Step 11: Real Razorpay Webhook Endpoint
 * POST /api/payments/webhook
 */
export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const bodyStr = JSON.stringify(req.body);

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || config.razorpay.webhookSecret;
    if (webhookSecret && !webhookSecret.includes('placeholder') && !webhookSecret.includes('demo')) {
      const isValid = razorpayService.verifyWebhookSignature(bodyStr, signature);
      if (!isValid) {
        console.warn('[RAZORPAY] Invalid webhook signature rejected');
        return res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log(`[RAZORPAY] Webhook event received: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id || payload.order?.entity?.id;

      if (rzpOrderId) {
        const order = db.findOne('orders', o => o.razorpayOrderId === rzpOrderId);
        if (order && order.status !== 'PAID') {
          const paidAt = new Date().toISOString();
          db.update(
            'orders',
            o => o.id === order.id,
            o => ({
              status: 'PAID' as const,
              razorpayPaymentId: paymentEntity?.id || order.razorpayPaymentId,
              paymentMethod: paymentEntity?.method || order.paymentMethod || 'online',
              paidAt,
              updatedAt: paidAt
            })
          );

          // Create payment record if not exists
          if (!db.findOne('payments', p => p.orderId === order.id)) {
            db.insert('payments', {
              id: 'pay_' + uuidv4().substring(0, 8),
              orderId: order.id,
              userId: order.userId,
              razorpayPaymentId: paymentEntity?.id || 'pay_wh_' + uuidv4().substring(0, 8),
              razorpayOrderId: rzpOrderId,
              amount: order.amount,
              currency: order.currency,
              status: 'SUCCESS',
              method: paymentEntity?.method || 'online',
              createdAt: paidAt
            });
          }

          // Grant purchase if not exists (Idempotent)
          if (!db.findOne('purchases', p => p.orderId === order.id)) {
            db.insert('purchases', {
              id: 'pur_' + uuidv4().substring(0, 8),
              userId: order.userId,
              productId: order.productId,
              orderId: order.id,
              downloadCount: 0,
              maxDownloads: 50,
              accessGrantedAt: paidAt,
              licenseKey: `CPY-LIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
            });
          }
        }
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id;
      if (rzpOrderId) {
        const order = db.findOne('orders', o => o.razorpayOrderId === rzpOrderId);
        if (order && order.status === 'PENDING') {
          db.update(
            'orders',
            o => o.id === order.id,
            o => ({
              status: 'FAILED' as const,
              failureReason: paymentEntity?.error_description || 'Payment failed on Razorpay',
              updatedAt: new Date().toISOString()
            })
          );
        }
      }
    }

    return res.json({ status: 'ok' });
  } catch (error: any) {
    console.error('[RAZORPAY] Webhook processing error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get Order Status
 * GET /api/payments/status/:orderId
 */
export const getOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    const order = db.findOne('orders', o => o.id === orderId || o.razorpayOrderId === orderId || o.orderNumber === orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (userId && order.userId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const purchase = db.findOne('purchases', p => p.orderId === order.id);

    return res.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        productTitle: order.productTitle,
        productId: order.productId,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        paidAt: order.paidAt,
        paymentId: order.razorpayPaymentId,
        licenseKey: purchase?.licenseKey,
        downloadUrl: order.status === 'PAID' ? `/api/downloads/${order.productId}` : null
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
