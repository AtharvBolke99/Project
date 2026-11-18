import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  ChevronLeft, 
  LayoutDashboard, 
  ShoppingBag, 
  Receipt, 
  FolderTree, 
  MessageSquare,
  Sparkles,
  Save,
  Bell,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { SkeletonLoader } from '../../components/SkeletonLoader';

export const AdminHomepage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  // Homepage Fields
  const [heroHeading, setHeroHeading] = useState('Learn the idea. Not just the answer.');
  const [heroHighlight, setHeroHighlight] = useState('placement ace.');
  const [heroSubtitle, setHeroSubtitle] = useState('Comprehensive handwritten study notes, campus company question packs, and production-ready project source code.');
  const [heroCtaText, setHeroCtaText] = useState('Explore Notes & Store');
  const [heroCtaLink, setHeroCtaLink] = useState('/store');

  // Announcement Banner
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);
  const [announcementText, setAnnouncementText] = useState('⚡ Verified 2026 Campus Placement Notes & Roadmaps are live!');
  const [announcementLink, setAnnouncementLink] = useState('/store');

  // Why Trust Conceptifyyy items
  const [trustHeading, setTrustHeading] = useState('Why Trust Conceptifyyy?');
  const [trustSubtitle, setTrustSubtitle] = useState('Built with academic rigor, full transparency, and student-focused preparation.');
  const [trustItems, setTrustItems] = useState<Array<{ title: string; description: string; icon: string }>>([
    {
      title: 'Curated Learning Resources',
      description: 'Every resource is selected and organized to help students prepare for academics, technical interviews, and placements.',
      icon: 'BookOpen'
    },
    {
      title: 'Clear Product Information',
      description: 'Students can check the topics, file format, learning outcomes, and pricing before purchasing.',
      icon: 'FileCheck'
    },
    {
      title: 'Student-Focused Platform',
      description: 'Resources are organized around real student learning and placement preparation needs.',
      icon: 'GraduationCap'
    },
    {
      title: 'Transparent Pricing',
      description: 'Display accurate prices without hidden charges. Zero surprise fees.',
      icon: 'Tag'
    },
    {
      title: 'Secure Payments',
      description: 'Official 256-bit SSL encrypted checkout powered securely by Razorpay.',
      icon: 'ShieldCheck'
    },
    {
      title: 'Easy Access to Resources',
      description: 'Instant digital downloads and lifetime perpetual access in your personal student vault.',
      icon: 'Download'
    }
  ]);

  // Featured Product IDs
  const [featuredProductIds, setFeaturedProductIds] = useState<string[]>([]);

  const { showToast } = useToast();

  const fetchContent = async () => {
    setLoading(true);
    try {
      const [hpRes, prodRes] = await Promise.all([
        api.get('/admin/homepage'),
        api.get('/admin/products')
      ]);

      if (hpRes.success && hpRes.data) {
        const d = hpRes.data;
        if (d.heroHeading) setHeroHeading(d.heroHeading);
        if (d.heroHighlight) setHeroHighlight(d.heroHighlight);
        if (d.heroSubtitle) setHeroSubtitle(d.heroSubtitle);
        if (d.heroCtaText) setHeroCtaText(d.heroCtaText);
        if (d.heroCtaLink) setHeroCtaLink(d.heroCtaLink);

        if (d.announcement) {
          setAnnouncementEnabled(Boolean(d.announcement.enabled));
          if (d.announcement.text) setAnnouncementText(d.announcement.text);
          if (d.announcement.link) setAnnouncementLink(d.announcement.link);
        }

        if (d.whyTrustSection) {
          if (d.whyTrustSection.heading) setTrustHeading(d.whyTrustSection.heading);
          if (d.whyTrustSection.subtitle) setTrustSubtitle(d.whyTrustSection.subtitle);
          if (Array.isArray(d.whyTrustSection.items) && d.whyTrustSection.items.length > 0) {
            setTrustItems(d.whyTrustSection.items);
          }
        }

        if (Array.isArray(d.featuredProductIds)) {
          setFeaturedProductIds(d.featuredProductIds);
        }
      }

      if (prodRes.success && Array.isArray(prodRes.data)) {
        setProducts(prodRes.data);
      }
    } catch (e: any) {
      showToast('Error loading homepage settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        heroHeading,
        heroHighlight,
        heroSubtitle,
        heroCtaText,
        heroCtaLink,
        announcement: {
          enabled: announcementEnabled,
          text: announcementText,
          link: announcementLink
        },
        whyTrustSection: {
          heading: trustHeading,
          subtitle: trustSubtitle,
          items: trustItems
        },
        featuredProductIds
      };

      const res = await api.put('/admin/homepage', payload);
      if (res.success) {
        showToast('Homepage settings and trust section saved!', 'success');
      } else {
        showToast(res.message || 'Failed to save settings.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeaturedProduct = (id: string) => {
    setFeaturedProductIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleTrustItemChange = (index: number, field: 'title' | 'description', value: string) => {
    setTrustItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  return (
    <div className="admin-layout animate-fade-in">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <Link to="/" className="btn y btn-sm" style={{ marginBottom: '1.25rem', justifyContent: 'flex-start' }}>
          <ChevronLeft size={16} /> Back to Website
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.25rem 0.5rem', marginBottom: '0.75rem' }}>
          <strong style={{ fontSize: '15px', color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>Admin CMS Portal</strong>
        </div>

        <NavLink to="/admin" end className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} /> Overview
        </NavLink>

        <NavLink to="/admin/products" className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
          <ShoppingBag size={18} /> Products & Notes
        </NavLink>

        <NavLink to="/admin/categories" className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
          <FolderTree size={18} /> Categories & Subs
        </NavLink>

        <NavLink to="/admin/reviews" className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
          <MessageSquare size={18} /> Reviews & Feedback
        </NavLink>

        <NavLink to="/admin/homepage" className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
          <HomeIcon size={18} /> Homepage Content
        </NavLink>

        <NavLink to="/admin/orders" className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
          <Receipt size={18} /> Orders & Revenue
        </NavLink>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="tag" style={{ background: '#FFFBEB', color: '#B45309', marginBottom: '8px' }}>Storefront Customization</span>
            <h1 className="d" style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800 }}>Homepage Content & Trust CMS</h1>
            <p className="mu" style={{ fontSize: '15px' }}>Configure headline copy, announcements, trust-building claims, and featured materials without touching code.</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn v btn-sm" style={{ gap: '6px' }}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '2rem' }}>
            <SkeletonLoader rows={5} height="60px" />
          </div>
        ) : (
          <form onSubmit={handleSave}>
            
            {/* Section 1: Announcement Banner */}
            <div className="pop" style={{ background: '#FFFFFF', borderRadius: '24px', padding: '26px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Bell size={20} color="#4F46E5" />
                <h3 className="d" style={{ fontSize: '19px', margin: 0 }}>Site-Wide Announcement Banner</h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <input 
                  type="checkbox" 
                  id="annEnabled" 
                  checked={announcementEnabled} 
                  onChange={e => setAnnouncementEnabled(e.target.checked)} 
                />
                <label htmlFor="annEnabled" style={{ fontWeight: 700, fontSize: '14.5px', cursor: 'pointer' }}>
                  Enable top notification banner across website
                </label>
              </div>

              {announcementEnabled && (
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Announcement Text</label>
                    <input 
                      type="text" 
                      className="input" 
                      value={announcementText} 
                      onChange={e => setAnnouncementText(e.target.value)} 
                      placeholder="e.g. ⚡ 2026 Campus Placement Notes & Roadmaps are live!" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Destination Link</label>
                    <input 
                      type="text" 
                      className="input" 
                      value={announcementLink} 
                      onChange={e => setAnnouncementLink(e.target.value)} 
                      placeholder="/store" 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Hero Section */}
            <div className="pop" style={{ background: '#FFFFFF', borderRadius: '24px', padding: '26px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Sparkles size={20} color="#F59E0B" />
                <h3 className="d" style={{ fontSize: '19px', margin: 0 }}>Homepage Hero Banner Copy</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Hero Main Heading</label>
                <input 
                  type="text" 
                  className="input" 
                  value={heroHeading} 
                  onChange={e => setHeroHeading(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hero Subtitle</label>
                <textarea 
                  className="textarea" 
                  rows={3} 
                  value={heroSubtitle} 
                  onChange={e => setHeroSubtitle(e.target.value)} 
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">CTA Button Label</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={heroCtaText} 
                    onChange={e => setHeroCtaText(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CTA Destination URL</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={heroCtaLink} 
                    onChange={e => setHeroCtaLink(e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* Section 3: "Why Trust Conceptifyyy?" Section */}
            <div className="pop" style={{ background: '#FFFFFF', borderRadius: '24px', padding: '26px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <ShieldCheck size={20} color="#059669" />
                <h3 className="d" style={{ fontSize: '19px', margin: 0 }}>"Why Trust Conceptifyyy?" Section Copy</h3>
              </div>
              <p style={{ fontSize: '13.5px', color: '#64748B', marginBottom: '20px' }}>
                Edit the 6 trust pillar cards shown to prospective students on the homepage and store page.
              </p>

              <div className="form-grid-2" style={{ marginBottom: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Section Heading</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={trustHeading} 
                    onChange={e => setTrustHeading(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Section Subtitle</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={trustSubtitle} 
                    onChange={e => setTrustSubtitle(e.target.value)} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {trustItems.map((item, idx) => (
                  <div key={idx} style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Pillar #{idx + 1}
                    </div>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                      <input 
                        type="text" 
                        className="input" 
                        value={item.title} 
                        onChange={e => handleTrustItemChange(idx, 'title', e.target.value)} 
                        style={{ fontWeight: 700, fontSize: '14px' }} 
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <textarea 
                        className="textarea" 
                        rows={3} 
                        value={item.description} 
                        onChange={e => handleTrustItemChange(idx, 'description', e.target.value)} 
                        style={{ fontSize: '13px' }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Featured Products Selection */}
            <div className="pop" style={{ background: '#FFFFFF', borderRadius: '24px', padding: '26px', marginBottom: '24px' }}>
              <h3 className="d" style={{ fontSize: '19px', marginBottom: '8px' }}>Featured Products on Homepage</h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', marginBottom: '16px' }}>
                Select which verified materials appear in the top highlight bento on the homepage.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                {products.map(p => {
                  const isChecked = featuredProductIds.includes(p.id) || p.isFeatured;
                  return (
                    <label 
                      key={p.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        padding: '12px 14px', 
                        background: isChecked ? '#EEF2FF' : '#F8FAFC', 
                        border: isChecked ? '1.5px solid #4F46E5' : '1px solid #E2E8F0', 
                        borderRadius: '12px', 
                        cursor: 'pointer' 
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={() => handleToggleFeaturedProduct(p.id)} 
                      />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.title}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                          {p.category} • ₹{p.price}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="submit" disabled={saving} className="btn v btn-lg" style={{ minWidth: '220px' }}>
                <Save size={18} /> {saving ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>

          </form>
        )}
      </main>
    </div>
  );
};

export default AdminHomepage;
