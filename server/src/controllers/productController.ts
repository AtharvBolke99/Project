import { Response } from 'express';
import { db } from '../database/db';
import { AuthRequest } from '../middleware/auth';

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { category, search, tag, sort, minPrice, maxPrice } = req.query as Record<string, string>;
    const userId = req.user?.id;

    let products = db.find('products', p => p.isPublished !== false && !p.isDeleted);
    console.log(`[NOTES] Fetching store products (category: ${category || 'All'}, search: ${search || 'none'}). Total active in DB: ${products.length}`);

    if (category && category !== 'All') {
      const catLower = category.toLowerCase();
      products = products.filter(p => {
        if (catLower === 'dsa' || catLower === 'dsa notes') {
          return p.category?.toLowerCase() === 'dsa notes' || p.tags?.some(t => t.toLowerCase().includes('dsa'));
        }
        if (catLower === 'aptitude' || catLower === 'aptitude notes') {
          return p.category?.toLowerCase() === 'aptitude notes' || p.tags?.some(t => t.toLowerCase().includes('aptitude'));
        }
        if (catLower === 'projects') {
          return p.category?.toLowerCase() === 'projects';
        }
        if (catLower === 'placement bundles' || catLower === 'bundles' || catLower === 'resumes') {
          return p.category?.toLowerCase() === 'placement bundles' || p.tags?.some(t => t.toLowerCase().includes('resume'));
        }
        return p.category?.toLowerCase() === catLower || p.tags?.some(t => t.toLowerCase() === catLower);
      });
    }

    if (tag) {
      products = products.filter(p => p.tags && p.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
    }

    if (minPrice !== undefined && !isNaN(Number(minPrice))) {
      products = products.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
        (p.techStack && p.techStack.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Apply sorting
    if (sort) {
      if (sort === 'price_asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === 'price_desc') {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === 'popular') {
        products.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
      } else if (sort === 'newest') {
        products.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      }
    }

    const purchasedProductIds = new Set<string>();
    if (userId) {
      db.find('purchases', p => p.userId === userId).forEach(p => purchasedProductIds.add(p.productId));
    }

    const items = products.map(p => {
      const cardDesc = p.cardDescription || p.shortDescription || p.description;
      const stepDesc = p.stepDescription || p.detailedDescription || p.description;
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        cardDescription: cardDesc,
        shortDescription: cardDesc,
        stepDescription: stepDesc,
        detailedDescription: stepDesc,
        description: cardDesc,
        price: p.price,
        originalPrice: p.originalPrice,
        discountPercent: p.discountPercent,
        thumbnail: p.thumbnail,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        fileFormat: p.fileFormat,
        pageCount: p.pageCount,
        techStack: p.techStack,
        tags: p.tags,
        isFeatured: p.isFeatured,
        isPurchased: purchasedProductIds.has(p.id)
      };
    });

    return res.json({
      success: true,
      data: items,
      total: items.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;
    const targetSlug = (slug || '').toLowerCase().trim();

    // Robust matching: exact slug, product ID, prefix match, or core keyword match
    const product = db.findOne('products', p => {
      if (p.isDeleted) return false;
      const pSlug = (p.slug || '').toLowerCase().trim();
      const pId = (p.id || '').toLowerCase().trim();

      // 1. Exact match
      if (pSlug === targetSlug || pId === targetSlug) return true;

      // 2. Prefix or substring match for friendly shortened links
      if (targetSlug.length >= 8 && (pSlug.startsWith(targetSlug) || targetSlug.startsWith(pSlug))) {
        return true;
      }

      // 3. Keyword core match (e.g., 'realestate' or 'python-mastery')
      const targetCore = targetSlug.replace(/^(conceptifyyy-|the-)/, '').split('-').slice(0, 3).join('-');
      if (targetCore.length >= 6 && pSlug.includes(targetCore)) {
        return true;
      }

      return false;
    });

    console.log(`[NOTES] Fetching product by slug: "${slug}" (Found: ${!!product})`);
    if (!product || (product.isPublished === false && req.user?.role !== 'ADMIN')) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    let isPurchased = false;
    let purchaseInfo = null;

    if (userId) {
      const purchase = db.findOne('purchases', p => p.userId === userId && p.productId === product.id);
      if (purchase) {
        isPurchased = true;
        purchaseInfo = {
          licenseKey: purchase.licenseKey,
          accessGrantedAt: purchase.accessGrantedAt,
          downloadCount: purchase.downloadCount
        };
      }
    }

    const cardDesc = product.cardDescription || product.shortDescription || product.description;
    const stepDesc = product.stepDescription || product.detailedDescription || product.description;

    return res.json({
      success: true,
      data: {
        ...product,
        cardDescription: cardDesc,
        shortDescription: cardDesc,
        stepDescription: stepDesc,
        detailedDescription: stepDesc,
        isPurchased,
        purchaseInfo
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeaturedProjects = async (req: AuthRequest, res: Response) => {
  try {
    const rawProjects = db.find('products', p => p.category === 'Projects' && p.isPublished);
    const projects = rawProjects.map(p => ({
      ...p,
      cardDescription: p.cardDescription || p.shortDescription || p.description,
      shortDescription: p.cardDescription || p.shortDescription || p.description,
      stepDescription: p.stepDescription || p.detailedDescription || p.description,
      detailedDescription: p.stepDescription || p.detailedDescription || p.description
    }));

    return res.json({
      success: true,
      data: projects
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
