import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ChevronLeft, Shield, Ban, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { SkeletonLoader } from '../../components/SkeletonLoader';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await api.put(`/admin/users/${user.id}`, { status: newStatus });
      showToast(`User status updated to ${newStatus}`, 'success');
      fetchUsers();
    } catch (e: any) {
      showToast(e.message || 'Update failed', 'error');
    }
  };

  const handleToggleRole = async (user: any) => {
    const newRole = user.role === 'ADMIN' ? 'STUDENT' : 'ADMIN';
    try {
      await api.put(`/admin/users/${user.id}`, { role: newRole });
      showToast(`User role updated to ${newRole}`, 'success');
      fetchUsers();
    } catch (e: any) {
      showToast(e.message || 'Role change failed', 'error');
    }
  };

  return (
    <div className="admin-layout animate-fade-in">
      <aside className="admin-sidebar">
        <Link to="/admin" className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}>
          <ChevronLeft size={16} /> Back to Overview
        </Link>
        <Link to="/admin/users" className="admin-sidebar-link active">
          <Users size={18} /> User Accounts
        </Link>
      </aside>

      <main className="admin-content">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Student & Admin Accounts</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage roles, account status, and platform access.</p>
        </div>

        <div className="data-table-wrapper">
          {loading ? (
            <div style={{ padding: '2rem' }}>
              <SkeletonLoader rows={4} height="44px" />
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>DSA Solved</th>
                  <th>XP</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{u.name}</strong>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-purple' : 'badge-cyan'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.status === 'ACTIVE' ? 'badge-easy' : 'badge-hard'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{u.problemsSolved}</td>
                    <td style={{ fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                      {u.xp} XP
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleToggleRole(u)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                        >
                          Make {u.role === 'ADMIN' ? 'Student' : 'Admin'}
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '2px 8px', color: u.status === 'ACTIVE' ? 'var(--color-rose)' : 'var(--color-emerald)' }}
                        >
                          {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
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
