import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit2, 
  ChevronLeft, 
  LayoutDashboard, 
  ShoppingBag, 
  Receipt, 
  FolderTree, 
  Home as HomeIcon,
  Star,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  Award
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { SkeletonLoader } from '../../components/SkeletonLoader';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalRev, setDeleteModalRev] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRole, setReviewerRole] = useState('Student');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewDescription, setReviewDescription] = useState('');
  const [productId, setProductId] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [reviewDate, setReviewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isFeatured, setIsFeatured] = useState<boolean>(true);
  const [isEditorial, setIsEditorial] = useState<boolean>(true);
  const [badge, setBadge] = useState<string>('Editorial Recommendation');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');

  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [revRes, prodRes] = await Promise.all([
        api.get('/admin/reviews'),
        api.get('/admin/products')
      ]);

      if (revRes.success && Array.isArray(revRes.data)) {
        setReviews(revRes.data);
      }
      if (prodRes.success && Array.isArray(prodRes.data)) {
        setProducts(prodRes.data);
      }
    } catch (e: any) {
      showToast('Error loading reviews or products.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setReviewerName('');
    setReviewerRole('Student');
    setReviewTitle('');
    setReviewDescription('');
    setProductId('');
    setRating(5);
    setReviewDate(new Date().toISOString().split('T')[0]);
    setIsFeatured(true);
    setIsEditorial(true);
    setBadge('Editorial Recommendation');
    setStatus('Published');
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rev: any) => {
    setEditingId(rev.id);
    setReviewerName(rev.reviewerName || '');
    setReviewerRole(rev.reviewerRole || 'Student');
    setReviewTitle(rev.reviewTitle || '');
    setReviewDescription(rev.reviewDescription || '');
    setProductId(rev.productId || '');
    setRating(rev.rating || 5);
    setReviewDate(rev.reviewDate || new Date().toISOString().split('T')[0]);
    setIsFeatured(Boolean(rev.isFeatured));
    setIsEditorial(rev.isEditorial !== false);
    setBadge(rev.badge || 'Editorial Recommendation');
    setStatus(rev.status === 'Draft' ? 'Draft' : 'Published');
    setIsModalOpen(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewDescription.trim()) {
      showToast('Reviewer name and review description are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const selectedProduct = products.find(p => p.id === productId);
      const payload = {
        reviewerName: reviewerName.trim(),
        reviewerRole: reviewerRole.trim(),
        reviewTitle: reviewTitle.trim() || 'Helpful Learning Resource',
        reviewDescription: reviewDescription.trim(),
        productId: productId ? productId : undefined,
        productTitle: selectedProduct ? selectedProduct.title : undefined,
        rating: Number(rating) || 5,
        reviewDate: reviewDate || new Date().toISOString().split('T')[0],
        isFeatured,
        isEditorial,
        badge: badge.trim(),
        status
      };

      if (editingId) {
        const res = await api.put(`/admin/reviews/${editingId}`, payload);
        if (res.success) {
          showToast('Review updated successfully!', 'success');
        } else {
          showToast(res.message || 'Failed to update review.', 'error');
        }
      } else {
        const res = await api.post('/admin/reviews', payload);
        if (res.success) {
          showToast('Review created successfully!', 'success');
        } else {
          showToast(res.message || 'Failed to create review.', 'error');
        }
      }

      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save review.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (rev: any) => {
    const newStatus = rev.status === 'Published' ? 'Draft' : 'Published';
    try {
      const res = await api.put(`/admin/reviews/${rev.id}`, { status: newStatus });
      if (res.success) {
        showToast(`Review set to ${newStatus}.`, 'info');
        fetchData();
      }
    } catch (e: any) {
      showToast('Failed to change status.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalRev) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/admin/reviews/${deleteModalRev.id}`);
      if (res.success) {
        showToast('Review deleted permanently.', 'success');
        setDeleteModalRev(null);
        fetchData();
      }
    } catch (e: any) {
      showToast('Failed to delete review.', 'error');
    } finally {
      setDeleting(false);
    }
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
            <span className="tag" style={{ background: '#ECFDF5', color: '#059669', marginBottom: '8px' }}>Trust & Feedback</span>
            <h1 className="d" style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800 }}>Reviews & Trust Management</h1>
            <p className="mu" style={{ fontSize: '15px' }}>Publish and manage transparent editorial recommendations, instructor notes, and verified student feedback.</p>
          </div>
          <button onClick={handleOpenAdd} className="btn v btn-sm">
            <Plus size={16} /> Add Review / Recommendation
          </button>
        </div>

        {/* Ethical Transparency Notice */}
        <div className="pop" style={{ marginBottom: '1.5rem', background: '#FFFFFF', borderRadius: '20px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} color="#059669" />
            </div>
            <span style={{ fontSize: '13.5px', color: 'var(--ink)' }}>
              <strong>Trust & Ethics Standard:</strong> Editorial recommendations and instructor notes are clearly labeled as such and never falsely masqueraded as verified customer purchases.
            </span>
          </div>
          <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 700 }}>
            {reviews.length} Reviews ({reviews.filter(r => r.status === 'Published').length} Published)
          </span>
        </div>

        {/* Reviews Table */}
        <div className="data-table-wrapper pop">
          {loading ? (
            <div style={{ padding: '2rem' }}>
              <SkeletonLoader rows={4} height="44px" />
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
              No reviews or editorial recommendations yet. Click "Add Review" to create your first one.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reviewer & Role</th>
                  <th>Title & Rating</th>
                  <th>Type & Badge</th>
                  <th>Associated Product</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(rev => (
                  <tr key={rev.id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '14.5px' }}>{rev.reviewerName}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.reviewerRole}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} color={i < rev.rating ? '#F59E0B' : '#E2E8F0'} fill={i < rev.rating ? '#F59E0B' : 'transparent'} />
                        ))}
                      </div>
                      <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{rev.reviewTitle}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {rev.reviewDescription}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${rev.isEditorial ? 'badge-purple' : 'badge-cyan'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Award size={12} /> {rev.badge || (rev.isEditorial ? 'Editorial' : 'Student')}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', color: rev.productTitle ? 'var(--text-primary)' : '#94A3B8', fontWeight: rev.productTitle ? 600 : 400 }}>
                        {rev.productTitle || 'Site-Wide General'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(rev)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        title="Click to toggle Published / Draft"
                      >
                        {rev.status === 'Published' ? (
                          <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Eye size={12} /> Published
                          </span>
                        ) : (
                          <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <EyeOff size={12} /> Draft
                          </span>
                        )}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                        <button onClick={() => handleOpenEdit(rev)} className="btn-icon" title="Edit Review" style={{ color: 'var(--color-cyan)' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setDeleteModalRev(rev)} className="btn-icon" title="Delete Review" style={{ color: 'var(--color-rose)' }}>
                          <Trash2 size={16} />
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

      {/* Add / Edit Review Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content modal-content-lg" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>
              {editingId ? 'Edit Review / Recommendation' : 'Add Editorial Review or Recommendation'}
            </h3>
            <form onSubmit={handleSaveReview}>
              
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Reviewer Name *</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={reviewerName} 
                    onChange={e => setReviewerName(e.target.value)} 
                    placeholder="e.g. Conceptifyyy Editorial, Ananya S." 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Reviewer Role *</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={reviewerRole} 
                    onChange={e => setReviewerRole(e.target.value)} 
                    placeholder="e.g. Technical Instructor, Software Engineer" 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Review Title *</label>
                <input 
                  type="text" 
                  className="input" 
                  value={reviewTitle} 
                  onChange={e => setReviewTitle(e.target.value)} 
                  placeholder="e.g. Comprehensive DSA breakdown with visual steps" 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Review Description / Feedback *</label>
                <textarea 
                  className="textarea" 
                  rows={4} 
                  value={reviewDescription} 
                  onChange={e => setReviewDescription(e.target.value)} 
                  placeholder="Detailed review or editorial commentary on this resource..." 
                  required 
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Associate with Product (Optional)</label>
                  <select 
                    className="select" 
                    value={productId} 
                    onChange={e => setProductId(e.target.value)}
                  >
                    <option value="">Overall Platform / Site-Wide</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Star Rating (1–5)</label>
                  <select 
                    className="select" 
                    value={rating} 
                    onChange={e => setRating(Number(e.target.value))}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Review Type / Badge Label</label>
                  <select 
                    className="select" 
                    value={badge} 
                    onChange={e => {
                      setBadge(e.target.value);
                      setIsEditorial(e.target.value.includes('Editorial') || e.target.value.includes('Instructor'));
                    }}
                  >
                    <option value="Editorial Recommendation">Editorial Recommendation</option>
                    <option value="Instructor Review">Instructor Review</option>
                    <option value="Student Testimonial">Student Testimonial</option>
                    <option value="Placement Review">Placement Review</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Review Date</label>
                  <input 
                    type="date" 
                    className="input" 
                    value={reviewDate} 
                    onChange={e => setReviewDate(e.target.value)} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '10px', marginTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input 
                    type="checkbox" 
                    checked={isFeatured} 
                    onChange={e => setIsFeatured(e.target.checked)} 
                  />
                  <span>Feature on Homepage & Store</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input 
                    type="checkbox" 
                    checked={status === 'Published'} 
                    onChange={e => setStatus(e.target.checked ? 'Published' : 'Draft')} 
                  />
                  <span>Published (Live)</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Saving...' : (editingId ? 'Update Review' : 'Save Review')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalRev && (
        <div className="modal-overlay" onClick={() => setDeleteModalRev(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle size={22} color="var(--color-rose)" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Delete Review?
              </h3>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Are you sure you want to delete the review titled <strong>"{deleteModalRev.reviewTitle}"</strong>?
              <br /><br />
              This will permanently remove it from the product detail page and homepage showcase.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setDeleteModalRev(null)}
                className="btn btn-secondary"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="btn btn-primary"
                style={{ background: 'var(--color-rose)', borderColor: 'var(--color-rose)' }}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Review'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminReviews;
