import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus, Trash2, Edit2, ChevronLeft, IndianRupee } from 'lucide-react';
import { api, getApiUrl } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { getAssetUrl, handleImageError } from '../../utils/imageUrl';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'DSA Notes' | 'Aptitude Notes' | 'Placement Bundles' | 'Projects'>('DSA Notes');
  const [price, setPrice] = useState(39);
  const [originalPrice, setOriginalPrice] = useState(199);
  const [cardDescription, setCardDescription] = useState('');
  const [stepDescription, setStepDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80');
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [techStack, setTechStack] = useState('React, Node.js, Express, TypeScript');
  const [fileFormat, setFileFormat] = useState('PDF');
  const [digitalFile, setDigitalFile] = useState('');
  const [digitalFileName, setDigitalFileName] = useState('');
  const [whatIncluded, setWhatIncluded] = useState('180+ Pages Visual PDF, Top 100 Company Patterns, Cheat Sheet');
  const [uploadingDigitalFile, setUploadingDigitalFile] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/store/products');
      if (res.success && res.data) {
        setProducts(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('DSA Notes');
    setPrice(39);
    setOriginalPrice(199);
    setCardDescription('');
    setStepDescription('');
    setThumbnail('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80');
    setGithubRepoUrl('');
    setLiveDemoUrl('');
    setTechStack('React, Node.js, Express, TypeScript');
    setFileFormat('PDF');
    setDigitalFile('');
    setDigitalFileName('');
    setWhatIncluded('180+ Pages Visual PDF, Top 100 Company Patterns, Cheat Sheet');
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditProduct = (p: any) => {
    setEditingId(p.id);
    setTitle(p.title || '');
    setCategory(p.category || 'DSA Notes');
    setPrice(p.price || 0);
    setOriginalPrice(p.originalPrice || 0);
    setCardDescription(p.cardDescription || p.shortDescription || p.description || '');
    setStepDescription(p.stepDescription || p.detailedDescription || p.description || '');
    setThumbnail(p.thumbnail || '');
    setFileFormat(p.fileFormat || 'PDF');
    setDigitalFile(p.digitalFile || '');
    setDigitalFileName(p.digitalFile ? p.digitalFile.split('/').pop() || p.digitalFile : '');
    setGithubRepoUrl(p.githubRepoUrl || '');
    setLiveDemoUrl(p.liveDemoUrl || '');
    setTechStack(Array.isArray(p.techStack) ? p.techStack.join(', ') : (p.techStack || ''));
    setWhatIncluded(Array.isArray(p.whatIncluded) ? p.whatIncluded.join(', ') : (p.whatIncluded || ''));
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isThumbnail: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    if (isThumbnail) {
      setUploadingThumbnail(true);
    } else {
      setUploadingDigitalFile(true);
    }

    try {
      const token = localStorage.getItem('conceptifyyy_token');
      const response = await fetch(getApiUrl('/admin/upload'), {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });

      const res = await response.json();
      if (!response.ok || !res.success) {
        throw new Error(res.message || 'File upload failed.');
      }

      if (isThumbnail) {
        setThumbnail(res.data.fileUrl);
        showToast('Thumbnail uploaded successfully!', 'success');
      } else {
        setDigitalFile(res.data.filename);
        setDigitalFileName(res.data.originalName || file.name);
        const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
        if (['PDF', 'ZIP', 'DOCX', 'PPTX', 'CSV'].includes(ext)) {
          setFileFormat(ext);
        }
        showToast(`Document "${file.name}" uploaded successfully!`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      if (isThumbnail) {
        setUploadingThumbnail(false);
      } else {
        setUploadingDigitalFile(false);
      }
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title,
        category,
        price: Number(price),
        originalPrice: Number(originalPrice),
        discountPercent: originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
        cardDescription,
        shortDescription: cardDescription,
        stepDescription,
        detailedDescription: stepDescription,
        description: stepDescription || cardDescription,
        thumbnail,
        digitalFile: digitalFile || undefined,
        githubRepoUrl: category === 'Projects' ? githubRepoUrl : undefined,
        liveDemoUrl: category === 'Projects' ? liveDemoUrl : undefined,
        techStack: category === 'Projects' ? techStack.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        whatIncluded: whatIncluded.split(',').map(item => item.trim()).filter(Boolean),
        fileFormat: category === 'Projects' ? 'ZIP' : fileFormat
      };

      if (editingId) {
        await api.put(`/admin/products/${editingId}`, payload);
        showToast('Product updated successfully!', 'success');
      } else {
        await api.post('/admin/products', payload);
        showToast('Product added to Store live!', 'success');
      }

      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product from the Store?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      showToast('Product deleted.', 'info');
      fetchProducts();
    } catch (e: any) {
      showToast(e.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="admin-layout animate-fade-in">
      <aside className="admin-sidebar">
        <Link to="/admin" className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}>
          <ChevronLeft size={16} /> Back to Overview
        </Link>
        <Link to="/admin/products" className="admin-sidebar-link active">
          <ShoppingBag size={18} /> Products & Notes
        </Link>
      </aside>

      <main className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Store Products & Notes CMS</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Publish and edit handwritten notes, formula cheat sheets, and source code packages.</p>
          </div>
          <button onClick={handleOpenAddModal} className="btn btn-primary">
            <Plus size={16} /> Add New Store Product
          </button>
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
                  <th>Product Title & Card Info</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Format</th>
                  <th>Rating</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{p.title}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/store/{p.slug}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', marginTop: '3px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        📇 {p.cardDescription || p.shortDescription || p.description}
                      </div>
                    </td>
                    <td><span className="badge badge-purple">{p.category}</span></td>
                    <td style={{ fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>₹{p.price}</td>
                    <td><span className="badge badge-cyan">{p.fileFormat}</span></td>
                    <td>⭐ {p.rating}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                        <button onClick={() => handleEditProduct(p)} className="btn-icon" title="Edit Product" style={{ color: 'var(--color-cyan)' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="btn-icon" title="Delete Product" style={{ color: 'var(--color-rose)' }}>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '660px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>
              {editingId ? 'Edit Store Product / Notes' : 'Publish New Store Product'}
            </h3>
            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input type="text" className="input" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="select" value={category} onChange={e => setCategory(e.target.value as any)}>
                    <option value="DSA Notes">DSA Notes</option>
                    <option value="Aptitude Notes">Aptitude Notes</option>
                    <option value="Placement Bundles">Placement Bundles</option>
                    <option value="Projects">Projects</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price in INR (₹)</label>
                  <input type="number" className="input" value={price} onChange={e => setPrice(Number(e.target.value))} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Original Strikethrough Price (₹)</label>
                  <input type="number" className="input" value={originalPrice} onChange={e => setOriginalPrice(Number(e.target.value))} />
                </div>

                <div className="form-group">
                  <label className="form-label">File Format</label>
                  <select className="select" value={fileFormat} onChange={e => setFileFormat(e.target.value)}>
                    <option value="PDF">PDF Document</option>
                    <option value="ZIP">ZIP Archive (Source Code)</option>
                    <option value="DOCX">Word Document (.docx)</option>
                    <option value="PPTX">PowerPoint (.pptx)</option>
                    <option value="CSV">Data / Sheets (.csv)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Digital Resource File Upload (PDF, ZIP, DOCX, PPTX)</label>
                  <input
                    type="file"
                    className="input"
                    onChange={e => handleFileUpload(e, false)}
                    accept=".pdf,.zip,.doc,.docx,.ppt,.pptx,.csv,.txt"
                  />
                  {uploadingDigitalFile && <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', marginTop: '4px' }}>⏳ Uploading file to secure storage...</div>}
                  {digitalFileName && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-emerald)', marginTop: '4px', fontWeight: 600 }}>
                      ✔ File Attached: {digitalFileName}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Thumbnail Image Upload</label>
                  <input
                    type="file"
                    className="input"
                    onChange={e => handleFileUpload(e, true)}
                    accept="image/*"
                  />
                  {uploadingThumbnail && <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', marginTop: '4px' }}>⏳ Uploading thumbnail...</div>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Or Custom Thumbnail Image URL</label>
                <input type="text" className="input" value={thumbnail} onChange={e => setThumbnail(e.target.value)} placeholder="https://..." />
                {thumbnail && (
                  <div style={{ marginTop: '6px', width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <img
                      src={getAssetUrl(thumbnail)}
                      alt="Preview"
                      onError={handleImageError}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>

              {category === 'Projects' && (
                <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--color-cyan)', marginBottom: '8px' }}>Project Specific Links & Metadata</h4>
                  <div className="form-group">
                    <label className="form-label">GitHub Repository URL</label>
                    <input type="url" className="input" value={githubRepoUrl} onChange={e => setGithubRepoUrl(e.target.value)} placeholder="https://github.com/org/repo" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Live Demo URL</label>
                    <input type="url" className="input" value={liveDemoUrl} onChange={e => setLiveDemoUrl(e.target.value)} placeholder="https://demo.app" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tech Stack (comma separated)</label>
                    <input type="text" className="input" value={techStack} onChange={e => setTechStack(e.target.value)} />
                  </div>
                </div>
              )}

              {/* 1. Card Info / Preview Summary */}
              <div className="form-group" style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '14px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label className="form-label" style={{ color: 'var(--color-cyan)', fontWeight: 700, margin: 0, fontSize: '0.9rem' }}>
                    📇 1. Card Info / Preview Summary (Shown on Store Card)
                  </label>
                  <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Storefront Card</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: '1.4' }}>
                  Brief summary shown directly on the catalog card in the Store (1-3 lines). This is what students see while browsing.
                </p>
                <textarea
                  className="textarea"
                  rows={2}
                  value={cardDescription}
                  onChange={e => setCardDescription(e.target.value)}
                  placeholder="e.g. 180+ Pages Visual Hand-drawn Notes covering Top 25 FAANG Algorithms, Complexity Maps & Code Templates."
                  required
                />
              </div>

              {/* 2. Complete Step Description / Detailed Content */}
              <div className="form-group" style={{ background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.25)', padding: '14px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label className="form-label" style={{ color: 'var(--color-purple)', fontWeight: 700, margin: 0, fontSize: '0.9rem' }}>
                    📖 2. Complete Step Description / Detailed Content (Shown After Opening Card)
                  </label>
                  <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>Detail Page</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: '1.4' }}>
                  Comprehensive step-by-step breakdown shown on the product detail page when the student opens the card. Detail all steps, syllabus, modules, and what they will learn.
                </p>
                <textarea
                  className="textarea"
                  rows={6}
                  value={stepDescription}
                  onChange={e => setStepDescription(e.target.value)}
                  placeholder={`Step 1: Foundational Array & Two Pointer Algorithms&#10;Step 2: Tree & Graph Traversals with Recursion Trees&#10;Step 3: Dynamic Programming Patterns & Memoization Tables&#10;Step 4: Top 100 Solved FAANG Interview Problems`}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">What is Included (comma separated)</label>
                <input type="text" className="input" value={whatIncluded} onChange={e => setWhatIncluded(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Saving...' : (editingId ? 'Update Product' : 'Publish to Store')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
