import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Code2, 
  BrainCircuit, 
  ShoppingBag, 
  Receipt, 
  Users, 
  TrendingUp,
  IndianRupee,
  Activity,
  PlusCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { SkeletonLoader } from '../../components/SkeletonLoader';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 0.75rem', marginBottom: '1rem' }}>
          <ShieldCheck size={20} color="var(--color-cyan)" />
          <strong style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Admin CMS Portal</strong>
        </div>

        <NavLink to="/admin" end className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} /> Overview
        </NavLink>

        <NavLink to="/admin/problems" className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
          <Code2 size={18} /> DSA Problems CMS
        </NavLink>

        <NavLink to="/admin/aptitude" className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
          <BrainCircuit size={18} /> Aptitude CMS
        </NavLink>

        <NavLink to="/admin/products" className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
          <ShoppingBag size={18} /> Products & Notes
        </NavLink>

        <NavLink to="/admin/orders" className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
          <Receipt size={18} /> Orders & Revenue
        </NavLink>

        <NavLink to="/admin/users" className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
          <Users size={18} /> User Accounts
        </NavLink>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Platform Intelligence & CMS</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Live platform metrics, sales telemetry, and instant content publishing.</p>
        </div>

        {loading ? (
          <SkeletonLoader rows={4} height="80px" />
        ) : (
          <>
            {/* Metric Cards Grid */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  <IndianRupee size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Revenue</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                    ₹{stats?.totalRevenue || 0}
                  </div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--color-emerald)' }}>
                  <TrendingUp size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Paid Orders</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {stats?.paidOrdersCount || 0}
                  </div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: 'var(--color-purple)' }}>
                  <Users size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Students</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {stats?.totalUsers || 0}
                  </div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  <Code2 size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DSA Submissions</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {stats?.totalSubmissions || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Publishing Shortcuts & Top Selling */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PlusCircle size={18} color="var(--color-cyan)" /> Fast Publishing CMS Shortcuts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link to="/admin/problems?action=new" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                    <Code2 size={16} /> Publish New DSA Problem + Animation
                  </Link>
                  <Link to="/admin/aptitude?action=new" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                    <BrainCircuit size={16} /> Add Aptitude Question & Visual Trick
                  </Link>
                  <Link to="/admin/products?action=new" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                    <ShoppingBag size={16} /> Upload New Placement Notes Package
                  </Link>
                </div>
              </div>

              {/* Top Products */}
              <div className="card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Top Selling Placement Notes</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data?.topProducts?.map((p: any) => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{p.title}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>₹{p.revenue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
