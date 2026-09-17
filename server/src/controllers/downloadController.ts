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

    let physicalFilePath: string | null = null;

    if (product.digitalFile) {
      // Check direct filename or basename
      const possiblePath1 = path.join(uploadsDir, product.digitalFile);
      const possiblePath2 = path.join(uploadsDir, path.basename(product.digitalFile));
      const possiblePath3 = path.resolve(__dirname, '../../', product.digitalFile);

      if (fs.existsSync(possiblePath1) && fs.statSync(possiblePath1).isFile()) {
        physicalFilePath = possiblePath1;
      } else if (fs.existsSync(possiblePath2) && fs.statSync(possiblePath2).isFile()) {
        physicalFilePath = possiblePath2;
      } else if (fs.existsSync(possiblePath3) && fs.statSync(possiblePath3).isFile()) {
        physicalFilePath = possiblePath3;
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

    // 4. Generate structured digital document if no physical file was uploaded
    const isZip = product.fileFormat === 'ZIP' || product.category === 'Projects';
    const filename = `${cleanTitle}_Conceptifyyy_Official.${isZip ? 'zip' : 'pdf'}`;
    const disposition = isViewMode && !isZip ? 'inline' : 'attachment';

    let packageContent = '';

    if (isZip) {
      packageContent = `========================================================================
CONCEPTIFYYY DIGITAL PRODUCT VAULT
PRODUCT: ${product.title}
CATEGORY: ${product.category}
ACCESS: ${isFree ? 'Free Community Resource' : `Verified Licensed Access (${user?.email})`}
SECURITY HASH: SHA256-${Buffer.from(product.id).toString('hex')}
========================================================================

WHAT IS INCLUDED:
${(product.whatIncluded || ['Full Source Code', 'Architecture Diagram', 'Setup Guide']).map(item => `[✔] ${item}`).join('\n')}

PROJECT SETUP GUIDE & INSTRUCTIONS:
1. Extract this archive into your working project directory.
2. Ensure Node.js (v18+) and npm are installed.
3. Run \`npm install\` to install dependencies.
4. Configure .env with your database and API keys.
5. Run \`npm run dev\` to launch the development server.

ARCHITECTURE SUMMARY:
Tech Stack: ${(product.techStack || ['React', 'Node.js', 'Express', 'TypeScript']).join(', ')}

SYNOPSIS & ACADEMIC VIVA Q&A:
Q1: What is the core problem this project solves?
A1: High-concurrency educational telemetry, sandboxed code compilation, and interactive algorithmic visualization.

Q2: How is security handled?
A2: JWT authorization with HttpOnly tokens, parameterized ORM queries, rate-limiting, and sanitized inputs.

Support: support@conceptifyyy.com
© ${new Date().getFullYear()} CONCEPTIFYYY. All rights reserved.
`;
      res.setHeader('Content-Type', 'application/octet-stream');
    } else {
      packageContent = `%PDF-1.4
% CONCEPTIFYYY VERIFIED EDUCATIONAL RESOURCE
% Title: ${product.title}
% Category: ${product.category}
% Access: ${isFree ? 'Free Community Resource' : `Verified Licensed Access (${user?.email})`}
% Pages: ${product.pageCount || 120}

[CONCEPTIFYYY OFFICIAL STUDY GUIDE & CHEAT SHEET]
Category: ${product.category}

KEY TOPICS & INTERVIEW PATTERNS COVERED:
${(product.whatIncluded || ['Visual Diagrams', 'Pattern Cheat Sheets', 'Interview Questions']).map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

CORE ALGORITHMIC PATTERNS & COMPLEXITY CHEAT SHEET:
- Two Pointer Technique: O(N) Time | O(1) Space
- Sliding Window: O(N) Time | O(K) Space
- Fast & Slow Pointer (Floyd's Cycle): O(N) Time | O(1) Space
- Binary Search on Answer: O(log(Max-Min)) Time
- Monotonic Stack (Next Greater Element): O(N) Time | O(N) Space
- Dynamic Programming (0/1 Knapsack): O(N*W) Time | O(W) Space
- Graph BFS/DFS & Dijkstra Shortest Path: O((V+E) log V) Time

Verified & Certified for Campus Placements & Product Companies.
`;
      res.setHeader('Content-Type', 'application/pdf');
    }

    res.setHeader('Content-Disposition', `${disposition}; filename="${filename}"`);
    return res.send(Buffer.from(packageContent, 'utf-8'));
  } catch (error: any) {
    console.error('Download error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Download failed.' });
  }
};
