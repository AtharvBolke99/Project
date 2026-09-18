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

  // 4. Seed and Upsert Catalog Products (Guarantees persistence across container reboots without overwriting user data)
  const defaultProducts: Product[] = [
    {
      id: 'prod_dsa_handbook',
      title: 'Complete DSA Placement Handbook (180+ Pages Visual Notes)',
      slug: 'dsa-placement-handbook',
      category: 'DSA Notes',
      cardDescription: 'Comprehensive 184-page visual guide covering all 25 core DSA patterns, visual flowcharts, and multi-language interview cheat sheets.',
      stepDescription: '• Step 1: Core Array & Two Pointer Patterns (Sliding Window, Prefix Sums, Dutch National Flag)\n• Step 2: Linked Lists, Stacks & Queues (Monotonic Stack, Fast & Slow Pointers)\n• Step 3: Binary Trees & BST Traversal Mechanics (Recursion Trees, LCA, Tree Diameter)\n• Step 4: Graph BFS/DFS, Dijkstra, Topological Sort & Disjoint Set Union (DSU)\n• Step 5: Dynamic Programming Memoization & Tabulation Blueprints (0/1 Knapsack, LCS, LIS)\n• Step 6: Top 100 FAANG & Tier-1 Company Placement Questions with Step-by-Step Solutions',
      detailedDescription: '• Step 1: Core Array & Two Pointer Patterns (Sliding Window, Prefix Sums, Dutch National Flag)\n• Step 2: Linked Lists, Stacks & Queues (Monotonic Stack, Fast & Slow Pointers)\n• Step 3: Binary Trees & BST Traversal Mechanics (Recursion Trees, LCA, Tree Diameter)\n• Step 4: Graph BFS/DFS, Dijkstra, Topological Sort & Disjoint Set Union (DSU)\n• Step 5: Dynamic Programming Memoization & Tabulation Blueprints (0/1 Knapsack, LCS, LIS)\n• Step 6: Top 100 FAANG & Tier-1 Company Placement Questions with Step-by-Step Solutions',
      shortDescription: 'Comprehensive 184-page visual guide covering all 25 core DSA patterns, visual flowcharts, and multi-language interview cheat sheets.',
      description: 'Comprehensive, illustrated visual guide covering all 25 core DSA patterns with Python, Java & C++ code snippets, complexity cheat sheets, and interview cheat codes.',
      price: 39,
      originalPrice: 199,
      discountPercent: 80,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      previewImages: [
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
      ],
      digitalFile: 'dsa_placement_handbook.pdf',
      fileFormat: 'PDF',
      pageCount: 184,
      rating: 4.9,
      reviewsCount: 1420,
      whatIncluded: [
        '184 Pages High-Resolution Color PDF',
        'All 25 DSA Pattern Flowcharts & Visual Walkthroughs',
        'Python, C++, Java & JavaScript Code Implementations',
        'Top 100 FAANG & Tier-1 Placement Questions'
      ],
      tags: ['DSA', 'Placement', 'Handwritten Notes', 'FAANG', 'Interview Prep'],
      isFeatured: true,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prod_aptitude_speed_tricks',
      title: 'Master Aptitude Speed Tricks & Formula Pack',
      slug: 'aptitude-formula-speed-tricks',
      category: 'Aptitude Notes',
      cardDescription: 'Instant speed math shortcuts, Vedic tricks, and 200+ solved formulas for Quantitative Aptitude and Logical Reasoning for campus exams.',
      stepDescription: '• Step 1: Speed Arithmetic & Vedic Math Mental Multiplications (Squares, Cubes, Fast Division)\n• Step 2: Quantitative Foundations (Percentages, Profit & Loss, Simple & Compound Interest)\n• Step 3: Time, Speed & Distance (Relative Speed, Trains, Boats & Streams)\n• Step 4: Time & Work (Work-Unit LCM Model, Pipes & Cisterns, Efficiency Ratios)\n• Step 5: Logical Reasoning (Syllogisms, Blood Relations, Seating Arrangements, Coding-Decoding)\n• Step 6: Company-Wise Exam Weightage & Solved Previous Year Question Patterns (TCS NQT, Infosys, Accenture, Cognizant)',
      detailedDescription: '• Step 1: Speed Arithmetic & Vedic Math Mental Multiplications (Squares, Cubes, Fast Division)\n• Step 2: Quantitative Foundations (Percentages, Profit & Loss, Simple & Compound Interest)\n• Step 3: Time, Speed & Distance (Relative Speed, Trains, Boats & Streams)\n• Step 4: Time & Work (Work-Unit LCM Model, Pipes & Cisterns, Efficiency Ratios)\n• Step 5: Logical Reasoning (Syllogisms, Blood Relations, Seating Arrangements, Coding-Decoding)\n• Step 6: Company-Wise Exam Weightage & Solved Previous Year Question Patterns (TCS NQT, Infosys, Accenture, Cognizant)',
      shortDescription: 'Instant speed math shortcuts, Vedic tricks, and 200+ solved formulas for Quantitative Aptitude and Logical Reasoning for campus exams.',
      description: 'Instant speed math shortcuts, Vedic tricks, and 200+ solved formulas for Quantitative Aptitude and Logical Reasoning for TCS NQT, Infosys, Accenture, and Cognizant.',
      price: 29,
      originalPrice: 149,
      discountPercent: 80,
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
      previewImages: [
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80'
      ],
      digitalFile: 'aptitude_speed_tricks.pdf',
      fileFormat: 'PDF',
      pageCount: 95,
      rating: 4.8,
      reviewsCount: 890,
      whatIncluded: [
        '95 Pages Quantitative & Logical Formula Sheet',
        '50+ Speed-Math Vedic Shortcuts',
        'Company-wise Aptitude Weightage Map',
        'Previous 3 Years Solved Question Patterns'
      ],
      tags: ['Aptitude', 'Quantitative', 'Logical Reasoning', 'TCS NQT', 'Formulas'],
      isFeatured: true,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prod_placement_master_bundle',
      title: 'Campus Placement Ultimate Super Pack (DSA + Aptitude + Core CS)',
      slug: 'placement-ultimate-super-pack',
      category: 'Placement Bundles',
      cardDescription: 'The ultimate 4-in-1 placement bundle: Complete DSA Visual Notes + Aptitude Speed Formulas + Core CS Revision + ATS Resume Guide.',
      stepDescription: '• Module 1: Complete DSA Placement Handbook (184 Pages Illustrated Notes)\n• Module 2: Quantitative Aptitude & Logical Reasoning Master Formula Sheet (95 Pages)\n• Module 3: Core Computer Science Revision Flashcards (Operating Systems, DBMS & SQL, Computer Networks, OOPs Principles)\n• Module 4: 500+ Frequently Asked Campus Technical & HR Interview Questions with Answers\n• Module 5: ATS-Optimized High-Score Resume Templates & Strong Action Verbs Guide',
      detailedDescription: '• Module 1: Complete DSA Placement Handbook (184 Pages Illustrated Notes)\n• Module 2: Quantitative Aptitude & Logical Reasoning Master Formula Sheet (95 Pages)\n• Module 3: Core Computer Science Revision Flashcards (Operating Systems, DBMS & SQL, Computer Networks, OOPs Principles)\n• Module 4: 500+ Frequently Asked Campus Technical & HR Interview Questions with Answers\n• Module 5: ATS-Optimized High-Score Resume Templates & Strong Action Verbs Guide',
      shortDescription: 'The ultimate 4-in-1 placement bundle: Complete DSA Visual Notes + Aptitude Speed Formulas + Core CS Revision + ATS Resume Guide.',
      description: 'The all-in-one preparation suite: DSA Handbook + Aptitude Formulas + DBMS, OS, Computer Networks & System Design Quick-Revision Notes + HR & Tech Viva Q&A.',
      price: 99,
      originalPrice: 499,
      discountPercent: 80,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      previewImages: [
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80'
      ],
      digitalFile: 'placement_ultimate_bundle.zip',
      fileFormat: 'ZIP',
      pageCount: 450,
      rating: 5.0,
      reviewsCount: 2310,
      whatIncluded: [
        'Complete DSA Visual Notes (184 Pages)',
        'Aptitude Speed Formulas (95 Pages)',
        'Core CS Subjects: OS, DBMS, CN, OOPs Flashcards',
        '500+ Campus Placement Interview Questions & Answers',
        'ATS-Optimized Resume Templates & Action Verbs Guide'
      ],
      tags: ['Bundle', 'Placement', 'DSA', 'Core CS', 'Aptitude', 'Resume'],
      isFeatured: true,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prod_job_portal_project',
      title: 'Full-Stack Job Portal & ATS Platform (MERN Stack)',
      slug: 'mern-job-portal-ats-project',
      category: 'Projects',
      cardDescription: 'Production-grade engineering project: Full MERN Stack job recruiting platform with resume parsing, recruiter portal, and student dashboard.',
      stepDescription: '• Phase 1: Full Architecture & DB Schema Design (MongoDB Models, Relations, JWT Authentication)\n• Phase 2: Recruiter Workflow (Job Postings, Application Tracking, Status Updates, Candidate Shortlisting)\n• Phase 3: Student Candidate Workflow (Profile Builder, Resume Upload with Multer, Real-Time Application Tracking)\n• Phase 4: Production Deployment Guide & Complete Final Year College Synopsis/PPT Viva Report',
      detailedDescription: '• Phase 1: Full Architecture & DB Schema Design (MongoDB Models, Relations, JWT Authentication)\n• Phase 2: Recruiter Workflow (Job Postings, Application Tracking, Status Updates, Candidate Shortlisting)\n• Phase 3: Student Candidate Workflow (Profile Builder, Resume Upload with Multer, Real-Time Application Tracking)\n• Phase 4: Production Deployment Guide & Complete Final Year College Synopsis/PPT Viva Report',
      shortDescription: 'Production-grade engineering project: Full MERN Stack job recruiting platform with resume parsing, recruiter portal, and student dashboard.',
      description: 'Production-grade engineering project: Full MERN Stack job recruiting platform with resume parsing, recruiter portal, student dashboard, and email triggers.',
      price: 149,
      originalPrice: 899,
      discountPercent: 83,
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
      previewImages: [
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80'
      ],
      digitalFile: 'mern_job_portal_complete.zip',
      fileFormat: 'ZIP',
      rating: 4.9,
      reviewsCount: 460,
      whatIncluded: [
        'Complete Source Code (React, Node.js, Express, MongoDB)',
        'Detailed Synopsis & 45-Page Project Report (.DOCX & .PDF)',
        'Full PPT Presentation for Final Year College Viva',
        'Database Schema & Architecture Diagrams',
        'Step-by-step Setup & Deployment Guide'
      ],
      tags: ['MERN', 'Major Project', 'React', 'Node.js', 'College Project'],
      techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Multer'],
      liveDemoUrl: 'https://demo-job-portal.conceptifyyy.dev',
      isFeatured: true,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prod_test_mode_item',
      title: 'Conceptifyyy Test Product (Razorpay Test Mode)',
      slug: 'conceptifyyy-test-product',
      category: 'Test Mode',
      cardDescription: 'Special ₹1 product designed to verify Razorpay checkout, signature verification, and instant digital asset delivery.',
      stepDescription: '• Step 1: Real-time Razorpay Order Creation via Backend\n• Step 2: Official Razorpay SSL Encrypted Payment Processing\n• Step 3: Instant Webhook & Client Signature Verification\n• Step 4: Automatic Library Access & Secure PDF File Delivery',
      detailedDescription: '• Step 1: Real-time Razorpay Order Creation via Backend\n• Step 2: Official Razorpay SSL Encrypted Payment Processing\n• Step 3: Instant Webhook & Client Signature Verification\n• Step 4: Automatic Library Access & Secure PDF File Delivery',
      shortDescription: 'Special ₹1 product designed to verify Razorpay checkout, signature verification, and instant digital asset delivery.',
      description: 'Special ₹1 product designed to verify Razorpay Test Mode checkout, webhook processing, signature verification, and instant digital asset unlocking.',
      price: 1,
      originalPrice: 10,
      discountPercent: 90,
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=600&auto=format&fit=crop&q=80',
      previewImages: [],
      digitalFile: 'conceptifyyy_test_verification.pdf',
      fileFormat: 'PDF',
      pageCount: 5,
      rating: 5.0,
      reviewsCount: 99,
      whatIncluded: [
        'Real Razorpay Test Order Simulation',
        'Instant Database Order & Purchase Record',
        'Verified Download Delivery'
      ],
      tags: ['Test Mode', 'Razorpay', 'Verification'],
      isFeatured: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  for (const prod of defaultProducts) {
    const existing = db.findOne('products', p => p.id === prod.id || p.slug === prod.slug);
    if (!existing) {
      db.insert('products', prod);
      console.log(`📦 Seeded core product: ${prod.title}`);
    } else {
      // Ensure existing items have cardDescription and stepDescription populated
      db.update('products', p => p.id === existing.id, p => ({
        cardDescription: p.cardDescription || prod.cardDescription || p.shortDescription || p.description,
        stepDescription: p.stepDescription || prod.stepDescription || p.detailedDescription || p.description,
        detailedDescription: p.detailedDescription || prod.detailedDescription || p.stepDescription || p.description,
        shortDescription: p.shortDescription || prod.shortDescription || p.cardDescription,
        price: p.price ?? prod.price,
        originalPrice: p.originalPrice ?? prod.originalPrice,
        discountPercent: p.discountPercent ?? prod.discountPercent,
        whatIncluded: p.whatIncluded && p.whatIncluded.length > 0 ? p.whatIncluded : prod.whatIncluded,
        tags: p.tags && p.tags.length > 0 ? p.tags : prod.tags
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
