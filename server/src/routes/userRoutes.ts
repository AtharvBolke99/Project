import { Router } from 'express';
import {
  getDashboardStats,
  getMyPurchases,
  getBookmarks,
  getNotifications,
  markNotificationRead,
  getLeaderboard,
  getLearningPaths,
  globalSearch
} from '../controllers/userController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authenticateToken, getDashboardStats);
router.get('/purchases', authenticateToken, getMyPurchases);
router.get('/bookmarks', authenticateToken, getBookmarks);
router.get('/notifications', optionalAuth, getNotifications);
router.put('/notifications/:id/read', authenticateToken, markNotificationRead);
router.get('/leaderboard', optionalAuth, getLeaderboard);
router.get('/learning-paths', optionalAuth, getLearningPaths);
router.get('/search', optionalAuth, globalSearch);

export default router;
