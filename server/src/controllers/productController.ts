import { Response } from 'express';
import { db } from '../database/db';
import { AuthRequest } from '../middleware/auth';

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { category, search, tag } = req.query as Record<string, string>;
    const userId = req.user?.id;

    let products = db.find('products', p => p.isPublished);

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

    const items = products.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      description: p.description,
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
    }));

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

    return res.json({
      success: true,
      data: {
        ...product,
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
    const projects = db.find('products', p => p.category === 'Projects' && p.isPublished);

    return res.json({
      success: true,
      data: projects
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
