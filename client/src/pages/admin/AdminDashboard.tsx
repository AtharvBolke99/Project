import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  ShoppingBag, 
  Receipt, 
  Users, 
  TrendingUp,
  IndianRupee,
  PlusCircle,
  ChevronLeft,
  FolderTree,
  MessageSquare,
  Home as HomeIcon,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get('/admin/overview');
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (e) {
        console.error('Failed to load admin overview:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const stats = data?.stats;

  return (
    <div className="admin-layout animate-fade-in">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <Link to="/" className="btn y btn-sm" style={{ marginBottom: '1.25rem', justifyContent: 'flex-start' }}>
          <ChevronLeft size={16} /> Back to Website
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.25rem 0.5rem', marginBottom: '0.75rem' }}>
          <ShieldCheck size={20} color="#FFC933" />
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
        <div style={{ marginBottom: '2rem' }}>
          <span className="tag" style={{ background: '#C9F7E8', marginBottom: '8px' }}>
            System Telemetry & Controls
          </span>
          <h1 className="d" style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800 }}>Platform Intelligence & CMS</h1>
          <p className="mu" style={{ fontSize: '15px' }}>Complete manual control over store notes, dynamic categories, reviews, and storefront copy.</p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="pop skeleton-pop" style={{ height: '90px', borderRadius: '20px' }}></div>
            ))}
          </div>
        ) : (
          <>
            {/* 8 Primary Telemetry Metric Cards */}
            <div className="admin-stats-grid" style={{ marginBottom: '2rem' }}>
              
              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Products</div>
                  <div className="d" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--ink)' }}>
                    {stats?.totalProducts || 0}
                  </div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#ECFDF5', color: '#059669' }}>
                  <Eye size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Published Products</div>
                  <div className="d" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--ink)' }}>
                    {stats?.publishedProducts || 0}
                  </div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#FFFBEB', color: '#D97706' }}>
                  <EyeOff size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Draft Products</div>
                  <div className="d" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--ink)' }}>
                    {stats?.draftProducts || 0}
                  </div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
                  <FolderTree size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Categories</div>
                  <div className="d" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--ink)' }}>
                    {stats?.totalCategories || 0}
                  </div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                  <Sparkles size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Featured Products</div>
                  <div className="d" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--ink)' }}>
                    {stats?.featuredProductsCount || 0}
                  </div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#ECFEFF', color: '#0891B2' }}>
                  <MessageSquare size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Reviews</div>
                  <div className="d" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--ink)' }}>
                    {stats?.totalReviews || 0}
                  </div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
                  <IndianRupee size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Revenue</div>
                  <div className="d" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--ink)' }}>
                    ₹{stats?.totalRevenue || 0}
                  </div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: '#ECFDF5', color: '#059669' }}>
                  <TrendingUp size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Paid Orders</div>
                  <div className="d" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--ink)' }}>
                    {stats?.paidOrdersCount || 0}
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Management Hub */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '2.5rem' }}>
              
              <Link to="/admin/products" className="pop" style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', transition: 'transform 0.15s' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingBag size={22} color="#4F46E5" />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '16px', color: '#0F172A', fontWeight: 800 }}>Products & Notes</h4>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B' }}>Add, edit, upload and delete notes</p>
                </div>
                <ArrowRight size={18} color="#64748B" />
              </Link>

              <Link to="/admin/categories" className="pop" style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', transition: 'transform 0.15s' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FolderTree size={22} color="#7C3AED" />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '16px', color: '#0F172A', fontWeight: 800 }}>Categories & Subs</h4>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B' }}>Manage dynamic category tree</p>
                </div>
                <ArrowRight size={18} color="#64748B" />
              </Link>

              <Link to="/admin/reviews" className="pop" style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', transition: 'transform 0.15s' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={22} color="#059669" />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '16px', color: '#0F172A', fontWeight: 800 }}>Reviews & Feedback</h4>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B' }}>Editorial reviews & testimonials</p>
                </div>
                <ArrowRight size={18} color="#64748B" />
              </Link>

              <Link to="/admin/homepage" className="pop" style={{ background: '#FFFFFF', borderRadius: '20px', padding: '20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', transition: 'transform 0.15s' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HomeIcon size={22} color="#D97706" />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '16px', color: '#0F172A', fontWeight: 800 }}>Homepage Content</h4>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B' }}>Headlines, banners & trust copy</p>
                </div>
                <ArrowRight size={18} color="#64748B" />
              </Link>

            </div>

            {/* Recent Product Additions & Recently Updated */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '2rem' }}>
              
              {/* Recent Additions */}
              <div className="pop" style={{ background: '#FFFFFF', borderRadius: '24px', padding: '24px' }}>
                <h3 className="d" style={{ fontSize: '19px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PlusCircle size={18} color="#4F46E5" /> Recent Product Additions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data?.recentAdditions && data.recentAdditions.length > 0 ? (
                    data.recentAdditions.map((p: any) => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <div>
                          <strong style={{ fontSize: '14px', color: '#0F172A' }}>{p.title}</strong>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>{p.category} {p.subcategory ? `• ${p.subcategory}` : ''}</div>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#4F46E5' }}>
                          {p.price === 0 ? 'FREE' : `₹${p.price}`}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: '#64748B', fontSize: '14px' }}>No products yet.</div>
                  )}
                </div>
              </div>

              {/* Recently Updated */}
              <div className="pop" style={{ background: '#FFFFFF', borderRadius: '24px', padding: '24px' }}>
                <h3 className="d" style={{ fontSize: '19px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#059669" /> Recently Updated Products
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data?.recentlyUpdated && data.recentlyUpdated.length > 0 ? (
                    data.recentlyUpdated.map((p: any) => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <div>
                          <strong style={{ fontSize: '14px', color: '#0F172A' }}>{p.title}</strong>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>
                            Updated: {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Recently'}
                          </div>
                        </div>
                        <span className={`badge ${p.status === 'Draft' ? 'badge-amber' : 'badge-emerald'}`}>
                          {p.status || 'Published'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: '#64748B', fontSize: '14px' }}>No products updated yet.</div>
                  )}
                </div>
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
