import { Router } from 'express';
import { getProducts, getProductBySlug, getFeaturedProjects } from '../controllers/productController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/products', optionalAuth, getProducts);
router.get('/products/:slug', optionalAuth, getProductBySlug);
router.get('/projects', optionalAuth, getFeaturedProjects);

export default router;
