import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  HelpCircle,
  Phone,
  MessageCircle
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      showToast('Thank you! Your message has been received. We will respond within 24 hours.', 'success');
      setName('');
      setEmail('');
      setMessage('');
    }, 600);
  };

  return (
    <div style={{ padding: '2rem 1.5rem 5rem' }}>
      <div className="wrap" style={{ maxWidth: '960px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
            <span className="chip" style={{ background: 'var(--yellow)', transform: 'rotate(-2deg)' }}>
              ✦ 24/7 LEARNER SUPPORT
            </span>
          </div>

          <h1 className="d" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.25rem)', lineHeight: 1.15, marginBottom: '0.75rem' }}>
            Get in touch with <span style={{ color: 'var(--purple)' }}>Conceptifyyy</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--muted)', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>
            Have a question about your order, notes access, or need help with a payment? We are here to help you 7 days a week.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Left Column: Form */}
          <div className="pop" style={{ background: '#FFFFFF', padding: '2rem' }}>
            <h2 className="d" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Send Us a Message</h2>

            {submitted ? (
              <div style={{ background: 'var(--mint-soft)', border: '2px solid var(--ink)', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
                <CheckCircle2 size={40} color="var(--mint)" style={{ margin: '0 auto 0.75rem' }} />
                <h3 className="d" style={{ fontSize: '1.2rem', margin: '0 0 0.5rem' }}>Message Received!</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: '0 0 1.25rem' }}>
                  Our academic support team has received your inquiry and will respond within 24 hours.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn v btn-sm">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="inp"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@college.edu"
                    className="inp"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="inp"
                    style={{ width: '100%', cursor: 'pointer' }}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order & Download Help">Order & Download Vault Help</option>
                    <option value="Payment Verification">Payment / Razorpay Transaction Help</option>
                    <option value="Content Feedback">Notes or Content Feedback</option>
                    <option value="Creator Collaboration">Creator / College Representative</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    Message Details
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Provide details about your query or order ID..."
                    className="inp"
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn v"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {submitting ? 'Sending...' : (
                    <>
                      <Send size={16} /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Support Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div className="pop" style={{ background: '#FFFFFF', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--yellow)', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={20} color="var(--ink)" />
                </div>
                <div>
                  <h3 className="d" style={{ fontSize: '1.15rem', margin: 0 }}>Direct Email Support</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Guaranteed response under 24 hrs</p>
                </div>
              </div>
              <a
                href="mailto:conceptifyyy@gmail.com"
                style={{
                  display: 'inline-block',
                  color: 'var(--purple)',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  textDecoration: 'underline'
                }}
              >
                conceptifyyy@gmail.com
              </a>
            </div>

            <div className="pop" style={{ background: '#FFFFFF', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--mint-soft)', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} color="var(--ink)" />
                </div>
                <div>
                  <h3 className="d" style={{ fontSize: '1.15rem', margin: 0 }}>Razorpay Order Inquiries</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Payment dispute & refund assistance</p>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                For instant resolution regarding Razorpay transactions, please include your <strong>Payment ID</strong> (starts with <code>pay_...</code>) or Order ID.
              </p>
            </div>

            <div className="pop" style={{ background: 'var(--lavender-accent)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Clock size={20} color="var(--ink)" />
                <h3 className="d" style={{ fontSize: '1.15rem', margin: 0 }}>Support Hours</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--ink)', margin: 0, lineHeight: 1.6 }}>
                <strong>Monday – Sunday:</strong> 9:00 AM – 9:00 PM IST <br />
                Queries sent during nighttime are prioritized first thing next morning.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
