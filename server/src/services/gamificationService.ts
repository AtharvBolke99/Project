import { db, User } from '../database/db';

export class GamificationService {
  /**
   * Award XP and update streak for user activity
   */
  public awardActivity(
    userId: string,
    activityType: 'dsa_solve' | 'aptitude_solve' | 'daily_challenge',
    difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy'
  ): { xpAdded: number; newTotalXp: number; streak: number; newBadges: string[] } {
    const user = db.findOne('users', u => u.id === userId);
    if (!user) {
      return { xpAdded: 0, newTotalXp: 0, streak: 0, newBadges: [] };
    }

    // 1. Calculate XP
    let xpGain = 0;
    if (activityType === 'dsa_solve') {
      if (difficulty === 'Easy') xpGain = 20;
      else if (difficulty === 'Medium') xpGain = 40;
      else if (difficulty === 'Hard') xpGain = 80;
    } else if (activityType === 'aptitude_solve') {
      xpGain = 10;
    } else if (activityType === 'daily_challenge') {
      xpGain = 50;
    }

    // 2. Calculate Streak
    const todayStr = new Date().toISOString().split('T')[0];
    let newStreak = user.streak || 0;

    if (!user.lastActiveDate) {
      newStreak = 1;
    } else {
      const lastDate = new Date(user.lastActiveDate);
      const today = new Date(todayStr);
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1; // streak broke
      }
    }

    const currentBadges = new Set(user.badges || []);
    const awardedBadges: string[] = [];

    // 3. Check Badges
    const solvedSubmissions = db.find('submissions', s => s.userId === userId && s.status === 'Accepted');
    const aptitudeSubmissions = db.find('aptitudeSubmissions', s => s.userId === userId && s.isCorrect);

    if (solvedSubmissions.length >= 1 && !currentBadges.has('First Step')) {
      currentBadges.add('First Step');
      awardedBadges.push('First Step');
    }

    if (solvedSubmissions.length >= 5 && !currentBadges.has('Problem Solver')) {
      currentBadges.add('Problem Solver');
      awardedBadges.push('Problem Solver');
    }

    if (newStreak >= 7 && !currentBadges.has('7-Day Streak Warrior')) {
      currentBadges.add('7-Day Streak Warrior');
      awardedBadges.push('7-Day Streak Warrior');
    }

    if (aptitudeSubmissions.length >= 5 && !currentBadges.has('Aptitude Ace')) {
      currentBadges.add('Aptitude Ace');
      awardedBadges.push('Aptitude Ace');
    }

    const updatedXp = (user.xp || 0) + xpGain;

    // Update in database
    db.update(
      'users',
      u => u.id === userId,
      u => ({
        xp: updatedXp,
        streak: newStreak,
        lastActiveDate: todayStr,
        badges: Array.from(currentBadges),
        updatedAt: new Date().toISOString()
      })
    );

    // If new badge awarded, create notification
    if (awardedBadges.length > 0) {
      for (const badge of awardedBadges) {
        db.insert('notifications', {
          id: 'notif_' + Math.random().toString(36).substring(2, 9),
          userId,
          title: '🎉 New Badge Unlocked!',
          message: `Congratulations! You have earned the "${badge}" badge.`,
          type: 'achievement',
          link: '/dashboard',
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    }

    return {
      xpAdded: xpGain,
      newTotalXp: updatedXp,
      streak: newStreak,
      newBadges: awardedBadges
    };
  }

  /**
   * Get Leaderboard with computed rankings
   */
  public getLeaderboard(type: 'global' | 'weekly' | 'monthly' = 'global') {
    const users = db.find('users', u => u.status === 'ACTIVE');

    const leaderboard = users.map(user => {
      const solvedProblemsCount = new Set(
        db.find('submissions', s => s.userId === user.id && s.status === 'Accepted').map(s => s.problemId)
      ).size;

      const solvedAptitudeCount = new Set(
        db.find('aptitudeSubmissions', s => s.userId === user.id && s.isCorrect).map(s => s.questionId)
      ).size;

      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`,
        xp: user.xp || 0,
        streak: user.streak || 0,
        problemsSolved: solvedProblemsCount,
        aptitudeSolved: solvedAptitudeCount,
        badges: user.badges || [],
        role: user.role
      };
    });

    leaderboard.sort((a, b) => b.xp - a.xp);

    return leaderboard.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }
}

export const gamificationService = new GamificationService();
