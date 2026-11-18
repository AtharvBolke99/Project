import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../database/db';

export interface StoreStorageConfig {
  storeDir: string;
  productsFile: string;
  pdfsDir: string;
  thumbnailsDir: string;
}

export class StoreStorage {
  private config: StoreStorageConfig;
  private productsCache: Product[] | null = null;
  private isInitialized = false;

  constructor(customDir?: string) {
    // Custom Dir, Render Persistent Disk or Environment Variable override
    const targetDir = customDir || process.env.STORE_DATA_PATH || process.env.RENDER_DISK_PATH;
    const storeDir = targetDir
      ? path.resolve(targetDir)
      : path.resolve(__dirname, '../../data/store');

    this.config = {
      storeDir,
      productsFile: path.join(storeDir, 'products.json'),
      pdfsDir: path.join(storeDir, 'uploads', 'pdfs'),
      thumbnailsDir: path.join(storeDir, 'uploads', 'thumbnails')
    };

    this.init();
  }

  /**
   * Initializes store directories and products.json.
   * If products.json does not exist, performs a safe one-time import from existing database,
   * then locks products.json as the sole source of truth.
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

        // Check legacy conceptifyyy.db.json for real existing products
        const legacyDbPath = path.resolve(__dirname, '../../data/conceptifyyy.db.json');
        if (fs.existsSync(legacyDbPath)) {
          try {
            const raw = fs.readFileSync(legacyDbPath, 'utf8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed.products)) {
              // Exclude test products or archived items from legacy data
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
        // Load into cache
        this.loadProducts();
      }

      this.isInitialized = true;
    } catch (err: any) {
      console.error('[STORE-STORAGE] Initialization error:', err);
    }
  }

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

  /**
   * Atomically writes products array to disk using a temporary file and atomic rename.
   * Prevents corrupted files during server crashes or concurrent writes.
   */
  private saveProductsAtomic(products: Product[]): void {
    const tempFile = `${this.config.productsFile}.tmp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    try {
      fs.writeFileSync(tempFile, JSON.stringify(products, null, 2), 'utf8');
      fs.renameSync(tempFile, this.config.productsFile);
      this.productsCache = [...products];
    } catch (err: any) {
      if (fs.existsSync(tempFile)) {
        try { fs.unlinkSync(tempFile); } catch {}
      }
      throw new Error(`Failed to save store products atomically: ${err.message}`);
    }
  }

  /**
   * Loads products from products.json (always authoritative from disk).
   */
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

  /**
   * Retrieves products with search, category filtering, and sorting.
   */
  public getAllProducts(options: {
    includeDrafts?: boolean;
    category?: string;
    search?: string;
    sort?: string;
  } = {}): (Product & { isFileAvailable: boolean })[] {
    let products = this.loadProducts();

    // 1. Visibility filter
    if (!options.includeDrafts) {
      products = products.filter(p => p.isPublished !== false && p.status !== 'Draft' && p.status !== 'DRAFT');
    }

    // 2. Category filter
    if (options.category && options.category !== 'All') {
      const catLower = options.category.toLowerCase();
      products = products.filter(p => {
        const pCat = (p.category || '').toLowerCase();
        if (pCat === catLower) return true;
        if (catLower === 'dsa notes' || catLower === 'dsa') return pCat.includes('dsa');
        if (catLower === 'python') return pCat.includes('python');
        if (catLower === 'mysql / dbms' || catLower === 'mysql' || catLower === 'dbms') return pCat.includes('sql') || pCat.includes('dbms');
        if (catLower === 'aptitude notes' || catLower === 'aptitude') return pCat.includes('aptitude');
        if (catLower === 'projects') return pCat.includes('project');
        if (catLower === 'placement bundles') return pCat.includes('placement') || pCat.includes('bundle') || pCat.includes('resume');
        return false;
      });
    }

    // 3. Search query
    if (options.search && options.search.trim()) {
      const q = options.search.trim().toLowerCase();
      products = products.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.cardDescription && p.cardDescription.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
        (p.techStack && p.techStack.some(t => t.toLowerCase().includes(q)))
      );
    }

    // 4. Sorting
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

    // 5. Attach file existence status gracefully
    return products.map(p => ({
      ...p,
      isFileAvailable: this.isDocumentAvailable(p.digitalFile)
    }));
  }

  /**
   * Retrieves single product by ID or Slug.
   */
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
      isFileAvailable: this.isDocumentAvailable(product.digitalFile)
    };
  }

  /**
   * Creates a new store product and atomically saves to products.json.
   */
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
    const mainDesc = stepDesc || cardDesc || 'Comprehensive educational placement material.';

    const isDraft = data.status === 'Draft' || data.status === 'DRAFT' || data.isPublished === false;
    const status = isDraft ? 'Draft' : 'Published';
    const isPublished = !isDraft;

    const newProduct: Product = {
      id,
      title: data.title || 'Untitled Resource',
      slug: uniqueSlug,
      category: data.category || 'DSA Notes',
      subcategory: data.subcategory || '',
      cardDescription: cardDesc,
      shortDescription: cardDesc,
      stepDescription: stepDesc,
      detailedDescription: stepDesc,
      description: mainDesc,
      price: Number(data.price) || 0,
      originalPrice: Number(data.originalPrice) || (Number(data.price) > 0 ? Number(data.price) * 2 : 0),
      salePrice: data.salePrice !== undefined ? Number(data.salePrice) : undefined,
      discountPercent: Number(data.discountPercent) || (data.originalPrice && data.originalPrice > (data.price || 0) ? Math.round(((data.originalPrice - (data.price || 0)) / data.originalPrice) * 100) : 0),
      thumbnail: data.thumbnail ? data.thumbnail.trim() : '',
      previewImages: Array.isArray(data.previewImages) ? data.previewImages : [],
      digitalFile: data.digitalFile ? path.basename(data.digitalFile) : '',
      fileFormat: data.fileFormat || 'PDF Document',
      pageCount: data.pageCount || 100,
      rating: data.rating ? Number(data.rating) : 4.9,
      reviewsCount: data.reviewsCount !== undefined ? Number(data.reviewsCount) : (Math.floor(Math.random() * (200 - 50 + 1)) + 50),
      whatIncluded: Array.isArray(data.whatIncluded) ? data.whatIncluded : (data.whatIncluded ? String(data.whatIncluded).split(',').map((s: string) => s.trim()).filter(Boolean) : ['Visual Diagrams', 'Pattern Cheat Sheets', 'Interview Questions']),
      tags: Array.isArray(data.tags) ? data.tags : ['DSA', 'Placement'],
      techStack: Array.isArray(data.techStack) ? data.techStack : [],
      githubRepoUrl: data.githubRepoUrl || '',
      liveDemoUrl: data.liveDemoUrl || '',
      documentationPdf: data.documentationPdf || '',
      sourceCodeZip: data.sourceCodeZip || '',
      presentationPpt: data.presentationPpt || '',
      synopsis: data.synopsis || '',
      difficulty: data.difficulty || 'Intermediate',
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
    console.log(`[STORE-STORAGE] Created product: "${newProduct.title}" (ID: ${newProduct.id}, Slug: ${newProduct.slug}, Status: ${newProduct.status})`);

    return newProduct;
  }

  /**
   * Updates an existing product and atomically writes to products.json.
   */
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
      cardDescription: cardDesc,
      shortDescription: cardDesc,
      stepDescription: stepDesc,
      detailedDescription: stepDesc,
      description: mainDesc,
      digitalFile: updates.digitalFile !== undefined ? (updates.digitalFile ? path.basename(updates.digitalFile) : '') : existing.digitalFile,
      thumbnail: updates.thumbnail !== undefined ? updates.thumbnail.trim() : existing.thumbnail,
      updatedAt: new Date().toISOString()
    };

    products[idx] = updated;
    this.saveProductsAtomic(products);
    console.log(`[STORE-STORAGE] Updated product ID: ${id} ("${updated.title}")`);

    return updated;
  }

  /**
   * PERMANENTLY deletes a product from products.json and removes its uploaded files from disk.
   */
  public deleteProduct(id: string): { success: boolean; deletedProduct?: Product } {
    const products = this.loadProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return { success: false };

    const [deleted] = products.splice(idx, 1);

    // Clean up associated physical document and thumbnail from disk
    if (deleted.digitalFile) {
      this.safeDeleteUploadFile(deleted.digitalFile, 'pdf');
    }
    if (deleted.thumbnail && (deleted.thumbnail.startsWith('/uploads/') || deleted.thumbnail.startsWith('uploads/'))) {
      this.safeDeleteUploadFile(deleted.thumbnail, 'thumbnail');
    }

    this.saveProductsAtomic(products);
    console.log(`[STORE-STORAGE] Permanently removed product ID ${id} ("${deleted.title}") and disk files.`);
    return { success: true, deletedProduct: deleted };
  }

  /**
   * Safely deletes an uploaded file from disk (ignores public static core assets).
   */
  public safeDeleteUploadFile(filenameOrUrl: string, type: 'pdf' | 'thumbnail'): void {
    if (!filenameOrUrl) return;
    const cleanName = path.basename(filenameOrUrl);

    // Guard essential core templates from deletion
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

  /**
   * Checks whether the digital document file actually exists on disk.
   */
  public isDocumentAvailable(digitalFile?: string): boolean {
    if (!digitalFile) return false;
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

  /**
   * Resolves the full physical path on disk for digital document download.
   */
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

    for (const candidate of candidates) {
      if (candidate && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    }

    return null;
  }
}

export const storeStorage = new StoreStorage();
