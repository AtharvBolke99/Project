import { Response } from 'express';
import { db, AptitudeSubmission } from '../database/db';
import { AuthRequest } from '../middleware/auth';
import { gamificationService } from '../services/gamificationService';
import { v4 as uuidv4 } from 'uuid';

export const getCategoriesAndTopics = async (req: AuthRequest, res: Response) => {
  try {
    const topics = db.find('aptitudeTopics');
    const questions = db.find('aptitudeQuestions');

    const topicsWithCount = topics.map(t => ({
      ...t,
      questionCount: questions.filter(q => q.topicId === t.id).length,
      sampleQuestionSlug: questions.find(q => q.topicId === t.id)?.slug
    }));

    const categorized = {
      Quantitative: topicsWithCount.filter(t => t.category === 'Quantitative'),
      'Logical Reasoning': topicsWithCount.filter(t => t.category === 'Logical Reasoning'),
      'Verbal Ability': topicsWithCount.filter(t => t.category === 'Verbal Ability')
    };

    return res.json({
      success: true,
      data: categorized,
      totalQuestions: questions.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuestionsByTopic = async (req: AuthRequest, res: Response) => {
  try {
    const { topicSlug } = req.params;
    const { search, difficulty, page = '1', limit = '20' } = req.query as Record<string, string>;
    const userId = req.user?.id;

    const topic = db.findOne('aptitudeTopics', t => t.slug === topicSlug);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found.' });
    }

    let questions = db.find('aptitudeQuestions', q => q.topicId === topic.id);

    // Filter by Difficulty
    if (difficulty && difficulty !== 'All') {
      questions = questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    // Filter by Search
    if (search) {
      const q = search.toLowerCase();
      questions = questions.filter(item =>
        item.question.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q)
      );
    }

    const userSubmissions = userId
      ? db.find('aptitudeSubmissions', s => s.userId === userId)
      : [];

    const total = questions.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = questions.slice(startIndex, startIndex + limitNum);

    const items = paginated.map(q => {
      const sub = userSubmissions.find(s => s.questionId === q.id);
      return {
        id: q.id,
        topicId: q.topicId,
        topicTitle: q.topicTitle,
        category: q.category,
        slug: q.slug,
        question: q.question,
        difficulty: q.difficulty,
        options: q.options,
        isSolved: Boolean(sub?.isCorrect),
        hasVisualExplanation: Boolean(q.visualSteps && q.visualSteps.length > 0)
      };
    });

    return res.json({
      success: true,
      topic,
      questions: items,
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

export const getQuestionBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    const question = db.findOne('aptitudeQuestions', q => q.slug === slug);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Aptitude question not found.' });
    }

    let userSubmission = null;
    if (userId) {
      userSubmission = db.findOne('aptitudeSubmissions', s => s.userId === userId && s.questionId === question.id);
    }

    return res.json({
      success: true,
      data: {
        id: question.id,
        topicId: question.topicId,
        topicTitle: question.topicTitle,
        category: question.category,
        slug: question.slug,
        question: question.question,
        difficulty: question.difficulty,
        options: question.options,
        // Only provide answer/explanation if user already solved it or if explicitly requested after submission
        userSubmission: userSubmission
          ? {
              selectedOption: userSubmission.selectedOption,
              isCorrect: userSubmission.isCorrect
            }
          : null
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { questionId, selectedOption, timeSpentSec = 30 } = req.body;
    const userId = req.user?.id;

    if (questionId === undefined || selectedOption === undefined) {
      return res.status(400).json({ success: false, message: 'questionId and selectedOption are required.' });
    }

    const question = db.findOne('aptitudeQuestions', q => q.id === questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    const isCorrect = Number(selectedOption) === Number(question.correctAnswer);

    let gamification = { xpAdded: 0, newTotalXp: 0, streak: 0, newBadges: [] as string[] };

    if (userId) {
      const submission: AptitudeSubmission = {
        id: 'asub_' + uuidv4().substring(0, 8),
        userId,
        questionId,
        selectedOption: Number(selectedOption),
        isCorrect,
        timeSpentSec: Number(timeSpentSec),
        createdAt: new Date().toISOString()
      };

      db.insert('aptitudeSubmissions', submission);

      if (isCorrect) {
        gamification = gamificationService.awardActivity(userId, 'aptitude_solve', question.difficulty);
      }
    }

    return res.json({
      success: true,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      formula: question.formula,
      shortcut: question.shortcut,
      visualSteps: question.visualSteps,
      gamification
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const generateTest = async (req: AuthRequest, res: Response) => {
  try {
    const { category, topicId, count = 5 } = req.query as { category?: string; topicId?: string; count?: string };
    let questions = db.find('aptitudeQuestions');

    if (category && category !== 'All') {
      questions = questions.filter(q => q.category === category);
    }
    if (topicId && topicId !== 'All') {
      questions = questions.filter(q => q.topicId === topicId);
    }

    // Shuffle and pick
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(Number(count), shuffled.length));

    const testItems = selected.map((q, idx) => ({
      index: idx + 1,
      id: q.id,
      topicTitle: q.topicTitle,
      category: q.category,
      question: q.question,
      difficulty: q.difficulty,
      options: q.options,
      slug: q.slug
    }));

    return res.json({
      success: true,
      data: {
        testId: 'test_' + uuidv4().substring(0, 8),
        durationMinutes: Math.max(5, Math.ceil(testItems.length * 1.5)),
        totalQuestions: testItems.length,
        questions: testItems
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitTest = async (req: AuthRequest, res: Response) => {
  try {
    const { answers, timeSpentSeconds = 300 } = req.body as { answers: Record<string, number>; timeSpentSeconds?: number };
    const userId = req.user?.id;

    if (!answers) {
      return res.status(400).json({ success: false, message: 'Answers object is required.' });
    }

    const questionIds = Object.keys(answers);
    const questions = db.find('aptitudeQuestions', q => questionIds.includes(q.id));

    let correctCount = 0;
    const reviewDetails: any[] = [];

    questions.forEach(q => {
      const selected = answers[q.id];
      const isCorrect = selected !== undefined && Number(selected) === Number(q.correctAnswer);
      if (isCorrect) correctCount++;

      if (userId && selected !== undefined) {
        db.insert('aptitudeSubmissions', {
          id: 'asub_' + uuidv4().substring(0, 8),
          userId,
          questionId: q.id,
          selectedOption: Number(selected),
          isCorrect,
          timeSpentSec: Math.round(timeSpentSeconds / questions.length),
          createdAt: new Date().toISOString()
        });
      }

      reviewDetails.push({
        id: q.id,
        question: q.question,
        options: q.options,
        selectedOption: selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        formula: q.formula,
        shortcut: q.shortcut,
        visualSteps: q.visualSteps
      });
    });

    const total = questions.length || 1;
    const accuracy = Math.round((correctCount / total) * 100);

    let gamification = { xpAdded: 0, newTotalXp: 0, streak: 0, newBadges: [] as string[] };
    if (userId && correctCount > 0) {
      gamification = gamificationService.awardActivity(userId, 'aptitude_solve', 'Medium');
    }

    return res.json({
      success: true,
      data: {
        score: correctCount,
        totalQuestions: total,
        accuracy,
        timeSpentSeconds,
        details: reviewDetails,
        gamification
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

