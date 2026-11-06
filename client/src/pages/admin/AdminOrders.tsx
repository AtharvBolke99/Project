import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, ChevronLeft, ShoppingBag, Database } from 'lucide-react';
import { api } from '../../services/api';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/orders?status=${statusFilter}`);
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  return (
    <div className="admin-layout animate-fade-in">
      <aside className="admin-sidebar">
        <Link to="/" className="btn y btn-sm" style={{ marginBottom: '1.25rem', justifyContent: 'flex-start' }}>
          <ChevronLeft size={16} /> Back to Website
        </Link>
        <Link to="/admin" className="admin-sidebar-link">
          <Database size={18} /> Overview
        </Link>
        <Link to="/admin/products" className="admin-sidebar-link">
          <ShoppingBag size={18} /> Products & Notes
        </Link>
        <Link to="/admin/orders" className="admin-sidebar-link active">
          <Receipt size={18} /> Orders & Revenue
        </Link>
      </aside>

      <main className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="tag" style={{ background: '#C9F7E8', marginBottom: '8px' }}>Sales Telemetry</span>
            <h1 className="d" style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800 }}>Order Management & Payments</h1>
            <p className="mu" style={{ fontSize: '15px' }}>Live real Razorpay transactions and license unlock records.</p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'PAID', 'PENDING', 'FAILED'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`btn btn-sm ${statusFilter === st ? 'v' : ''}`}
                style={{
                  background: statusFilter === st ? 'var(--purple)' : '#FFFFFF',
                  color: statusFilter === st ? '#FFFFFF' : 'var(--ink)'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="data-table-wrapper pop">
          {loading ? (
            <div style={{ padding: '2rem' }}>
              <div className="skeleton-pop" style={{ height: '44px', marginBottom: '12px' }}></div>
              <div className="skeleton-pop" style={{ height: '44px', marginBottom: '12px' }}></div>
              <div className="skeleton-pop" style={{ height: '44px' }}></div>
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--muted)', fontWeight: 600 }}>
              No orders recorded under "{statusFilter}".
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Razorpay IDs</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>
                      <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>
                        {o.orderNumber}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{o.userName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{o.userEmail}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{o.productTitle}</td>
                    <td>
                      <span className="d" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink)' }}>
                        ₹{o.amount}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="tag" 
                        style={{ 
                          background: o.status === 'PAID' ? '#C9F7E8' : o.status === 'FAILED' ? '#FFD4C8' : '#FFE9A8' 
                        }}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
                      <div>Order: {o.razorpayOrderId}</div>
                      {o.razorpayPaymentId && <div>Pay: {o.razorpayPaymentId}</div>}
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};
