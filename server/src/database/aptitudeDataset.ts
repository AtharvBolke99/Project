import { AptitudeTopic, AptitudeQuestion } from './db';

export const aptitudeTopicsDataset: AptitudeTopic[] = [
  // Quantitative Aptitude
  {
    id: 'top_time_and_work',
    title: 'Time & Work',
    slug: 'time-and-work',
    category: 'Quantitative',
    description: 'Master combined work, alternate days, wages, and LCM work-unit shortcuts.',
    icon: 'Clock',
    totalQuestions: 50,
    visualizerType: 'work_units'
  },
  {
    id: 'top_percentages',
    title: 'Percentages',
    slug: 'percentages',
    category: 'Quantitative',
    description: 'Percentage change, successive discounts, price-consumption balances, and election math.',
    icon: 'TrendingUp',
    totalQuestions: 50,
    visualizerType: 'percentage_bar'
  },
  {
    id: 'top_ratio_proportion',
    title: 'Ratio & Proportion',
    slug: 'ratio-and-proportion',
    category: 'Quantitative',
    description: 'Dividing quantities, income-expenditure ratios, mixtures, and mean proportions.',
    icon: 'Zap',
    totalQuestions: 50,
    visualizerType: 'ratio_boxes'
  },
  {
    id: 'top_profit_loss',
    title: 'Profit & Loss',
    slug: 'profit-and-loss',
    category: 'Quantitative',
    description: 'Cost Price, Selling Price, Marked Price, False Weights, and Net Margin Calculations.',
    icon: 'TrendingUp',
    totalQuestions: 50,
    visualizerType: 'percentage_bar'
  },
  {
    id: 'top_speed_distance',
    title: 'Time Speed Distance',
    slug: 'time-speed-distance',
    category: 'Quantitative',
    description: 'Relative speed, trains crossing platforms/poles, and average speed shortcuts.',
    icon: 'Clock',
    totalQuestions: 50,
    visualizerType: 'series_flow'
  },
  {
    id: 'top_probability',
    title: 'Probability',
    slug: 'probability',
    category: 'Quantitative',
    description: 'Dice, cards, coins, conditional probability, and independent events.',
    icon: 'Zap',
    totalQuestions: 50,
    visualizerType: 'probability_tree'
  },

  // Logical Reasoning
  {
    id: 'top_coding_decoding',
    title: 'Coding-Decoding',
    slug: 'coding-decoding',
    category: 'Logical Reasoning',
    description: 'Letter shifting, substitution codes, matrix grids, and pattern deciphers.',
    icon: 'BrainCircuit',
    totalQuestions: 50,
    visualizerType: 'series_flow'
  },
  {
    id: 'top_blood_relations',
    title: 'Blood Relations',
    slug: 'blood-relations',
    category: 'Logical Reasoning',
    description: 'Family trees, coded relations, generational hierarchies, and pointing statements.',
    icon: 'BrainCircuit',
    totalQuestions: 50,
    visualizerType: 'series_flow'
  },
  {
    id: 'top_direction_sense',
    title: 'Direction Sense',
    slug: 'direction-sense',
    category: 'Logical Reasoning',
    description: 'Cardinal coordinates, Pythagoras displacements, shadow directions, and turns.',
    icon: 'BrainCircuit',
    totalQuestions: 50,
    visualizerType: 'series_flow'
  },
  {
    id: 'top_number_series',
    title: 'Number Series',
    slug: 'number-series',
    category: 'Logical Reasoning',
    description: 'Arithmetic, geometric, Fibonacci, and alternating numerical patterns.',
    icon: 'Binary',
    totalQuestions: 50,
    visualizerType: 'series_flow'
  },
  {
    id: 'top_syllogisms',
    title: 'Syllogisms',
    slug: 'syllogisms',
    category: 'Logical Reasoning',
    description: 'Venn diagrams, statement & conclusions, and possibility deduction.',
    icon: 'BrainCircuit',
    totalQuestions: 50,
    visualizerType: 'venn_diagram'
  },

  // Verbal Ability
  {
    id: 'top_synonyms_antonyms',
    title: 'Synonyms & Antonyms',
    slug: 'synonyms-and-antonyms',
    category: 'Verbal Ability',
    description: 'High-frequency GRE/Placement vocabulary words with root word associations.',
    icon: 'BookOpen',
    totalQuestions: 50,
    visualizerType: 'series_flow'
  },
  {
    id: 'top_sentence_correction',
    title: 'Sentence Correction & Grammar',
    slug: 'sentence-correction',
    category: 'Verbal Ability',
    description: 'Subject-verb agreement, modifier errors, tenses, parallelism, and prepositions.',
    icon: 'BookOpen',
    totalQuestions: 50,
    visualizerType: 'series_flow'
  }
];

const baseAptitudeQuestionsDataset: AptitudeQuestion[] = [
  // ─── QUANTITATIVE: TIME & WORK ─────────────────────────────────────
  {
    id: 'apt_tw_1',
    topicId: 'top_time_and_work',
    topicTitle: 'Time & Work',
    category: 'Quantitative',
    slug: 'person-a-and-b-together-work',
    question: 'A can complete a piece of work in 12 days and B can complete the same work in 18 days. If they work together, in how many days will the entire work be completed?',
    options: ['7.2 days', '6.5 days', '8.0 days', '7.5 days'],
    correctAnswer: 0,
    explanation: 'Total Work = LCM(12, 18) = 36 units.\nA’s 1-day work = 36 / 12 = 3 units/day.\nB’s 1-day work = 36 / 18 = 2 units/day.\nTogether (A + B) in 1 day = 3 + 2 = 5 units/day.\nTotal time = 36 / 5 = 7.2 days.',
    shortcut: 'Formula: (A * B) / (A + B) = (12 * 18) / (12 + 18) = 216 / 30 = 7.2 days.',
    formula: 'Time = (A * B) / (A + B)',
    difficulty: 'Easy',
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Determine Total Work Capacity via LCM',
        description: 'Take LCM of 12 and 18 to establish total work = 36 standard work units.',
        visualType: 'work_units',
        data: { totalUnits: 36, rateA: 3, rateB: 2, combinedRate: 5 }
      },
      {
        stepNumber: 2,
        title: 'Calculate Combined Daily Output',
        description: 'A produces 3 units/day + B produces 2 units/day = 5 units/day combined.',
        visualType: 'work_units',
        data: { completedUnits: 36, daysRequired: 7.2 }
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt_tw_2',
    topicId: 'top_time_and_work',
    topicTitle: 'Time & Work',
    category: 'Quantitative',
    slug: 'pipe-a-fills-pipe-b-empties',
    question: 'Pipe A can fill a tank in 20 hours while Pipe B can empty the full tank in 30 hours. If both pipes are opened simultaneously in an empty tank, how long will it take to fill the tank completely?',
    options: ['45 hours', '50 hours', '60 hours', '40 hours'],
    correctAnswer: 2,
    explanation: 'Total Tank Capacity = LCM(20, 30) = 60 liters.\nPipe A filling rate = +60 / 20 = +3 L/hr.\nPipe B emptying rate = -60 / 30 = -2 L/hr.\nNet filling rate = +3 - 2 = +1 L/hr.\nTotal Time = 60 / 1 = 60 hours.',
    shortcut: 'Formula: (A * B) / (B - A) = (20 * 30) / (30 - 20) = 600 / 10 = 60 hours.',
    formula: 'Time = (A * B) / (B - A)',
    difficulty: 'Easy',
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Establish Tank Volume',
        description: 'LCM(20, 30) = 60 units.',
        visualType: 'work_units',
        data: { capacity: 60, rateA: 3, rateB: -2, netRate: 1 }
      }
    ],
    createdAt: new Date().toISOString()
  },

  // ─── QUANTITATIVE: PERCENTAGES ─────────────────────────────────────
  {
    id: 'apt_pct_1',
    topicId: 'top_percentages',
    topicTitle: 'Percentages',
    category: 'Quantitative',
    slug: 'price-increase-consumption-reduction',
    question: 'If the price of sugar increases by 25%, by what percentage must a household reduce its sugar consumption so that the total expenditure remains unchanged?',
    options: ['20%', '25%', '16.66%', '30%'],
    correctAnswer: 0,
    explanation: 'Let original price = ₹100 and consumption = 100 kg. Total expenditure = ₹10,000.\nNew price = ₹125.\nNew consumption needed = 10,000 / 125 = 80 kg.\nReduction = 100 - 80 = 20 kg (which is 20%).',
    shortcut: 'Formula: [R / (100 + R)] * 100% = [25 / 125] * 100% = (1/5) * 100% = 20%.',
    formula: 'Reduction % = [R / (100 + R)] * 100%',
    difficulty: 'Easy',
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Price vs Consumption Inverse Balance',
        description: 'When Price goes up by 1/4 (+25%), Consumption must drop by 1/(4+1) = 1/5 (-20%).',
        visualType: 'percentage_bar',
        data: { priceIncreaseFraction: '1/4', consumptionReductionFraction: '1/5', percentage: 20 }
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt_pct_2',
    topicId: 'top_percentages',
    topicTitle: 'Percentages',
    category: 'Quantitative',
    slug: 'successive-discounts-calculation',
    question: 'An electronics item is marked with two successive discounts of 20% and 10%. What is the single equivalent overall discount percentage?',
    options: ['30%', '28%', '25%', '32%'],
    correctAnswer: 1,
    explanation: 'Let Marked Price = ₹100.\nAfter 1st discount (20%): Price = ₹80.\nAfter 2nd discount (10% of ₹80 = ₹8): Price = ₹72.\nTotal Discount = ₹100 - ₹72 = ₹28 (which is 28%).',
    shortcut: 'Formula: (a + b - (a * b) / 100) = (20 + 10 - 200/100) = 30 - 2 = 28%.',
    formula: 'Equivalent Discount = a + b - (ab / 100)',
    difficulty: 'Easy',
    visualSteps: [],
    createdAt: new Date().toISOString()
  },

  // ─── QUANTITATIVE: PROFIT & LOSS ───────────────────────────────────
  {
    id: 'apt_pl_1',
    topicId: 'top_profit_loss',
    topicTitle: 'Profit & Loss',
    category: 'Quantitative',
    slug: 'selling-price-profit-margin',
    question: 'A shopkeeper sells a book for ₹440 and incurs a 12% loss. At what price must he sell the book to gain a 10% profit?',
    options: ['₹550', '₹500', '₹520', '₹560'],
    correctAnswer: 0,
    explanation: 'Selling at 12% loss means ₹440 represents 88% of Cost Price (CP).\nCP = 440 / 0.88 = ₹500.\nTo gain 10% profit, Selling Price = 500 * 1.10 = ₹550.',
    shortcut: 'SP2 = SP1 * (100 + P%) / (100 - L%) = 440 * (110 / 88) = 5 * 110 = ₹550.',
    formula: 'SP2 = SP1 * (100 + Profit%) / (100 - Loss%)',
    difficulty: 'Medium',
    visualSteps: [],
    createdAt: new Date().toISOString()
  },

  // ─── QUANTITATIVE: TIME SPEED DISTANCE ─────────────────────────────
  {
    id: 'apt_tsd_1',
    topicId: 'top_speed_distance',
    topicTitle: 'Time Speed Distance',
    category: 'Quantitative',
    slug: 'train-crossing-platform',
    question: 'A train 150 meters long is traveling at a speed of 54 km/h. How many seconds will it take to cross a platform 200 meters long?',
    options: ['23.33 seconds', '20.00 seconds', '25.00 seconds', '18.50 seconds'],
    correctAnswer: 0,
    explanation: 'Speed in m/s = 54 * (5 / 18) = 15 m/s.\nTotal Distance to cross = Length of Train + Length of Platform = 150 + 200 = 350 meters.\nTime = Distance / Speed = 350 / 15 = 23.33 seconds (or 23 1/3 sec).',
    shortcut: 'Convert speed: km/h * 5/18 = m/s. Time = (150 + 200) / 15 = 350 / 15 = 23.33 s.',
    formula: 'Time = (Length_train + Length_platform) / Speed_m_s',
    difficulty: 'Medium',
    visualSteps: [],
    createdAt: new Date().toISOString()
  },

  // ─── LOGICAL REASONING: CODING DECODING ────────────────────────────
  {
    id: 'apt_cd_1',
    topicId: 'top_coding_decoding',
    topicTitle: 'Coding-Decoding',
    category: 'Logical Reasoning',
    slug: 'letter-shift-cipher',
    question: 'In a certain code language, if "MONKEY" is written as "XDJMNL", how will "TIGER" be written in that same code?',
    options: ['QDFHS', 'SDFHS', 'SHFDQ', 'UJHFS'],
    correctAnswer: 0,
    explanation: 'Pattern: Each letter is shifted by -1 and the sequence of letters is reversed from right to left.\nY - 1 = X\nE - 1 = D\nK - 1 = J\nN - 1 = M\nO - 1 = N\nM - 1 = L\nApplying to TIGER:\nR - 1 = Q\nE - 1 = D\nG - 1 = F\nI - 1 = H\nT - 1 = S\nResult: "QDFHS".',
    shortcut: 'Reverse string and subtract 1 from alphabetical position of each character.',
    formula: 'Cipher: charAt(n - 1 - i) - 1',
    difficulty: 'Medium',
    visualSteps: [],
    createdAt: new Date().toISOString()
  },

  // ─── LOGICAL REASONING: BLOOD RELATIONS ────────────────────────────
  {
    id: 'apt_br_1',
    topicId: 'top_blood_relations',
    topicTitle: 'Blood Relations',
    category: 'Logical Reasoning',
    slug: 'pointing-to-photograph-man',
    question: 'Pointing to a photograph of a man, Rahul said, "He is the only son of my mother’s father-in-law." How is the man in the photograph related to Rahul?',
    options: ['Father', 'Uncle', 'Brother', 'Grandfather'],
    correctAnswer: 0,
    explanation: 'Break down step-by-step:\n1. Rahul\'s mother\'s father-in-law = Rahul\'s paternal grandfather.\n2. The only son of Rahul\'s paternal grandfather = Rahul\'s father.\nTherefore, the man in the photograph is Rahul’s Father.',
    shortcut: 'Mother\'s father-in-law = Grandfather -> Only son of grandfather = Father.',
    formula: 'Hierarchical family tree decomposition',
    difficulty: 'Easy',
    visualSteps: [],
    createdAt: new Date().toISOString()
  },

  // ─── LOGICAL REASONING: SYLLOGISMS ────────────────────────────────
  {
    id: 'apt_syl_1',
    topicId: 'top_syllogisms',
    topicTitle: 'Syllogisms',
    category: 'Logical Reasoning',
    slug: 'standard-syllogism-deduction',
    question: 'Statements:\n1. All cats are dogs.\n2. All dogs are birds.\nConclusions:\nI. All cats are birds.\nII. Some birds are cats.',
    options: ['Only conclusion I follows', 'Only conclusion II follows', 'Both conclusions I and II follow', 'Neither follows'],
    correctAnswer: 2,
    explanation: 'Cats ⊆ Dogs ⊆ Birds.\nSince the entire set of Cats is inside Dogs, and all Dogs are inside Birds, all Cats are Birds (Conclusion I is valid).\nSince Cats is a non-empty subset of Birds, Some Birds are Cats (Conclusion II is valid).\nBoth conclusions I and II follow.',
    shortcut: 'Universal affirmative (A + A = A): All A are B + All B are C => All A are C, and Some C are A.',
    formula: 'Venn Nested Circles: Cats ⊂ Dogs ⊂ Birds',
    difficulty: 'Easy',
    visualSteps: [],
    createdAt: new Date().toISOString()
  },

  // ─── VERBAL ABILITY: SYNONYMS ─────────────────────────────────────
  {
    id: 'apt_syn_1',
    topicId: 'top_synonyms_antonyms',
    topicTitle: 'Synonyms & Antonyms',
    category: 'Verbal Ability',
    slug: 'synonym-lucid',
    question: 'Choose the word that is most nearly SIMILAR in meaning to the word:\n\n"LUCID"',
    options: ['Clear and easy to understand', 'Murky and vague', 'Extremely bright and glowing', 'Complicated and dense'],
    correctAnswer: 0,
    explanation: '"Lucid" originates from the Latin word "lucidus" (light/clear). In English, it means expressed clearly; easy to understand.\nExample: "The professor gave a lucid explanation of complex quantum mechanics."',
    shortcut: 'Root: Luc / Lum = Light or Clarity (Lucid, Translucent, Illuminate).',
    formula: 'Root word: Luc- = Clear / Transparent',
    difficulty: 'Easy',
    visualSteps: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt_dir_1',
    topicId: 'top_direction_sense',
    topicTitle: 'Direction Sense',
    category: 'Logical Reasoning',
    slug: 'man-walking-north-turns',
    question: 'A person walks 10 km towards North. From there he walks 6 km towards South. Then, he walks 3 km towards East. How far and in which direction is he with reference to his starting point?',
    options: ['5 km North-East', '5 km South-East', '7 km North', '7 km East'],
    correctAnswer: 0,
    explanation: 'Displacement along North-South axis = 10 km (North) - 6 km (South) = 4 km (North).\nDisplacement along East-West axis = 3 km (East).\nUsing Pythagoras theorem: Total Distance = sqrt(4^2 + 3^2) = sqrt(16 + 9) = sqrt(25) = 5 km.\nDirection from starting point is North-East.',
    shortcut: 'Net Coordinates: (East, North) = (3, 4). Distance = sqrt(3^2 + 4^2) = 5 km North-East.',
    formula: 'Distance = sqrt(dx^2 + dy^2)',
    difficulty: 'Easy',
    visualSteps: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt_prob_1',
    topicId: 'top_probability',
    topicTitle: 'Probability',
    category: 'Quantitative',
    slug: 'two-dice-sum-eight',
    question: 'Two unbiased dice are rolled simultaneously. What is the probability of getting a sum equal to 8?',
    options: ['5 / 36', '1 / 6', '7 / 36', '1 / 9'],
    correctAnswer: 0,
    explanation: 'Total possible outcomes when two dice are rolled = 6 * 6 = 36.\nFavorable outcomes where sum = 8 are: (2,6), (3,5), (4,4), (5,3), (6,2) = 5 outcomes.\nProbability = Favorable Outcomes / Total Outcomes = 5 / 36.',
    shortcut: 'Pairs summing to 8 on two dice: 5 pairs. Probability = 5/36.',
    formula: 'P(Event) = Favorable / Sample Space',
    difficulty: 'Easy',
    visualSteps: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt_rp_1',
    topicId: 'top_ratio_proportion',
    topicTitle: 'Ratio & Proportion',
    category: 'Quantitative',
    slug: 'ratio-division-amount',
    question: 'A sum of ₹1,400 is divided between A, B, and C in the ratio 2 : 3 : 5. How much share does B receive?',
    options: ['₹420', '₹280', '₹700', '₹350'],
    correctAnswer: 0,
    explanation: 'Total ratio parts = 2 + 3 + 5 = 10 parts.\nValue of 1 part = ₹1,400 / 10 = ₹140.\nShare of B = 3 parts * ₹140 = ₹420.\n(A receives ₹280, C receives ₹700).',
    shortcut: 'B\'s share = (3 / 10) * 1400 = 3 * 140 = ₹420.',
    formula: 'Share = (Entity Ratio / Total Ratio Sum) * Total Amount',
    difficulty: 'Easy',
    visualSteps: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt_pl_2',
    topicId: 'top_profit_loss',
    topicTitle: 'Profit & Loss',
    category: 'Quantitative',
    slug: 'cost-price-selling-price-gain-2',
    question: 'An article is bought for ₹500 and sold for ₹625. What is the gain percentage?',
    options: ['25%', '20%', '30%', '15%'],
    correctAnswer: 0,
    explanation: 'Profit = Selling Price - Cost Price = ₹625 - ₹500 = ₹125.\nProfit % = (Profit / Cost Price) * 100 = (125 / 500) * 100 = 25%.',
    shortcut: 'Profit % = (125 / 500) * 100 = 1/4 * 100 = 25%.',
    formula: 'Profit % = [(SP - CP) / CP] * 100',
    difficulty: 'Easy',
    visualSteps: [],
    createdAt: new Date().toISOString()
  }
];

const round = (value: number) => Math.round(value * 100) / 100;

const generatedQuestion = (
  topic: AptitudeTopic,
  index: number,
  question: string,
  answer: string,
  distractors: string[],
  explanation: string,
  formula: string,
  difficulty: AptitudeQuestion['difficulty'] = index % 3 === 0 ? 'Medium' : 'Easy'
): AptitudeQuestion => ({
  id: `apt_${topic.id.replace('top_', '')}_practice_${index + 1}`,
  topicId: topic.id,
  topicTitle: topic.title,
  category: topic.category,
  slug: `${topic.slug}-practice-${index + 1}`,
  question,
  options: [answer, ...distractors],
  correctAnswer: 0,
  explanation,
  shortcut: `Practice variant ${index + 1}: identify the governing ${topic.title} rule before calculating.`,
  formula,
  difficulty,
  visualSteps: [],
  createdAt: new Date().toISOString()
});

const buildGeneratedQuestion = (topic: AptitudeTopic, index: number): AptitudeQuestion => {
  const variant = index + 1;

  switch (topic.id) {
    case 'top_time_and_work': {
      const a = 8 + (index % 9);
      const b = 12 + ((index * 2) % 11);
      const answer = round((a * b) / (a + b));
      return generatedQuestion(topic, index, `A can complete a job in ${a} days and B can complete it in ${b} days. How many days will they take together?`, `${answer} days`, [`${round(answer + 1)} days`, `${round(answer - 1)} days`, `${round(answer + 2)} days`], `Combined rate = 1/${a} + 1/${b} = ${(a + b)}/${a * b}. Therefore time = ${a * b}/${a + b} = ${answer} days.`, 'Combined time = (A × B) / (A + B)');
    }
    case 'top_percentages': {
      const base = 240 + index * 10;
      const rate = 10 + (index % 6) * 5;
      const answer = base * rate / 100;
      return generatedQuestion(topic, index, `A salary of ₹${base} increases by ${rate}%. What is the amount of the increase?`, `₹${answer}`, [`₹${base + answer}`, `₹${base - answer}`, `₹${round(answer + 10)}`], `${rate}% of ₹${base} = ${base} × ${rate}/100 = ₹${answer}.`, 'Percentage change = Original value × Rate / 100');
    }
    case 'top_ratio_proportion': {
      const first = 2 + (index % 5);
      const second = 3 + ((index * 2) % 5);
      const third = 4 + ((index * 3) % 5);
      const totalParts = first + second + third;
      const unit = 60 + (index % 5) * 20;
      const total = totalParts * unit;
      const answer = second * unit;
      return generatedQuestion(topic, index, `₹${total} is divided among A, B and C in the ratio ${first}:${second}:${third}. What is B's share?`, `₹${answer}`, [`₹${first * unit}`, `₹${third * unit}`, `₹${unit}`], `The ratio has ${totalParts} parts. One part is ₹${total}/${totalParts} = ₹${unit}; B receives ${second} parts = ₹${answer}.`, 'Share = (Required ratio / Total ratio) × Total amount');
    }
    case 'top_profit_loss': {
      const cost = 200 + index * 25;
      const rate = 10 + (index % 5) * 5;
      const answer = cost * (100 + rate) / 100;
      return generatedQuestion(topic, index, `An article costs ₹${cost}. If it is sold at a ${rate}% profit, what is its selling price?`, `₹${answer}`, [`₹${cost - cost * rate / 100}`, `₹${cost + rate}`, `₹${round(answer + 25)}`], `Selling price = ₹${cost} × ${(100 + rate)}/100 = ₹${answer}.`, 'SP = CP × (100 + Profit%) / 100');
    }
    case 'top_speed_distance': {
      const distance = 120 + index * 15;
      const speed = 30 + (index % 6) * 10;
      const answer = round(distance / speed * 60);
      return generatedQuestion(topic, index, `A vehicle travels ${distance} km at ${speed} km/h. How many minutes does the journey take?`, `${answer} minutes`, [`${round(answer + 10)} minutes`, `${round(answer - 10)} minutes`, `${round(answer * 2)} minutes`], `Time in hours = ${distance}/${speed}; converting to minutes gives (${distance}/${speed}) × 60 = ${answer} minutes.`, 'Time = Distance / Speed');
    }
    case 'top_probability': {
      const target = 3 + (index % 8);
      const ways = target <= 7 ? target - 1 : 13 - target;
      return generatedQuestion(topic, index, `Two fair dice are rolled. What is the probability that their sum is ${target}?`, `${ways}/36`, [`${ways + 1}/36`, `1/${target}`, `${ways}/30`], `There are 36 equally likely outcomes. A sum of ${target} has ${ways} favorable ordered pairs, so probability = ${ways}/36.`, 'Probability = Favorable outcomes / Total outcomes');
    }
    case 'top_coding_decoding': {
      const shift = 2 + (index % 5);
      const letter = String.fromCharCode(65 + (index % 20));
      const answer = String.fromCharCode(65 + ((letter.charCodeAt(0) - 65 + shift) % 26));
      return generatedQuestion(topic, index, `In a code, each letter is shifted ${shift} places forward. How is ${letter} coded?`, answer, [String.fromCharCode(65 + ((letter.charCodeAt(0) - 65 + shift + 1) % 26)), String.fromCharCode(65 + ((letter.charCodeAt(0) - 65 - shift + 26) % 26)), letter], `${letter} moved ${shift} positions forward in the alphabet becomes ${answer}.`, 'Coded letter = Original letter + Shift');
    }
    case 'top_blood_relations': {
      const relations = ['maternal uncle', 'paternal aunt', 'grandfather', 'cousin'];
      const answer = relations[index % relations.length];
      const prompts = [`Riya is the daughter of Meera's brother. How is Meera related to Riya?`, `Aman is the son of Kavita's brother. How is Kavita related to Aman?`, `Neha's mother's father is Raj. How is Raj related to Neha?`, `P is the child of Q's sibling. How is P related to Q?`];
      return generatedQuestion(topic, index, `${prompts[index % prompts.length]} (Question variant ${variant})`, answer, ['sibling', 'parent', 'nephew'], `Trace the parent-child link first, then the sibling link. The stated relationship is ${answer}.`, 'Family tree: parent link + sibling link');
    }
    case 'top_direction_sense': {
      const north = 3 + (index % 5);
      const east = 4 + (index % 4);
      const distance = round(Math.sqrt(north * north + east * east));
      return generatedQuestion(topic, index, `A person walks ${north} km north and then ${east} km east. What is the shortest distance from the starting point?`, `${distance} km`, [`${north + east} km`, `${Math.abs(east - north)} km`, `${round(distance + 1)} km`], `The two movements form a right triangle. Distance = √(${north}² + ${east}²) = ${distance} km.`, 'Shortest distance = √(North² + East²)');
    }
    case 'top_number_series': {
      const start = 2 + (index % 8);
      const step = 3 + (index % 6);
      const terms = [start, start + step, start + step * 2, start + step * 3];
      const answer = start + step * 4;
      return generatedQuestion(topic, index, `Find the next number in the series: ${terms.join(', ')}, ?`, String(answer), [String(answer + step), String(answer - step), String(answer * 2)], `Each term increases by ${step}. Therefore the next term is ${terms[3]} + ${step} = ${answer}.`, 'Arithmetic series: next term = current term + common difference');
    }
    case 'top_syllogisms':
      return generatedQuestion(topic, index, `Statements: All ${['artists', 'teachers', 'poets', 'engineers'][index % 4]} are creative. Some creative people are researchers. Which conclusion definitely follows?`, 'All members of the first group are creative.', ['All researchers are artists.', 'No creative person is a researcher.', 'Some artists are not creative.'], 'The universal statement directly establishes that every member of the first group belongs to the creative group. The other conclusions introduce unsupported relationships.', 'All A are B means A is a subset of B');
    case 'top_synonyms_antonyms': {
      const pairs = [['abundant', 'plentiful'], ['brief', 'short'], ['candid', 'frank'], ['diligent', 'hardworking'], ['empathy', 'understanding'], ['fragile', 'delicate'], ['genuine', 'authentic'], ['hostile', 'unfriendly'], ['immense', 'huge'], ['vital', 'essential']];
      const [word, answer] = pairs[index % pairs.length];
      return generatedQuestion(topic, index, `Choose the word most nearly similar in meaning to “${word}” (variant ${variant}).`, answer, ['scarce', 'uncertain', 'opposite'], `“${word}” and “${answer}” share the same or a very similar meaning in standard placement vocabulary.`, 'Use context and common roots to identify the closest meaning');
    }
    case 'top_sentence_correction': {
      const subjects = ['The list of items', 'Each of the players', 'The committee members', 'Neither of the answers', 'The manager'];
      const subject = subjects[index % subjects.length];
      const singular = /list|Each|Neither|manager/.test(subject);
      const answer = singular ? 'is ready for review' : 'are ready for review';
      return generatedQuestion(topic, index, `Choose the grammatically correct completion: “${subject} ___.” (variant ${variant})`, answer, [singular ? 'are ready for review' : 'is ready for review', 'were ready for review', 'have ready for review'], `The verb agrees with the true subject: “${subject}” is ${singular ? 'singular' : 'plural'}, so the correct form is “${answer}.”`, 'Subject-verb agreement');
    }
    default:
      return generatedQuestion(topic, index, `Select the correct answer for ${topic.title} practice question ${variant}.`, 'Correct application of the topic rule', ['A common misconception', 'An unrelated result', 'Insufficient information'], 'Apply the standard rule for this topic and eliminate options that do not match it.', 'Use the core topic rule');
  }
};

const generatedAptitudeQuestionsDataset = aptitudeTopicsDataset.flatMap(topic => {
  const existingCount = baseAptitudeQuestionsDataset.filter(question => question.topicId === topic.id).length;
  return Array.from({ length: Math.max(0, 50 - existingCount) }, (_, index) => buildGeneratedQuestion(topic, index));
});

export const aptitudeQuestionsDataset: AptitudeQuestion[] = [
  ...baseAptitudeQuestionsDataset,
  ...generatedAptitudeQuestionsDataset
];
