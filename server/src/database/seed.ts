import bcrypt from 'bcryptjs';
import { db, Product, LearningPath, User } from './db';
import { buildVisualizationData, dsaProblemsDataset } from './dsaDataset';
import { aptitudeTopicsDataset, aptitudeQuestionsDataset } from './aptitudeDataset';

export async function seedDatabaseIfEmpty() {
  // 1. Remove any legacy demo accounts safely
  const demoUserIds = ['usr_admin_master', 'usr_student_demo'];
  const demoEmails = ['admin@conceptifyyy.com', 'student@conceptifyyy.com'];
  
  db.delete('users', u => demoUserIds.includes(u.id) || demoEmails.includes(u.email));

  // 2. Ensure Real Admin Account (atharvbolke99@gmail.com) exists with role ADMIN and verified password
  const adminEmail = 'atharvbolke99@gmail.com';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('#Atharvb@99', salt);
  const existingAdmin = db.findOne('users', u => u.email === adminEmail);

  if (!existingAdmin) {
    const adminUser: User = {
      id: 'usr_admin_primary',
      name: 'Atharv Bolke',
      email: adminEmail,
      passwordHash,
      role: 'ADMIN',
      xp: 2500,
      streak: 5,
      badges: ['Platform Founder', 'Admin Master', 'DSA Specialist'],
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.insert('users', adminUser);
    console.log(`👑 Real Admin Account initialized: ${adminEmail}`);
  } else {
    // Keep role as ADMIN and ensure known working password
    db.update('users', u => u.id === existingAdmin.id, () => ({
      role: 'ADMIN' as const,
      passwordHash,
      status: 'ACTIVE' as const
    }));
  }

  // 2. Seed DSA Problems if not populated
  const existingProblems = db.find('problems');
  if (existingProblems.length === 0) {
    console.log('🌱 Seeding genuine DSA problems dataset...');
    for (const prob of dsaProblemsDataset) {
      db.insert('problems', prob);
    }
  } else {
    // Ensure all problems in DB have clean starter code without leaking complete solutions
    for (const prob of dsaProblemsDataset) {
      const match = db.findOne('problems', p => p.slug === prob.slug);
      if (match) {
        db.update('problems', p => p.id === match.id, () => prob);
      } else {
        db.insert('problems', prob);
      }
    }

    for (const existingProblem of db.find('problems', problem => !problem.visualizeData?.steps?.length)) {
      db.update('problems', problem => problem.id === existingProblem.id, () => ({
        visualizeData: buildVisualizationData(existingProblem.slug, existingProblem.topics[0] || 'Arrays')
      }));
    }
  }

  // 3. Seed Aptitude Topics & Questions if not populated
  const existingTopics = db.find('aptitudeTopics');
  if (existingTopics.length === 0) {
    console.log('🌱 Seeding genuine Aptitude topics & questions...');
    for (const top of aptitudeTopicsDataset) {
      db.insert('aptitudeTopics', top);
    }
    for (const q of aptitudeQuestionsDataset) {
      db.insert('aptitudeQuestions', q);
    }
  } else {
    for (const top of aptitudeTopicsDataset) {
      const matchingTopics = db.find('aptitudeTopics', t => t.id === top.id || t.slug === top.slug);
      const existingTopic = matchingTopics[0];
      if (!existingTopic) {
        db.insert('aptitudeTopics', top);
      } else {
        db.update('aptitudeTopics', t => t.id === existingTopic.id, () => ({ ...top, id: existingTopic.id }));
        for (const duplicate of matchingTopics.slice(1)) {
          for (const question of db.find('aptitudeQuestions', q => q.topicId === duplicate.id)) {
            db.update('aptitudeQuestions', q => q.id === question.id, () => ({ topicId: existingTopic.id }));
          }
          db.delete('aptitudeTopics', t => t.id === duplicate.id);
        }
      }
    }
    for (const q of aptitudeQuestionsDataset) {
      const sourceTopic = aptitudeTopicsDataset.find(topic => topic.id === q.topicId);
      const targetTopic = sourceTopic
        ? db.findOne('aptitudeTopics', topic => topic.slug === sourceTopic.slug)
        : undefined;
      const normalizedQuestion = targetTopic ? { ...q, topicId: targetTopic.id } : q;
      const existingQuestion = db.findOne('aptitudeQuestions', item => item.slug === q.slug);
      if (!existingQuestion) {
        db.insert('aptitudeQuestions', normalizedQuestion);
      } else if (targetTopic && existingQuestion.topicId !== targetTopic.id) {
        db.update('aptitudeQuestions', item => item.id === existingQuestion.id, () => ({ topicId: targetTopic.id }));
      }
    }
  }

  // 4. Normalize Catalog Products (Ensures all existing products have valid review counts without injecting unwanted sample products)
  for (const prod of db.find('products')) {
    if (!prod.reviewsCount || prod.reviewsCount < 50 || prod.reviewsCount > 200) {
      db.update('products', p => p.id === prod.id, () => ({
        reviewsCount: Math.floor(Math.random() * (200 - 50 + 1)) + 50
      }));
    }
  }

  // 5. Seed Learning Paths if empty
  const existingPaths = db.find('learningPaths');
  if (existingPaths.length === 0) {
    console.log('🌱 Seeding learning roadmaps...');
    const learningPaths: LearningPath[] = [
      {
        id: 'lp_dsa_complete',
        title: 'Complete DSA Zero-to-Hero Roadmap',
        slug: 'dsa-zero-to-hero',
        category: 'DSA',
        description: 'Structured visual roadmap taking you from fundamental arrays up to advanced Dynamic Programming and Graph algorithms.',
        icon: 'Code2',
        estimatedHours: 45,
        modules: [
          {
            id: 'mod_1',
            title: '1. Arrays & Two Pointers',
            description: 'Master in-place manipulation, prefix sums, and two pointers.',
            items: [
              { id: 'prob_two_sum', title: 'Two Sum', type: 'dsa', slug: 'two-sum', difficulty: 'Easy', xpReward: 20 },
              { id: 'prob_best_time_stock', title: 'Best Time to Buy & Sell Stock', type: 'dsa', slug: 'best-time-to-buy-and-sell-stock', difficulty: 'Easy', xpReward: 20 }
            ]
          },
          {
            id: 'mod_2',
            title: '2. Binary Search & Divide and Conquer',
            description: 'Logarithmic search spaces, sorted arrays, and search on answer.',
            items: [
              { id: 'prob_binary_search', title: 'Binary Search', type: 'dsa', slug: 'binary-search', difficulty: 'Easy', xpReward: 20 },
              { id: 'prob_search_2d_matrix', title: 'Search a 2D Matrix', type: 'dsa', slug: 'search-a-2d-matrix', difficulty: 'Medium', xpReward: 40 }
            ]
          },
          {
            id: 'mod_3',
            title: '3. Stacks & Queues',
            description: 'LIFO evaluation, monotonic stacks, and balanced parentheses.',
            items: [
              { id: 'prob_valid_parentheses', title: 'Valid Parentheses', type: 'dsa', slug: 'valid-parentheses', difficulty: 'Easy', xpReward: 20 },
              { id: 'prob_min_stack', title: 'Min Stack', type: 'dsa', slug: 'min-stack', difficulty: 'Medium', xpReward: 40 }
            ]
          },
          {
            id: 'mod_4',
            title: '4. Linked Lists & Pointers',
            description: 'Pointer manipulation, reversal, and fast/slow pointer cycle detection.',
            items: [
              { id: 'prob_reverse_linked_list', title: 'Reverse Linked List', type: 'dsa', slug: 'reverse-linked-list', difficulty: 'Easy', xpReward: 20 },
              { id: 'prob_linked_list_cycle', title: 'Linked List Cycle', type: 'dsa', slug: 'linked-list-cycle', difficulty: 'Easy', xpReward: 20 }
            ]
          }
        ]
      },
      {
        id: 'lp_aptitude_mastery',
        title: 'Campus Placement Aptitude Roadmap',
        slug: 'campus-aptitude-mastery',
        category: 'Aptitude',
        description: 'Step-by-step training for Quant, Logical Reasoning, and Verbal Ability for top IT company exams.',
        icon: 'BrainCircuit',
        estimatedHours: 25,
        modules: [
          {
            id: 'mod_apt_1',
            title: '1. Quantitative Foundations',
            description: 'Percentages, Profit & Loss, and Ratios.',
            items: [
              { id: 'apt_pct_1', title: 'Percentage Price Hike & Consumption', type: 'aptitude', slug: 'price-increase-consumption-reduction', difficulty: 'Easy', xpReward: 10 },
              { id: 'apt_pl_1', title: 'Selling Price & Profit Margin', type: 'aptitude', slug: 'selling-price-profit-margin', difficulty: 'Medium', xpReward: 15 }
            ]
          },
          {
            id: 'mod_apt_2',
            title: '2. Time, Work & Speed',
            description: 'Work-units method and relative motion.',
            items: [
              { id: 'apt_tw_1', title: 'Person A and B Combined Work', type: 'aptitude', slug: 'person-a-and-b-together-work', difficulty: 'Easy', xpReward: 10 },
              { id: 'apt_tsd_1', title: 'Train Crossing Platform', type: 'aptitude', slug: 'train-crossing-platform', difficulty: 'Medium', xpReward: 15 }
            ]
          },
          {
            id: 'mod_apt_3',
            title: '3. Logical Pattern Recognition',
            description: 'Coding-Decoding and Syllogisms.',
            items: [
              { id: 'apt_cd_1', title: 'Letter Shift Cipher', type: 'aptitude', slug: 'letter-shift-cipher', difficulty: 'Medium', xpReward: 15 },
              { id: 'apt_syl_1', title: 'Standard Syllogism Deduction', type: 'aptitude', slug: 'standard-syllogism-deduction', difficulty: 'Easy', xpReward: 10 }
            ]
          }
        ]
      }
    ];

    for (const lp of learningPaths) {
      db.insert('learningPaths', lp);
    }
  }

  console.log('✅ CONCEPTIFYYY database initialized with genuine educational datasets!');
}
