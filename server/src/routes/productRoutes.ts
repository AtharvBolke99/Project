import { Router } from 'express';
import { 
  getProducts, 
  getProductBySlug, 
  getFeaturedProjects, 
  getCategories, 
  getReviews, 
  getHomepageContent 
} from '../controllers/productController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/categories', optionalAuth, getCategories);
router.get('/reviews', optionalAuth, getReviews);
router.get('/homepage', optionalAuth, getHomepageContent);
router.get('/products', optionalAuth, getProducts);
router.get('/products/:slug', optionalAuth, getProductBySlug);
router.get('/projects', optionalAuth, getFeaturedProjects);

export default router;
