import { Router } from 'express';
import { 
  getProblems, 
  getProblemBySlug, 
  getProblemSolution, 
  getVisualizationData, 
  toggleBookmark, 
  getTopicsAndCompanies 
} from '../controllers/dsaController';
import { optionalAuth, authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/meta', getTopicsAndCompanies);
router.get('/problems', optionalAuth, getProblems);
router.get('/problems/:slug', optionalAuth, getProblemBySlug);
router.get('/problems/:slug/solution', optionalAuth, getProblemSolution);
router.get('/problems/:slug/visualize', optionalAuth, getVisualizationData);
router.post('/bookmark', authenticateToken, toggleBookmark);

export default router;
