import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Code2, 
  BrainCircuit, 
  ShoppingBag, 
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'DSA' | 'Aptitude' | 'Payments' | 'General';
}

export const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndexes, setOpenIndexes] = useState<Record<number, boolean>>({ 0: true });

  const faqs: FAQItem[] = [
    {
      category: 'DSA',
      question: 'How does the Conceptifyyy Algorithm Visualizer work?',
      answer: 'Our signature visualizer translates raw code execution into cognitive step-by-step animations. When you click "VISUALIZE", you can inspect array indices, pointer movements (left, right, mid), HashMap state additions in O(1) time, and tree branches with full control over playback (Play, Pause, Step Next/Prev, Speed Multiplier, Scrubber Timeline).',
    },
    {
      category: 'DSA',
      question: 'Why is the complete solution hidden initially on DSA problems?',
      answer: 'Active recall and try-first practice lead to 4x higher cognitive retention compared to passive reading. On Conceptifyyy, you are encouraged to write and run your code first. Only after you click "Show Solution" does the platform unlock the full optimal approach, code in 4 languages (JavaScript, Python, C++, Java), and detailed Big-O analysis.',
    },
    {
      category: 'DSA',
      question: 'Which programming languages are supported in the code editor?',
      answer: 'Our code editor supports JavaScript (Node.js VM), Python 3, C++ (GCC), and Java 17. Every run executes in an isolated sandbox with public test cases, hidden edge cases, and runtime/memory profiling.',
    },
    {
      category: 'Aptitude',
      question: 'What types of Aptitude topics are covered for placement exams?',
      answer: 'We provide full coverage for Quantitative Aptitude (Time & Work, Percentages, Profit & Loss, Ratio & Proportion, Probability, Numbers, Time-Speed-Distance), Logical Reasoning (Number Series, Blood Relations, Syllogisms, Directions), and Verbal Ability (Sentence Correction, Vocabulary, Reading Comprehension), tailored for TCS NQT, Infosys, Accenture, Wipro, and product-based hiring rounds.',
    },
    {
      category: 'Aptitude',
      question: 'How does the visual aptitude solver help me solve faster?',
      answer: 'Instead of memorizing multi-step algebra, our visual explanations introduce cognitive shortcuts such as the Work-Units LCM method for Time & Work and Percentage Balance bars. Each question includes a 10-second shortcut formula.',
    },
    {
      category: 'Payments',
      question: 'How do digital downloads and Razorpay payments work?',
      answer: 'When you click "Buy Now" on any digital note or project, a secure Razorpay checkout order is generated using server-side pricing in paise. Once payment is completed, the cryptographic HMAC-SHA256 signature is verified on the backend, unlocking instant access. Your files remain permanently downloadable in your "My Purchases" library.',
    },
    {
      category: 'Payments',
      question: 'What payment methods are supported on Conceptifyyy?',
      answer: 'We support all major Indian and international payment methods via Razorpay 256-bit encrypted checkout, including UPI (Google Pay, PhonePe, Paytm, BHIM), Credit & Debit Cards (Visa, Mastercard, RuPay), NetBanking across 50+ banks, and digital wallets.',
    },
    {
      category: 'General',
      question: 'How do XP points, Streaks, and Achievement Badges work?',
      answer: 'You earn Experience Points (XP) each time you solve a DSA problem, submit an aptitude answer, or complete daily challenges. Solving daily problems maintains your continuous streak and unlocks milestone achievement badges like Early Adopter, Problem Solver, and 7-Day Streak Warrior.',
    },
    {
      category: 'General',
      question: 'Can college placement cells partner with Conceptifyyy for campus batches?',
      answer: 'Yes! We offer bulk institutional licensing and customized roadmaps for engineering colleges and training & placement cells. Please reach out through our Contact page with your college details.',
    }
  ];

  const filteredFaqs = faqs.filter(f => {
    const matchesCategory = activeCategory === 'All' || f.category === activeCategory;
    const matchesSearch = f.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (index: number) => {
    setOpenIndexes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '880px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 229, 255, 0.08)',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            marginBottom: '1rem'
          }}>
            <HelpCircle size={14} color="var(--color-cyan)" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-cyan)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Frequently Asked Questions
            </span>
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Everything You Need to Know
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Find clear answers regarding our visual cognitive engine, DSA arena, aptitude tests, and digital store.
          </p>
        </div>

        {/* Search Bar */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              placeholder="Search frequently asked questions (e.g. Visualizer, Razorpay, Python)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input"
              style={{ paddingLeft: '38px' }}
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {['All', 'DSA', 'Aptitude', 'Payments', 'General'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            >
              {cat === 'All' ? 'All Questions' : cat}
            </button>
          ))}
        </div>

        {/* Accordion FAQ List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '3.5rem' }}>
          {filteredFaqs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
              <p>No questions matched your search query. Try searching with different keywords.</p>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndexes[idx];
              return (
                <div
                  key={idx}
                  className="card glass-card"
                  style={{ padding: '0', overflow: 'hidden', border: isOpen ? '1px solid var(--border-highlight)' : '1px solid var(--border-subtle)' }}
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      background: 'transparent',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={`badge ${faq.category === 'DSA' ? 'badge-cyan' : faq.category === 'Aptitude' ? 'badge-purple' : 'badge-emerald'}`} style={{ fontSize: '0.7rem' }}>
                        {faq.category}
                      </span>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                        {faq.question}
                      </strong>
                    </div>
                    {isOpen ? <ChevronUp size={18} color="var(--color-cyan)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 1.5rem 1.25rem 1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.7' }}>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions Box */}
        <div className="card glass-card glowing-border" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Still have questions?
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Can't find what you're looking for? Reach out to our technical learning support team.
          </p>
          <Link to="/contact" className="btn btn-primary btn-sm">
            Contact Support Team <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
