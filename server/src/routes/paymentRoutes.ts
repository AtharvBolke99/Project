import { Router } from 'express';
import { createOrder, verifyPayment, getOrderStatus, handleWebhook } from '../controllers/paymentController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();

// Order creation & client verification
router.post('/create-order', authenticateToken, createOrder);
router.post('/verify', authenticateToken, verifyPayment);
router.get('/order-status/:orderId', optionalAuth, getOrderStatus);

// Webhook endpoint (Raw body verification)
router.post('/webhook', handleWebhook);

export default router;
