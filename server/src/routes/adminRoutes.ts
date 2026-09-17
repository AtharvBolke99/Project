import { Router } from 'express';
import {
  getAdminOverview,
  createProblem,
  updateProblem,
  deleteProblem,
  bulkImportDsaProblems,
  createAptitudeQuestion,
  deleteAptitudeQuestion,
  bulkImportAptitudeQuestions,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  getAdminUsers,
  updateUserStatus,
  uploadAdminFile
} from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { uploadMiddleware } from '../middleware/upload';

const router = Router();

// Protect all admin CMS routes
router.use(authenticateToken, requireAdmin);

router.get('/overview', getAdminOverview);

// File & Thumbnail Upload
router.post('/upload', uploadMiddleware.single('file'), uploadAdminFile);

// DSA Problems CMS
router.post('/problems', createProblem);
router.post('/dsa/import', bulkImportDsaProblems);
router.put('/problems/:id', updateProblem);
router.delete('/problems/:id', deleteProblem);

// Aptitude CMS
router.post('/aptitude', createAptitudeQuestion);
router.post('/aptitude/import', bulkImportAptitudeQuestions);
router.delete('/aptitude/:id', deleteAptitudeQuestion);

// Products & Projects CMS
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Orders & Users
router.get('/orders', getAdminOrders);
router.get('/users', getAdminUsers);
router.put('/users/:id', updateUserStatus);

export default router;
