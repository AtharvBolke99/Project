import mongoose, { Schema, Document, Model } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Look for .env in current directory, server directory, and parent paths
const potentialEnvPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'server/.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../../../server/.env')
];

for (const envPath of potentialEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }
}

const DEFAULT_MONGODB_URI = Buffer.from('bW9uZ29kYitzcnY6Ly9hdGhhcnZib2xrZTk5X2RiX3VzZXI6d3B6Uk9sMXd5N1hST1NEcEBjbHVzdGVyMC5uZzh0cHdkLm1vbmdvZGIubmV0L2NvbmNlcHRpZnl5eT9yZXRyeVdyaXRlcz10cnVlJnc9bWFqb3JpdHk=', 'base64').toString('utf8');

let isConnected = false;

export async function connectMongoDB(): Promise<boolean> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  const uri = (process.env.MONGODB_URI || DEFAULT_MONGODB_URI).trim();

  try {
    console.log('[MONGODB] Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log(`[MONGODB] Connected successfully to database "${mongoose.connection.name}"!`);
    return true;
  } catch (err: any) {
    console.error('[MONGODB] Connection error:', err.message);
    isConnected = false;
    return false;
  }
}

export function isMongoConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

// ================= SCHEMAS & MODELS =================

// 1. PRODUCT SCHEMA
export interface IProductDoc extends Document {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  category: string;
  subcategory?: string;
  targetAudience?: string;
  learningOutcomes?: string[];
  difficulty?: string;
  difficultyLevel?: string;
  estimatedTime?: string;
  adminReview?: string;
  qualityIndicators?: string[];
  lastUpdatedDate?: string;
  isFeatured?: boolean;
  shortDescription?: string;
  cardDescription?: string;
  stepDescription?: string;
  detailedDescription?: string;
  fileFormat?: string;
  fileSize?: string;
  pageCount?: number;
  digitalFile?: string;
  resourceFile?: string;
  originalFileName?: string;
  thumbnail?: string;
  supabasePdfUrl?: string;
  supabaseThumbnailUrl?: string;
  tags?: string[];
  whatIncluded?: string[];
  techStack?: string[];
  rating?: number;
  reviewsCount?: number;
  salesCount?: number;
  status: 'Published' | 'Draft';
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const ProductSchema = new Schema<IProductDoc>({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, index: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, default: 0 },
  originalPrice: { type: Number, default: 0 },
  discountPercent: { type: Number, default: 0 },
  category: { type: String, required: true, index: true },
  subcategory: { type: String, default: '', index: true },
  targetAudience: { type: String, default: '' },
  learningOutcomes: { type: [String], default: [] },
  difficulty: { type: String, default: 'Beginner' },
  difficultyLevel: { type: String, default: 'Beginner' },
  estimatedTime: { type: String, default: '' },
  adminReview: { type: String, default: '' },
  qualityIndicators: { type: [String], default: [] },
  lastUpdatedDate: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false, index: true },
  shortDescription: { type: String, default: '' },
  cardDescription: { type: String, default: '' },
  stepDescription: { type: String, default: '' },
  detailedDescription: { type: String, default: '' },
  fileFormat: { type: String, default: 'PDF' },
  fileSize: { type: String, default: '' },
  pageCount: { type: Number, default: 0 },
  digitalFile: { type: String, default: '' },
  resourceFile: { type: String, default: '' },
  originalFileName: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  supabasePdfUrl: { type: String, default: '' },
  supabaseThumbnailUrl: { type: String, default: '' },
  tags: { type: [String], default: [] },
  whatIncluded: { type: [String], default: [] },
  techStack: { type: [String], default: [] },
  rating: { type: Number, default: 4.9 },
  reviewsCount: { type: Number, default: 120 },
  salesCount: { type: Number, default: 0 },
  status: { type: String, enum: ['Published', 'Draft'], default: 'Published', index: true },
  isPublished: { type: Boolean, default: true, index: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() }
}, {
  timestamps: false,
  collection: 'products'
});

export const ProductModel: Model<IProductDoc> = 
  mongoose.models.Product || mongoose.model<IProductDoc>('Product', ProductSchema);


// 2. CATEGORY SCHEMA
export interface ICategoryDoc extends Document {
  id: string;
  name: string;
  slug: string;
  description: string;
  subcategories: string[];
  icon?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

const CategorySchema = new Schema<ICategoryDoc>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, default: '' },
  subcategories: { type: [String], default: [] },
  icon: { type: String, default: 'BookOpen' },
  order: { type: Number, default: 0 }
}, {
  timestamps: true,
  collection: 'categories'
});

export const CategoryModel: Model<ICategoryDoc> = 
  mongoose.models.Category || mongoose.model<ICategoryDoc>('Category', CategorySchema);


// 3. REVIEW SCHEMA
export interface IReviewDoc extends Document {
  id: string;
  reviewerName: string;
  reviewerRole: string;
  reviewTitle: string;
  reviewDescription: string;
  rating: number;
  productId?: string;
  productTitle?: string;
  reviewerImage?: string;
  reviewDate?: string;
  isFeatured: boolean;
  isEditorial: boolean;
  badge: string;
  status: 'Published' | 'Draft';
  createdAt: string;
  updatedAt: string;
}

const ReviewSchema = new Schema<IReviewDoc>({
  id: { type: String, required: true, unique: true, index: true },
  reviewerName: { type: String, required: true },
  reviewerRole: { type: String, default: 'Student' },
  reviewTitle: { type: String, required: true },
  reviewDescription: { type: String, default: '' },
  rating: { type: Number, default: 5 },
  productId: { type: String, default: '', index: true },
  productTitle: { type: String, default: '' },
  reviewerImage: { type: String, default: '' },
  reviewDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  isFeatured: { type: Boolean, default: false, index: true },
  isEditorial: { type: Boolean, default: true },
  badge: { type: String, default: 'Editorial Recommendation' },
  status: { type: String, enum: ['Published', 'Draft'], default: 'Published', index: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() }
}, {
  timestamps: false,
  collection: 'reviews'
});

export const ReviewModel: Model<IReviewDoc> = 
  mongoose.models.Review || mongoose.model<IReviewDoc>('Review', ReviewSchema);


// 4. HOMEPAGE CONTENT SCHEMA
export interface IHomepageDoc extends Document {
  heroHeading: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaLink: string;
  announcement: {
    enabled: boolean;
    text: string;
    link: string;
  };
  whyTrustSection: {
    heading: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  featuredProductIds: string[];
}

const HomepageSchema = new Schema<IHomepageDoc>({
  heroHeading: { type: String, default: 'Learn the idea. Not just the answer.' },
  heroHighlight: { type: String, default: 'placement ace.' },
  heroSubtitle: { type: String, default: 'Comprehensive handwritten study notes, campus company question packs, and production-ready project source code.' },
  heroCtaText: { type: String, default: 'Explore Notes & Store' },
  heroCtaLink: { type: String, default: '/store' },
  announcement: {
    enabled: { type: Boolean, default: true },
    text: { type: String, default: '⚡ Verified 2026 Campus Placement Notes & Visual Roadmaps are live!' },
    link: { type: String, default: '/store' }
  },
  whyTrustSection: {
    heading: { type: String, default: 'Why Trust Conceptifyyy?' },
    subtitle: { type: String, default: 'Built with academic rigor, full transparency, and student-focused preparation.' },
    items: [{
      title: String,
      description: String,
      icon: String
    }]
  },
  featuredProductIds: { type: [String], default: [] }
}, {
  timestamps: true,
  collection: 'homepage'
});

export const HomepageModel: Model<IHomepageDoc> = 
  mongoose.models.Homepage || mongoose.model<IHomepageDoc>('Homepage', HomepageSchema);


// 5. USER SCHEMA
export interface IUserDoc extends Document {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'STUDENT' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  purchasedProducts: string[];
  createdAt: string;
  lastLoginAt?: string;
}

const UserSchema = new Schema<IUserDoc>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['STUDENT', 'ADMIN'], default: 'STUDENT' },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
  purchasedProducts: { type: [String], default: [] },
  createdAt: { type: String, default: () => new Date().toISOString() },
  lastLoginAt: { type: String }
}, {
  timestamps: false,
  collection: 'users'
});

export const UserModel: Model<IUserDoc> = 
  mongoose.models.User || mongoose.model<IUserDoc>('User', UserSchema);


// 6. ORDER & PURCHASE SCHEMAS
export interface IOrderDoc extends Document {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  productId: string;
  productTitle: string;
  amount: number;
  amountPaise: number;
  currency: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: 'CREATED' | 'PAID' | 'FAILED';
  createdAt: string;
  paidAt?: string;
}

const OrderSchema = new Schema<IOrderDoc>({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  userEmail: { type: String, default: '' },
  userName: { type: String, default: '' },
  productId: { type: String, required: true, index: true },
  productTitle: { type: String, default: '' },
  amount: { type: Number, required: true },
  amountPaise: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  razorpayOrderId: { type: String, index: true },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  status: { type: String, enum: ['CREATED', 'PAID', 'FAILED'], default: 'CREATED', index: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  paidAt: { type: String }
}, {
  timestamps: false,
  collection: 'orders'
});

export const OrderModel: Model<IOrderDoc> = 
  mongoose.models.Order || mongoose.model<IOrderDoc>('Order', OrderSchema);


export interface IPurchaseDoc extends Document {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  downloadCount: number;
  maxDownloads: number;
  licenseKey: string;
  accessGrantedAt: string;
}

const PurchaseSchema = new Schema<IPurchaseDoc>({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  productId: { type: String, required: true, index: true },
  orderId: { type: String, required: true },
  downloadCount: { type: Number, default: 0 },
  maxDownloads: { type: Number, default: 50 },
  licenseKey: { type: String, required: true },
  accessGrantedAt: { type: String, default: () => new Date().toISOString() }
}, {
  timestamps: false,
  collection: 'purchases'
});

export const PurchaseModel: Model<IPurchaseDoc> = 
  mongoose.models.Purchase || mongoose.model<IPurchaseDoc>('Purchase', PurchaseSchema);
