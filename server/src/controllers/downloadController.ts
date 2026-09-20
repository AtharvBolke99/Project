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

    // 1. Verify product exists
    const product = db.findOne('products', p => p.id === productId || p.slug === productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Digital product or resource not found.'
      });
    }

    const isFree = product.price === 0;

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
        const purchase = db.findOne('purchases', p => p.userId === user.id && (p.productId === product.id || p.productId === productId));
        const order = purchase ? db.findOne('orders', o => o.id === purchase.orderId && o.status === 'PAID') : null;

        if (!purchase || !order) {
          return res.status(403).json({
            success: false,
            message: 'Access Denied. You have not purchased this premium resource or your payment order is pending.'
          });
        }

        // Increment download counter
        db.update(
          'purchases',
          p => p.id === purchase.id,
          p => ({ downloadCount: (p.downloadCount || 0) + 1 })
        );
      }
    }

    // 3. Check for physical file in uploads directory
    const cleanTitle = product.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    const uploadsDir = path.resolve(__dirname, '../../uploads/documents');
    const uploadsRoot = path.resolve(__dirname, '../../uploads');

    let physicalFilePath: string | null = null;

    if (product.digitalFile) {
      const candidates = [
        path.join(uploadsDir, product.digitalFile),
        path.join(uploadsDir, path.basename(product.digitalFile)),
        path.join(uploadsRoot, product.digitalFile),
        path.join(uploadsRoot, path.basename(product.digitalFile)),
        path.resolve(__dirname, '../../', product.digitalFile)
      ];

      for (const candidate of candidates) {
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          physicalFilePath = candidate;
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

    // 4. If no physical file exists on disk, never hallucinate or invent fake notes
    console.warn(`[NOTES] Download requested for product "${product.title}" (ID: ${product.id}), but physical file "${product.digitalFile || 'none'}" was not found on disk.`);
    return res.status(404).json({
      success: false,
      message: 'The digital file for this product is not available for download. Please contact support or the administrator.'
    });
  } catch (error: any) {
    console.error('[NOTES] Download error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Download failed.' });
  }
};
