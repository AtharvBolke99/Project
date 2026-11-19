import React, { useState, useEffect, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit2, 
  ChevronLeft, 
  Download, 
  Upload, 
  Database, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Search,
  LayoutDashboard,
  FolderTree,
  MessageSquare,
  Home as HomeIcon,
  Receipt,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { getAssetUrl, handleImageError } from '../../utils/imageUrl';

const QUALITY_INDICATOR_OPTIONS = [
  'Beginner Friendly',
  'Intermediate',
  'Advanced',
  'Interview Focused',
  'Exam Preparation',
  'Practice-Oriented',
  'Updated Resource',
  'Free Resource'
];

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  // Delete Confirmation Modal State
  const [deleteModalProduct, setDeleteModalProduct] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Admin Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const getRandomReviews = () => Math.floor(Math.random() * (200 - 50 + 1)) + 50;

  // Form State - Complete Manual Control
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');
  const [customCategoryInput, setCustomCategoryInput] = useState<string>('');
  const [customSubcategoryInput, setCustomSubcategoryInput] = useState<string>('');
  const [price, setPrice] = useState(39);
  const [originalPrice, setOriginalPrice] = useState(199);
  const [reviewsCount, setReviewsCount] = useState<number>(getRandomReviews);
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');
  const [cardDescription, setCardDescription] = useState('');
  const [stepDescription, setStepDescription] = useState('');
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState('');
  const [customThumbnailUrl, setCustomThumbnailUrl] = useState('');
  const [instantThumbnailPreview, setInstantThumbnailPreview] = useState<string | null>(null);
  const [uploadProgressThumbnail, setUploadProgressThumbnail] = useState<number>(0);
  const [fileFormat, setFileFormat] = useState('PDF');
  const [digitalFile, setDigitalFile] = useState('');
  const [digitalFileName, setDigitalFileName] = useState('');
  const [supabasePdfUrl, setSupabasePdfUrl] = useState('');
  const [uploadProgressDigitalFile, setUploadProgressDigitalFile] = useState<number>(0);
  const [whatIncluded, setWhatIncluded] = useState('');
  const [tags, setTags] = useState('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [learningOutcomes, setLearningOutcomes] = useState<string>('');
  const [pageCount, setPageCount] = useState<number | ''>('');
  const [estimatedTime, setEstimatedTime] = useState<string>('');
  const [adminReview, setAdminReview] = useState<string>('');
  const [qualityIndicators, setQualityIndicators] = useState<string[]>([]);
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [techStack, setTechStack] = useState('');

  const [uploadingDigitalFile, setUploadingDigitalFile] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/admin/products'),
        api.get('/admin/categories')
      ]);

      if (prodRes.success && Array.isArray(prodRes.data)) {
        setProducts(prodRes.data);
      }
      if (catRes.success && Array.isArray(catRes.data)) {
        setCategories(catRes.data);
      }
    } catch (e: any) {
      console.error('[ADMIN] Failed to fetch data for admin:', e);
      showToast('Unable to connect to backend storage.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const activeProducts = useMemo(() => {
    return products.filter(p => !p.isDeleted);
  }, [products]);

  const filteredAdminProducts = useMemo(() => {
    return activeProducts.filter(p => {
      const matchesCat = categoryFilter === 'All' || (p.category || '').toLowerCase() === categoryFilter.toLowerCase();
      const matchesSearch = !searchTerm.trim() || 
        (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.slug && p.slug.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [activeProducts, categoryFilter, searchTerm]);

  // Dynamic Subcategories based on selected main category
  const currentCategoryObj = useMemo(() => {
    return categories.find(c => c.name.toLowerCase() === category.toLowerCase());
  }, [categories, category]);

  const availableSubcategories = useMemo(() => {
    return currentCategoryObj?.subcategories || [];
  }, [currentCategoryObj]);

  const handleExportBackup = async () => {
    try {
      const res = await api.get('/admin/products/backup');
      const dataToExport = (res.success && res.data) ? res.data : products;
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conceptifyyy-products-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Catalog exported to JSON backup!', 'success');
    } catch (e: any) {
      showToast(e.message || 'Export failed', 'error');
    }
  };

  const handleRestoreBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        showToast('Invalid backup file. Must contain a products array.', 'error');
        return;
      }

      setRestoring(true);
      const res = await api.post('/admin/products/restore', { products: parsed });
      if (res.success) {
        showToast(res.message || 'Catalog restored successfully!', 'success');
        fetchInitialData();
      } else {
        showToast(res.message || 'Failed to restore backup.', 'error');
      }
    } catch (err: any) {
      showToast('Error reading or parsing JSON file.', 'error');
    } finally {
      setRestoring(false);
      e.target.value = '';
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('');
    setSubcategory('');
    setCustomCategoryInput('');
    setCustomSubcategoryInput('');
    setPrice(39);
    setOriginalPrice(199);
    setReviewsCount(getRandomReviews());
    setStatus('Published');
    setCardDescription('');
    setStepDescription('');
    setUploadedThumbnailUrl('');
    setCustomThumbnailUrl('');
    if (instantThumbnailPreview) {
      URL.revokeObjectURL(instantThumbnailPreview);
    }
    setInstantThumbnailPreview(null);
    setUploadProgressThumbnail(0);
    setGithubRepoUrl('');
    setLiveDemoUrl('');
    setTechStack('');
    setFileFormat('PDF');
    setDigitalFile('');
    setDigitalFileName('');
    setSupabasePdfUrl('');
    setUploadProgressDigitalFile(0);
    setWhatIncluded('');
    setTags('');
    setDifficulty('');
    setTargetAudience('');
    setLearningOutcomes('');
    setPageCount('');
    setEstimatedTime('');
    setAdminReview('');
    setQualityIndicators([]);
    setLastUpdatedDate(new Date().toISOString().split('T')[0]);
    setIsFeatured(false);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditProduct = (p: any) => {
    setEditingId(p.id);
    setTitle(p.title || '');
    setCategory(p.category || '');
    setSubcategory(p.subcategory || '');
    setCustomCategoryInput('');
    setCustomSubcategoryInput('');
    setPrice(p.price || 0);
    setOriginalPrice(p.originalPrice || 0);
    setReviewsCount(p.reviewsCount || getRandomReviews());
    const isDraft = p.status === 'Draft' || p.isPublished === false;
    setStatus(isDraft ? 'Draft' : 'Published');
    setCardDescription(p.cardDescription || p.shortDescription || p.description || '');
    setStepDescription(p.stepDescription || p.detailedDescription || p.description || '');
    
    const existingThumb = p.thumbnail || '';
    if (existingThumb.startsWith('/uploads/') || existingThumb.startsWith('uploads/')) {
      setUploadedThumbnailUrl(existingThumb);
      setCustomThumbnailUrl('');
    } else {
      setUploadedThumbnailUrl('');
      setCustomThumbnailUrl(existingThumb);
    }
    if (instantThumbnailPreview) {
      URL.revokeObjectURL(instantThumbnailPreview);
    }
    setInstantThumbnailPreview(null);
    setUploadProgressThumbnail(0);
    setFileFormat(p.fileFormat || 'PDF');
    setDigitalFile(p.digitalFile || '');
    setDigitalFileName(p.digitalFile ? p.digitalFile.split('/').pop() || p.digitalFile : '');
    setSupabasePdfUrl(p.supabasePdfUrl || '');
    setUploadProgressDigitalFile(0);
    setGithubRepoUrl(p.githubRepoUrl || '');
    setLiveDemoUrl(p.liveDemoUrl || '');
    setTechStack(Array.isArray(p.techStack) ? p.techStack.join(', ') : (p.techStack || ''));
    setWhatIncluded(Array.isArray(p.whatIncluded) ? p.whatIncluded.join(', ') : (p.whatIncluded || ''));
    setTags(Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''));
    setDifficulty(p.difficulty || '');
    setTargetAudience(p.targetAudience || '');
    setLearningOutcomes(Array.isArray(p.learningOutcomes) ? p.learningOutcomes.join('\n') : (p.learningOutcomes || ''));
    setPageCount(p.pageCount !== undefined ? p.pageCount : '');
    setEstimatedTime(p.estimatedTime || '');
    setAdminReview(p.adminReview || '');
    setQualityIndicators(Array.isArray(p.qualityIndicators) ? p.qualityIndicators : []);
    setLastUpdatedDate(p.lastUpdatedDate || (p.updatedAt ? p.updatedAt.split('T')[0] : new Date().toISOString().split('T')[0]));
    setIsFeatured(Boolean(p.isFeatured));
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isThumbnail: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isThumbnail) {
      const allowedExts = ['.png', '.jpg', '.jpeg', '.webp'];
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedExts.includes(fileExt) && !file.type.startsWith('image/')) {
        showToast('Thumbnail must be a PNG, JPG, JPEG, or WEBP image.', 'error');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast(`Thumbnail image exceeds 5 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`, 'error');
        e.target.value = '';
        return;
      }

      try {
        if (instantThumbnailPreview) {
          URL.revokeObjectURL(instantThumbnailPreview);
        }
        const previewUrl = URL.createObjectURL(file);
        setInstantThumbnailPreview(previewUrl);
      } catch (prevErr) {
        console.warn('Could not generate instant object URL preview:', prevErr);
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        setUploadingThumbnail(true);
        setUploadProgressThumbnail(15);
        const res = await api.postFormData('/admin/upload', formData, (percent) => {
          setUploadProgressThumbnail(percent);
        });

        const uploadedUrl = res.data?.url || res.data?.fileUrl;
        if (res.success && uploadedUrl) {
          setUploadedThumbnailUrl(uploadedUrl);
          showToast('Thumbnail uploaded to storage!', 'success');
        } else {
          showToast(res.message || 'Thumbnail upload failed.', 'error');
        }
      } catch (err: any) {
        showToast(err.message || 'Thumbnail upload failed.', 'error');
      } finally {
        setUploadingThumbnail(false);
      }
    } else {
      const allowedExts = ['.pdf', '.zip', '.docx', '.pptx', '.csv', '.doc', '.ppt', '.rar', '.txt'];
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedExts.includes(fileExt)) {
        showToast(`Unsupported format "${fileExt}". Accepted: .pdf, .zip, .docx, .pptx, .csv`, 'error');
        e.target.value = '';
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        showToast(`File size exceeds 50 MB limit.`, 'error');
        e.target.value = '';
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        setUploadingDigitalFile(true);
        setUploadProgressDigitalFile(15);
        const res = await api.postFormData('/admin/upload', formData, (percent) => {
          setUploadProgressDigitalFile(percent);
        });

        const uploadedFilename = res.data?.digitalFile || res.data?.filename || (res.data?.url ? res.data.url.split('/').pop() : file.name);
        if (res.success && uploadedFilename) {
          setDigitalFile(uploadedFilename);
          setDigitalFileName(file.name);
          if (res.data?.supabaseUrl || res.data?.fileUrl) {
            setSupabasePdfUrl(res.data.supabaseUrl || res.data.fileUrl);
          }
          showToast(`Digital resource "${file.name}" uploaded to secure storage!`, 'success');
        } else {
          showToast(res.message || 'Digital resource upload failed.', 'error');
        }
      } catch (err: any) {
        showToast(err.message || 'Digital resource upload failed.', 'error');
      } finally {
        setUploadingDigitalFile(false);
      }
    }
  };

  const handleToggleQualityIndicator = (indicator: string) => {
    setQualityIndicators(prev => 
      prev.includes(indicator) ? prev.filter(i => i !== indicator) : [...prev, indicator]
    );
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingDigitalFile || uploadingThumbnail) {
      showToast('Please wait for file uploads to complete.', 'info');
      return;
    }

    const finalCategory = (customCategoryInput.trim() || category.trim());
    if (!finalCategory) {
      showToast('Please select or specify a Main Category.', 'error');
      return;
    }

    const finalSubcategory = (customSubcategoryInput.trim() || subcategory.trim());

    setSaving(true);
    try {
      const finalThumbnail = uploadedThumbnailUrl.trim() || customThumbnailUrl.trim() || '';

      const outcomesArray = learningOutcomes
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);

      const payload = {
        title: title.trim(),
        category: finalCategory,
        subcategory: finalSubcategory || undefined,
        status,
        isPublished: status === 'Published',
        price: Number(price),
        originalPrice: Number(originalPrice),
        discountPercent: originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
        reviewsCount: Number(reviewsCount) || getRandomReviews(),
        cardDescription: cardDescription.trim(),
        shortDescription: cardDescription.trim(),
        stepDescription: stepDescription.trim(),
        detailedDescription: stepDescription.trim(),
        description: stepDescription.trim() || cardDescription.trim(),
        thumbnail: finalThumbnail,
        supabaseThumbnailUrl: finalThumbnail.startsWith('http') ? finalThumbnail : undefined,
        digitalFile: digitalFile ? digitalFile.split('/').pop() : undefined,
        supabasePdfUrl: supabasePdfUrl || undefined,
        difficulty: difficulty || undefined,
        targetAudience: targetAudience.trim() || undefined,
        learningOutcomes: outcomesArray,
        pageCount: pageCount !== '' ? Number(pageCount) : undefined,
        estimatedTime: estimatedTime.trim() || undefined,
        adminReview: adminReview.trim() || undefined,
        qualityIndicators,
        lastUpdatedDate: lastUpdatedDate || undefined,
        isFeatured,
        githubRepoUrl: githubRepoUrl.trim() || undefined,
        liveDemoUrl: liveDemoUrl.trim() || undefined,
        techStack: techStack.split(',').map(s => s.trim()).filter(Boolean),
        whatIncluded: whatIncluded.split(',').map(item => item.trim()).filter(Boolean),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        fileFormat: fileFormat || 'PDF'
      };

      if (editingId) {
        await api.put(`/admin/products/${editingId}`, payload);
        showToast('Product updated successfully!', 'success');
      } else {
        await api.post('/admin/products', payload);
        showToast('Product saved successfully!', 'success');
      }

      setIsModalOpen(false);
      resetForm();
      fetchInitialData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalProduct) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/products/${deleteModalProduct.id}?permanent=true`);
      showToast(`Product "${deleteModalProduct.title}" permanently deleted from catalog and storage.`, 'success');
      setDeleteModalProduct(null);
      fetchInitialData();
    } catch (e: any) {
      showToast(e.message || 'Delete failed', 'error');
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

      <main className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="tag" style={{ background: '#C9F7E8', marginBottom: '8px' }}>Admin Management</span>
            <h1 className="d" style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800 }}>Store Products & Notes CMS</h1>
            <p className="mu" style={{ fontSize: '15px' }}>Complete manual control over titles, dynamic categories, pricing, target audiences, and transparency badges.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={handleExportBackup} className="btn y btn-sm" title="Download catalog backup JSON">
              <Download size={15} /> Export Backup
            </button>
            <label className="btn btn-sm" style={{ cursor: 'pointer', margin: 0 }} title="Restore catalog from JSON file">
              <Upload size={15} /> {restoring ? 'Restoring...' : 'Restore Backup'}
              <input type="file" accept=".json" onChange={handleRestoreBackup} style={{ display: 'none' }} disabled={restoring} />
            </label>
            <button onClick={handleOpenAddModal} className="btn v btn-sm">
              <Plus size={16} /> Add New Store Product
            </button>
          </div>
        </div>

        {/* Persistence Notice */}
        <div className="pop" style={{ marginBottom: '1.5rem', background: '#FFFFFF', borderRadius: '20px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--lavender-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--ink)' }}>
              <Database size={18} color="var(--purple)" />
            </div>
            <span style={{ fontSize: '14px', color: 'var(--ink)' }}>
              <strong>Permanent File Storage Vault:</strong> All {activeProducts.length} verified products are preserved in <code>server/data/store/products.json</code>. No categories or subcategories are automatically assigned.
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
            Click <strong>Export Backup</strong> for offline snapshots.
          </span>
        </div>

        {/* Search & Dynamic Category Filter Controls */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 260px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search products by title or slug..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input"
              style={{ paddingLeft: '36px' }}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ flex: '0 0 auto' }}>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="select"
              style={{ minWidth: '180px' }}
            >
              <option value="All">All Categories ({activeProducts.length})</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
            Showing {filteredAdminProducts.length} of {activeProducts.length} products
          </div>
        </div>

        {/* Products Table */}
        <div className="data-table-wrapper pop">
          {loading ? (
            <div style={{ padding: '2rem' }}>
              <SkeletonLoader rows={4} height="44px" />
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product Title & Subcategory</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Format</th>
                  <th>Difficulty & Target</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdminProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {p.isFeatured && (
                          <span title="Featured on Homepage" style={{ color: '#F59E0B' }}>⭐</span>
                        )}
                        <strong style={{ color: 'var(--text-primary)' }}>{p.title}</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        /store/{p.slug} {p.subcategory ? `• Subcategory: ${p.subcategory}` : ''}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', marginTop: '3px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        📇 {p.cardDescription || p.shortDescription || p.description}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-purple">{p.category}</span>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                      {p.price === 0 ? 'FREE' : `₹${p.price}`}
                    </td>
                    <td><span className="badge badge-cyan">{p.fileFormat || 'PDF'}</span></td>
                    <td style={{ fontSize: '12.5px', color: '#64748B' }}>
                      {p.difficulty && <span className="badge" style={{ background: '#F1F5F9', color: '#0F172A', marginRight: '4px' }}>{p.difficulty}</span>}
                      {p.targetAudience ? p.targetAudience : '—'}
                    </td>
                    <td>
                      {(p.status === 'Draft' || p.isPublished === false) ? (
                        <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <EyeOff size={12} /> Draft
                        </span>
                      ) : (
                        <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Eye size={12} /> Published
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                        <button onClick={() => handleEditProduct(p)} className="btn-icon" title="Edit Product" style={{ color: 'var(--color-cyan)' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setDeleteModalProduct(p)} className="btn-icon" title="Delete Product" style={{ color: 'var(--color-rose)' }}>
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

      {/* Product Add/Edit Modal (Complete Manual Control) */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content modal-content-lg" onClick={e => e.stopPropagation()} style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', fontWeight: 800 }}>
              {editingId ? 'Edit Store Product / Notes' : 'Publish New Store Product (Manual Control)'}
            </h3>
            <form onSubmit={handleSaveProduct}>
              
              {/* 1. Visibility & Featured Switch */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="radio" 
                      name="statusRadio" 
                      checked={status === 'Published'} 
                      onChange={() => setStatus('Published')} 
                    />
                    <span style={{ color: 'var(--color-emerald)', fontWeight: 700 }}>🟢 Published (Live on Store)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="radio" 
                      name="statusRadio" 
                      checked={status === 'Draft'} 
                      onChange={() => setStatus('Draft')} 
                    />
                    <span style={{ color: 'var(--color-amber)', fontWeight: 700 }}>🟡 Draft (Hidden from Public Store)</span>
                  </label>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    checked={isFeatured} 
                    onChange={e => setIsFeatured(e.target.checked)} 
                  />
                  <span style={{ fontWeight: 700 }}>⭐ Featured Product</span>
                </label>
              </div>

              {/* 2. Title */}
              <div className="form-group">
                <label className="form-label">Product / Notes Title *</label>
                <input 
                  type="text" 
                  className="input" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="e.g. Complete System Design & Microservices Handout" 
                  required 
                />
              </div>

              {/* 3. Dynamic Category & Subcategory */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Main Category * (Select or Type New)</label>
                  <select 
                    className="select" 
                    value={category} 
                    onChange={e => {
                      setCategory(e.target.value);
                      setSubcategory('');
                    }}
                  >
                    <option value="">-- Select Main Category --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="__custom__">+ Add Custom Category...</option>
                  </select>
                  {category === '__custom__' && (
                    <input 
                      type="text" 
                      className="input" 
                      style={{ marginTop: '8px' }} 
                      placeholder="Type custom category name..." 
                      value={customCategoryInput} 
                      onChange={e => setCustomCategoryInput(e.target.value)} 
                    />
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Subcategory (Optional - Depends on Category)</label>
                  <select 
                    className="select" 
                    value={subcategory} 
                    onChange={e => setSubcategory(e.target.value)}
                  >
                    <option value="">No Subcategory (None)</option>
                    {availableSubcategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                    <option value="__custom_sub__">+ Type Custom Subcategory...</option>
                  </select>
                  {subcategory === '__custom_sub__' && (
                    <input 
                      type="text" 
                      className="input" 
                      style={{ marginTop: '8px' }} 
                      placeholder="Type custom subcategory..." 
                      value={customSubcategoryInput} 
                      onChange={e => setCustomSubcategoryInput(e.target.value)} 
                    />
                  )}
                </div>
              </div>

              {/* 4. Pricing */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Selling Price (₹) * (Enter 0 for Free)</label>
                  <input 
                    type="number" 
                    className="input" 
                    value={price} 
                    onChange={e => setPrice(Number(e.target.value))} 
                    min={0} 
                    required 
                  />
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    {price === 0 ? '✨ This resource will be displayed as FREE to students.' : `Will sell at ₹${price}`}
                  </span>
                </div>
                <div className="form-group">
                  <label className="form-label">Original Strikethrough Price (₹)</label>
                  <input 
                    type="number" 
                    className="input" 
                    value={originalPrice} 
                    onChange={e => setOriginalPrice(Number(e.target.value))} 
                    min={0} 
                  />
                </div>
              </div>

              {/* 5. Descriptions */}
              <div className="form-group">
                <label className="form-label">Short Summary (1–2 lines shown on Store Card) *</label>
                <textarea 
                  className="textarea" 
                  rows={2} 
                  value={cardDescription} 
                  onChange={e => setCardDescription(e.target.value)} 
                  placeholder="Concise overview explaining why this resource helps students..." 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Content Breakdown / Syllabus *</label>
                <textarea 
                  className="textarea" 
                  rows={5} 
                  value={stepDescription} 
                  onChange={e => setStepDescription(e.target.value)} 
                  placeholder="Comprehensive chapter breakdown, step-by-step topics, and modules..." 
                  required 
                />
              </div>

              {/* 6. Target Audience & Learning Outcomes */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Target Audience / Who Should Use This?</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={targetAudience} 
                    onChange={e => setTargetAudience(e.target.value)} 
                    placeholder="e.g. 3rd & 4th Year B.Tech, Off-campus placement applicants" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Estimated Learning Time (Optional)</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={estimatedTime} 
                    onChange={e => setEstimatedTime(e.target.value)} 
                    placeholder="e.g. 4-6 Hours, 3 Days Intensive" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Learning Outcomes / What You Will Learn (One per line)</label>
                <textarea 
                  className="textarea" 
                  rows={3} 
                  value={learningOutcomes} 
                  onChange={e => setLearningOutcomes(e.target.value)} 
                  placeholder="Master BFS & DFS recurrence trees&#10;Solve top 50 FAANG graph problems&#10;Avoid common off-by-one complexity errors" 
                />
              </div>

              {/* 7. Difficulty & Format & Pages & Last Updated */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Difficulty Level</label>
                  <select 
                    className="select" 
                    value={difficulty} 
                    onChange={e => setDifficulty(e.target.value)}
                  >
                    <option value="">Not Specified (None)</option>
                    <option value="Beginner">Beginner Friendly</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced / Expert</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">File Format</label>
                  <select 
                    className="select" 
                    value={fileFormat} 
                    onChange={e => setFileFormat(e.target.value)}
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="ZIP">ZIP Archive (Code/Source)</option>
                    <option value="DOCX">DOCX Word Document</option>
                    <option value="PPTX">PPTX Presentation</option>
                    <option value="CSV">CSV Data File</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Number of Pages (Optional)</label>
                  <input 
                    type="number" 
                    className="input" 
                    value={pageCount} 
                    onChange={e => setPageCount(e.target.value ? Number(e.target.value) : '')} 
                    placeholder="e.g. 185" 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Last Maintained / Updated Date</label>
                  <input 
                    type="date" 
                    className="input" 
                    value={lastUpdatedDate} 
                    onChange={e => setLastUpdatedDate(e.target.value)} 
                  />
                </div>
              </div>

              {/* 8. Quality & Transparency Badges */}
              <div className="form-group" style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <label className="form-label" style={{ fontWeight: 800, marginBottom: '8px' }}>
                  Quality & Transparency Indicators (Only checked items will be displayed)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                  {QUALITY_INDICATOR_OPTIONS.map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                      <input 
                        type="checkbox" 
                        checked={qualityIndicators.includes(opt)} 
                        onChange={() => handleToggleQualityIndicator(opt)} 
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 9. Editorial Recommendation / Trust Message */}
              <div className="form-group">
                <label className="form-label">Admin's Editorial Recommendation / Trust Message (Optional)</label>
                <textarea 
                  className="textarea" 
                  rows={2} 
                  value={adminReview} 
                  onChange={e => setAdminReview(e.target.value)} 
                  placeholder="e.g. Recommended for students preparing for campus hiring rounds with TCS, Infosys, and Amazon." 
                />
                <span style={{ fontSize: '11px', color: '#64748B' }}>
                  Displayed transparently on the detail page as an editorial instructor note.
                </span>
              </div>

              {/* 10. File & Thumbnail Uploads */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Digital Resource File (.pdf, .zip, .docx, .pptx, .csv)</label>
                  <input 
                    type="file" 
                    className="input" 
                    onChange={e => handleFileUpload(e, false)} 
                    disabled={uploadingDigitalFile} 
                  />
                  {uploadingDigitalFile && (
                    <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--color-cyan)' }}>
                      Uploading file... {uploadProgressDigitalFile}%
                    </div>
                  )}
                  {digitalFileName && (
                    <div style={{ fontSize: '12px', color: 'var(--color-emerald)', marginTop: '4px' }}>
                      ✓ File loaded: {digitalFileName}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Thumbnail Image (Upload or URL)</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="input" 
                    onChange={e => handleFileUpload(e, true)} 
                    disabled={uploadingThumbnail} 
                  />
                  <input 
                    type="text" 
                    className="input" 
                    style={{ marginTop: '6px' }} 
                    value={customThumbnailUrl} 
                    onChange={e => setCustomThumbnailUrl(e.target.value)} 
                    placeholder="Or enter custom image URL" 
                  />
                  {(instantThumbnailPreview || uploadedThumbnailUrl || customThumbnailUrl) && (
                    <div style={{ marginTop: '8px', width: '80px', height: '50px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                      <img 
                        src={instantThumbnailPreview || getAssetUrl(uploadedThumbnailUrl || customThumbnailUrl)} 
                        alt="Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={handleImageError} 
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 11. Tags & What is Included */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">What is Included (Comma-separated)</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={whatIncluded} 
                    onChange={e => setWhatIncluded(e.target.value)} 
                    placeholder="Visual PDF, Pattern Cheat Sheets, Solved Problems" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Product Search Tags (Comma-separated)</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={tags} 
                    onChange={e => setTags(e.target.value)} 
                    placeholder="DSA, Python, Campus Placement, Interview" 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ minWidth: '160px' }}>
                  {saving ? 'Saving...' : (editingId ? 'Update Product' : 'Save Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Dialog */}
      {deleteModalProduct && (
        <div className="modal-overlay" onClick={() => setDeleteModalProduct(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle size={22} color="var(--color-rose)" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Permanently Delete Product?
              </h3>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Are you sure you want to permanently delete <strong>"{deleteModalProduct.title}"</strong>?
              <br /><br />
              This will permanently remove its metadata from <code>products.json</code> and delete its uploaded PDF/document and thumbnail files from storage. This cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setDeleteModalProduct(null)}
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
                {deleting ? 'Deleting...' : 'Yes, Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;
