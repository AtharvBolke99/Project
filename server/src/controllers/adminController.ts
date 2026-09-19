import { Response } from 'express';
import { db, Problem, AptitudeQuestion, Product, Order, User } from '../database/db';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

export const getAdminOverview = async (req: AuthRequest, res: Response) => {
  try {
    const users = db.find('users');
    const problems = db.find('problems');
    const submissions = db.find('submissions');
    const aptitudeQuestions = db.find('aptitudeQuestions');
    const aptitudeSubmissions = db.find('aptitudeSubmissions');
    const orders = db.find('orders');
    const products = db.find('products');

    const paidOrders = orders.filter(o => o.status === 'PAID');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayRevenue = paidOrders
      .filter(o => o.paidAt && o.paidAt.startsWith(todayStr))
      .reduce((sum, o) => sum + (o.amount || 0), 0);

    const conversionRate = users.length > 0
      ? Math.round((paidOrders.length / users.length) * 100)
      : 0;

    // Top products by orders
    const productSalesMap: Record<string, number> = {};
    paidOrders.forEach(o => {
      productSalesMap[o.productId] = (productSalesMap[o.productId] || 0) + 1;
    });

    const topProducts = products
      .map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        salesCount: productSalesMap[p.id] || 0,
        revenue: (productSalesMap[p.id] || 0) * p.price
      }))
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5);

    // Revenue trend (last 7 days)
    const last7Days: Array<{ date: string; revenue: number; ordersCount: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayPaid = paidOrders.filter(o => o.paidAt && o.paidAt.startsWith(dateStr));
      const dayRev = dayPaid.reduce((sum, o) => sum + (o.amount || 0), 0);
      last7Days.push({
        date: dateStr.slice(5), // MM-DD
        revenue: dayRev,
        ordersCount: dayPaid.length
      });
    }

    return res.json({
      success: true,
      data: {
        stats: {
          totalUsers: users.length,
          activeUsers: users.filter(u => u.status === 'ACTIVE').length,
          totalProblems: problems.length,
          totalSubmissions: submissions.length,
          acceptedSubmissions: submissions.filter(s => s.status === 'Accepted').length,
          totalAptitudeQuestions: aptitudeQuestions.length,
          totalAptitudeAttempts: aptitudeSubmissions.length,
          totalOrders: orders.length,
          paidOrdersCount: paidOrders.length,
          totalRevenue,
          todayRevenue,
          conversionRate,
          totalProducts: products.length
        },
        topProducts,
        recentProducts: products,
        revenueTrend: last7Days
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminProducts = async (req: AuthRequest, res: Response) => {
  try {
    const products = db.find('products');
    return res.json({
      success: true,
      data: products,
      total: products.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= DSA PROBLEMS CMS =================
export const createProblem = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    if (!data.title || !data.difficulty) {
      return res.status(400).json({ success: false, message: 'Title and difficulty are required.' });
    }

    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProblem: Problem = {
      id: 'prob_' + uuidv4().substring(0, 8),
      title: data.title,
      slug,
      difficulty: data.difficulty,
      topics: Array.isArray(data.topics) ? data.topics : (data.topics ? data.topics.split(',').map((t: string) => t.trim()) : ['Arrays']),
      companies: Array.isArray(data.companies) ? data.companies : (data.companies ? data.companies.split(',').map((c: string) => c.trim()) : ['Amazon']),
      description: data.description || 'Problem description...',
      examples: data.examples || [{ input: 'nums = [1,2,3]', output: '6' }],
      constraints: data.constraints || ['1 <= nums.length <= 10^5'],
      starterCode: data.starterCode || {
        javascript: 'function solution(input) {\n  // your code here\n}',
        python: 'def solution(input):\n    # your code here\n    pass',
        cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}',
        java: 'public class Solution {\n    public static void main(String[] args) {\n    }\n}'
      },
      testCases: data.testCases || [{ input: '1,2,3', expectedOutput: '6', isHidden: false }],
      solution: data.solution || {
        approach: 'Optimal Approach',
        intuition: 'Understand the problem logic.',
        stepByStep: ['Step 1', 'Step 2'],
        code: {
          javascript: '// Optimal JS Solution',
          python: '# Optimal Python Solution',
          cpp: '// Optimal C++ Solution',
          java: '// Optimal Java Solution'
        },
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        commonMistakes: ['Edge cases with empty inputs'],
        interviewTips: ['Mention edge cases upfront']
      },
      hints: data.hints || ['Think about two pointers or hash map'],
      visualizeData: data.visualizeData || {
        type: 'array',
        initialState: { array: [1, 2, 3] },
        steps: [
          { stepNumber: 1, label: 'Start', explanation: 'Initialize pointers', state: { array: [1, 2, 3] } }
        ]
      },
      acceptanceRate: 100,
      totalSubmissions: 0,
      totalAccepted: 0,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.insert('problems', newProblem);

    return res.status(201).json({
      success: true,
      message: 'Problem published successfully without modifying source code!',
      data: newProblem
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProblem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = db.update(
      'problems',
      p => p.id === id,
      p => ({
        ...data,
        updatedAt: new Date().toISOString()
      })
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    return res.json({
      success: true,
      message: 'Problem updated successfully!',
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProblem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.delete('problems', p => p.id === id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }
    return res.json({ success: true, message: 'Problem removed from platform.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= APTITUDE CMS =================
export const createAptitudeQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    if (!data.question || !data.options || data.correctAnswer === undefined) {
      return res.status(400).json({ success: false, message: 'Question, options, and correct answer are required.' });
    }

    const slug = (data.slug || data.question.substring(0, 40)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newQuestion: AptitudeQuestion = {
      id: 'apt_' + uuidv4().substring(0, 8),
      topicId: data.topicId || 'top_quant_1',
      topicTitle: data.topicTitle || 'Time & Work',
      category: data.category || 'Quantitative',
      slug,
      question: data.question,
      difficulty: data.difficulty || 'Medium',
      options: data.options,
      correctAnswer: Number(data.correctAnswer),
      explanation: data.explanation || 'Step by step breakdown...',
      formula: data.formula || '',
      shortcut: data.shortcut || '',
      visualSteps: data.visualSteps || [
        {
          stepNumber: 1,
          title: 'Problem Setup',
          description: 'Visualize the work units',
          visualType: 'work_units',
          data: { totalUnits: 60, currentUnits: 0 }
        }
      ],
      createdAt: new Date().toISOString()
    };

    db.insert('aptitudeQuestions', newQuestion);

    return res.status(201).json({
      success: true,
      message: 'Aptitude question published live!',
      data: newQuestion
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAptitudeQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.delete('aptitudeQuestions', q => q.id === id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }
    return res.json({ success: true, message: 'Aptitude question removed.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= PRODUCT & NOTES CMS =================
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    if (!data.title || !data.price) {
      return res.status(400).json({ success: false, message: 'Product title and price are required.' });
    }

    const slug = (data.slug || data.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const cardDesc = data.cardDescription || data.shortDescription || (data.description ? data.description.substring(0, 140) : '');
    const stepDesc = data.stepDescription || data.detailedDescription || data.description || '';
    const mainDesc = stepDesc || cardDesc || 'Premium comprehensive notes curated for placement interviews.';

    const newProduct: Product = {
      id: 'prod_' + uuidv4().substring(0, 8),
      title: data.title,
      slug,
      category: data.category || 'DSA Notes',
      subcategory: data.subcategory || '',
      cardDescription: cardDesc,
      shortDescription: cardDesc,
      stepDescription: stepDesc,
      detailedDescription: stepDesc,
      description: mainDesc,
      price: Number(data.price),
      originalPrice: Number(data.originalPrice || Number(data.price) * 2),
      salePrice: data.salePrice ? Number(data.salePrice) : undefined,
      discountPercent: Number(data.discountPercent || 50),
      thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      previewImages: data.previewImages || [],
      digitalFile: data.digitalFile || `${slug}.pdf`,
      fileFormat: data.fileFormat || 'PDF',
      pageCount: data.pageCount || 120,
      rating: data.rating ? Number(data.rating) : 4.9,
      reviewsCount: data.reviewsCount ? Number(data.reviewsCount) : (Math.floor(Math.random() * (200 - 50 + 1)) + 50),
      whatIncluded: Array.isArray(data.whatIncluded) ? data.whatIncluded : ['Visual Diagrams', 'Pattern Cheat Sheets', 'Interview Questions'],
      tags: Array.isArray(data.tags) ? data.tags : ['DSA', 'Placement'],
      techStack: data.techStack || [],
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
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.insert('products', newProduct);

    return res.status(201).json({
      success: true,
      message: 'Product added to Store successfully!',
      data: newProduct
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = db.findOne('products', p => p.id === id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const cardDesc = data.cardDescription !== undefined 
      ? data.cardDescription 
      : (data.shortDescription !== undefined ? data.shortDescription : existing.cardDescription);

    const stepDesc = data.stepDescription !== undefined 
      ? data.stepDescription 
      : (data.detailedDescription !== undefined ? data.detailedDescription : existing.stepDescription);

    const mainDesc = data.description !== undefined 
      ? data.description 
      : (stepDesc || existing.description);

    const updated = db.update(
      'products',
      p => p.id === id,
      p => ({
        ...p,
        ...data,
        cardDescription: cardDesc,
        shortDescription: cardDesc || p.shortDescription,
        stepDescription: stepDesc,
        detailedDescription: stepDesc,
        description: mainDesc,
        reviewsCount: data.reviewsCount !== undefined 
          ? Number(data.reviewsCount) 
          : (existing.reviewsCount && existing.reviewsCount >= 50 && existing.reviewsCount <= 200 
              ? existing.reviewsCount 
              : (Math.floor(Math.random() * (200 - 50 + 1)) + 50)),
        updatedAt: new Date().toISOString()
      })
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.json({
      success: true,
      message: 'Product updated successfully!',
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.delete('products', p => p.id === id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    return res.json({ success: true, message: 'Product deleted.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= ORDERS & USERS MANAGEMENT =================
export const getAdminOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query as { status?: string };
    let orders = db.find('orders');

    if (status && status !== 'All') {
      orders = orders.filter(o => o.status === status);
    }

    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json({
      success: true,
      data: orders
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = db.find('users');
    const submissions = db.find('submissions');
    const purchases = db.find('purchases');

    const usersData = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      xp: u.xp,
      streak: u.streak,
      createdAt: u.createdAt,
      problemsSolved: submissions.filter(s => s.userId === u.id && s.status === 'Accepted').length,
      purchasesCount: purchases.filter(p => p.userId === u.id).length
    }));

    return res.json({
      success: true,
      data: usersData
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, role } = req.body;

    const updated = db.update(
      'users',
      u => u.id === id,
      u => ({
        status: status || u.status,
        role: role || u.role,
        updatedAt: new Date().toISOString()
      })
    );

    return res.json({
      success: true,
      message: 'User account updated.',
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= BULK IMPORT ENDPOINTS =================
export const bulkImportDsaProblems = async (req: AuthRequest, res: Response) => {
  try {
    const { problems, overwrite } = req.body;
    if (!Array.isArray(problems) || problems.length === 0) {
      return res.status(400).json({ success: false, message: 'An array of problems is required.' });
    }

    let imported = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (let i = 0; i < problems.length; i++) {
      const item = problems[i];
      if (!item.title || !item.difficulty) {
        errors.push(`Problem #${i + 1}: Missing title or difficulty.`);
        skipped++;
        continue;
      }

      const slug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existing = db.findOne('problems', p => p.slug === slug || p.title.toLowerCase() === item.title.toLowerCase());

      const probData: Problem = {
        id: existing ? existing.id : ('prob_' + uuidv4().substring(0, 8)),
        title: item.title,
        slug,
        difficulty: item.difficulty || 'Easy',
        topics: Array.isArray(item.topics) ? item.topics : ['Arrays'],
        companies: Array.isArray(item.companies) ? item.companies : [],
        description: item.description || '',
        examples: Array.isArray(item.examples) ? item.examples : [],
        constraints: Array.isArray(item.constraints) ? item.constraints : [],
        starterCode: item.starterCode || {
          javascript: `function solution() {\n  // Write your code here\n}`,
          python: `def solution():\n    # Write your code here\n    pass`,
          cpp: `class Solution {\npublic:\n    void solution() {\n        \n    }\n};`,
          java: `class Solution {\n    public void solution() {\n        \n    }\n}`
        },
        testCases: Array.isArray(item.testCases) ? item.testCases : [],
        solution: item.solution || {
          approach: 'Optimal Approach',
          intuition: '',
          stepByStep: [],
          code: { javascript: '', python: '', cpp: '', java: '' },
          timeComplexity: 'O(N)',
          spaceComplexity: 'O(1)',
          commonMistakes: [],
          interviewTips: []
        },
        hints: Array.isArray(item.hints) ? item.hints : [],
        visualizeData: item.visualizeData,
        isDailyChallenge: Boolean(item.isDailyChallenge),
        acceptanceRate: item.acceptanceRate || 50,
        totalSubmissions: item.totalSubmissions || 0,
        totalAccepted: item.totalAccepted || 0,
        isPublished: item.isPublished !== undefined ? item.isPublished : true,
        createdAt: existing ? existing.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (existing) {
        if (overwrite) {
          db.update('problems', p => p.id === existing.id, () => probData);
          updated++;
        } else {
          skipped++;
        }
      } else {
        db.insert('problems', probData);
        imported++;
      }
    }

    return res.json({
      success: true,
      message: `Bulk import completed: ${imported} added, ${updated} updated, ${skipped} skipped.`,
      stats: {
        total: problems.length,
        imported,
        updated,
        skipped,
        errors
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkImportAptitudeQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const { questions, overwrite } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'An array of questions is required.' });
    }

    let imported = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (let i = 0; i < questions.length; i++) {
      const item = questions[i];
      if (!item.question || !Array.isArray(item.options) || item.correctAnswer === undefined) {
        errors.push(`Question #${i + 1}: Missing question, options, or correctAnswer.`);
        skipped++;
        continue;
      }

      const slug = item.slug || item.question.substring(0, 50).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existing = db.findOne('aptitudeQuestions', q => q.slug === slug || q.question.trim() === item.question.trim());

      const questionData: AptitudeQuestion = {
        id: existing ? existing.id : ('apt_' + uuidv4().substring(0, 8)),
        topicId: item.topicId || 'top_percentages',
        topicTitle: item.topicTitle || 'Percentages',
        category: item.category || 'Quantitative',
        slug,
        question: item.question,
        difficulty: item.difficulty || 'Easy',
        options: item.options,
        correctAnswer: Number(item.correctAnswer),
        explanation: item.explanation || 'Detailed explanation provided above.',
        shortcut: item.shortcut,
        formula: item.formula,
        visualSteps: Array.isArray(item.visualSteps) ? item.visualSteps : [],
        isDailyChallenge: Boolean(item.isDailyChallenge),
        createdAt: existing ? existing.createdAt : new Date().toISOString()
      };

      if (existing) {
        if (overwrite) {
          db.update('aptitudeQuestions', q => q.id === existing.id, () => questionData);
          updated++;
        } else {
          skipped++;
        }
      } else {
        db.insert('aptitudeQuestions', questionData);
        imported++;
      }
    }

    return res.json({
      success: true,
      message: `Bulk import completed: ${imported} added, ${updated} updated, ${skipped} skipped.`,
      stats: {
        total: questions.length,
        imported,
        updated,
        skipped,
        errors
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= CATALOG BACKUP & RESTORE CMS =================
export const exportCatalogBackup = async (req: AuthRequest, res: Response) => {
  try {
    const products = db.find('products');
    return res.json({
      success: true,
      data: products,
      count: products.length,
      exportedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const restoreCatalogBackup = async (req: AuthRequest, res: Response) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'Valid array of products is required for catalog restore.' });
    }

    let restoredCount = 0;
    for (const item of products) {
      if (!item.title || !item.price) continue;
      const existing = db.findOne('products', p => p.id === item.id || p.slug === item.slug);
      if (existing) {
        db.update('products', p => p.id === existing.id, () => ({
          ...item,
          updatedAt: new Date().toISOString()
        }));
      } else {
        db.insert('products', {
          ...item,
          id: item.id || ('prod_' + uuidv4().substring(0, 8)),
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      restoredCount++;
    }

    db.save();

    return res.json({
      success: true,
      message: `Catalog restored successfully: ${restoredCount} products synced to database!`,
      count: restoredCount
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= FILE & THUMBNAIL UPLOADER =================
export const uploadAdminFile = async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file was uploaded.' });
    }

    const isImage = file.mimetype.startsWith('image/');
    const relativeUrl = `/uploads/${isImage ? 'thumbnails' : 'documents'}/${file.filename}`;

    return res.json({
      success: true,
      message: 'File uploaded successfully!',
      data: {
        filename: file.filename,
        originalName: file.originalname,
        fileUrl: relativeUrl,
        sizeBytes: file.size,
        mimeType: file.mimetype,
        isImage
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'File upload failed.' });
  }
};
