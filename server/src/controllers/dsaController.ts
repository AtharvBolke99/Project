import { Response } from 'express';
import { db } from '../database/db';
import { AuthRequest } from '../middleware/auth';

export const getProblems = async (req: AuthRequest, res: Response) => {
  try {
    const {
      search,
      difficulty,
      topic,
      company,
      status,
      page = '1',
      limit = '20'
    } = req.query as Record<string, string>;

    const userId = req.user?.id;
    let problems = db.find('problems', p => p.isPublished);

    // Filter by Difficulty
    if (difficulty && difficulty !== 'All') {
      problems = problems.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    // Filter by Topic
    if (topic && topic !== 'All') {
      problems = problems.filter(p => p.topics.some(t => t.toLowerCase() === topic.toLowerCase()));
    }

    // Filter by Company
    if (company && company !== 'All') {
      problems = problems.filter(p => p.companies.some(c => c.toLowerCase() === company.toLowerCase()));
    }

    // Filter by Search
    if (search) {
      const q = search.toLowerCase();
      problems = problems.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.topics.some(t => t.toLowerCase().includes(q)) ||
        p.companies.some(c => c.toLowerCase().includes(q))
      );
    }

    // Collect solved and bookmark sets if user is logged in
    const solvedSet = new Set<string>();
    const bookmarkSet = new Set<string>();

    if (userId) {
      db.find('submissions', s => s.userId === userId && s.status === 'Accepted').forEach(s => {
        solvedSet.add(s.problemId);
      });
      db.find('bookmarks', b => b.userId === userId && b.entityType === 'dsa').forEach(b => {
        bookmarkSet.add(b.entityId);
      });
    }

    // Filter by Status
    if (status && userId) {
      if (status === 'Solved') {
        problems = problems.filter(p => solvedSet.has(p.id));
      } else if (status === 'Unsolved') {
        problems = problems.filter(p => !solvedSet.has(p.id));
      } else if (status === 'Bookmarked') {
        problems = problems.filter(p => bookmarkSet.has(p.id));
      }
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const total = problems.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = problems.slice(startIndex, startIndex + limitNum);

    const items = paginated.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      difficulty: p.difficulty,
      topics: p.topics,
      companies: p.companies,
      acceptanceRate: p.acceptanceRate,
      totalSubmissions: p.totalSubmissions,
      isDailyChallenge: Boolean(p.isDailyChallenge),
      hasVisualization: Boolean(p.visualizeData && p.visualizeData.steps && p.visualizeData.steps.length > 0),
      isSolved: solvedSet.has(p.id),
      isBookmarked: bookmarkSet.has(p.id)
    }));

    return res.json({
      success: true,
      data: items,
      meta: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        limit: limitNum
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProblemBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    const problem = db.findOne('problems', p => p.slug === slug);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    let isSolved = false;
    let isBookmarked = false;

    if (userId) {
      isSolved = Boolean(db.findOne('submissions', s => s.userId === userId && s.problemId === problem.id && s.status === 'Accepted'));
      isBookmarked = Boolean(db.findOne('bookmarks', b => b.userId === userId && b.entityType === 'dsa' && b.entityId === problem.id));
    }

    const publicTestCases = (problem.testCases || []).filter(t => !t.isHidden);

    return res.json({
      success: true,
      data: {
        ...problem,
        testCases: publicTestCases,
        isSolved,
        isBookmarked
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProblemSolution = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const problem = db.findOne('problems', p => p.slug === slug);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    if (!problem.solution) {
      return res.status(404).json({ success: false, message: 'Solution is not available for this problem.' });
    }

    return res.json({
      success: true,
      data: problem.solution
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getVisualizationData = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const problem = db.findOne('problems', p => p.slug === slug);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    return res.json({
      success: true,
      data: {
        title: problem.title,
        slug: problem.slug,
        visualizeData: problem.visualizeData || { type: 'array', steps: [] }
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleBookmark = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Login required to bookmark.' });
    }

    const { problemId } = req.body;
    const userId = req.user.id;

    const existing = db.findOne('bookmarks', b => b.userId === userId && b.entityType === 'dsa' && b.entityId === problemId);

    if (existing) {
      db.delete('bookmarks', b => b.id === existing.id);
      return res.json({ success: true, isBookmarked: false, message: 'Removed from bookmarks.' });
    } else {
      db.insert('bookmarks', {
        id: 'bm_' + Math.random().toString(36).substring(2, 9),
        userId,
        entityType: 'dsa',
        entityId: problemId,
        createdAt: new Date().toISOString()
      });
      return res.json({ success: true, isBookmarked: true, message: 'Added to bookmarks.' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTopicsAndCompanies = async (req: AuthRequest, res: Response) => {
  try {
    const problems = db.find('problems', p => p.isPublished);

    const topicCounts: Record<string, number> = {};
    const companyCounts: Record<string, number> = {};

    problems.forEach(p => {
      p.topics.forEach(t => {
        topicCounts[t] = (topicCounts[t] || 0) + 1;
      });
      p.companies.forEach(c => {
        companyCounts[c] = (companyCounts[c] || 0) + 1;
      });
    });

    return res.json({
      success: true,
      topics: Object.entries(topicCounts).map(([name, count]) => ({ name, count })),
      companies: Object.entries(companyCounts).map(([name, count]) => ({ name, count })),
      totalProblems: problems.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
