import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Product, Category, Review, HomepageContent } from '../database/db';
import { 
  connectMongoDB, 
  isMongoConnected, 
  ProductModel, 
  CategoryModel, 
  ReviewModel, 
  HomepageModel 
} from '../database/mongodb';
import { 
  deleteFromSupabase, 
  BUCKET_PDFS, 
  BUCKET_THUMBNAILS 
} from '../services/supabaseService';

export interface StoreStorageConfig {
  storeDir: string;
  productsFile: string;
  categoriesFile: string;
  reviewsFile: string;
  homepageFile: string;
  pdfsDir: string;
  thumbnailsDir: string;
}

export class StoreStorage {
  private config: StoreStorageConfig;
  private productsCache: Product[] | null = null;
  private categoriesCache: Category[] | null = null;
  private reviewsCache: Review[] | null = null;
  private homepageCache: HomepageContent | null = null;
  private isInitialized = false;

  constructor(customDir?: string) {
    const targetDir = customDir || process.env.STORE_DATA_PATH || process.env.RENDER_DISK_PATH;
    const storeDir = targetDir
      ? path.resolve(targetDir)
      : path.resolve(__dirname, '../../data/store');

    this.config = {
      storeDir,
      productsFile: path.join(storeDir, 'products.json'),
      categoriesFile: path.join(storeDir, 'categories.json'),
      reviewsFile: path.join(storeDir, 'reviews.json'),
      homepageFile: path.join(storeDir, 'homepage.json'),
      pdfsDir: path.join(storeDir, 'uploads', 'pdfs'),
      thumbnailsDir: path.join(storeDir, 'uploads', 'thumbnails')
    };

    this.init();
  }

  /**
   * Initializes store directories, products.json, categories.json, reviews.json, and homepage.json.
   */
  private init(): void {
    if (this.isInitialized) return;

    try {
      // 1. Ensure storage directories exist
      [this.config.storeDir, this.config.pdfsDir, this.config.thumbnailsDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });

      // 2. Ensure initial products.json
      if (!fs.existsSync(this.config.productsFile)) {
        let initialProducts: Product[] = [];
        const legacyDbPath = path.resolve(__dirname, '../../data/conceptifyyy.db.json');
        if (fs.existsSync(legacyDbPath)) {
          try {
            const raw = fs.readFileSync(legacyDbPath, 'utf8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed.products)) {
              initialProducts = parsed.products.filter((p: any) => 
                p && 
                p.id !== 'prod_test_mode_item' && 
                p.category !== 'Test Mode' && 
                p.slug !== 'conceptifyyy-test-product' &&
                !p.isDeleted
              );
            }
          } catch (e: any) {
            console.warn('[STORE-STORAGE] Could not read legacy db for migration:', e.message);
          }
        }
        this.saveProductsAtomic(initialProducts);
        console.log(`[STORE-STORAGE] Initialized products.json at ${this.config.productsFile} with ${initialProducts.length} materials.`);
      } else {
        this.loadProducts();
      }

      // 3. Ensure initial categories.json
      if (!fs.existsSync(this.config.categoriesFile)) {
        const initialCategories: Category[] = [
          {
            id: 'cat_dsa_notes',
            name: 'DSA Notes',
            slug: 'dsa-notes',
            description: 'Comprehensive Data Structures & Algorithms notes with visual diagrams',
            subcategories: ['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Dynamic Programming', 'Recursion & Backtracking'],
            order: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'cat_python',
            name: 'Python',
            slug: 'python',
            description: 'Complete Python programming guide from fundamentals to OOP',
            subcategories: ['Basics & Syntax', 'OOP Concepts', 'Data Structures', 'Projects & Modules'],
            order: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'cat_mysql_dbms',
            name: 'MySQL / DBMS',
            slug: 'mysql-dbms',
            description: 'Database management systems, SQL queries, normalization, and indexing',
            subcategories: ['SQL Queries & Joins', 'Database Design & Normalization', 'Transactions & Indexing'],
            order: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'cat_aptitude',
            name: 'Aptitude Notes',
            slug: 'aptitude-notes',
            description: 'Quantitative aptitude, logical reasoning, and shortcut formula guides',
            subcategories: ['Quantitative Aptitude', 'Logical Reasoning', 'Speed Math & Shortcuts'],
            order: 4,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'cat_projects',
            name: 'Projects',
            slug: 'projects',
            description: 'Full-stack production projects with source code and documentation',
            subcategories: ['MERN Stack', 'Full-Stack Web', 'API & Backend'],
            order: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'cat_placement_bundles',
            name: 'Placement Bundles',
            slug: 'placement-bundles',
            description: 'ATS-friendly resumes, HR round guides, and company interview packs',
            subcategories: ['Resume Templates', 'Interview Question Packs', 'HR & Technical Prep'],
            order: 6,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        this.saveCategoriesAtomic(initialCategories);
      } else {
        this.loadCategories();
      }

      // 4. Ensure initial reviews.json
      if (!fs.existsSync(this.config.reviewsFile)) {
        const initialReviews: Review[] = [
          {
            id: 'rev_editorial_1',
            reviewerName: 'Conceptifyyy Academic Team',
            reviewerRole: 'Curriculum & Placement Editorial Team',
            reviewTitle: 'Curated for FAANG & Tier-1 Campus Hiring',
            reviewDescription: 'Every concept in this visual guide is formatted around common interview patterns: recurrence trees, edge-case detection, and optimal memory layouts.',
            reviewerImage: '',
            rating: 5,
            reviewDate: '2026-02-10',
            isFeatured: true,
            isEditorial: true,
            badge: 'Editorial Recommendation',
            status: 'Published',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'rev_editorial_2',
            reviewerName: 'Campus Placement Mentor',
            reviewerRole: 'Technical Instructor & Interviewer',
            reviewTitle: 'Clear diagrams eliminate rote memorization',
            reviewDescription: 'Students frequently struggle with pointer manipulation and tree traversals. The visual diagrams break down pointer updates step by step.',
            reviewerImage: '',
            rating: 5,
            reviewDate: '2026-02-18',
            isFeatured: true,
            isEditorial: true,
            badge: 'Instructor Note',
            status: 'Published',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        this.saveReviewsAtomic(initialReviews);
      } else {
        this.loadReviews();
      }

      // 5. Ensure initial homepage.json
      if (!fs.existsSync(this.config.homepageFile)) {
        const initialHomepage: HomepageContent = {
          heroHeading: 'Learn the idea. Not just the answer.',
          heroHighlight: 'placement ace.',
          heroSubtitle: 'Comprehensive handwritten study notes, campus company question packs, and production-ready project source code.',
          heroCtaText: 'Explore Notes & Store',
          heroCtaLink: '/store',
          announcement: {
            enabled: true,
            text: '⚡ Verified 2026 Campus Placement Notes & Visual Roadmaps are live!',
            link: '/store'
          },
          whyTrustSection: {
            heading: 'Why Trust Conceptifyyy?',
            subtitle: 'Built with academic rigor, full transparency, and student-focused preparation.',
            items: [
              {
                title: 'Curated Learning Resources',
                description: 'Every resource is selected and organized to help students prepare for academics, technical interviews, and placements.',
                icon: 'BookOpen'
              },
              {
                title: 'Clear Product Information',
                description: 'Students can check the topics, file format, learning outcomes, and pricing before purchasing.',
                icon: 'FileCheck'
              },
              {
                title: 'Student-Focused Platform',
                description: 'Resources are organized around real student learning and placement preparation needs.',
                icon: 'GraduationCap'
              },
              {
                title: 'Transparent Pricing',
                description: 'Display accurate prices without hidden charges. Zero surprise fees.',
                icon: 'Tag'
              },
              {
                title: 'Secure Payments',
                description: 'Official 256-bit SSL encrypted checkout powered securely by Razorpay.',
                icon: 'ShieldCheck'
              },
              {
                title: 'Easy Access to Resources',
                description: 'Instant digital downloads and lifetime perpetual access in your personal student vault.',
                icon: 'Download'
              }
            ]
          },
          featuredProductIds: []
        };
        this.saveHomepageAtomic(initialHomepage);
      } else {
        this.loadHomepage();
      }

      this.isInitialized = true;
    } catch (err: any) {
      console.error('[STORE-STORAGE] Initialization error:', err);
    }
  }

  // ================= STORAGE DIRECTORY GETTERS =================

  public getStoreDir(): string {
    return this.config.storeDir;
  }

  public getPdfsDir(): string {
    return this.config.pdfsDir;
  }

  public getThumbnailsDir(): string {
    return this.config.thumbnailsDir;
  }

  public getProductsFilePath(): string {
    return this.config.productsFile;
  }

  public getCategoriesFilePath(): string {
    return this.config.categoriesFile;
  }

  public getReviewsFilePath(): string {
    return this.config.reviewsFile;
  }

  public getHomepageFilePath(): string {
    return this.config.homepageFile;
  }

  // ================= ATOMIC FILE WRITE UTILITIES =================

  private writeJsonAtomic(filePath: string, data: any): void {
    const tempFile = `${filePath}.tmp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    try {
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
      fs.renameSync(tempFile, filePath);
    } catch (err: any) {
      if (fs.existsSync(tempFile)) {
        try { fs.unlinkSync(tempFile); } catch {}
      }
      throw new Error(`Failed to write atomic file (${path.basename(filePath)}): ${err.message}`);
    }
  }

  // ================= MONGODB ASYNC HELPERS =================

  private async saveProductToMongo(product: Product): Promise<void> {
    if (!isMongoConnected()) return;
    try {
      await ProductModel.findOneAndUpdate({ id: product.id }, product, { upsert: true, new: true });
    } catch (err: any) {
      console.warn(`[STORE-STORAGE] Could not sync product ${product.id} to MongoDB:`, err.message);
    }
  }

  private async deleteProductFromMongo(id: string): Promise<void> {
    if (!isMongoConnected()) return;
    try {
      await ProductModel.deleteOne({ id });
    } catch (err: any) {
      console.warn(`[STORE-STORAGE] Could not delete product ${id} from MongoDB:`, err.message);
    }
  }

  private async saveCategoryToMongo(category: Category): Promise<void> {
    if (!isMongoConnected()) return;
    try {
      await CategoryModel.findOneAndUpdate({ id: category.id }, category, { upsert: true, new: true });
    } catch (err: any) {
      console.warn(`[STORE-STORAGE] Could not sync category ${category.id} to MongoDB:`, err.message);
    }
  }

  private async deleteCategoryFromMongo(id: string): Promise<void> {
    if (!isMongoConnected()) return;
    try {
      await CategoryModel.deleteOne({ id });
    } catch (err: any) {
      console.warn(`[STORE-STORAGE] Could not delete category ${id} from MongoDB:`, err.message);
    }
  }

  private async saveReviewToMongo(review: Review): Promise<void> {
    if (!isMongoConnected()) return;
    try {
      await ReviewModel.findOneAndUpdate({ id: review.id }, review, { upsert: true, new: true });
    } catch (err: any) {
      console.warn(`[STORE-STORAGE] Could not sync review ${review.id} to MongoDB:`, err.message);
    }
  }

  private async deleteReviewFromMongo(id: string): Promise<void> {
    if (!isMongoConnected()) return;
    try {
      await ReviewModel.deleteOne({ id });
    } catch (err: any) {
      console.warn(`[STORE-STORAGE] Could not delete review ${id} from MongoDB:`, err.message);
    }
  }

  private async saveHomepageToMongo(homepage: HomepageContent): Promise<void> {
    if (!isMongoConnected()) return;
    try {
      await HomepageModel.findOneAndUpdate({}, homepage, { upsert: true, new: true });
    } catch (err: any) {
      console.warn(`[STORE-STORAGE] Could not sync homepage to MongoDB:`, err.message);
    }
  }

  /**
   * Bi-directional synchronization between MongoDB and local JSON files.
   * Ensures zero downtime and complete data durability across restarts.
   */
  public async syncWithMongoDB(): Promise<void> {
    try {
      const connected = await connectMongoDB();
      if (!connected) return;

      // 1. Sync Products
      const mongoProducts = await ProductModel.find().lean();
      if (mongoProducts.length > 0) {
        const cleaned: Product[] = mongoProducts.map((p: any) => {
          const { _id, __v, ...rest } = p;
          return rest as Product;
        });
        this.saveProductsAtomic(cleaned);
        console.log(`[STORE-STORAGE] Synced ${cleaned.length} products from MongoDB.`);
      } else {
        const local = this.loadProducts();
        if (local.length > 0) {
          for (const prod of local) {
            await ProductModel.findOneAndUpdate({ id: prod.id }, prod, { upsert: true });
          }
          console.log(`[STORE-STORAGE] Seeded ${local.length} products to MongoDB.`);
        }
      }

      // 2. Sync Categories
      const mongoCategories = await CategoryModel.find().lean();
      if (mongoCategories.length > 0) {
        const cleaned: Category[] = mongoCategories.map((c: any) => {
          const { _id, __v, ...rest } = c;
          return rest as Category;
        });
        this.saveCategoriesAtomic(cleaned);
        console.log(`[STORE-STORAGE] Synced ${cleaned.length} categories from MongoDB.`);
      } else {
        const local = this.loadCategories();
        if (local.length > 0) {
          for (const cat of local) {
            await CategoryModel.findOneAndUpdate({ id: cat.id }, cat, { upsert: true });
          }
          console.log(`[STORE-STORAGE] Seeded ${local.length} categories to MongoDB.`);
        }
      }

      // 3. Sync Reviews
      const mongoReviews = await ReviewModel.find().lean();
      if (mongoReviews.length > 0) {
        const cleaned: Review[] = mongoReviews.map((r: any) => {
          const { _id, __v, ...rest } = r;
          return rest as Review;
        });
        this.saveReviewsAtomic(cleaned);
        console.log(`[STORE-STORAGE] Synced ${cleaned.length} reviews from MongoDB.`);
      } else {
        const local = this.loadReviews();
        if (local.length > 0) {
          for (const rev of local) {
            await ReviewModel.findOneAndUpdate({ id: rev.id }, rev, { upsert: true });
          }
          console.log(`[STORE-STORAGE] Seeded ${local.length} reviews to MongoDB.`);
        }
      }

      // 4. Sync Homepage
      const mongoHomepage = await HomepageModel.findOne().lean();
      if (mongoHomepage) {
        const { _id, __v, ...rest } = mongoHomepage as any;
        this.saveHomepageAtomic(rest as HomepageContent);
        console.log(`[STORE-STORAGE] Synced homepage content from MongoDB.`);
      } else {
        const local = this.loadHomepage();
        if (local) {
          await HomepageModel.create(local);
          console.log(`[STORE-STORAGE] Seeded homepage content to MongoDB.`);
        }
      }
    } catch (err: any) {
      console.error('[STORE-STORAGE] syncWithMongoDB error:', err.message);
    }
  }

  // ================= 1. PRODUCTS MANAGEMENT =================

  private saveProductsAtomic(products: Product[]): void {
    this.writeJsonAtomic(this.config.productsFile, products);
    this.productsCache = [...products];
  }

  public loadProducts(): Product[] {
    try {
      if (!fs.existsSync(this.config.productsFile)) {
        this.saveProductsAtomic([]);
        return [];
      }
      const raw = fs.readFileSync(this.config.productsFile, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        this.productsCache = data;
        return [...data];
      }
      return [];
    } catch (err: any) {
      console.error('[STORE-STORAGE] Error loading products.json:', err.message);
      return this.productsCache ? [...this.productsCache] : [];
    }
  }

  public getAllProducts(options: {
    includeDrafts?: boolean;
    category?: string;
    subcategory?: string;
    search?: string;
    sort?: string;
  } = {}): (Product & { isFileAvailable: boolean })[] {
    let products = this.loadProducts();

    // 1. Visibility filter
    if (!options.includeDrafts) {
      products = products.filter(p => p.isPublished !== false && p.status !== 'Draft' && p.status !== 'DRAFT');
    }

    // 2. Dynamic Category filter (matches exact category or subcategory)
    if (options.category && options.category !== 'All') {
      const catLower = options.category.toLowerCase().trim();
      products = products.filter(p => {
        const pCat = (p.category || '').toLowerCase().trim();
        const pSub = (p.subcategory || '').toLowerCase().trim();
        return pCat === catLower || pSub === catLower;
      });
    }

    // 3. Dynamic Subcategory filter
    if (options.subcategory && options.subcategory !== 'All') {
      const subLower = options.subcategory.toLowerCase().trim();
      products = products.filter(p => (p.subcategory || '').toLowerCase().trim() === subLower);
    }

    // 4. Search query
    if (options.search && options.search.trim()) {
      const q = options.search.trim().toLowerCase();
      products = products.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.cardDescription && p.cardDescription.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
        (p.targetAudience && p.targetAudience.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
        (p.techStack && p.techStack.some(t => t.toLowerCase().includes(q)))
      );
    }

    // 5. Sorting
    if (options.sort === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (options.sort === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (options.sort === 'popular') {
      products.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    } else {
      // Default: Newest First
      products.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    // 6. Attach file existence status
    return products.map(p => ({
      ...p,
      isFileAvailable: this.isDocumentAvailable(p.digitalFile, p.supabasePdfUrl)
    }));
  }

  public getProduct(idOrSlug: string): (Product & { isFileAvailable: boolean }) | null {
    const products = this.loadProducts();
    const target = idOrSlug.trim().toLowerCase();

    const product = products.find(p => 
      p.id.toLowerCase() === target || 
      p.slug.toLowerCase() === target ||
      (target.length >= 8 && p.slug.toLowerCase().includes(target))
    );

    if (!product) return null;

    return {
      ...product,
      isFileAvailable: this.isDocumentAvailable(product.digitalFile, product.supabasePdfUrl)
    };
  }

  public createProduct(data: Partial<Product>): Product {
    const products = this.loadProducts();

    // Permanent unique ID
    const id = 'prod_' + uuidv4().replace(/-/g, '').substring(0, 12);

    // Collision-free slug
    let baseSlug = (data.slug || data.title || 'notes')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    if (!baseSlug) baseSlug = 'resource';

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (products.some(p => p.slug === uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const cardDesc = data.cardDescription || data.shortDescription || (data.description ? data.description.substring(0, 160) : '');
    const stepDesc = data.stepDescription || data.detailedDescription || data.description || '';
    const mainDesc = stepDesc || cardDesc || '';

    const isDraft = data.status === 'Draft' || data.status === 'DRAFT' || data.isPublished === false;
    const status = isDraft ? 'Draft' : 'Published';
    const isPublished = !isDraft;

    // Use admin-supplied category without auto-defaulting to DSA
    const category = data.category ? String(data.category).trim() : 'General Notes';
    const subcategory = data.subcategory ? String(data.subcategory).trim() : undefined;

    const newProduct: Product = {
      id,
      title: data.title || 'Untitled Resource',
      slug: uniqueSlug,
      category,
      subcategory,
      cardDescription: cardDesc,
      shortDescription: cardDesc,
      stepDescription: stepDesc,
      detailedDescription: stepDesc,
      description: mainDesc,
      price: Number(data.price) || 0,
      originalPrice: Number(data.originalPrice) || 0,
      salePrice: data.salePrice !== undefined ? Number(data.salePrice) : undefined,
      discountPercent: Number(data.discountPercent) || (data.originalPrice && data.originalPrice > (data.price || 0) ? Math.round(((data.originalPrice - (data.price || 0)) / data.originalPrice) * 100) : 0),
      thumbnail: data.thumbnail ? data.thumbnail.trim() : '',
      supabaseThumbnailUrl: data.supabaseThumbnailUrl || (data.thumbnail && data.thumbnail.startsWith('http') ? data.thumbnail : undefined),
      supabasePdfUrl: data.supabasePdfUrl || undefined,
      previewImages: Array.isArray(data.previewImages) ? data.previewImages : [],
      digitalFile: data.digitalFile ? path.basename(data.digitalFile) : '',
      fileFormat: data.fileFormat || 'PDF',
      pageCount: data.pageCount ? Number(data.pageCount) : undefined,
      rating: data.rating ? Number(data.rating) : 4.9,
      reviewsCount: data.reviewsCount !== undefined ? Number(data.reviewsCount) : (Math.floor(Math.random() * (200 - 50 + 1)) + 50),
      whatIncluded: Array.isArray(data.whatIncluded) ? data.whatIncluded : (data.whatIncluded ? String(data.whatIncluded).split(',').map((s: string) => s.trim()).filter(Boolean) : []),
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? String(data.tags).split(',').map((s: string) => s.trim()).filter(Boolean) : []),
      techStack: Array.isArray(data.techStack) ? data.techStack : [],
      githubRepoUrl: data.githubRepoUrl || '',
      liveDemoUrl: data.liveDemoUrl || '',
      documentationPdf: data.documentationPdf || '',
      sourceCodeZip: data.sourceCodeZip || '',
      presentationPpt: data.presentationPpt || '',
      synopsis: data.synopsis || '',
      difficulty: data.difficulty || undefined,
      targetAudience: data.targetAudience ? String(data.targetAudience).trim() : undefined,
      learningOutcomes: Array.isArray(data.learningOutcomes) 
        ? data.learningOutcomes 
        : (data.learningOutcomes ? String(data.learningOutcomes).split('\n').map((s: string) => s.trim()).filter(Boolean) : []),
      estimatedTime: data.estimatedTime ? String(data.estimatedTime).trim() : undefined,
      adminReview: data.adminReview ? String(data.adminReview).trim() : undefined,
      qualityIndicators: Array.isArray(data.qualityIndicators) ? data.qualityIndicators : [],
      lastUpdatedDate: data.lastUpdatedDate ? String(data.lastUpdatedDate).trim() : new Date().toISOString().split('T')[0],
      seoTitle: data.seoTitle || data.title,
      seoDescription: data.seoDescription || cardDesc || mainDesc,
      isFeatured: Boolean(data.isFeatured),
      isPublished,
      status: status as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Prepend (newest first)
    products.unshift(newProduct);
    this.saveProductsAtomic(products);
    this.saveProductToMongo(newProduct);

    console.log(`[STORE-STORAGE] Created product: "${newProduct.title}" (ID: ${newProduct.id}, Category: "${newProduct.category}")`);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.loadProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const existing = products[idx];

    // Status sync
    let status = existing.status;
    let isPublished = existing.isPublished;
    if (updates.status !== undefined) {
      status = (updates.status === 'Draft' || updates.status === 'DRAFT') ? 'Draft' : 'Published';
      isPublished = status === 'Published';
    } else if (updates.isPublished !== undefined) {
      isPublished = Boolean(updates.isPublished);
      status = isPublished ? 'Published' : 'Draft';
    }

    const cardDesc = updates.cardDescription !== undefined 
      ? updates.cardDescription 
      : (updates.shortDescription !== undefined ? updates.shortDescription : existing.cardDescription);
    const stepDesc = updates.stepDescription !== undefined 
      ? updates.stepDescription 
      : (updates.detailedDescription !== undefined ? updates.detailedDescription : existing.stepDescription);
    const mainDesc = updates.description !== undefined 
      ? updates.description 
      : (stepDesc || existing.description);

    // Clean old files if replaced
    if (updates.digitalFile && updates.digitalFile !== existing.digitalFile) {
      this.safeDeleteUploadFile(existing.digitalFile, 'pdf');
    }
    if (updates.thumbnail && updates.thumbnail !== existing.thumbnail && existing.thumbnail.startsWith('/uploads/')) {
      this.safeDeleteUploadFile(existing.thumbnail, 'thumbnail');
    }

    const updated: Product = {
      ...existing,
      ...updates,
      id: existing.id, // ID is permanent and immutable
      status: status as any,
      isPublished,
      category: updates.category !== undefined ? String(updates.category).trim() : existing.category,
      subcategory: updates.subcategory !== undefined ? (updates.subcategory ? String(updates.subcategory).trim() : undefined) : existing.subcategory,
      cardDescription: cardDesc,
      shortDescription: cardDesc,
      stepDescription: stepDesc,
      detailedDescription: stepDesc,
      description: mainDesc,
      targetAudience: updates.targetAudience !== undefined ? (updates.targetAudience ? String(updates.targetAudience).trim() : undefined) : existing.targetAudience,
      learningOutcomes: updates.learningOutcomes !== undefined ? (Array.isArray(updates.learningOutcomes) ? updates.learningOutcomes : String(updates.learningOutcomes).split('\n').map(s => s.trim()).filter(Boolean)) : existing.learningOutcomes,
      estimatedTime: updates.estimatedTime !== undefined ? (updates.estimatedTime ? String(updates.estimatedTime).trim() : undefined) : existing.estimatedTime,
      adminReview: updates.adminReview !== undefined ? (updates.adminReview ? String(updates.adminReview).trim() : undefined) : existing.adminReview,
      qualityIndicators: updates.qualityIndicators !== undefined ? (Array.isArray(updates.qualityIndicators) ? updates.qualityIndicators : []) : existing.qualityIndicators,
      lastUpdatedDate: updates.lastUpdatedDate !== undefined ? (updates.lastUpdatedDate ? String(updates.lastUpdatedDate).trim() : undefined) : existing.lastUpdatedDate,
      isFeatured: updates.isFeatured !== undefined ? Boolean(updates.isFeatured) : existing.isFeatured,
      digitalFile: updates.digitalFile !== undefined ? (updates.digitalFile ? path.basename(updates.digitalFile) : '') : existing.digitalFile,
      thumbnail: updates.thumbnail !== undefined ? updates.thumbnail.trim() : existing.thumbnail,
      supabaseThumbnailUrl: updates.supabaseThumbnailUrl || (updates.thumbnail && updates.thumbnail.startsWith('http') ? updates.thumbnail : existing.supabaseThumbnailUrl),
      supabasePdfUrl: updates.supabasePdfUrl || existing.supabasePdfUrl,
      updatedAt: new Date().toISOString()
    };

    products[idx] = updated;
    this.saveProductsAtomic(products);
    this.saveProductToMongo(updated);

    console.log(`[STORE-STORAGE] Updated product ID: ${id} ("${updated.title}")`);
    return updated;
  }

  public deleteProduct(id: string): { success: boolean; deletedProduct?: Product } {
    const products = this.loadProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return { success: false };

    const [deleted] = products.splice(idx, 1);

    // Clean up physical document and thumbnail from disk
    if (deleted.digitalFile) {
      this.safeDeleteUploadFile(deleted.digitalFile, 'pdf');
      deleteFromSupabase(BUCKET_PDFS, deleted.digitalFile).catch(() => {});
    }
    if (deleted.thumbnail) {
      if (deleted.thumbnail.startsWith('/uploads/') || deleted.thumbnail.startsWith('uploads/')) {
        this.safeDeleteUploadFile(deleted.thumbnail, 'thumbnail');
      }
      if (deleted.thumbnail.includes('supabase.co') || deleted.thumbnail.includes(BUCKET_THUMBNAILS)) {
        deleteFromSupabase(BUCKET_THUMBNAILS, path.basename(deleted.thumbnail)).catch(() => {});
      }
    }

    this.saveProductsAtomic(products);
    this.deleteProductFromMongo(id);

    console.log(`[STORE-STORAGE] Permanently removed product ID ${id} ("${deleted.title}") from MongoDB, Supabase, and storage files.`);
    return { success: true, deletedProduct: deleted };
  }

  public safeDeleteUploadFile(filenameOrUrl: string, type: 'pdf' | 'thumbnail'): void {
    if (!filenameOrUrl) return;
    const cleanName = path.basename(filenameOrUrl);

    // Guard core starter assets from accidental deletion
    if (cleanName === 'ats_friendly_resume_template.pdf' || cleanName === 'conceptifyyy_dsa_prep_2026_thumb.svg' || cleanName === 'ats_resume_thumb.jpg') {
      return;
    }

    const searchDirs = type === 'pdf'
      ? [
          this.config.pdfsDir,
          path.resolve(__dirname, '../../uploads/documents'),
          path.resolve(__dirname, '../../uploads')
        ]
      : [
          this.config.thumbnailsDir,
          path.resolve(__dirname, '../../uploads/thumbnails'),
          path.resolve(__dirname, '../../uploads')
        ];

    for (const dir of searchDirs) {
      const fullPath = path.join(dir, cleanName);
      try {
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
          fs.unlinkSync(fullPath);
          console.log(`[STORE-STORAGE] Deleted file: ${fullPath}`);
        }
      } catch (err: any) {
        console.warn(`[STORE-STORAGE] Could not delete ${fullPath}:`, err.message);
      }
    }
  }

  public isDocumentAvailable(digitalFile?: string, supabasePdfUrl?: string): boolean {
    if (supabasePdfUrl && supabasePdfUrl.startsWith('http')) return true;
    if (!digitalFile) return false;
    if (digitalFile.startsWith('http')) return true;

    const cleanName = path.basename(digitalFile);

    const candidates = [
      path.join(this.config.pdfsDir, cleanName),
      path.resolve(__dirname, '../../uploads/documents', cleanName),
      path.resolve(__dirname, '../../data', cleanName),
      path.resolve(__dirname, '../../../client/public', cleanName),
      path.resolve(__dirname, '../../../client/dist', cleanName)
    ];

    return candidates.some(p => fs.existsSync(p) && fs.statSync(p).isFile());
  }

  public resolvePhysicalDocumentPath(digitalFile?: string): string | null {
    if (!digitalFile) return null;
    const cleanName = path.basename(digitalFile);

    const candidates = [
      path.join(this.config.pdfsDir, cleanName),
      path.resolve(__dirname, '../../uploads/documents', cleanName),
      path.resolve(__dirname, '../../data', cleanName),
      path.resolve(__dirname, '../../../client/public', cleanName),
      path.resolve(__dirname, '../../../client/dist', cleanName)
    ];

    for (const p of candidates) {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        return p;
      }
    }
    return null;
  }

  // ================= 2. CATEGORIES MANAGEMENT =================

  private saveCategoriesAtomic(categories: Category[]): void {
    this.writeJsonAtomic(this.config.categoriesFile, categories);
    this.categoriesCache = [...categories];
  }

  public loadCategories(): Category[] {
    try {
      if (!fs.existsSync(this.config.categoriesFile)) {
        return [];
      }
      const raw = fs.readFileSync(this.config.categoriesFile, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        this.categoriesCache = data;
        return [...data];
      }
      return [];
    } catch (err: any) {
      console.error('[STORE-STORAGE] Error loading categories.json:', err.message);
      return this.categoriesCache ? [...this.categoriesCache] : [];
    }
  }

  public getAllCategories(): Category[] {
    const categories = this.loadCategories();
    return categories.sort((a, b) => (a.order || 99) - (b.order || 99));
  }

  public getCategory(idOrSlug: string): Category | null {
    const categories = this.loadCategories();
    const target = idOrSlug.trim().toLowerCase();
    return categories.find(c => c.id.toLowerCase() === target || c.slug.toLowerCase() === target || c.name.toLowerCase() === target) || null;
  }

  public createCategory(data: Partial<Category>): Category {
    const categories = this.loadCategories();
    const id = 'cat_' + uuidv4().replace(/-/g, '').substring(0, 10);
    const name = data.name ? data.name.trim() : 'New Category';
    let baseSlug = (data.slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!baseSlug) baseSlug = 'category';

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (categories.some(c => c.slug === uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const subcategories = Array.isArray(data.subcategories)
      ? data.subcategories.map(s => String(s).trim()).filter(Boolean)
      : (data.subcategories ? String(data.subcategories).split(',').map(s => s.trim()).filter(Boolean) : []);

    const newCategory: Category = {
      id,
      name,
      slug: uniqueSlug,
      description: data.description ? data.description.trim() : '',
      subcategories,
      order: Number(data.order) || (categories.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    categories.push(newCategory);
    this.saveCategoriesAtomic(categories);
    this.saveCategoryToMongo(newCategory);

    console.log(`[STORE-STORAGE] Created category "${newCategory.name}" (ID: ${newCategory.id})`);
    return newCategory;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | null {
    const categories = this.loadCategories();
    const idx = categories.findIndex(c => c.id === id);
    if (idx === -1) return null;

    const existing = categories[idx];
    const subcategories = updates.subcategories !== undefined
      ? (Array.isArray(updates.subcategories) 
          ? updates.subcategories.map(s => String(s).trim()).filter(Boolean)
          : String(updates.subcategories).split(',').map(s => s.trim()).filter(Boolean))
      : existing.subcategories;

    const updated: Category = {
      ...existing,
      ...updates,
      id: existing.id,
      name: updates.name ? updates.name.trim() : existing.name,
      description: updates.description !== undefined ? updates.description.trim() : existing.description,
      subcategories,
      order: updates.order !== undefined ? Number(updates.order) : existing.order,
      updatedAt: new Date().toISOString()
    };

    categories[idx] = updated;
    this.saveCategoriesAtomic(categories);
    this.saveCategoryToMongo(updated);

    console.log(`[STORE-STORAGE] Updated category ID: ${id}`);
    return updated;
  }

  public deleteCategory(id: string): boolean {
    const categories = this.loadCategories();
    const idx = categories.findIndex(c => c.id === id);
    if (idx === -1) return false;

    const [deleted] = categories.splice(idx, 1);
    this.saveCategoriesAtomic(categories);
    this.deleteCategoryFromMongo(id);

    console.log(`[STORE-STORAGE] Deleted category "${deleted.name}" (ID: ${id})`);
    return true;
  }

  // ================= 3. REVIEWS & TRUST MANAGEMENT =================

  private saveReviewsAtomic(reviews: Review[]): void {
    this.writeJsonAtomic(this.config.reviewsFile, reviews);
    this.reviewsCache = [...reviews];
  }

  public loadReviews(): Review[] {
    try {
      if (!fs.existsSync(this.config.reviewsFile)) {
        return [];
      }
      const raw = fs.readFileSync(this.config.reviewsFile, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        this.reviewsCache = data;
        return [...data];
      }
      return [];
    } catch (err: any) {
      console.error('[STORE-STORAGE] Error loading reviews.json:', err.message);
      return this.reviewsCache ? [...this.reviewsCache] : [];
    }
  }

  public getAllReviews(options: {
    productId?: string;
    status?: string;
    featuredOnly?: boolean;
    includeDrafts?: boolean;
  } = {}): Review[] {
    let reviews = this.loadReviews();

    if (!options.includeDrafts) {
      reviews = reviews.filter(r => r.status !== 'Draft');
    }

    if (options.productId) {
      reviews = reviews.filter(r => r.productId === options.productId || !r.productId);
    }

    if (options.featuredOnly) {
      reviews = reviews.filter(r => r.isFeatured);
    }

    // Newest review date first
    return reviews.sort((a, b) => new Date(b.reviewDate || b.createdAt).getTime() - new Date(a.reviewDate || a.createdAt).getTime());
  }

  public getReview(id: string): Review | null {
    const reviews = this.loadReviews();
    return reviews.find(r => r.id === id) || null;
  }

  public createReview(data: Partial<Review>): Review {
    const reviews = this.loadReviews();
    const id = 'rev_' + uuidv4().replace(/-/g, '').substring(0, 10);

    const isEditorial = data.isEditorial !== undefined ? Boolean(data.isEditorial) : true;
    const badge = data.badge || (isEditorial ? 'Editorial Recommendation' : 'Student Feedback');

    const newReview: Review = {
      id,
      reviewerName: data.reviewerName ? data.reviewerName.trim() : 'Anonymous Student',
      reviewerRole: data.reviewerRole ? data.reviewerRole.trim() : 'Student',
      reviewTitle: data.reviewTitle ? data.reviewTitle.trim() : 'Helpful Study Resource',
      reviewDescription: data.reviewDescription ? data.reviewDescription.trim() : '',
      productId: data.productId ? String(data.productId).trim() : undefined,
      productTitle: data.productTitle ? String(data.productTitle).trim() : undefined,
      reviewerImage: data.reviewerImage ? String(data.reviewerImage).trim() : undefined,
      rating: Math.min(5, Math.max(1, Number(data.rating) || 5)),
      reviewDate: data.reviewDate ? String(data.reviewDate).trim() : new Date().toISOString().split('T')[0],
      isFeatured: Boolean(data.isFeatured),
      isEditorial,
      badge,
      status: (data.status === 'Draft' ? 'Draft' : 'Published'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    reviews.unshift(newReview);
    this.saveReviewsAtomic(reviews);
    this.saveReviewToMongo(newReview);

    console.log(`[STORE-STORAGE] Created review "${newReview.reviewTitle}" (ID: ${newReview.id})`);
    return newReview;
  }

  public updateReview(id: string, updates: Partial<Review>): Review | null {
    const reviews = this.loadReviews();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;

    const existing = reviews[idx];
    const updated: Review = {
      ...existing,
      ...updates,
      id: existing.id,
      reviewerName: updates.reviewerName !== undefined ? updates.reviewerName.trim() : existing.reviewerName,
      reviewerRole: updates.reviewerRole !== undefined ? updates.reviewerRole.trim() : existing.reviewerRole,
      reviewTitle: updates.reviewTitle !== undefined ? updates.reviewTitle.trim() : existing.reviewTitle,
      reviewDescription: updates.reviewDescription !== undefined ? updates.reviewDescription.trim() : existing.reviewDescription,
      productId: updates.productId !== undefined ? (updates.productId ? String(updates.productId).trim() : undefined) : existing.productId,
      productTitle: updates.productTitle !== undefined ? (updates.productTitle ? String(updates.productTitle).trim() : undefined) : existing.productTitle,
      rating: updates.rating !== undefined ? Math.min(5, Math.max(1, Number(updates.rating))) : existing.rating,
      isFeatured: updates.isFeatured !== undefined ? Boolean(updates.isFeatured) : existing.isFeatured,
      isEditorial: updates.isEditorial !== undefined ? Boolean(updates.isEditorial) : existing.isEditorial,
      badge: updates.badge !== undefined ? updates.badge : existing.badge,
      status: updates.status === 'Draft' ? 'Draft' : 'Published',
      updatedAt: new Date().toISOString()
    };

    reviews[idx] = updated;
    this.saveReviewsAtomic(reviews);
    this.saveReviewToMongo(updated);

    console.log(`[STORE-STORAGE] Updated review ID: ${id}`);
    return updated;
  }

  public deleteReview(id: string): boolean {
    const reviews = this.loadReviews();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) return false;

    reviews.splice(idx, 1);
    this.saveReviewsAtomic(reviews);
    this.deleteReviewFromMongo(id);

    console.log(`[STORE-STORAGE] Deleted review ID: ${id}`);
    return true;
  }

  // ================= 4. HOMEPAGE CONTENT & ANNOUNCEMENTS =================

  private saveHomepageAtomic(content: HomepageContent): void {
    this.writeJsonAtomic(this.config.homepageFile, content);
    this.homepageCache = { ...content };
  }

  public loadHomepage(): HomepageContent {
    try {
      if (!fs.existsSync(this.config.homepageFile)) {
        return {
          heroHeading: 'Learn the idea. Not just the answer.',
          heroHighlight: 'placement ace.',
          heroSubtitle: 'Comprehensive handwritten study notes, campus company question packs, and production-ready project source code.',
          heroCtaText: 'Explore Notes & Store',
          heroCtaLink: '/store',
          announcement: { enabled: true, text: '⚡ Verified 2026 Campus Placement Notes & Roadmaps are live!', link: '/store' },
          whyTrustSection: { heading: 'Why Trust Conceptifyyy?', subtitle: 'Built with academic rigor, full transparency, and student-focused preparation.', items: [] },
          featuredProductIds: []
        };
      }
      const raw = fs.readFileSync(this.config.homepageFile, 'utf8');
      const data = JSON.parse(raw);
      this.homepageCache = data;
      return data;
    } catch (err: any) {
      console.error('[STORE-STORAGE] Error loading homepage.json:', err.message);
      return this.homepageCache || {
        heroHeading: 'Learn the idea. Not just the answer.',
        heroHighlight: 'placement ace.',
        heroSubtitle: 'Comprehensive handwritten study notes, campus company question packs, and production-ready project source code.',
        heroCtaText: 'Explore Notes & Store',
        heroCtaLink: '/store',
        announcement: { enabled: true, text: '⚡ Verified 2026 Campus Placement Notes & Roadmaps are live!', link: '/store' },
        whyTrustSection: { heading: 'Why Trust Conceptifyyy?', subtitle: 'Built with academic rigor, full transparency, and student-focused preparation.', items: [] },
        featuredProductIds: []
      };
    }
  }

  public getHomepageContent(): HomepageContent {
    return this.loadHomepage();
  }

  public updateHomepageContent(updates: Partial<HomepageContent>): HomepageContent {
    const current = this.loadHomepage();
    const updated: HomepageContent = {
      ...current,
      ...updates,
      announcement: {
        ...current.announcement,
        ...(updates.announcement || {})
      },
      whyTrustSection: {
        ...current.whyTrustSection,
        ...(updates.whyTrustSection || {})
      },
      updatedAt: new Date().toISOString()
    };

    this.saveHomepageAtomic(updated);
    this.saveHomepageToMongo(updated);

    console.log(`[STORE-STORAGE] Updated homepage content and announcement settings.`);
    return updated;
  }
}

export const storeStorage = new StoreStorage();
