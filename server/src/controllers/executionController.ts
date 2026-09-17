import { Response } from 'express';
import { db, Submission } from '../database/db';
import { AuthRequest } from '../middleware/auth';
import { sandboxService } from '../services/sandboxService';
import { gamificationService } from '../services/gamificationService';
import { v4 as uuidv4 } from 'uuid';

export const runCode = async (req: AuthRequest, res: Response) => {
  try {
    const { problemId, problemSlug, language, code, customInput } = req.body;
    const targetId = problemId || problemSlug;

    if (!targetId || !language || !code) {
      return res.status(400).json({ success: false, message: 'problemId/problemSlug, language, and code are required.' });
    }

    const problem = db.findOne('problems', p => p.id === targetId || p.slug === targetId);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    // Run against public sample test cases or custom input
    const testCases = customInput
      ? [{ input: customInput, expectedOutput: '' }]
      : problem.testCases.filter(t => !t.isHidden);

    const result = await sandboxService.execute(language, code, testCases, customInput);

    return res.json({
      success: true,
      data: result,
      result
    });
  } catch (error: any) {
    console.error('Run code error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Execution error.' });
  }
};

export const submitSolution = async (req: AuthRequest, res: Response) => {
  try {
    const { problemId, problemSlug, language, code } = req.body;
    const targetId = problemId || problemSlug;
    const userId = req.user?.id;

    if (!targetId || !language || !code) {
      return res.status(400).json({ success: false, message: 'problemId/problemSlug, language, and code are required.' });
    }

    const problem = db.findOne('problems', p => p.id === targetId || p.slug === targetId);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    // Execute against full suite of test cases (including hidden)
    const result = await sandboxService.execute(language, code, problem.testCases);

    let xpData = { xpAdded: 0, newTotalXp: 0, streak: 0, newBadges: [] as string[] };

    if (userId) {
      const submission: Submission = {
        id: 'sub_' + uuidv4().substring(0, 8),
        userId,
        problemId,
        code,
        language,
        status: result.status,
        executionTimeMs: result.executionTimeMs,
        memoryKb: result.memoryKb,
        testCasesPassed: result.testCasesPassed,
        totalTestCases: result.totalTestCases,
        errorOutput: result.error,
        createdAt: new Date().toISOString()
      };

      db.insert('submissions', submission);

      // Update problem metrics
      const newTotal = (problem.totalSubmissions || 0) + 1;
      const newAccepted = (problem.totalAccepted || 0) + (result.status === 'Accepted' ? 1 : 0);
      const newRate = Math.round((newAccepted / newTotal) * 100);

      db.update(
        'problems',
        p => p.id === problem.id,
        p => ({
          totalSubmissions: newTotal,
          totalAccepted: newAccepted,
          acceptanceRate: newRate
        })
      );

      // If accepted, award gamification XP and update streak
      if (result.status === 'Accepted') {
        xpData = gamificationService.awardActivity(userId, 'dsa_solve', problem.difficulty);
      }
    }

    // Sanitize hidden test case inputs and expected outputs so secrets/tests are not leaked to frontend
    const sanitizedDetails = (result.details || []).map((detail, idx) => {
      const tc = problem.testCases[idx];
      if (tc && tc.isHidden) {
        return {
          testCaseIndex: detail.testCaseIndex,
          input: '[Hidden Test Case]',
          expectedOutput: '[Hidden]',
          actualOutput: detail.passed ? '[Hidden Passed]' : (detail.error || '[Output Mismatch on Hidden Test]'),
          passed: detail.passed,
          error: detail.error,
          executionTimeMs: detail.executionTimeMs,
          isHidden: true
        };
      }
      return detail;
    });

    const sanitizedResult = {
      ...result,
      details: sanitizedDetails
    };

    return res.json({
      success: true,
      data: sanitizedResult,
      result: sanitizedResult,
      gamification: xpData
    });
  } catch (error: any) {
    console.error('Submit solution error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Submission execution failed.' });
  }
};

export const getProblemSubmissions = async (req: AuthRequest, res: Response) => {
  try {
    const { problemId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthenticated.' });
    }

    const submissions = db.find('submissions', s => s.userId === userId && s.problemId === problemId);
    submissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json({
      success: true,
      submissions
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
