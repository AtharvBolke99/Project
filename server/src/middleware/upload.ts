import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { storeStorage } from '../storage/storeStorage';

const PDFS_DIR = storeStorage.getPdfsDir();
const THUMBNAILS_DIR = storeStorage.getThumbnailsDir();

// Ensure upload directories exist
[PDFS_DIR, THUMBNAILS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'thumbnail' || file.mimetype.startsWith('image/')) {
      cb(null, THUMBNAILS_DIR);
    } else {
      cb(null, PDFS_DIR);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '_' + Math.random().toString(36).substring(7);
    const cleanExt = path.extname(file.originalname).toLowerCase() || '.bin';
    const cleanName = path.basename(file.originalname, cleanExt).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanName}_${uniqueSuffix}${cleanExt}`);
  }
});

// Supported MIME types and extensions
const allowedExtensions = [
  '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.zip', '.rar', 
  '.png', '.jpg', '.jpeg', '.svg', '.webp', '.txt', '.csv'
];

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB max
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file format "${ext}". Supported formats: ${allowedExtensions.join(', ')}`));
    }
  }
});
