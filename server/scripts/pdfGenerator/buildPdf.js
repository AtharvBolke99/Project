const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const tcs = require('./data/tcs.js');
const cognizant = require('./data/cognizant.js');
const infosys = require('./data/infosys.js');
const wipro = require('./data/wipro.js');
const accenture = require('./data/accenture.js');
const capgemini = require('./data/capgemini.js');
const deloitte = require('./data/deloitte.js');
const hcltech = require('./data/hcltech.js');
const techmahindra = require('./data/techmahindra.js');
const master40 = require('./data/master40.js');
const extras = require('./data/extras.js');

// Brand Colors
const COLORS = {
  primary: '#4338CA',      // Indigo
  primaryDark: '#312E81',
  primaryLight: '#EEF2FF',
  textPrimary: '#0F172A',   // Slate 900
  textSecondary: '#475569', // Slate 600
  textMuted: '#64748B',
  bgCard: '#F8FAFC',        // Slate 50
  borderSubtle: '#E2E8F0',  // Slate 200
  accentCyan: '#0284C7',    // Sky 600
  accentEmerald: '#059669', // Emerald 600
  accentRose: '#E11D48',    // Rose 600
  accentAmber: '#D97706',   // Amber 600
  codeBg: '#0F172A',        // Slate 900
  codeText: '#E2E8F0'
};

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 45;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN; // 505.28

async function generatePlacementPdf() {
  console.log('🚀 Starting Conceptifyyy Company-Wise DSA Placement PDF Generation...');

  const outputDir = path.resolve(__dirname, '../../uploads/documents');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'conceptifyyy_company_wise_dsa_placement_prep_2026.pdf');

  const doc = new PDFDocument({
    autoFirstPage: false,
    bufferPages: true,
    size: 'A4',
    margin: { top: 50, bottom: 50, left: MARGIN, right: MARGIN }
  });

  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  const tocEntries = [];

  // ================= 1. COVER PAGE =================
  console.log('📄 Rendering Cover Page...');
  doc.addPage();
  drawCoverPage(doc);

  // ================= 2. COPYRIGHT PAGE =================
  console.log('📄 Rendering Copyright & Notice...');
  doc.addPage();
  drawCopyrightPage(doc);

  // ================= 3. TABLE OF CONTENTS PLACEHOLDERS =================
  // Reserve 4 pages for TOC
  const tocStartPage = doc.bufferedPageRange().count; // Page 3 (0-indexed: 2)
  const TOC_PAGES = 4;
  for (let i = 0; i < TOC_PAGES; i++) {
    doc.addPage();
  }

  // ================= 4. INTRODUCTION =================
  console.log('📄 Rendering Introduction...');
  doc.addPage();
  const introPageNum = doc.bufferedPageRange().count;
  tocEntries.push({ title: 'Introduction & How to Master Placements', page: introPageNum, isChapter: true });
  drawIntroduction(doc);

  // ================= 5 to 13. COMPANY CHAPTERS =================
  const chapters = [
    {
      num: 1,
      name: 'TCS NQT — National Qualifier Test',
      subtitle: 'Most Important Coding Questions with Complete Java Solutions',
      role: 'Ninja, Digital & Prime Recruitment Tracks',
      tips: 'TCS NQT heavily emphasizes array logic, mathematical properties (prime, armstrong, fibonacci), string manipulation, and Kadane\'s algorithm. Ensure edge case handling for large inputs.',
      data: tcs
    },
    {
      num: 2,
      name: 'Cognizant GenC & GenC Elevate / Next',
      subtitle: 'Standard Console I/O Programs & Complete Java Implementations',
      role: 'GenC, GenC Elevate & GenC Next Technical Rounds',
      tips: 'Cognizant requires complete Java code reading from standard input using Scanner and printing exact outputs. Special focus on pairwise-product minimization, coin change, and hashing.',
      data: cognizant
    },
    {
      num: 3,
      name: 'Infosys — Systems Engineer & Specialist Programmer',
      subtitle: 'Algorithmic Optimization, Graphs & Dynamic Programming',
      role: 'Systems Engineer (SE), Digital Specialist Engineer (DSE) & Specialist Programmer (SP)',
      tips: 'Infosys SP track is renowned for medium-to-hard dynamic programming (0/1 Knapsack, Coin Change, LCS, LIS) and graph algorithms (BFS/DFS, Dijkstra, Number of Islands).',
      data: infosys
    },
    {
      num: 4,
      name: 'Wipro — Entry-Level & Turbo Technical',
      subtitle: 'Fundamental Coding Challenges & Data Structure Manipulations',
      role: 'Wipro Elite NTH & Turbo Assessment Rounds',
      tips: 'Wipro focuses on algorithmic fundamentals: recursion, linked list reversal, balanced parentheses, array rotations, and searching/sorting algorithms.',
      data: wipro
    },
    {
      num: 5,
      name: 'Accenture — ASE & Advanced Entry-Level',
      subtitle: 'Coding Questions for Associate Software Engineer (ASE) & FSE',
      role: 'Associate Software Engineer & Full Stack Engineer',
      tips: 'Accenture test patterns cover array frequency sorting, next greater element (monotonic stacks), activity selection (greedy), and string prefix matching.',
      data: accenture
    },
    {
      num: 6,
      name: 'Capgemini — Exceller & Analyst Track',
      subtitle: 'Technical Assessment Coding Solutions & Algorithms',
      role: 'Capgemini Exceller, Senior Analyst & Analyst Drives',
      tips: 'Key recurring questions include Leaders in an Array, Moore\'s Voting Majority Element, Minimum Platforms Required, and Merge Sort divide-and-conquer.',
      data: capgemini
    },
    {
      num: 7,
      name: 'Deloitte — Analyst & Technology Consulting',
      subtitle: 'Trees, Linked Lists, Hashing & Algorithmic Design',
      role: 'Analyst, Associate Analyst & Technology Solutions Consultant',
      tips: 'Deloitte technical interviews focus deeply on Trees (LCA, height, traversals), Linked Lists (cycle detection, middle node), and Floyd\'s duplicate number algorithm.',
      data: deloitte
    },
    {
      num: 8,
      name: 'HCLTech — Graduate / Entry-Level Engineer',
      subtitle: 'Core Data Structures, Sorting, Searching & Number Theory',
      role: 'Graduate Trainee & Associate Software Developer',
      tips: 'HCLTech emphasizes classic foundational DSA: Min/Max elements, array verification, insertion sort, binary search, prime numbers, and palindrome checks.',
      data: hcltech
    },
    {
      num: 9,
      name: 'Tech Mahindra — Entry-Level Assessment',
      subtitle: 'Essential Coding Practice & Full Solutions',
      role: 'Associate Software Engineer Technical Exam',
      tips: 'Tech Mahindra focuses on fundamental mathematical programming, selection sort, middle of linked list, and custom stack/queue operations.',
      data: techmahindra
    }
  ];

  for (const ch of chapters) {
    console.log(`📄 Rendering Chapter ${ch.num}: ${ch.name}...`);
    doc.addPage();
    const chPageNum = doc.bufferedPageRange().count;
    tocEntries.push({ title: `Chapter ${ch.num}: ${ch.name}`, page: chPageNum, isChapter: true });

    drawChapterDivider(doc, ch);

    for (const prob of ch.data) {
      checkPageBudget(doc, 150);
      const probPageNum = doc.bufferedPageRange().count;
      tocEntries.push({ title: `${prob.num}. ${prob.title}`, page: probPageNum, isChapter: false });
      drawProblem(doc, prob, ch.name);
    }
  }

  // ================= 14. THE 40-PROBLEM MASTER REVISION LIST =================
  console.log('📄 Rendering Chapter 10: The 40-Problem Master List...');
  doc.addPage();
  const m40PageNum = doc.bufferedPageRange().count;
  tocEntries.push({ title: 'Chapter 10: The 40-Problem Master Revision List', page: m40PageNum, isChapter: true });

  drawChapterDivider(doc, {
    num: 10,
    name: 'The Final Master List — 40 Core Problems',
    subtitle: 'The Ultimate Placement Preparation Checklist for Freshers',
    role: 'Universal Foundation for All Technical Interviews',
    tips: 'If you have limited preparation time, solve these 40 problems first. They cover 85% of all recurring algorithmic patterns encountered across service and product company campus rounds.',
    data: master40
  });

  for (const prob of master40) {
    checkPageBudget(doc, 150);
    const probPageNum = doc.bufferedPageRange().count;
    tocEntries.push({ title: `M${prob.num}. ${prob.title}`, page: probPageNum, isChapter: false });
    drawProblem(doc, prob, '40-Problem Master List');
  }

  // ================= 15. COMPLEXITY REFERENCE SHEET =================
  console.log('📄 Rendering Chapter 11: Complexity Reference Sheet...');
  doc.addPage();
  const compPageNum = doc.bufferedPageRange().count;
  tocEntries.push({ title: 'Chapter 11: Complexity Reference Sheet (Big-O Cheat Sheet)', page: compPageNum, isChapter: true });
  drawComplexitySheet(doc);

  // ================= 16. FINAL ROADMAP =================
  console.log('📄 Rendering Chapter 12: Placement Preparation Roadmap...');
  doc.addPage();
  const roadPageNum = doc.bufferedPageRange().count;
  tocEntries.push({ title: 'Chapter 12: Final 60-Day Placement Preparation Roadmap', page: roadPageNum, isChapter: true });
  drawRoadmap(doc);

  // ================= 17. WRITE TABLE OF CONTENTS INTO PLACEHOLDERS =================
  console.log('📑 Writing Table of Contents into reserved pages...');
  renderTableOfContents(doc, tocStartPage, TOC_PAGES, tocEntries);

  // ================= 18. RUNNING HEADERS AND FOOTERS =================
  console.log('🏷️ Adding running headers and footers to all content pages...');
  const totalPages = doc.bufferedPageRange().count;
  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);
    // Skip cover (0) and copyright (1)
    if (i >= 2) {
      drawHeaderAndFooter(doc, i + 1, totalPages);
    }
  }

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      const stats = fs.statSync(outputPath);
      console.log(`✅ SUCCESS! Placement PDF generated successfully!`);
      console.log(`📍 Path: ${outputPath}`);
      console.log(`📊 Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`📄 Total Pages: ${totalPages}`);

      // Also copy to fallback durable locations
      const backupPath1 = path.resolve(__dirname, '../../uploads/conceptifyyy_company_wise_dsa_placement_prep_2026.pdf');
      fs.copyFileSync(outputPath, backupPath1);
      const backupPath2 = path.resolve(__dirname, '../../data/conceptifyyy_company_wise_dsa_placement_prep_2026.pdf');
      fs.copyFileSync(outputPath, backupPath2);

      resolve({
        path: outputPath,
        totalPages,
        sizeBytes: stats.size
      });
    });
    writeStream.on('error', reject);
  });
}

// ---------------- Helper Functions ----------------

function checkPageBudget(doc, neededHeight) {
  if (doc.y + neededHeight > PAGE_HEIGHT - 60) {
    doc.addPage();
  }
}

function drawCoverPage(doc) {
  // Top brand bar accent
  doc.rect(0, 0, PAGE_WIDTH, 12).fill(COLORS.primary);

  // Background subtle decorative accent
  doc.rect(MARGIN, 60, CONTENT_WIDTH, 700).lineWidth(1).strokeColor(COLORS.borderSubtle).stroke();
  doc.rect(MARGIN + 6, 66, CONTENT_WIDTH - 12, 688).lineWidth(0.5).strokeColor(COLORS.borderSubtle).stroke();

  // Logo / Brand treatment
  doc.fontSize(28).font('Helvetica-Bold').fillColor(COLORS.primary).text('CONCEPTIFYYY', MARGIN + 30, 110, { align: 'center', width: CONTENT_WIDTH - 60 });
  doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.accentCyan).text('OFFICIAL PLACEMENT CODING COMPENDIUM • 2026 EDITION', MARGIN + 30, 145, { align: 'center', width: CONTENT_WIDTH - 60, characterSpacing: 1.5 });

  // Divider
  doc.moveTo(MARGIN + 120, 168).lineTo(PAGE_WIDTH - MARGIN - 120, 168).lineWidth(1.5).strokeColor(COLORS.primary).stroke();

  // Book Title
  doc.fontSize(24).font('Helvetica-Bold').fillColor(COLORS.textPrimary).text('Company-Wise DSA Placement Preparation', MARGIN + 25, 205, { align: 'center', width: CONTENT_WIDTH - 50, lineGap: 4 });

  // Subtitle
  doc.fontSize(11).font('Helvetica').fillColor(COLORS.textSecondary).text('Most Important Coding Questions and Complete Java Solutions for Freshers', MARGIN + 35, 270, { align: 'center', width: CONTENT_WIDTH - 70, lineGap: 3 });

  // Target Companies Badge Pill Grid
  const compGridY = 325;
  doc.rect(MARGIN + 30, compGridY, CONTENT_WIDTH - 60, 180).fillAndStroke('#F8FAFC', COLORS.borderSubtle);

  doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORS.primary).text('TARGET COMPANY EXAM PATTERNS INCLUDED', MARGIN + 40, compGridY + 16, { align: 'center', width: CONTENT_WIDTH - 80, characterSpacing: 1 });

  const companyPills = [
    'TCS NQT (Ninja / Digital / Prime)',
    'Cognizant GenC & Next',
    'Infosys (SE & Specialist Programmer)',
    'Wipro Turbo & Elite NTH',
    'Accenture ASE (Advanced Entry)',
    'Capgemini Exceller & Analyst',
    'Deloitte Analyst & Tech Roles',
    'HCLTech Graduate Engineer',
    'Tech Mahindra Entry-Level',
    '+ The 40-Problem Master Revision List'
  ];

  let pillY = compGridY + 45;
  for (let i = 0; i < companyPills.length; i += 2) {
    const col1 = companyPills[i];
    const col2 = companyPills[i + 1] || '';
    doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.textPrimary).text('•  ' + col1, MARGIN + 50, pillY, { width: (CONTENT_WIDTH - 120) / 2 });
    if (col2) {
      doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.accentCyan).text('•  ' + col2, MARGIN + 50 + (CONTENT_WIDTH - 120) / 2, pillY, { width: (CONTENT_WIDTH - 120) / 2 });
    }
    pillY += 24;
  }

  // Key Features Strip
  const featY = 530;
  doc.rect(MARGIN + 30, featY, CONTENT_WIDTH - 60, 95).fillAndStroke('#F0FDF4', '#86EFAC');
  doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORS.accentEmerald).text('KEY FEATURES & CODING STANDARDS', MARGIN + 40, featY + 14, { align: 'center', width: CONTENT_WIDTH - 80 });
  doc.fontSize(8.5).font('Helvetica').fillColor(COLORS.textPrimary).text(
    '✓ 216 Verified Coding Problems with Compilable Java 21 Syntax\n' +
    '✓ Complete Console I/O Programs (Scanner) & Method-Level Solutions\n' +
    '✓ Step-by-Step Dry Runs, Big-O Time & Space Complexity Analyses\n' +
    '✓ Boundary Edge Case Coverage & 60-Day Placement Roadmap',
    MARGIN + 50, featY + 35, { lineGap: 4, width: CONTENT_WIDTH - 100 }
  );

  // Author and Footer
  doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.textSecondary).text('Published by Conceptifyyy Placement Engineering Team', MARGIN + 30, 665, { align: 'center', width: CONTENT_WIDTH - 60 });
  doc.fontSize(8).font('Helvetica').fillColor(COLORS.textMuted).text('Verified for 2026 Campus Recruitment Drives • All Rights Reserved', MARGIN + 30, 680, { align: 'center', width: CONTENT_WIDTH - 60 });

  // Bottom color bar accent
  doc.rect(0, PAGE_HEIGHT - 12, PAGE_WIDTH, 12).fill(COLORS.primary);
}

function drawCopyrightPage(doc) {
  doc.y = 80;
  doc.fontSize(16).font('Helvetica-Bold').fillColor(COLORS.primary).text('Conceptifyyy — Company-Wise DSA Placement Preparation 2026', MARGIN, doc.y);
  doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORS.textSecondary).text(extras.bookMeta.edition, MARGIN, doc.y + 6);
  doc.moveDown(1.5);

  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 1).fill(COLORS.borderSubtle);
  doc.moveDown(1.5);

  doc.fontSize(9).font('Helvetica').fillColor(COLORS.textSecondary).text(extras.copyrightText, MARGIN, doc.y, {
    width: CONTENT_WIDTH,
    lineGap: 4
  });

  doc.moveDown(2);

  // Notice Box
  const noticeY = doc.y;
  doc.rect(MARGIN, noticeY, CONTENT_WIDTH, 120).fillAndStroke('#FEF3C7', '#FDE68A');
  doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORS.accentAmber).text('IMPORTANT NOTICE FOR STUDENTS & ASPIRANTS', MARGIN + 15, noticeY + 12);
  doc.fontSize(8.5).font('Helvetica').fillColor(COLORS.textPrimary).text(
    'This handbook is engineered to deliver concise, pattern-oriented preparation. In actual technical interviews, interviewers prioritize clean code, descriptive variable names, and your ability to articulate trade-offs over memorized syntax.\n\nAlways explain your brute-force thought process first before offering an optimal solution. Walk through the dry-run steps provided for each question to demonstrate clear algorithmic reasoning.',
    MARGIN + 15, noticeY + 30, { width: CONTENT_WIDTH - 30, lineGap: 3 }
  );
}

function drawIntroduction(doc) {
  doc.y = 70;
  doc.fontSize(18).font('Helvetica-Bold').fillColor(COLORS.primary).text(extras.introduction.heading, MARGIN, doc.y);
  doc.moveDown(0.5);
  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 2).fill(COLORS.primary);
  doc.moveDown(1);

  for (const p of extras.introduction.paragraphs) {
    checkPageBudget(doc, 80);
    doc.fontSize(9.5).font('Helvetica').fillColor(COLORS.textPrimary).text(p, MARGIN, doc.y, {
      width: CONTENT_WIDTH,
      lineGap: 4
    });
    doc.moveDown(1);
  }
}

function drawChapterDivider(doc, ch) {
  doc.y = 80;
  // Chapter badge
  doc.rect(MARGIN, doc.y, 110, 22).fill(COLORS.primaryLight);
  doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORS.primary).text(`CHAPTER ${ch.num}`, MARGIN + 12, doc.y + 6);

  doc.y += 32;
  doc.fontSize(20).font('Helvetica-Bold').fillColor(COLORS.textPrimary).text(ch.name, MARGIN, doc.y, { width: CONTENT_WIDTH });
  doc.moveDown(0.3);
  doc.fontSize(11).font('Helvetica').fillColor(COLORS.textSecondary).text(ch.subtitle, MARGIN, doc.y, { width: CONTENT_WIDTH });

  doc.moveDown(1);
  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 2).fill(COLORS.primary);
  doc.moveDown(1);

  // Strategy & Insights Card
  const cardY = doc.y;
  doc.rect(MARGIN, cardY, CONTENT_WIDTH, 85).fillAndStroke(COLORS.bgCard, COLORS.borderSubtle);
  doc.fontSize(9.5).font('Helvetica-Bold').fillColor(COLORS.primary).text(`Target Focus: ${ch.role}`, MARGIN + 14, cardY + 12);
  doc.fontSize(8.5).font('Helvetica').fillColor(COLORS.textSecondary).text(ch.tips, MARGIN + 14, cardY + 30, {
    width: CONTENT_WIDTH - 28,
    lineGap: 3
  });

  doc.y = cardY + 98;
  doc.fontSize(11).font('Helvetica-Bold').fillColor(COLORS.textPrimary).text(`Questions in this Section (${ch.data.length} Problems):`, MARGIN, doc.y);
  doc.moveDown(0.5);
}

function drawProblem(doc, prob, companyContext) {
  checkPageBudget(doc, 180);

  const startY = doc.y + 10;
  doc.y = startY;

  // Header Bar with Problem Number, Title and Topic
  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 24).fill(COLORS.primary);
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#FFFFFF').text(
    `#${prob.num}: ${prob.title}`,
    MARGIN + 10,
    doc.y + 6,
    { width: CONTENT_WIDTH - 120 }
  );
  doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#A5B4FC').text(
    prob.topic || 'Data Structures',
    PAGE_WIDTH - MARGIN - 130,
    doc.y - 12,
    { width: 120, align: 'right' }
  );

  doc.y += 18;

  // Problem Statement Box
  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 1).fill(COLORS.borderSubtle);
  doc.y += 6;
  doc.fontSize(8.5).font('Helvetica-Bold').fillColor(COLORS.primaryDark).text('PROBLEM STATEMENT:', MARGIN + 5, doc.y);
  doc.y += 12;
  doc.fontSize(9).font('Helvetica').fillColor(COLORS.textPrimary).text(prob.statement, MARGIN + 5, doc.y, {
    width: CONTENT_WIDTH - 10,
    lineGap: 2.5
  });

  // Example Box
  doc.moveDown(0.6);
  checkPageBudget(doc, 60);
  const exY = doc.y;
  const exHeight = Math.max(36, doc.heightOfString(prob.example, { width: CONTENT_WIDTH - 24, fontSize: 8.5 }) + 20);
  doc.rect(MARGIN, exY, CONTENT_WIDTH, exHeight).fillAndStroke('#F1F5F9', COLORS.borderSubtle);
  doc.fontSize(8).font('Helvetica-Bold').fillColor(COLORS.accentCyan).text('SAMPLE INPUT & OUTPUT:', MARGIN + 10, exY + 6);
  doc.fontSize(8).font('Courier').fillColor(COLORS.textPrimary).text(prob.example, MARGIN + 10, exY + 18, {
    width: CONTENT_WIDTH - 20,
    lineGap: 2
  });
  doc.y = exY + exHeight + 6;

  // Approach
  checkPageBudget(doc, 70);
  doc.fontSize(8.5).font('Helvetica-Bold').fillColor(COLORS.primaryDark).text('ALGORITHM & INTUITION:', MARGIN + 5, doc.y);
  doc.y += 12;
  doc.fontSize(8.5).font('Helvetica').fillColor(COLORS.textSecondary).text(prob.approach, MARGIN + 5, doc.y, {
    width: CONTENT_WIDTH - 10,
    lineGap: 2.5
  });

  // Java Solution Code Box
  doc.moveDown(0.8);
  checkPageBudget(doc, 140);
  doc.fontSize(8.5).font('Helvetica-Bold').fillColor(COLORS.primaryDark).text('COMPLETE JAVA 21 SOLUTION:', MARGIN + 5, doc.y);
  doc.y += 12;

  // Measure code height
  const codeLines = prob.code.split('\n');
  const codeTextHeight = codeLines.length * 9.5 + 16;

  // Check if we need to split or start fresh page
  if (doc.y + Math.min(codeTextHeight, 180) > PAGE_HEIGHT - 60) {
    doc.addPage();
  }

  const codeBoxY = doc.y;
  // If code is very long, PDFKit will paginate text naturally
  doc.fontSize(7.5).font('Courier').fillColor(COLORS.codeText);
  const calculatedHeight = doc.heightOfString(prob.code, { width: CONTENT_WIDTH - 20, lineGap: 1.5 }) + 16;

  doc.rect(MARGIN, codeBoxY, CONTENT_WIDTH, calculatedHeight).fill(COLORS.codeBg);
  // Left Indigo accent bar
  doc.rect(MARGIN, codeBoxY, 4, calculatedHeight).fill(COLORS.primary);

  doc.text(prob.code, MARGIN + 12, codeBoxY + 8, {
    width: CONTENT_WIDTH - 24,
    lineGap: 1.5
  });

  doc.y = codeBoxY + calculatedHeight + 8;

  // Dry Run
  checkPageBudget(doc, 60);
  doc.fontSize(8.5).font('Helvetica-Bold').fillColor(COLORS.primaryDark).text('DRY RUN WALKTHROUGH:', MARGIN + 5, doc.y);
  doc.y += 12;
  doc.fontSize(8.5).font('Helvetica').fillColor(COLORS.textSecondary).text(prob.dryRun, MARGIN + 5, doc.y, {
    width: CONTENT_WIDTH - 10,
    lineGap: 2
  });

  // Complexity & Edge Cases Row
  doc.moveDown(0.6);
  checkPageBudget(doc, 55);
  const infoY = doc.y;
  doc.rect(MARGIN, infoY, CONTENT_WIDTH, 48).fillAndStroke('#F8FAFC', COLORS.borderSubtle);

  doc.fontSize(8).font('Helvetica-Bold').fillColor(COLORS.accentEmerald).text('TIME COMPLEXITY:', MARGIN + 10, infoY + 6);
  doc.fontSize(8).font('Helvetica').fillColor(COLORS.textPrimary).text(prob.timeComplexity, MARGIN + 10, infoY + 16, { width: (CONTENT_WIDTH - 30) / 2 });

  doc.fontSize(8).font('Helvetica-Bold').fillColor(COLORS.accentCyan).text('SPACE COMPLEXITY:', MARGIN + 15 + (CONTENT_WIDTH - 30) / 2, infoY + 6);
  doc.fontSize(8).font('Helvetica').fillColor(COLORS.textPrimary).text(prob.spaceComplexity, MARGIN + 15 + (CONTENT_WIDTH - 30) / 2, infoY + 16, { width: (CONTENT_WIDTH - 30) / 2 });

  doc.fontSize(7.5).font('Helvetica-Bold').fillColor(COLORS.textMuted).text('EDGE CASES: ' + prob.edgeCases, MARGIN + 10, infoY + 34, { width: CONTENT_WIDTH - 20 });

  doc.y = infoY + 56;
}

function drawComplexitySheet(doc) {
  doc.y = 70;
  doc.fontSize(18).font('Helvetica-Bold').fillColor(COLORS.primary).text('Complexity Reference Sheet (Big-O Cheat Sheet)', MARGIN, doc.y);
  doc.moveDown(0.4);
  doc.fontSize(10).font('Helvetica').fillColor(COLORS.textSecondary).text('Quick revision table for Data Structure and Algorithm time & space complexities.', MARGIN, doc.y);
  doc.moveDown(0.8);
  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 2).fill(COLORS.primary);
  doc.moveDown(1);

  // Table 1: Data Structures
  doc.fontSize(11).font('Helvetica-Bold').fillColor(COLORS.primaryDark).text('1. Data Structure Complexities', MARGIN, doc.y);
  doc.moveDown(0.5);

  const colWidths = [125, 75, 75, 115, 65, 50]; // Total: 505
  const headers1 = ['Data Structure', 'Access', 'Search', 'Insertion', 'Deletion', 'Space'];

  drawTableRow(doc, headers1, colWidths, true, COLORS.primary, '#FFFFFF');

  for (let i = 0; i < extras.complexitySheet.length; i++) {
    const row = extras.complexitySheet[i];
    const vals = [row.structure, row.access, row.search, row.insert, row.delete, row.space];
    const isAlt = i % 2 === 1;
    drawTableRow(doc, vals, colWidths, false, isAlt ? '#F8FAFC' : '#FFFFFF', COLORS.textPrimary);
  }

  doc.moveDown(1.5);
  checkPageBudget(doc, 220);

  // Table 2: Common Algorithms
  doc.fontSize(11).font('Helvetica-Bold').fillColor(COLORS.primaryDark).text('2. Algorithmic Patterns & Sorting/Searching Complexities', MARGIN, doc.y);
  doc.moveDown(0.5);

  const colWidths2 = [145, 90, 90, 90, 90];
  const headers2 = ['Algorithm', 'Best Time', 'Average Time', 'Worst Time', 'Space'];

  drawTableRow(doc, headers2, colWidths2, true, COLORS.primary, '#FFFFFF');

  for (let i = 0; i < extras.algorithmComplexities.length; i++) {
    const row = extras.algorithmComplexities[i];
    const vals = [row.algorithm, row.best, row.avg, row.worst, row.space];
    const isAlt = i % 2 === 1;
    drawTableRow(doc, vals, colWidths2, false, isAlt ? '#F8FAFC' : '#FFFFFF', COLORS.textPrimary);
  }
}

function drawTableRow(doc, values, widths, isHeader, bgColor, textColor) {
  const rowHeight = isHeader ? 22 : 18;
  const startY = doc.y;

  doc.rect(MARGIN, startY, CONTENT_WIDTH, rowHeight).fillAndStroke(bgColor, COLORS.borderSubtle);

  let currentX = MARGIN;
  for (let i = 0; i < values.length; i++) {
    doc.fontSize(isHeader ? 8 : 7.5)
       .font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
       .fillColor(textColor)
       .text(values[i], currentX + 5, startY + (isHeader ? 6 : 5), { width: widths[i] - 10, ellipsis: true });
    currentX += widths[i];
  }

  doc.y = startY + rowHeight;
}

function drawRoadmap(doc) {
  doc.y = 70;
  doc.fontSize(18).font('Helvetica-Bold').fillColor(COLORS.primary).text(extras.roadmap.heading, MARGIN, doc.y);
  doc.moveDown(0.4);
  doc.fontSize(10).font('Helvetica').fillColor(COLORS.textSecondary).text('Structured 4-phase preparation guide for technical placement exams & interviews.', MARGIN, doc.y);
  doc.moveDown(0.8);
  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 2).fill(COLORS.primary);
  doc.moveDown(1);

  for (const w of extras.roadmap.weeks) {
    checkPageBudget(doc, 100);
    const boxY = doc.y;
    doc.rect(MARGIN, boxY, CONTENT_WIDTH, 75).fillAndStroke(COLORS.bgCard, COLORS.borderSubtle);
    doc.rect(MARGIN, boxY, 4, 75).fill(COLORS.primary);

    doc.fontSize(9.5).font('Helvetica-Bold').fillColor(COLORS.primary).text(w.phase, MARGIN + 14, boxY + 8);
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor(COLORS.accentCyan).text(`Focus Area: ${w.focus}`, MARGIN + 14, boxY + 22);

    let taskY = boxY + 36;
    for (const t of w.tasks.slice(0, 2)) {
      doc.fontSize(8).font('Helvetica').fillColor(COLORS.textPrimary).text('• ' + t, MARGIN + 16, taskY, { width: CONTENT_WIDTH - 30 });
      taskY += 16;
    }
    doc.y = boxY + 82;
  }

  doc.moveDown(1);
  checkPageBudget(doc, 150);

  // Tips Box
  const tipsY = doc.y;
  doc.rect(MARGIN, tipsY, CONTENT_WIDTH, 140).fillAndStroke('#F0FDF4', '#86EFAC');
  doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORS.accentEmerald).text('5 LIVE TECHNICAL INTERVIEW GOLDEN RULES', MARGIN + 14, tipsY + 10);

  let curTipY = tipsY + 28;
  for (const tip of extras.roadmap.interviewTips) {
    doc.fontSize(7.5).font('Helvetica').fillColor(COLORS.textPrimary).text(tip, MARGIN + 14, curTipY, { width: CONTENT_WIDTH - 28, lineGap: 1.5 });
    curTipY += 21;
  }
}

function renderTableOfContents(doc, startPageIdx, numPages, tocEntries) {
  let entryIndex = 0;
  const entriesPerPage = Math.ceil(tocEntries.length / numPages);

  for (let pageOffset = 0; pageOffset < numPages; pageOffset++) {
    doc.switchToPage(startPageIdx + pageOffset);
    doc.y = 60;

    if (pageOffset === 0) {
      doc.fontSize(20).font('Helvetica-Bold').fillColor(COLORS.primary).text('Table of Contents', MARGIN, doc.y);
      doc.moveDown(0.3);
      doc.fontSize(9.5).font('Helvetica').fillColor(COLORS.textSecondary).text('Complete index of all chapters, company questions, and reference sections.', MARGIN, doc.y);
      doc.moveDown(0.6);
      doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 2).fill(COLORS.primary);
      doc.moveDown(0.8);
    } else {
      doc.fontSize(12).font('Helvetica-Bold').fillColor(COLORS.primary).text('Table of Contents (Continued)', MARGIN, doc.y);
      doc.moveDown(0.5);
      doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 1).fill(COLORS.borderSubtle);
      doc.moveDown(0.8);
    }

    const pageEndIdx = Math.min(tocEntries.length, (pageOffset + 1) * entriesPerPage);

    while (entryIndex < pageEndIdx && doc.y < PAGE_HEIGHT - 70) {
      const entry = tocEntries[entryIndex];
      const lineY = doc.y;

      if (entry.isChapter) {
        doc.y += 4;
        doc.fontSize(8.5).font('Helvetica-Bold').fillColor(COLORS.primary).text(entry.title, MARGIN, doc.y, { width: CONTENT_WIDTH - 45 });
        doc.fontSize(8.5).font('Helvetica-Bold').fillColor(COLORS.primary).text(String(entry.page), PAGE_WIDTH - MARGIN - 35, doc.y, { width: 35, align: 'right' });
        doc.y += 14;
      } else {
        doc.fontSize(7.5).font('Helvetica').fillColor(COLORS.textPrimary).text(entry.title, MARGIN + 12, doc.y, { width: CONTENT_WIDTH - 65 });
        doc.fontSize(7.5).font('Helvetica').fillColor(COLORS.textMuted).text(String(entry.page), PAGE_WIDTH - MARGIN - 35, doc.y, { width: 35, align: 'right' });
        doc.y += 11;
      }
      entryIndex++;
    }
  }
}

function drawHeaderAndFooter(doc, currentPage, totalPages) {
  // Running Header
  doc.fontSize(7.5).font('Helvetica-Bold').fillColor(COLORS.textMuted).text('CONCEPTIFYYY • Company-Wise DSA Placement Preparation 2026', MARGIN, 26);
  doc.fontSize(7.5).font('Helvetica').fillColor(COLORS.textMuted).text('Official Candidate Edition', PAGE_WIDTH - MARGIN - 140, 26, { width: 140, align: 'right' });
  doc.moveTo(MARGIN, 38).lineTo(PAGE_WIDTH - MARGIN, 38).lineWidth(0.5).strokeColor(COLORS.borderSubtle).stroke();

  // Running Footer
  doc.moveTo(MARGIN, PAGE_HEIGHT - 38).lineTo(PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 38).lineWidth(0.5).strokeColor(COLORS.borderSubtle).stroke();
  doc.fontSize(7.5).font('Helvetica').fillColor(COLORS.textMuted).text('© 2026 CONCEPTIFYYY • All Solutions Java 21 Verified', MARGIN, PAGE_HEIGHT - 28);
  doc.fontSize(7.5).font('Helvetica-Bold').fillColor(COLORS.primary).text(`Page ${currentPage} of ${totalPages}`, PAGE_WIDTH - MARGIN - 100, PAGE_HEIGHT - 28, { width: 100, align: 'right' });
}

// Execute directly if run via CLI
if (require.main === module) {
  generatePlacementPdf()
    .then(res => {
      console.log('🎉 Done! Result:', res);
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ PDF generation failed:', err);
      process.exit(1);
    });
}

module.exports = { generatePlacementPdf };
