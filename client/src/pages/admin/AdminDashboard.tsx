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
  Database
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
          <p className="mu" style={{ fontSize: '15px' }}>Live platform metrics, sales telemetry, and instant content publishing.</p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="pop skeleton-pop" style={{ height: '90px', borderRadius: '20px' }}></div>
            ))}
          </div>
        ) : (
          <>
            {/* Metric Cards Grid */}
            <div className="admin-stats-grid">
              
              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  <IndianRupee size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Revenue</div>
                  <div className="d" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink)' }}>
                    ₹{stats?.totalRevenue || 0}
                  </div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: 'var(--soft-mint)' }}>
                  <TrendingUp size={22} color="var(--ink)" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Paid Orders</div>
                  <div className="d" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink)' }}>
                    {stats?.paidOrdersCount || 0}
                  </div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: 'var(--lavender-accent)' }}>
                  <ShoppingBag size={22} color="var(--ink)" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Store Materials</div>
                  <div className="d" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink)' }}>
                    {stats?.totalProducts || 8}
                  </div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: 'var(--coral-light)' }}>
                  <Users size={22} color="var(--ink)" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Students Registered</div>
                  <div className="d" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink)' }}>
                    {stats?.totalUsers || 0}
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Publishing Shortcuts & Top Selling */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '2rem' }}>
              
              <div className="pop" style={{ background: '#FFFFFF', borderRadius: '26px', padding: '24px' }}>
                <h3 className="d" style={{ fontSize: '20px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PlusCircle size={18} color="var(--purple)" /> Publishing CMS Shortcuts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link to="/admin/products" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                    <ShoppingBag size={16} /> Manage & Edit Store Products
                  </Link>
                  <Link to="/admin/orders" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                    <Receipt size={16} /> View Orders & Customer Invoices
                  </Link>
                </div>
              </div>

              {/* Top Selling Products */}
              <div className="pop" style={{ background: '#FFFFFF', borderRadius: '26px', padding: '24px' }}>
                <h3 className="d" style={{ fontSize: '20px', marginBottom: '14px' }}>Catalog Materials</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data?.topProducts && data.topProducts.length > 0 ? (
                    data.topProducts.map((p: any) => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--lavender)', borderRadius: '12px', border: '1.5px solid var(--ink)' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{p.title}</span>
                        <span className="d" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--purple)' }}>₹{p.price}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: 'var(--muted)', fontSize: '14px' }}>
                      Materials stored in database. Visit Products CMS to manage.
                    </div>
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
