import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  ArrowRight,
  Download
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'Notes' | 'Payments' | 'Downloads' | 'General';
}

export const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndexes, setOpenIndexes] = useState<Record<number, boolean>>({ 0: true });

  const faqs: FAQItem[] = [
    {
      category: 'Notes',
      question: 'What formats are the study notes and resources provided in?',
      answer: 'All notes are provided as crystal-clear, high-resolution searchable PDF files. They are optimized for viewing on laptops, tablets, iPads (e.g. GoodNotes/Notability), and mobile devices, and are also fully printable.',
    },
    {
      category: 'Notes',
      question: 'Who writes and verifies the study notes on Conceptifyyy?',
      answer: 'Our notes are created by top university rankers, campus drive qualifiers, and tech engineers. Every document undergoes peer review to ensure 100% accuracy in formulas, algorithms, memory layouts, and interview tips.',
    },
    {
      category: 'Downloads',
      question: 'How do I access my purchased notes or projects after payment?',
      answer: 'Access is instantaneous! As soon as your payment is verified via Razorpay, you are redirected to the "My Purchases" vault where you can immediately download or preview your files. You also receive an email confirmation with lifetime direct download access.',
    },
    {
      category: 'Downloads',
      question: 'Can I re-download my purchases in the future if I switch devices?',
      answer: 'Yes! Your purchases remain permanently linked to your Conceptifyyy user account. Simply log in at any time and head over to the "My Purchases" tab to re-download your files whenever you need them.',
    },
    {
      category: 'Payments',
      question: 'Which payment methods are accepted on Conceptifyyy?',
      answer: 'We support all major Indian and international payment methods via Razorpay: UPI (Google Pay, PhonePe, Paytm, CRED), Net Banking across 50+ banks, Credit & Debit Cards (Visa, MasterCard, RuPay, Amex), and leading wallets.',
    },
    {
      category: 'Payments',
      question: 'Is online payment secure on Conceptifyyy?',
      answer: 'Completely secure. All payments are encrypted via 256-bit SSL and processed directly through Razorpay Software Private Limited, an RBI-authorized PCI-DSS Level 1 compliant payment aggregator. Conceptifyyy never stores your card or banking credentials.',
    },
    {
      category: 'Payments',
      question: 'What is your refund policy if I am not satisfied with a purchase?',
      answer: 'We provide a 7-day learner satisfaction guarantee. If the content does not match the curriculum or description, reach out to us at conceptifyyy@gmail.com with your payment details for a full refund.',
    },
    {
      category: 'General',
      question: 'Are capstone projects provided with complete source code?',
      answer: 'Yes. Full-stack projects come with the entire production source code (Frontend, Backend, Database schemas), detailed setup READMEs, environment variable examples, and project architecture explanations.',
    }
  ];

  const categories = ['All', 'Notes', 'Downloads', 'Payments', 'General'];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (idx: number) => {
    setOpenIndexes(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div style={{ padding: '2rem 1.5rem 5rem' }}>
      <div className="wrap" style={{ maxWidth: '920px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
            <span className="chip" style={{ background: 'var(--yellow)', transform: 'rotate(-2deg)' }}>
              ✦ FREQUENTLY ASKED QUESTIONS
            </span>
          </div>

          <h1 className="d" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.25rem)', lineHeight: 1.15, marginBottom: '0.75rem' }}>
            Got questions? <span style={{ color: 'var(--purple)' }}>We've got answers.</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--muted)', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>
            Everything you need to know about purchasing, accessing, and downloading notes and digital projects.
          </p>
        </div>

        {/* Search & Categories */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="pop" style={{ background: '#FFFFFF', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderRadius: '999px' }}>
            <Search size={20} color="var(--ink)" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search questions by keyword (e.g. PDF, download, Razorpay, refund)..."
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '1rem',
                fontFamily: 'inherit',
                background: 'transparent'
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`tag ${activeCategory === cat ? 'active' : ''}`}
                style={{
                  cursor: 'pointer',
                  background: activeCategory === cat ? 'var(--purple)' : '#FFFFFF',
                  color: activeCategory === cat ? '#FFFFFF' : 'var(--ink)',
                  border: '2px solid var(--ink)',
                  boxShadow: activeCategory === cat ? '2px 2px 0 var(--ink)' : 'none',
                  fontSize: '0.875rem',
                  padding: '6px 16px',
                  fontWeight: 700
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3.5rem' }}>
          {filteredFaqs.length === 0 ? (
            <div className="pop" style={{ background: '#FFFFFF', padding: '3rem', textAlign: 'center' }}>
              <HelpCircle size={40} color="var(--purple)" style={{ margin: '0 auto 1rem' }} />
              <h3 className="d" style={{ fontSize: '1.3rem', margin: '0 0 0.5rem' }}>No matching questions found</h3>
              <p style={{ color: 'var(--muted)', margin: 0 }}>Try adjusting your search terms or clearing filters.</p>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = !!openIndexes[idx];
              return (
                <div
                  key={idx}
                  className="pop"
                  style={{
                    background: '#FFFFFF',
                    transition: 'all 0.15s ease',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span className="d" style={{ fontSize: '1.1rem', color: 'var(--ink)' }}>
                      {faq.question}
                    </span>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isOpen ? 'var(--yellow)' : 'var(--lavender)', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isOpen ? <ChevronUp size={16} color="var(--ink)" /> : <ChevronDown size={16} color="var(--ink)" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 1.5rem 1.25rem 1.5rem', color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6, borderTop: '1px solid var(--lavender-accent)' }}>
                      <p style={{ margin: '0.75rem 0 0' }}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still have questions */}
        <div className="pop" style={{ background: 'var(--yellow)', padding: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <h3 className="d" style={{ fontSize: '1.5rem', margin: '0 0 0.5rem' }}>Still have questions?</h3>
            <p style={{ margin: 0, color: 'var(--ink)', fontSize: '0.95rem' }}>Our team is ready to assist you anytime.</p>
          </div>
          <Link to="/contact" className="btn v" style={{ textDecoration: 'none' }}>
            Contact Support <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
};
