import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../config/env';

export class RazorpayService {
  private getClient(): any {
    const keyId = config.razorpay.keyId || process.env.RAZORPAY_KEY_ID || '';
    const keySecret = config.razorpay.keySecret || process.env.RAZORPAY_KEY_SECRET || '';

    if (!keyId || !keySecret) {
      throw new Error('Razorpay SDK client is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment.');
    }

    console.log(`[RAZORPAY] Initializing SDK with Key ID: ${keyId}`);

    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  /**
   * Create a real Razorpay Order on the Razorpay API
   */
  public async createOrder(options: {
    amountInPaise: number;
    currency?: string;
    receipt: string;
    notes?: Record<string, string>;
  }): Promise<{
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
  }> {
    const currency = options.currency || 'INR';
    const razorpayClient: any = this.getClient();

    if (options.amountInPaise < 100) {
      throw new Error('Minimum transaction amount is ₹1.00 (100 paise).');
    }

    console.log(`[RAZORPAY] Creating order for receipt: ${options.receipt}, amount: ${options.amountInPaise} paise`);

    try {
      const order: any = await razorpayClient.orders.create({
        amount: options.amountInPaise,
        currency,
        receipt: options.receipt,
        notes: options.notes || {},
        payment_capture: 1
      });

      console.log(`[RAZORPAY] Order created successfully: ${order.id}`);

      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status
      };
    } catch (error: any) {
      const errorMsg = error?.error?.description || error?.message || 'Razorpay Order Creation Failed';
      console.error(`[RAZORPAY] Order creation failed:`, errorMsg);
      if (errorMsg.toLowerCase().includes('authentication failed')) {
        throw new Error('Razorpay Authentication Failed: The RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in server/.env is invalid or placeholder. Please update server/.env with your real Razorpay Test Key and Secret from https://dashboard.razorpay.com/app/keys');
      }
      throw new Error(`Razorpay Order Creation Failed: ${errorMsg}`);
    }
  }

  /**
   * Cryptographically verify the payment signature using HMAC-SHA256
   * formula: HMAC-SHA256(razorpay_order_id + '|' + razorpay_payment_id, RAZORPAY_KEY_SECRET)
   */
  public verifyPaymentSignature(params: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): boolean {
    const { orderId, paymentId, signature } = params;
    if (!orderId || !paymentId || !signature) {
      console.warn('[RAZORPAY] Verification parameters incomplete');
      return false;
    }

    const keySecret = config.razorpay.keySecret || process.env.RAZORPAY_KEY_SECRET || '';
    if (!keySecret) {
      console.error('[RAZORPAY] RAZORPAY_KEY_SECRET missing in environment');
      return false;
    }

    console.log(`[RAZORPAY] Verifying signature for order ${orderId}`);

    try {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const isValid = crypto.timingSafeEqual(
        Buffer.from(generatedSignature.toLowerCase(), 'utf-8'),
        Buffer.from(signature.toLowerCase(), 'utf-8')
      );

      if (isValid) {
        console.log(`[RAZORPAY] Signature verified successfully for order ${orderId}`);
      } else {
        console.warn(`[RAZORPAY] Signature mismatch for order ${orderId}`);
      }

      return isValid;
    } catch (err: any) {
      console.error('[RAZORPAY] Signature verification exception:', err.message);
      return false;
    }
  }

  /**
   * Fetch real payment details directly from Razorpay API to confirm payment status
   */
  public async fetchPayment(paymentId: string): Promise<{
    id: string;
    status: string;
    amount: number;
    currency: string;
    method: string;
    captured: boolean;
    order_id: string;
  } | null> {
    const razorpayClient: any = this.getClient();

    console.log(`[RAZORPAY] Checking payment status for ${paymentId}`);

    try {
      const payment: any = await razorpayClient.payments.fetch(paymentId);
      console.log(`[RAZORPAY] Payment status for ${paymentId}: ${payment.status}, captured: ${payment.captured}`);
      return {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method || 'unknown',
        captured: Boolean(payment.captured),
        order_id: payment.order_id
      };
    } catch (err: any) {
      console.error(`[RAZORPAY] Could not fetch payment ${paymentId}:`, err?.error?.description || err.message);
      return null;
    }
  }

  /**
   * Verify Webhook Signature using HMAC-SHA256
   */
  public verifyWebhookSignature(rawBody: string, receivedSignature: string): boolean {
    const webhookSecret = config.razorpay.webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET || '';
    if (!rawBody || !receivedSignature || !webhookSecret) {
      return false;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature.toLowerCase(), 'utf-8'),
        Buffer.from(receivedSignature.toLowerCase(), 'utf-8')
      );
    } catch (err: any) {
      console.error('[RAZORPAY] Webhook signature verification error:', err.message);
      return false;
    }
  }
}

export const razorpayService = new RazorpayService();
