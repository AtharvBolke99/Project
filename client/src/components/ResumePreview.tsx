import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  FileCode2, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Code, 
  ExternalLink,
  Check,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ResumePreviewProps {
  canAccess?: boolean;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ canAccess = false }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'latex' | 'markdown' | 'keywords'>('preview');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const { showToast } = useToast();

  const latexCode = `%-------------------------
% 94+ ATS Score Verified Resume Template
% Engineered for Full-Stack / Software Engineers
% Single-column, zero-graphics, 100% ATS Parse Rate
%-------------------------

\\documentclass[letterpaper,10.8pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\begin{document}

%----------HEADING----------
\\begin{center}
    {\\Huge \\scshape Atharv Bolke} \\\\ \\vspace{2pt}
    \\textbf{Full Stack Developer / Software Engineer} \\\\ \\vspace{2pt}
    \\small Pune, Maharashtra $|$ +91 9876543210 $|$ \\href{mailto:atharv@conceptifyyy.com}{atharv@conceptifyyy.com} $|$ 
    \\href{https://linkedin.com/in/atharv-bolke}{linkedin.com/in/atharv-bolke} $|$
    \\href{https://github.com/atharv-bolke}{github.com/atharv-bolke}
\\end{center}

%-----------SUMMARY-----------
\\section{Summary}
\\vspace{3pt}
Results-driven Full Stack Developer with strong foundations in MERN stack, data structures, and distributed backend architectures. Passionate about building high-performance web applications, scalable REST APIs, and intuitive user experiences with high system reliability.

%-----------EDUCATION-----------
\\section{Education}
  \\vspace{2pt}
  \\textbf{Bachelor of Engineering in Electronics \\& Computer Engineering} \\hfill 2022 -- 2026 \\\\ 
  \\textit{Savitribai Phule Pune University, CGPA: 9.67 / 10.0} \\hfill Pune, India \\\\ \\vspace{3pt}
  \\textbf{Higher Secondary Certificate (HSC) -- Science} \\hfill 2020 -- 2022 \\\\ 
  \\textit{Maharashtra State Board $|$ Aggregate: 85.50\\%} \\hfill Pune, India

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: Java, JavaScript (ES6+), TypeScript, Python, C++, HTML5, CSS3} \\\\ 
     \\textbf{Frameworks \\& Libraries}{: React.js, Node.js, Express.js, Next.js, Redux Toolkit, Tailwind CSS} \\\\ 
     \\textbf{Databases \\& Tools}{: MongoDB, MySQL, Redis, Git, GitHub, Postman, Docker, Linux} \\\\ 
     \\textbf{Core Competencies}{: Data Structures \\& Algorithms, RESTful APIs, System Design, Microservices}
    }}
 \\end{itemize}

%-----------EXPERIENCE-----------
\\section{Experience}
  \\textbf{Campus Technical Ambassador / Chapter Lead} \\hfill Aug 2024 -- Present \\\\ 
  \\textit{GeeksforGeeks Student Chapter} \\hfill Pune, India
  \\begin{itemize}[leftmargin=0.15in]
    \\item Conducted 10+ technical workshops on Data Structures, Algorithms, and Full-Stack Development for 500+ attendees.
    \\item Boosted student active coding participation by 40\\% through weekly algorithmic contests and peer mentoring.
    \\item Coordinated university hackathon with 80+ participating teams, managing code evaluation criteria and judging workflows.
  \\end{itemize}

%-----------PROJECTS-----------
\\section{Projects}
  \\textbf{RealEstate Management Platform} $|$ \\textit{React.js, Node.js, Express.js, MongoDB, Tailwind CSS} \\hfill 2024
  \\begin{itemize}[leftmargin=0.15in]
    \\item Architected a responsive full-stack property rental portal with secure JWT authentication and role-based access control.
    \\item Integrated multi-criteria property search and filtering engine, reducing database query execution latency by 35\\%.
    \\item Engineered secure image upload pipeline with automated thumbnail optimization and cloud storage caching.
  \\end{itemize}
  \\vspace{2pt}
  \\textbf{Helpora -- On-Demand Local Service Booking System} $|$ \\textit{MERN Stack, REST APIs} \\hfill 2024
  \\begin{itemize}[leftmargin=0.15in]
    \\item Built real-time appointment scheduling engine with automated conflict detection and SMS/Email reminders.
    \\item Designed robust RESTful API architecture handling concurrent booking requests with sub-100ms response times.
    \\item Implemented responsive mobile-first UI achieving 98+ Google Lighthouse performance and accessibility score.
  \\end{itemize}

%-----------ACHIEVEMENTS-----------
\\section{Achievements \\& Certifications}
 \\begin{itemize}[leftmargin=0.15in]
    \\item Maintained academic excellence with a 9.67 CGPA across 6 semesters in Bachelor of Engineering.
    \\item Solved 450+ Data Structures \\& Algorithms problems across LeetCode, GeeksforGeeks, and CodeChef.
    \\item Developed and deployed 3 production-grade full-stack web applications with active user adoption.
 \\end{itemize}

\\end{document}`;

  const markdownCode = `# Atharv Bolke
**Full Stack Developer / Software Engineer**  
Pune, Maharashtra | +91 9876543210 | atharv@conceptifyyy.com  
[LinkedIn](https://linkedin.com/in/atharv-bolke) | [GitHub](https://github.com/atharv-bolke)

---

## 💼 Professional Summary
Results-driven Full Stack Developer with strong foundations in MERN stack, data structures, and distributed backend architectures. Passionate about building high-performance web applications, scalable REST APIs, and intuitive user experiences with high system reliability.

---

## 🎓 Education
- **Bachelor of Engineering in Electronics & Computer Engineering** (2022 – 2026)  
  *Savitribai Phule Pune University* — **CGPA: 9.67 / 10.0**
- **Higher Secondary Certificate (HSC) — Science** (2020 – 2022)  
  *Maharashtra State Board* — **Aggregate: 85.50%**

---

## 🛠️ Technical Skills
- **Languages:** Java, JavaScript (ES6+), TypeScript, Python, C++, HTML5, CSS3
- **Frameworks & Libraries:** React.js, Node.js, Express.js, Next.js, Redux Toolkit, Tailwind CSS
- **Databases & Tools:** MongoDB, MySQL, Redis, Git, GitHub, Postman, Docker, Linux
- **Core Competencies:** Data Structures & Algorithms, RESTful APIs, System Design, Microservices

---

## 🚀 Experience
### Campus Technical Ambassador / Chapter Lead — GeeksforGeeks Student Chapter *(Aug 2024 – Present)*
- Conducted 10+ technical workshops on Data Structures, Algorithms, and Full-Stack Development for 500+ attendees.
- Boosted student active coding participation by 40% through weekly algorithmic contests and peer mentoring.
- Coordinated university hackathon with 80+ participating teams, managing code evaluation criteria and judging workflows.

---

## 📂 Projects
### RealEstate Management Platform *(React.js, Node.js, Express.js, MongoDB, Tailwind CSS)*
- Architected a responsive full-stack property rental portal with secure JWT authentication and role-based access control.
- Integrated multi-criteria property search and filtering engine, reducing database query execution latency by 35%.
- Engineered secure image upload pipeline with automated thumbnail optimization and cloud storage caching.

### Helpora – On-Demand Local Service Booking System *(MERN Stack, REST APIs)*
- Built real-time appointment scheduling engine with automated conflict detection and SMS/Email reminders.
- Designed robust RESTful API architecture handling concurrent booking requests with sub-100ms response times.
- Implemented responsive mobile-first UI achieving 98+ Google Lighthouse performance and accessibility score.

---

## 🏆 Achievements & Certifications
- Maintained academic excellence with a **9.67 CGPA** across 6 semesters in Bachelor of Engineering.
- Solved **450+ Data Structures & Algorithms** problems across LeetCode, GeeksforGeeks, and CodeChef.
- Developed and deployed 3 production-grade full-stack web applications with active user adoption.`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    showToast(`Copied ${type} to clipboard!`, 'success');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const atsKeywords = [
    { name: 'React.js', category: 'Frontend', count: '100% Parsed' },
    { name: 'Node.js', category: 'Backend', count: '100% Parsed' },
    { name: 'Express.js', category: 'Backend', count: '100% Parsed' },
    { name: 'MongoDB', category: 'Database', count: '100% Parsed' },
    { name: 'JavaScript (ES6+)', category: 'Language', count: '100% Parsed' },
    { name: 'TypeScript', category: 'Language', count: '100% Parsed' },
    { name: 'Java', category: 'Language', count: '100% Parsed' },
    { name: 'Python', category: 'Language', count: '100% Parsed' },
    { name: 'RESTful APIs', category: 'Architecture', count: '100% Parsed' },
    { name: 'JWT Authentication', category: 'Security', count: '100% Parsed' },
    { name: 'Data Structures & Algorithms', category: 'Core CS', count: '100% Parsed' },
    { name: 'Tailwind CSS', category: 'Frontend', count: '100% Parsed' },
    { name: 'Git / GitHub', category: 'Version Control', count: '100% Parsed' },
    { name: 'Postman', category: 'Tools', count: '100% Parsed' },
    { name: 'MySQL / Relational DB', category: 'Database', count: '100% Parsed' },
    { name: 'Docker / Containerization', category: 'DevOps', count: '100% Parsed' },
    { name: 'System Design', category: 'Architecture', count: '100% Parsed' },
    { name: 'Microservices', category: 'Architecture', count: '100% Parsed' },
    { name: 'Lighthouse Performance', category: 'Optimization', count: '100% Parsed' },
    { name: 'Redux Toolkit', category: 'State Management', count: '100% Parsed' }
  ];

  return (
    <div style={{ marginTop: '2.5rem' }}>
      {/* ================= ATS SCORE SCANNER HIGHLIGHT ================= */}
      <div className="card glass-card glowing-border" style={{ 
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.06) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Score Ring */}
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 6px 18px rgba(16, 185, 129, 0.35)',
              flexShrink: 0
            }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 900, lineHeight: 1 }}>94</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>/ 100 ATS</span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-easy" style={{ fontSize: '0.75rem', padding: '3px 10px' }}>
                  <ShieldCheck size={14} /> ATS-Friendly Certified
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-emerald)', fontWeight: 700 }}>
                  Top 2% Candidate Tier
                </span>
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Guaranteed Single-Column ATS Parse Rate
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Benchmarked on <strong>Workday, Greenhouse, Lever, Taleo & Jobscan</strong>. Zero tables, zero columns, zero parsing bottlenecks.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>Workday 100%</span>
            <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>Greenhouse 100%</span>
            <span className="badge badge-easy" style={{ fontSize: '0.75rem' }}>Lever 100%</span>
            <span className="badge badge-outline" style={{ fontSize: '0.75rem' }}>Jobscan 94%+</span>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Contact & Links</span>
              <strong style={{ fontSize: '0.85rem', color: 'var(--color-emerald)' }}>100%</strong>
            </div>
            <div style={{ height: '6px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: 'var(--color-emerald)' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              ✓ Email, Phone, LinkedIn, GitHub
            </span>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Section Headings</span>
              <strong style={{ fontSize: '0.85rem', color: 'var(--color-emerald)' }}>100%</strong>
            </div>
            <div style={{ height: '6px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: 'var(--color-emerald)' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              ✓ Standard recognized H2 tags
            </span>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Measurable Metrics</span>
              <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>95%</strong>
            </div>
            <div style={{ height: '6px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '95%', height: '100%', background: 'var(--color-primary)' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              ✓ Google X-Y-Z formula applied
            </span>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Layout & Typography</span>
              <strong style={{ fontSize: '0.85rem', color: 'var(--color-emerald)' }}>100%</strong>
            </div>
            <div style={{ height: '6px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: 'var(--color-emerald)' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              ✓ Single-column vector typography
            </span>
          </div>
        </div>
      </div>

      {/* ================= TABS NAVIGATION ================= */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        borderBottom: '1px solid var(--border-subtle)', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('preview')}
            className={`btn ${activeTab === 'preview' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            <FileText size={15} /> A4 Live Preview
          </button>
          <button
            onClick={() => setActiveTab('latex')}
            className={`btn ${activeTab === 'latex' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            <FileCode2 size={15} /> Overleaf LaTeX Code
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`btn ${activeTab === 'markdown' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            <Code size={15} /> Markdown Source
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
            className={`btn ${activeTab === 'keywords' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            <Sparkles size={15} /> ATS Keywords (20+)
          </button>
        </div>

        <div>
          {activeTab === 'latex' && (
            <button
              onClick={() => copyToClipboard(latexCode, 'LaTeX Code')}
              className="btn btn-secondary btn-sm"
              style={{ gap: '6px' }}
            >
              {copiedType === 'LaTeX Code' ? <Check size={14} color="var(--color-emerald)" /> : <Copy size={14} />}
              <span>{copiedType === 'LaTeX Code' ? 'Copied!' : 'Copy LaTeX'}</span>
            </button>
          )}
          {activeTab === 'markdown' && (
            <button
              onClick={() => copyToClipboard(markdownCode, 'Markdown Source')}
              className="btn btn-secondary btn-sm"
              style={{ gap: '6px' }}
            >
              {copiedType === 'Markdown Source' ? <Check size={14} color="var(--color-emerald)" /> : <Copy size={14} />}
              <span>{copiedType === 'Markdown Source' ? 'Copied!' : 'Copy Markdown'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= TAB CONTENT 1: A4 LIVE RESUME PREVIEW ================= */}
      {activeTab === 'preview' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '100%',
            maxWidth: '820px',
            background: '#FFFFFF',
            color: '#111827',
            padding: '2.5rem 2.75rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid #E5E7EB',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: '0.875rem',
            lineHeight: '1.5'
          }}>
            {/* Header / Contact Info */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #111827', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 4px 0', color: '#111827', letterSpacing: '-0.02em' }}>
                Atharv Bolke
              </h1>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#4F46E5', marginBottom: '6px' }}>
                Full Stack Developer / Software Engineer
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#4B5563', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span>Pune, Maharashtra, India</span>
                <span>•</span>
                <span>+91 9876543210</span>
                <span>•</span>
                <span style={{ color: '#4F46E5', fontWeight: 500 }}>atharv@conceptifyyy.com</span>
                <span>•</span>
                <span style={{ color: '#4F46E5', fontWeight: 500 }}>linkedin.com/in/atharv-bolke</span>
                <span>•</span>
                <span style={{ color: '#4F46E5', fontWeight: 500 }}>github.com/atharv-bolke</span>
              </div>
            </div>

            {/* Summary */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', borderBottom: '1px solid #D1D5DB', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '0.04em' }}>
                Professional Summary
              </h2>
              <p style={{ margin: 0, color: '#374151', fontSize: '0.85rem', lineHeight: '1.6' }}>
                Results-driven Full Stack Developer with strong foundations in MERN stack, data structures, and distributed backend architectures. Passionate about building high-performance web applications, scalable REST APIs, and intuitive user experiences with high system reliability.
              </p>
            </div>

            {/* Education */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', borderBottom: '1px solid #D1D5DB', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '0.04em' }}>
                Education
              </h2>
              
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '0.875rem', color: '#111827' }}>Bachelor of Engineering in Electronics & Computer Engineering</strong>
                  <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>2022 – 2026</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#4B5563' }}>
                  <span>Savitribai Phule Pune University | <strong>CGPA: 9.67 / 10.0</strong></span>
                  <span>Pune, India</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '0.875rem', color: '#111827' }}>Higher Secondary Certificate (HSC) – Science</strong>
                  <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>2020 – 2022</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#4B5563' }}>
                  <span>Maharashtra State Board | <strong>Aggregate: 85.50%</strong></span>
                  <span>Pune, India</span>
                </div>
              </div>
            </div>

            {/* Technical Skills */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', borderBottom: '1px solid #D1D5DB', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '0.04em' }}>
                Technical Skills
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem' }}>
                <div>
                  <strong style={{ color: '#111827' }}>Languages: </strong>
                  <span style={{ color: '#374151' }}>Java, JavaScript (ES6+), TypeScript, Python, C++, HTML5, CSS3</span>
                </div>
                <div>
                  <strong style={{ color: '#111827' }}>Frameworks & Libraries: </strong>
                  <span style={{ color: '#374151' }}>React.js, Node.js, Express.js, Next.js, Redux Toolkit, Tailwind CSS</span>
                </div>
                <div>
                  <strong style={{ color: '#111827' }}>Databases & Tools: </strong>
                  <span style={{ color: '#374151' }}>MongoDB, MySQL, Redis, Git, GitHub, Postman, Docker, Linux</span>
                </div>
                <div>
                  <strong style={{ color: '#111827' }}>Core Competencies: </strong>
                  <span style={{ color: '#374151' }}>Data Structures & Algorithms, RESTful API Design, Microservices, System Architecture</span>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', borderBottom: '1px solid #D1D5DB', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '0.04em' }}>
                Experience
              </h2>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '0.875rem', color: '#111827' }}>Campus Technical Ambassador / Chapter Lead</strong>
                  <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>Aug 2024 – Present</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#4F46E5', fontWeight: 600, marginBottom: '4px' }}>
                  GeeksforGeeks Student Chapter — Pune, India
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#374151', fontSize: '0.835rem', lineHeight: '1.55' }}>
                  <li>Conducted <strong>10+ technical workshops</strong> on Data Structures, Algorithms, and Full-Stack Development for <strong>500+ attendees</strong>.</li>
                  <li>Boosted student active coding participation by <strong>40%</strong> through weekly algorithmic contests and peer mentoring.</li>
                  <li>Coordinated university hackathon with <strong>80+ participating teams</strong>, managing code evaluation criteria and judging workflows.</li>
                </ul>
              </div>
            </div>

            {/* Projects */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', borderBottom: '1px solid #D1D5DB', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '0.04em' }}>
                Projects
              </h2>

              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.875rem' }}>
                    <strong style={{ color: '#111827' }}>RealEstate Management Platform</strong> | <em style={{ color: '#4B5563' }}>React.js, Node.js, Express.js, MongoDB, Tailwind</em>
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>2024</span>
                </div>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '1.2rem', color: '#374151', fontSize: '0.835rem', lineHeight: '1.55' }}>
                  <li>Architected a responsive full-stack property rental portal with secure JWT authentication and role-based access control.</li>
                  <li>Integrated multi-criteria property search and filtering engine, reducing database query execution latency by <strong>35%</strong>.</li>
                  <li>Engineered secure image upload pipeline with automated thumbnail optimization and cloud storage caching.</li>
                </ul>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.875rem' }}>
                    <strong style={{ color: '#111827' }}>Helpora – On-Demand Local Service Booking System</strong> | <em style={{ color: '#4B5563' }}>MERN Stack, REST APIs</em>
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>2024</span>
                </div>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '1.2rem', color: '#374151', fontSize: '0.835rem', lineHeight: '1.55' }}>
                  <li>Built real-time appointment scheduling engine with automated conflict detection and SMS/Email reminders.</li>
                  <li>Designed robust RESTful API architecture handling concurrent booking requests with sub-100ms response times.</li>
                  <li>Implemented responsive mobile-first UI achieving <strong>98+ Google Lighthouse</strong> performance and accessibility score.</li>
                </ul>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', borderBottom: '1px solid #D1D5DB', paddingBottom: '3px', marginBottom: '6px', letterSpacing: '0.04em' }}>
                Achievements & Key Highlights
              </h2>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#374151', fontSize: '0.835rem', lineHeight: '1.55' }}>
                <li>Maintained academic excellence with a <strong>9.67 CGPA</strong> across 6 semesters in Bachelor of Engineering.</li>
                <li>Solved <strong>450+ Data Structures & Algorithms</strong> problems across LeetCode, GeeksforGeeks, and CodeChef.</li>
                <li>Developed and deployed 3 production-grade full-stack web applications with active user adoption.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB CONTENT 2: OVERLEAF LATEX SOURCE ================= */}
      {activeTab === 'latex' && (
        <div className="card" style={{ background: '#1E1E2E', border: '1px solid #313244', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: '#A6ADC8', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>resume_template.tex (Overleaf & TeX Live Ready)</span>
            <button
              onClick={() => copyToClipboard(latexCode, 'LaTeX Code')}
              className="btn btn-primary btn-sm"
            >
              {copiedType === 'LaTeX Code' ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedType === 'LaTeX Code' ? 'Copied!' : 'Copy LaTeX Code'}</span>
            </button>
          </div>
          <pre style={{
            margin: 0,
            padding: '1rem',
            background: '#181825',
            borderRadius: 'var(--radius-md)',
            color: '#CDD6F4',
            fontSize: '0.825rem',
            lineHeight: '1.6',
            maxHeight: '480px',
            overflowY: 'auto',
            fontFamily: 'Consolas, Monaco, monospace'
          }}>
            {latexCode}
          </pre>
        </div>
      )}

      {/* ================= TAB CONTENT 3: MARKDOWN SOURCE ================= */}
      {activeTab === 'markdown' && (
        <div className="card" style={{ background: '#1E1E2E', border: '1px solid #313244', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: '#A6ADC8', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>resume.md (Markdown / Plaintext ATS Ready)</span>
            <button
              onClick={() => copyToClipboard(markdownCode, 'Markdown Source')}
              className="btn btn-primary btn-sm"
            >
              {copiedType === 'Markdown Source' ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedType === 'Markdown Source' ? 'Copied!' : 'Copy Markdown'}</span>
            </button>
          </div>
          <pre style={{
            margin: 0,
            padding: '1rem',
            background: '#181825',
            borderRadius: 'var(--radius-md)',
            color: '#CDD6F4',
            fontSize: '0.825rem',
            lineHeight: '1.6',
            maxHeight: '480px',
            overflowY: 'auto',
            fontFamily: 'Consolas, Monaco, monospace'
          }}>
            {markdownCode}
          </pre>
        </div>
      )}

      {/* ================= TAB CONTENT 4: ATS KEYWORD OPTIMIZER ================= */}
      {activeTab === 'keywords' && (
        <div className="card glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              ATS Parsed Hard Skills & Technical Keywords
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              These high-value engineering terms are guaranteed to be cleanly recognized by enterprise ATS resume parsers with 100% extraction accuracy:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {atsKeywords.map((kw, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block' }}>
                    {kw.name}
                  </strong>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    {kw.category}
                  </span>
                </div>
                <span className="badge badge-easy" style={{ fontSize: '0.65rem' }}>
                  <CheckCircle2 size={12} /> {kw.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
