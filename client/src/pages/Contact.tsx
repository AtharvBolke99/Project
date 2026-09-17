import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  HelpCircle,
  Phone
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
    }, 800);
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '980px' }}>
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
            <Sparkles size={14} color="var(--color-cyan)" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-cyan)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Get In Touch
            </span>
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            We're Here to Help Your Journey
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
            Have a question about our DSA visualizers, placement notes, college bundle orders, or need technical support? Drop us a note!
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="contact-layout-grid" style={{ marginBottom: '3.5rem' }}>
          {/* Left: Contact Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card glass-card">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0, 229, 255, 0.12)', color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '2px' }}>Email Support</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>support@conceptifyyy.com</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Average response time: &lt; 4 hours</p>
                </div>
              </div>
            </div>

            <div className="card glass-card">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.12)', color: 'var(--color-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '2px' }}>Support Hours</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Monday – Saturday</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>9:00 AM – 8:00 PM IST</p>
                </div>
              </div>
            </div>

            <div className="card glass-card">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '2px' }}>Payment & Purchase Inquiries</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Razorpay 100% Secure Checkout</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Instant digital license fulfillment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="card glass-card glowing-border" style={{ padding: '2rem' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Message Sent Successfully!
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Our academic support team has received your message and will reach out to your email shortly.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn btn-secondary btn-sm">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                  Send a Message
                </h3>

                <div className="grid-2" style={{ marginBottom: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Your Name</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Priyanshu Roy"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Email Address</label>
                    <input
                      type="email"
                      className="input"
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Inquiry Category</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="select"
                  >
                    <option>General Inquiry</option>
                    <option>DSA Problem & Visualizer Feedback</option>
                    <option>Aptitude Arena Question Inquiry</option>
                    <option>Order, Download & Razorpay Support</option>
                    <option>College / Campus Placement Partnership</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Message</label>
                  <textarea
                    rows={5}
                    className="textarea"
                    placeholder="How can our team assist you today?"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', gap: '8px' }}
                >
                  <Send size={18} />
                  <span>{submitting ? 'Sending Message...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
