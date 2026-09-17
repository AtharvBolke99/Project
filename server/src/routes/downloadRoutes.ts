import { Router } from 'express';
import { downloadDigitalAsset } from '../controllers/downloadController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// Secure authenticated download route
router.get('/:productId', optionalAuth, downloadDigitalAsset);

export default router;
