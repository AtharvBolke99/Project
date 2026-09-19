import fs from 'fs';
import path from 'path';
import { triggerCloudPersistence } from '../services/persistenceService';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'STUDENT' | 'ADMIN';
  xp: number;
  streak: number;
  lastActiveDate?: string;
  badges: string[];
  avatar?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  resetPasswordToken?: string;
  resetPasswordExpires?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  companies: string[];
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  starterCode: {
    javascript: string;
    python: string;
    cpp: string;
    java: string;
  };
  testCases: Array<{
    input: string;
    expectedOutput: string;
    isHidden?: boolean;
  }>;
  solution: {
    approach: string;
    intuition: string;
    stepByStep: string[];
    code: {
      javascript: string;
      python: string;
      cpp: string;
      java: string;
    };
    timeComplexity: string;
    spaceComplexity: string;
    commonMistakes: string[];
    interviewTips: string[];
    alternativeApproach?: string;
  };
  hints: string[];
  visualizeData?: {
    type: string;
    initialState?: any;
    steps?: Array<{
      stepNumber: number;
      label: string;
      explanation: string;
      state?: any;
      highlightedIndices?: number[];
      pointers?: Record<string, number | string>;
      complexityNote?: string;
    }>;
  };
  isDailyChallenge?: boolean;
  acceptanceRate: number;
  totalSubmissions: number;
  totalAccepted: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: 'javascript' | 'python' | 'cpp' | 'java';
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  executionTimeMs: number;
  memoryKb: number;
  testCasesPassed: number;
  totalTestCases: number;
  errorOutput?: string;
  createdAt: string;
}

export interface AptitudeTopic {
  id: string;
  title: string;
  slug: string;
  category: 'Quantitative' | 'Logical Reasoning' | 'Verbal Ability';
  description: string;
  icon: string;
  questionCount?: number;
  totalQuestions?: number;
  visualizerType?: 'work_units' | 'percentage_bar' | 'ratio_boxes' | 'series_flow' | 'probability_tree' | 'venn_diagram';
}

export interface AptitudeQuestion {
  id: string;
  topicId: string;
  topicTitle: string;
  category: 'Quantitative' | 'Logical Reasoning' | 'Verbal Ability';
  slug: string;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  options: string[];
  correctAnswer: number; // 0-indexed option
  explanation: string;
  shortcut?: string;
  formula?: string;
  visualSteps: Array<{
    stepNumber: number;
    title: string;
    description: string;
    visualType: 'work_units' | 'percentage_bar' | 'ratio_boxes' | 'series_flow' | 'probability_tree' | 'venn_diagram';
    data: any;
  }>;
  isDailyChallenge?: boolean;
  createdAt: string;
}

export interface AptitudeSubmission {
  id: string;
  userId: string;
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeSpentSec: number;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: 'DSA Notes' | 'Aptitude Notes' | 'Cheat Sheets' | 'Interview Prep' | 'Placement Bundles' | 'Projects' | 'Test Mode';
  subcategory?: string;
  shortDescription?: string;
  cardDescription?: string;
  stepDescription?: string;
  detailedDescription?: string;
  description: string;
  price: number; // in INR
  originalPrice: number;
  salePrice?: number;
  discountPercent: number;
  thumbnail: string;
  previewImages: string[];
  digitalFile: string;
  fileFormat: string; // PDF, DOCX, PPTX, ZIP, RAR, Images, CSV
  pageCount?: number;
  rating: number;
  reviewsCount: number;
  whatIncluded: string[];
  tags: string[];
  techStack?: string[];
  githubRepoUrl?: string;
  liveDemoUrl?: string;
  documentationPdf?: string;
  sourceCodeZip?: string;
  presentationPpt?: string;
  synopsis?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  seoTitle?: string;
  seoDescription?: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  productId: string;
  productTitle: string;
  amount: number; // in INR
  amountPaise: number; // in paise
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentMethod?: string;
  failureReason?: string;
  isTestMode: boolean;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  amount: number; // in INR
  currency: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  method?: string;
  createdAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  downloadCount: number;
  maxDownloads: number;
  accessGrantedAt: string;
  licenseKey: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  entityType: 'dsa' | 'aptitude' | 'product';
  entityId: string;
  createdAt: string;
}

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  category: 'DSA' | 'Aptitude';
  description: string;
  icon: string;
  estimatedHours: number;
  modules: Array<{
    id: string;
    title: string;
    description: string;
    items: Array<{
      id: string;
      title: string;
      type: 'dsa' | 'aptitude' | 'article' | 'quiz';
      slug: string;
      difficulty: string;
      xpReward: number;
    }>;
  }>;
}

export interface NotificationItem {
  id: string;
  userId?: string; // empty means broadcast to all
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'achievement' | 'challenge';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface DatabaseSchema {
  users: User[];
  problems: Problem[];
  submissions: Submission[];
  aptitudeTopics: AptitudeTopic[];
  aptitudeQuestions: AptitudeQuestion[];
  aptitudeSubmissions: AptitudeSubmission[];
  products: Product[];
  orders: Order[];
  payments: Payment[];
  purchases: Purchase[];
  bookmarks: Bookmark[];
  learningPaths: LearningPath[];
  notifications: NotificationItem[];
}

const DB_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DB_DIR, 'conceptifyyy.db.json');

const defaultData: DatabaseSchema = {
  users: [],
  problems: [],
  submissions: [],
  aptitudeTopics: [],
  aptitudeQuestions: [],
  aptitudeSubmissions: [],
  products: [],
  orders: [],
  payments: [],
  purchases: [],
  bookmarks: [],
  learningPaths: [],
  notifications: []
};

class Database {
  private data: DatabaseSchema = { ...defaultData };
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure all arrays exist
        for (const key of Object.keys(defaultData) as (keyof DatabaseSchema)[]) {
          if (!this.data[key]) {
            (this.data[key] as any) = [];
          }
        }
      } catch (err) {
        console.error('Error reading database file, initializing with defaults', err);
        this.data = { ...defaultData };
        this.save();
      }
    } else {
      this.data = { ...defaultData };
      this.save();
    }
    this.initialized = true;
  }

  public save() {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
      // Trigger cloud persistence if configured
      triggerCloudPersistence().catch(() => {});
    } catch (err) {
      console.error('Failed to save database file:', err);
    }
  }

  public get<T extends keyof DatabaseSchema>(collection: T): DatabaseSchema[T] {
    return this.data[collection];
  }

  public set<T extends keyof DatabaseSchema>(collection: T, items: DatabaseSchema[T]) {
    this.data[collection] = items;
    this.save();
  }

  public findOne<T extends keyof DatabaseSchema>(
    collection: T,
    predicate: (item: DatabaseSchema[T][number]) => boolean
  ): DatabaseSchema[T][number] | undefined {
    return (this.data[collection] as any[]).find(predicate);
  }

  public find<T extends keyof DatabaseSchema>(
    collection: T,
    predicate?: (item: DatabaseSchema[T][number]) => boolean
  ): DatabaseSchema[T] {
    if (!predicate) return this.data[collection];
    return (this.data[collection] as any[]).filter(predicate) as any;
  }

  public insert<T extends keyof DatabaseSchema>(
    collection: T,
    item: DatabaseSchema[T][number]
  ): DatabaseSchema[T][number] {
    (this.data[collection] as any[]).push(item);
    this.save();
    return item;
  }

  public update<T extends keyof DatabaseSchema>(
    collection: T,
    predicate: (item: DatabaseSchema[T][number]) => boolean,
    updater: (item: DatabaseSchema[T][number]) => Partial<DatabaseSchema[T][number]>
  ): DatabaseSchema[T][number] | null {
    const list = this.data[collection] as any[];
    const index = list.findIndex(predicate);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updater(list[index]) };
    this.save();
    return list[index];
  }

  public delete<T extends keyof DatabaseSchema>(
    collection: T,
    predicate: (item: DatabaseSchema[T][number]) => boolean
  ): boolean {
    const list = this.data[collection] as any[];
    const index = list.findIndex(predicate);
    if (index === -1) return false;
    list.splice(index, 1);
    this.save();
    return true;
  }
}

export const db = new Database();
