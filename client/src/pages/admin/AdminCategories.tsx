import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  FolderTree, 
  Plus, 
  Trash2, 
  Edit2, 
  ChevronLeft, 
  LayoutDashboard, 
  ShoppingBag, 
  Receipt, 
  MessageSquare, 
  Home as HomeIcon,
  AlertTriangle,
  Tag
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { SkeletonLoader } from '../../components/SkeletonLoader';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalCat, setDeleteModalCat] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [subcategoriesText, setSubcategoriesText] = useState('');
  const [order, setOrder] = useState<number>(1);

  const { showToast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/categories');
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        showToast(res.message || 'Failed to fetch categories.', 'error');
      }
    } catch (e: any) {
      showToast('Error connecting to backend for categories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setSubcategoriesText('');
    setOrder(categories.length + 1);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name || '');
    setSlug(cat.slug || '');
    setDescription(cat.description || '');
    setSubcategoriesText(Array.isArray(cat.subcategories) ? cat.subcategories.join(', ') : '');
    setOrder(cat.order || 1);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Category name is required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const subcategories = subcategoriesText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim(),
        subcategories,
        order: Number(order) || 1
      };

      if (editingId) {
        const res = await api.put(`/admin/categories/${editingId}`, payload);
        if (res.success) {
          showToast('Category updated successfully!', 'success');
        } else {
          showToast(res.message || 'Failed to update category.', 'error');
        }
      } else {
        const res = await api.post('/admin/categories', payload);
        if (res.success) {
          showToast('Category created successfully!', 'success');
        } else {
          showToast(res.message || 'Failed to create category.', 'error');
        }
      }

      setIsModalOpen(false);
      resetForm();
      fetchCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to save category.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalCat) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/admin/categories/${deleteModalCat.id}`);
      if (res.success) {
        showToast(`Category "${deleteModalCat.name}" deleted.`, 'success');
        setDeleteModalCat(null);
        fetchCategories();
      } else {
        showToast(res.message || 'Delete failed.', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Delete failed.', 'error');
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
            <span className="tag" style={{ background: '#EEF2FF', color: '#4F46E5', marginBottom: '8px' }}>Store Organization</span>
            <h1 className="d" style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800 }}>Categories & Subcategories CMS</h1>
            <p className="mu" style={{ fontSize: '15px' }}>Dynamically configure main categories and dependent subcategories without editing source code.</p>
          </div>
          <button onClick={handleOpenAdd} className="btn v btn-sm">
            <Plus size={16} /> Add New Category
          </button>
        </div>

        {/* Dynamic Category Architecture Notice */}
        <div className="pop" style={{ marginBottom: '1.5rem', background: '#FFFFFF', borderRadius: '20px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FolderTree size={18} color="#4F46E5" />
            </div>
            <span style={{ fontSize: '14px', color: 'var(--ink)' }}>
              <strong>100% Dynamic Taxonomy:</strong> The student store and product editor dynamically render categories and subcategories from this list. Renaming a category automatically synchronizes existing products.
            </span>
          </div>
          <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 700 }}>
            {categories.length} Categories Active
          </span>
        </div>

        {/* Categories Table */}
        <div className="data-table-wrapper pop">
          {loading ? (
            <div style={{ padding: '2rem' }}>
              <SkeletonLoader rows={4} height="44px" />
            </div>
          ) : categories.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
              No categories configured yet. Click "Add New Category" above to create one.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Order</th>
                  <th>Category Name & Slug</th>
                  <th>Description</th>
                  <th>Configured Subcategories</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={cat.id}>
                    <td style={{ fontWeight: 800, color: '#64748B' }}>#{cat.order || idx + 1}</td>
                    <td>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '15px' }}>{cat.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>slug: {cat.slug}</div>
                    </td>
                    <td style={{ fontSize: '13.5px', color: 'var(--text-secondary)', maxWidth: '280px' }}>
                      {cat.description || '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {cat.subcategories && cat.subcategories.length > 0 ? (
                          cat.subcategories.map((sub: string) => (
                            <span key={sub} className="badge badge-purple" style={{ fontSize: '11px' }}>
                              {sub}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>No subcategories</span>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                        <button onClick={() => handleOpenEdit(cat)} className="btn-icon" title="Edit Category" style={{ color: 'var(--color-cyan)' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setDeleteModalCat(cat)} className="btn-icon" title="Delete Category" style={{ color: 'var(--color-rose)' }}>
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

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>
              {editingId ? 'Edit Category & Subcategories' : 'Create New Category'}
            </h3>
            <form onSubmit={handleSaveCategory}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input 
                  type="text" 
                  className="input" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g. DSA Notes, System Design, Cloud & DevOps" 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL Slug (Optional)</label>
                <input 
                  type="text" 
                  className="input" 
                  value={slug} 
                  onChange={e => setSlug(e.target.value)} 
                  placeholder="Leave empty to auto-generate from name" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea 
                  className="textarea" 
                  rows={2} 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Brief summary of what resources this category contains" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subcategories (Comma-separated)</label>
                <textarea 
                  className="textarea" 
                  rows={3} 
                  value={subcategoriesText} 
                  onChange={e => setSubcategoriesText(e.target.value)} 
                  placeholder="e.g. Arrays & Strings, Linked Lists, Trees & Graphs, Dynamic Programming" 
                />
                <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', display: 'block' }}>
                  Separate multiple subcategories with commas. Admin will be able to select these when creating or editing products.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Display Order</label>
                <input 
                  type="number" 
                  className="input" 
                  value={order} 
                  onChange={e => setOrder(Number(e.target.value))} 
                  min={1} 
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Saving...' : (editingId ? 'Update Category' : 'Create Category')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalCat && (
        <div className="modal-overlay" onClick={() => setDeleteModalCat(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle size={22} color="var(--color-rose)" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Delete Category?
              </h3>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Are you sure you want to delete category <strong>"{deleteModalCat.name}"</strong>?
              <br /><br />
              This will remove this category from the store filters and admin selection. Existing products assigned to this category will retain their category label.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setDeleteModalCat(null)}
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
                {deleting ? 'Deleting...' : 'Yes, Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCategories;
