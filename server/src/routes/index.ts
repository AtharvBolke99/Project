import { Router } from 'express';
import authRoutes from './authRoutes';
import dsaRoutes from './dsaRoutes';
import executionRoutes from './executionRoutes';
import aptitudeRoutes from './aptitudeRoutes';
import productRoutes from './productRoutes';
import paymentRoutes from './paymentRoutes';
import downloadRoutes from './downloadRoutes';
import userRoutes from './userRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dsa', dsaRoutes);
router.use('/execution', executionRoutes);
router.use('/aptitude', aptitudeRoutes);
router.use('/store', productRoutes);
router.use('/payments', paymentRoutes);
router.use('/downloads', downloadRoutes);
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'CONCEPTIFYYY API Server',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default router;
