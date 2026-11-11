import { Response } from 'express';
import { db, NotificationItem } from '../database/db';
import { AuthRequest } from '../middleware/auth';
import { gamificationService } from '../services/gamificationService';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated.' });
    }

    const dbUser = db.findOne('users', u => u.id === user.id);
    const submissions = db.find('submissions', s => s.userId === user.id);
    const acceptedSubmissions = submissions.filter(s => s.status === 'Accepted');
    const solvedProblemIds = Array.from(new Set(acceptedSubmissions.map(s => s.problemId)));

    const allProblems = db.find('problems');
    const solvedProblems = allProblems.filter(p => solvedProblemIds.includes(p.id));

    const easySolved = solvedProblems.filter(p => p.difficulty === 'Easy').length;
    const mediumSolved = solvedProblems.filter(p => p.difficulty === 'Medium').length;
    const hardSolved = solvedProblems.filter(p => p.difficulty === 'Hard').length;

    const aptitudeSubmissions = db.find('aptitudeSubmissions', s => s.userId === user.id);
    const aptitudeCorrect = aptitudeSubmissions.filter(s => s.isCorrect).length;
    const aptitudeAccuracy = aptitudeSubmissions.length > 0
      ? Math.round((aptitudeCorrect / aptitudeSubmissions.length) * 100)
      : 0;

    const purchases = db.find('purchases', p => p.userId === user.id);
    const bookmarks = db.find('bookmarks', b => b.userId === user.id);

    // Topic-wise progress
    const topicStats: Record<string, { total: number; solved: number }> = {};
    allProblems.forEach(p => {
      p.topics.forEach(t => {
        if (!topicStats[t]) topicStats[t] = { total: 0, solved: 0 };
        topicStats[t].total += 1;
        if (solvedProblemIds.includes(p.id)) {
          topicStats[t].solved += 1;
        }
      });
    });

    return res.json({
      success: true,
      stats: {
        totalXp: dbUser?.xp || 0,
        streak: dbUser?.streak || 1,
        badges: dbUser?.badges || [],
        dsa: {
          totalSolved: solvedProblems.length,
          totalAvailable: allProblems.length,
          easy: easySolved,
          medium: mediumSolved,
          hard: hardSolved,
          totalSubmissions: submissions.length,
          accuracy: submissions.length > 0 ? Math.round((acceptedSubmissions.length / submissions.length) * 100) : 0
        },
        aptitude: {
          totalAttempted: aptitudeSubmissions.length,
          totalCorrect: aptitudeCorrect,
          accuracy: aptitudeAccuracy
        },
        purchasesCount: purchases.length,
        bookmarksCount: bookmarks.length,
        topicMastery: Object.entries(topicStats).map(([topic, data]) => ({
          topic,
          ...data,
          percentage: Math.round((data.solved / data.total) * 100)
        })).slice(0, 8),
        recentActivity: submissions.slice(-5).reverse().map(s => {
          const p = allProblems.find(prob => prob.id === s.problemId);
          return {
            id: s.id,
            problemTitle: p?.title || 'Coding Problem',
            problemSlug: p?.slug || '',
            status: s.status,
            language: s.language,
            time: s.createdAt
          };
        })
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyPurchases = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated.' });
    }

    // Self-healing: if user has any paid orders that are missing a purchases entry, create it
    const paidOrders = db.find('orders', o => (o.userId === user.id || o.userEmail === user.email) && o.status === 'PAID');
    for (const ord of paidOrders) {
      const existingPurchase = db.findOne('purchases', p => p.orderId === ord.id || (p.userId === user.id && p.productId === ord.productId));
      if (!existingPurchase) {
        const licenseKey = `CPY-LIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        db.insert('purchases', {
          id: 'pur_' + Math.random().toString(36).substring(2, 10),
          userId: user.id,
          productId: ord.productId,
          orderId: ord.id,
          downloadCount: 0,
          maxDownloads: 50,
          accessGrantedAt: ord.paidAt || new Date().toISOString(),
          licenseKey
        });
      }
    }

    const purchases = db.find('purchases', p => p.userId === user.id);
    const allProducts = db.find('products');
    const allOrders = db.find('orders');

    const items = purchases.map(p => {
      const product = allProducts.find(prod => prod.id === p.productId || prod.slug === p.productId);
      const order = allOrders.find(ord => ord.id === p.orderId);

      return {
        purchaseId: p.id,
        productId: p.productId,
        orderId: p.orderId,
        orderNumber: order?.orderNumber,
        productTitle: product?.title || order?.productTitle || 'Placement Preparation Notes',
        productSlug: product?.slug,
        category: product?.category || 'Placement Notes',
        thumbnail: product?.thumbnail || '/uploads/thumbnails/conceptifyyy_dsa_prep_2026_thumb.svg',
        fileFormat: product?.fileFormat || 'PDF Document',
        amount: order?.amount,
        licenseKey: p.licenseKey,
        accessGrantedAt: p.accessGrantedAt,
        downloadCount: p.downloadCount || 0,
        downloadUrl: `/api/downloads/${p.productId}`
      };
    });

    return res.json({
      success: true,
      data: items
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookmarks = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated.' });
    }

    const bookmarks = db.find('bookmarks', b => b.userId === user.id);
    const dsaProblems = db.find('problems');
    const aptitudeQuestions = db.find('aptitudeQuestions');
    const products = db.find('products');

    const result = {
      dsa: bookmarks
        .filter(b => b.entityType === 'dsa')
        .map(b => dsaProblems.find(p => p.id === b.entityId))
        .filter(Boolean),
      aptitude: bookmarks
        .filter(b => b.entityType === 'aptitude')
        .map(b => aptitudeQuestions.find(q => q.id === b.entityId))
        .filter(Boolean),
      products: bookmarks
        .filter(b => b.entityType === 'product')
        .map(b => products.find(p => p.id === b.entityId))
        .filter(Boolean)
    };

    return res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const allNotifications = db.find('notifications', (n: NotificationItem) => Boolean(!n.userId || (user && n.userId === user.id)));
    allNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json({
      success: true,
      data: allNotifications.slice(0, 15)
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    db.update('notifications', n => n.id === id, n => ({ isRead: true }));
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const { type = 'global' } = req.query as { type: 'global' | 'weekly' | 'monthly' };
    const leaderboard = gamificationService.getLeaderboard(type);
    return res.json({
      success: true,
      data: leaderboard
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLearningPaths = async (req: AuthRequest, res: Response) => {
  try {
    const paths = db.find('learningPaths');
    return res.json({
      success: true,
      data: paths
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const globalSearch = async (req: AuthRequest, res: Response) => {
  try {
    const { q } = req.query as { q?: string };
    if (!q || q.trim().length === 0) {
      return res.json({
        success: true,
        results: { problems: [], aptitude: [], products: [], topics: [] }
      });
    }

    const query = q.toLowerCase().trim();

    const problems = db.find('problems', p => p.isPublished && (
      p.title.toLowerCase().includes(query) ||
      p.topics.some(t => t.toLowerCase().includes(query)) ||
      p.companies.some(c => c.toLowerCase().includes(query))
    )).slice(0, 5).map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      difficulty: p.difficulty,
      type: 'dsa'
    }));

    const aptitude = db.find('aptitudeQuestions', a => (
      a.question.toLowerCase().includes(query) ||
      a.topicTitle.toLowerCase().includes(query) ||
      a.category.toLowerCase().includes(query)
    )).slice(0, 5).map(a => ({
      id: a.id,
      title: a.question.length > 60 ? a.question.substring(0, 60) + '...' : a.question,
      slug: a.slug,
      topic: a.topicTitle,
      category: a.category,
      type: 'aptitude'
    }));

    const products = db.find('products', pr => pr.isPublished && (
      pr.title.toLowerCase().includes(query) ||
      pr.category.toLowerCase().includes(query) ||
      pr.tags.some(t => t.toLowerCase().includes(query))
    )).slice(0, 5).map(pr => ({
      id: pr.id,
      title: pr.title,
      slug: pr.slug,
      category: pr.category,
      price: pr.price,
      type: 'product'
    }));

    return res.json({
      success: true,
      results: {
        problems,
        aptitude,
        products
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
