import { Response } from 'express';
import { db } from '../database/db';
import { AuthRequest } from '../middleware/auth';

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { category, search, tag } = req.query as Record<string, string>;
    const userId = req.user?.id;

    let products = db.find('products', p => p.isPublished !== false);
    console.log(`[NOTES] Fetching store products (category: ${category || 'All'}, search: ${search || 'none'}). Total published in DB: ${products.length}`);

    if (category && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (tag) {
      products = products.filter(p => p.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        (p.techStack && p.techStack.some(t => t.toLowerCase().includes(q)))
      );
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

    const product = db.findOne('products', p => p.slug === slug);
    console.log(`[NOTES] Fetching product by slug: "${slug}" (Found: ${!!product})`);
    if (!product) {
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
