import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, ChevronLeft, CheckCircle2, Clock, XCircle, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { SkeletonLoader } from '../../components/SkeletonLoader';

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
        <Link to="/admin" className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}>
          <ChevronLeft size={16} /> Back to Overview
        </Link>
        <Link to="/admin/orders" className="admin-sidebar-link active">
          <Receipt size={18} /> Orders & Revenue
        </Link>
      </aside>

      <main className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Order Management & Payments</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Live real Razorpay transactions and license unlock records.</p>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['All', 'PAID', 'PENDING', 'FAILED'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`tab-btn ${statusFilter === st ? 'active' : ''}`}
                style={{ fontSize: '0.8125rem' }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="data-table-wrapper">
          {loading ? (
            <div style={{ padding: '2rem' }}>
              <SkeletonLoader rows={4} height="44px" />
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
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
                      <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                        {o.orderNumber}
                      </strong>
                    </td>
                    <td>
                      <div>{o.userName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.userEmail}</div>
                    </td>
                    <td>{o.productTitle}</td>
                    <td style={{ fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                      ₹{o.amount}
                    </td>
                    <td>
                      <span className={`badge ${o.status === 'PAID' ? 'badge-easy' : o.status === 'FAILED' ? 'badge-hard' : 'badge-medium'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      <div>Order: {o.razorpayOrderId}</div>
                      {o.razorpayPaymentId && <div>Pay: {o.razorpayPaymentId}</div>}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
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
