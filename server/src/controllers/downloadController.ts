import { Response } from 'express';
import { db } from '../database/db';
import { AuthRequest } from '../middleware/auth';
import path from 'path';
import fs from 'fs';

const MIME_MAP: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.txt': 'text/plain',
  '.csv': 'text/csv'
};

export const downloadDigitalAsset = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const user = req.user;
    const isViewMode = req.query.view === 'true' || req.query.inline === 'true';

    // 1. Verify product exists (match by id or slug)
    let product = db.findOne('products', p => p.id === productId || p.slug === productId);
    if (!product) {
      const purchaseByParam = db.findOne('purchases', p => p.id === productId || p.productId === productId);
      if (purchaseByParam) {
        product = db.findOne('products', p => p.id === purchaseByParam.productId || p.slug === purchaseByParam.productId);
      }
    }

    const isFree = product ? product.price === 0 : false;

    // 2. Authorization check
    if (!isFree) {
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required to access paid digital assets. Please provide a valid session token.'
        });
      }

      // Admins have universal preview access
      const isAdmin = user.role === 'ADMIN';

      if (!isAdmin) {
        let purchase = db.findOne('purchases', p => (p.userId === user.id || (user.email ? p.userId === user.email : false)) && (product ? p.productId === product.id : p.productId === productId));
        let order = purchase ? db.findOne('orders', o => o.id === purchase!.orderId && o.status === 'PAID') : null;

        // Auto-heal purchase if order is paid
        if (!purchase || !order) {
          const paidOrder = db.findOne('orders', o => (o.userId === user.id || (user.email ? o.userEmail === user.email : false)) && (product ? o.productId === product.id : o.productId === productId) && o.status === 'PAID');
          if (paidOrder) {
            const licenseKey = `CPY-LIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            purchase = {
              id: 'pur_' + Math.random().toString(36).substring(2, 10),
              userId: user.id,
              productId: product ? product.id : productId,
              orderId: paidOrder.id,
              downloadCount: 0,
              maxDownloads: 50,
              accessGrantedAt: paidOrder.paidAt || new Date().toISOString(),
              licenseKey
            };
            db.insert('purchases', purchase);
            order = paidOrder;
          }
        }

        if (!purchase && !order) {
          return res.status(403).json({
            success: false,
            message: 'Access Denied. You have not purchased this premium resource or your payment order is pending.'
          });
        }

        // Increment download counter
        if (purchase) {
          db.update(
            'purchases',
            p => p.id === purchase!.id,
            p => ({ downloadCount: (p.downloadCount || 0) + 1 })
          );
        }
      }
    }

    // 3. Check for physical file in uploads directory, data directory, or client assets
    const cleanTitle = (product?.title || 'Conceptifyyy_Placement_Notes').replace(/[^a-zA-Z0-9_-]/g, '_');
    const uploadsDir = path.resolve(__dirname, '../../uploads/documents');
    const uploadsRoot = path.resolve(__dirname, '../../uploads');
    const dataDir = path.resolve(__dirname, '../../data');
    const clientPublic = path.resolve(__dirname, '../../../client/public');
    const clientDist = path.resolve(__dirname, '../../../client/dist');

    let physicalFilePath: string | null = null;
    const fileTarget = (product?.digitalFile || '').trim();
    const cleanFileName = path.basename(fileTarget);
    const cleanTarget = fileTarget.replace(/^\/?(uploads\/documents\/|uploads\/|documents\/)?/, '');

    const candidates = [
      path.join(uploadsDir, cleanFileName),
      path.join(uploadsDir, cleanTarget),
      path.join(uploadsDir, fileTarget),
      path.join(uploadsRoot, cleanFileName),
      path.join(uploadsRoot, cleanTarget),
      path.join(dataDir, cleanFileName),
      path.join(dataDir, cleanTarget),
      path.join(clientPublic, cleanFileName),
      path.join(clientDist, cleanFileName),
      path.resolve(__dirname, '../../uploads/documents', cleanFileName),
      path.resolve(process.cwd(), 'server/uploads/documents', cleanFileName),
      path.resolve(process.cwd(), 'uploads/documents', cleanFileName),
      path.resolve(__dirname, '../../', cleanFileName)
    ];

    for (const candidate of candidates) {
      if (candidate && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        physicalFilePath = candidate;
        break;
      }
    }

    // Fallback: If resume template requested docx but pdf exists
    if (!physicalFilePath && (fileTarget.includes('resume') || product?.title?.toLowerCase().includes('resume'))) {
      const resumeCandidates = [
        path.join(uploadsDir, '92-ats-score-resume-template.docx'),
        path.join(uploadsDir, 'ats_friendly_resume_template.pdf'),
        path.join(clientPublic, 'ats_friendly_resume_template.pdf')
      ];
      for (const rc of resumeCandidates) {
        if (fs.existsSync(rc) && fs.statSync(rc).isFile()) {
          physicalFilePath = rc;
          break;
        }
      }
    }

    // Fallback: Default verified placement preparation handbook ONLY for the default seeded DSA product
    if (!physicalFilePath && (product?.id === 'prod_conceptifyyy_dsa_2026' || product?.slug === 'conceptifyyy-company-wise-dsa-placement-prep-2026')) {
      const defaultCandidates = [
        path.join(uploadsDir, 'conceptifyyy_company_wise_dsa_placement_prep_2026.pdf'),
        path.join(dataDir, 'conceptifyyy_company_wise_dsa_placement_prep_2026.pdf')
      ];
      for (const dc of defaultCandidates) {
        if (fs.existsSync(dc) && fs.statSync(dc).isFile()) {
          physicalFilePath = dc;
          break;
        }
      }
    }

    if (physicalFilePath && fs.existsSync(physicalFilePath)) {
      const ext = path.extname(physicalFilePath).toLowerCase();
      const mimeType = MIME_MAP[ext] || 'application/octet-stream';
      const disposition = isViewMode && ext === '.pdf' ? 'inline' : 'attachment';

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `${disposition}; filename="${cleanTitle}${ext}"`);
      return res.sendFile(physicalFilePath);
    }

    console.warn(`[NOTES] Download requested for product "${product?.title || productId}" (ID: ${productId}), but physical file "${product?.digitalFile || 'none'}" was not found on disk.`);
    return res.status(404).json({
      success: false,
      message: product?.digitalFile 
        ? `The uploaded resource file "${product.digitalFile}" for "${product.title}" was not found on server storage.` 
        : 'No digital resource file has been uploaded for this product yet.'
    });
  } catch (error: any) {
    console.error('[NOTES] Download error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Download failed.' });
  }
};
