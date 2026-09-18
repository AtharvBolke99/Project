import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderGit2, 
  Sparkles, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  Star, 
  Layers, 
  Download 
} from 'lucide-react';
import { api } from '../services/api';
import { SkeletonLoader } from '../components/SkeletonLoader';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/store/projects');
        if (res.success && res.data) {
          setProjects(res.data);
        }
      } catch (e) {
        console.error('Failed to load projects:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* Header Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <FolderGit2 size={22} color="var(--color-cyan)" />
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Engineering & Placement Projects Marketplace
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Complete full-stack source code, synopsis reports, viva presentations (PPT), and step-by-step setup guides.
          </p>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid-2">
            <SkeletonLoader rows={2} height="280px" />
          </div>
        ) : (
          <div className="grid-2">
            {projects.map(proj => (
              <div key={proj.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  height: '200px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: '1.25rem',
                  background: 'var(--bg-tertiary)'
                }}>
                  <img
                    src={proj.thumbnail}
                    alt={proj.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span className="badge badge-purple" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    Major Project
                  </span>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {proj.title}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', flex: 1, lineHeight: '1.6' }}>
                    {proj.cardDescription || proj.shortDescription || proj.description}
                  </p>

                  {/* Tech Stack tags */}
                  {proj.techStack?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '1.25rem' }}>
                      {proj.techStack.map((tech: string) => (
                        <span key={tech} className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price & Action */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: 'auto' }}>
                    <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                        ₹{proj.price}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-emerald)', fontWeight: 600 }}>
                        Includes Source Code + Synopsis + PPT
                      </span>
                    </div>

                    <Link to={`/store/${proj.slug}`} className="btn btn-primary btn-sm">
                      Get Project <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
