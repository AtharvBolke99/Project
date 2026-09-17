import { Router } from 'express';
import { runCode, submitSolution, getProblemSubmissions } from '../controllers/executionController';
import { optionalAuth, authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/run', optionalAuth, runCode);
router.post('/submit', optionalAuth, submitSolution);
router.get('/submissions/:problemId', authenticateToken, getProblemSubmissions);

export default router;
