import { Router } from 'express';
import { 
  getCategoriesAndTopics, 
  getQuestionsByTopic, 
  getQuestionBySlug, 
  submitAnswer,
  generateTest,
  submitTest
} from '../controllers/aptitudeController';
import { optionalAuth, authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/categories', optionalAuth, getCategoriesAndTopics);
router.get('/test/generate', optionalAuth, generateTest);
router.post('/test/submit', optionalAuth, submitTest);
router.get('/topics/:topicSlug', optionalAuth, getQuestionsByTopic);
router.get('/questions/:slug', optionalAuth, getQuestionBySlug);
router.post('/submit', optionalAuth, submitAnswer);

export default router;
