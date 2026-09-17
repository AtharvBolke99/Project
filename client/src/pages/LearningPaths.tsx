import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Code2, 
  BrainCircuit, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Layers, 
  Terminal, 
  Database, 
  Cloud, 
  ShieldCheck, 
  Smartphone, 
  Boxes, 
  Cpu,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  Award,
  TrendingUp,
  CheckSquare,
  Square,
  Zap,
  Building2
} from 'lucide-react';

interface Milestone {
  stage: string;
  title: string;
  duration: string;
  description: string;
  topics: string[];
  projects: string[];
}

interface DomainRoadmap {
  id: string;
  title: string;
  category: string;
  tagline: string;
  icon: any;
  color: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMonths: string;
  targetRoles: string[];
  salaryRange: string;
  salaryRangeINR: string;
  salaryRangeUSD: string;
  overview: string;
  milestones: Milestone[];
}

const DOMAIN_ROADMAPS: DomainRoadmap[] = [
  {
    id: 'full-stack',
    title: 'Full-Stack Web Development',
    category: 'Web Engineering',
    tagline: 'Master modern frontend, scalable backend architectures, databases, and cloud deployments.',
    icon: Code2,
    color: 'var(--color-cyan)',
    difficulty: 'Beginner',
    estimatedMonths: '6 - 9 Months',
    targetRoles: ['Full-Stack Engineer', 'Frontend Developer', 'Backend Developer', 'MERN Stack Specialist'],
    salaryRange: '₹12 - 28 LPA',
    salaryRangeINR: '₹12 - 28 LPA (₹1.0L - 2.3L/month)',
    salaryRangeUSD: '$85,000 - $145,000 / yr',
    overview: 'Complete end-to-end curriculum starting from foundational Web Standards (HTML5/CSS3/Modern JS) up to advanced single-page applications with React/Next.js, REST & GraphQL APIs, Node.js/Express, relational and NoSQL databases, authentication, and Docker deployments.',
    milestones: [
      {
        stage: 'Stage 1',
        title: 'Web Foundations & Modern JavaScript (ES6+)',
        duration: '4 Weeks',
        description: 'Master semantic HTML, CSS Grid/Flexbox, responsive design, asynchronous JavaScript, Promises, DOM manipulation, and Git version control.',
        topics: ['Semantic HTML5 & Accessibility (a11y)', 'Modern CSS3, Flexbox & CSS Grid', 'ES6+ JavaScript (Closures, Prototypes, Event Loop)', 'Async/Await & Fetch API', 'Git & GitHub Workflows'],
        projects: ['Interactive Portfolio Website', 'Responsive E-Commerce Landing Page', 'Real-Time Weather Dashboard with OpenWeatherMap API']
      },
      {
        stage: 'Stage 2',
        title: 'Modern Frontend with React & Next.js',
        duration: '6 Weeks',
        description: 'Build high-performance user interfaces using React 18+, Hooks, Context API, Redux/Zustand, Tailwind CSS, TypeScript, and Server-Side Rendering with Next.js.',
        topics: ['React Component Architecture & Virtual DOM', 'Custom Hooks (useEffect, useMemo, useCallback)', 'State Management (Zustand / Redux Toolkit)', 'TypeScript for React Applications', 'Next.js App Router & SSR/SSG'],
        projects: ['Full-Featured Kanban Task Manager', 'Social Media Feed with Infinite Scroll', 'SaaS Analytics Dashboard with Chart.js']
      },
      {
        stage: 'Stage 3',
        title: 'Backend Engineering, APIs & Authentication',
        duration: '6 Weeks',
        description: 'Design secure, high-throughput REST and GraphQL backend services using Node.js, Express.js, TypeScript, JWT auth, and middleware architectures.',
        topics: ['Node.js Event Loop & Streams', 'Express.js RESTful API Design', 'JWT, OAuth2 & Session Authentication', 'Role-Based Access Control (RBAC)', 'WebSockets & Real-Time Communication (Socket.io)'],
        projects: ['Multi-Tenant Blog Engine API', 'Real-Time Collaborative Chat System', 'E-Commerce Payment Gateway Integration with Razorpay/Stripe']
      },
      {
        stage: 'Stage 4',
        title: 'Database Architecture, Caching & Cloud Deployment',
        duration: '6 Weeks',
        description: 'Master data modeling with PostgreSQL, Prisma ORM, MongoDB, Redis caching, Docker containerization, CI/CD pipelines, and AWS/Vercel deployments.',
        topics: ['PostgreSQL & Relational Data Modeling', 'Prisma ORM & Database Migrations', 'MongoDB & Document Modeling', 'In-Memory Caching with Redis', 'Docker & GitHub Actions CI/CD'],
        projects: ['Full-Stack Production Marketplace', 'Distributed URL Shortener with Analytics', 'Automated DevOps Pipeline for Microservices']
      }
    ]
  },
  {
    id: 'data-science-ai',
    title: 'Data Science, AI & Machine Learning',
    category: 'Artificial Intelligence',
    tagline: 'From Python fundamentals and statistical modeling to Deep Learning, Computer Vision, and Generative AI.',
    icon: BrainCircuit,
    color: '#a855f7',
    difficulty: 'Intermediate',
    estimatedMonths: '8 - 12 Months',
    targetRoles: ['Data Scientist', 'Machine Learning Engineer', 'AI Research Assistant', 'Data Analyst'],
    salaryRange: '₹15 - 35 LPA',
    salaryRangeINR: '₹15 - 35 LPA (₹1.25L - 2.9L/month)',
    salaryRangeUSD: '$95,000 - $165,000 / yr',
    overview: 'Comprehensive AI pathway covering mathematical foundations (Linear Algebra, Calculus, Probability), Python data manipulation with NumPy & Pandas, classical Supervised & Unsupervised Machine Learning, PyTorch Deep Learning, NLP, and modern LLM Fine-Tuning.',
    milestones: [
      {
        stage: 'Stage 1',
        title: 'Mathematics, Statistics & Python for Data Science',
        duration: '6 Weeks',
        description: 'Solidify mathematical and programming fundamentals essential for understanding learning algorithms.',
        topics: ['Linear Algebra (Vectors, Matrices, Eigenvalues)', 'Multivariable Calculus & Gradients', 'Descriptive & Inferential Statistics, Probability', 'NumPy Multi-Dimensional Arrays', 'Pandas Data Wrangling & Cleaning'],
        projects: ['Exploratory Data Analysis (EDA) on World Health Dataset', 'Statistical Hypothesis Testing on Clinical Data']
      },
      {
        stage: 'Stage 2',
        title: 'Classical Machine Learning with Scikit-Learn',
        duration: '6 Weeks',
        description: 'Implement regression, classification, clustering, dimensionality reduction, and model evaluation metrics.',
        topics: ['Linear & Logistic Regression', 'Decision Trees, Random Forests & XGBoost', 'K-Means Clustering & Hierarchical Clustering', 'Principal Component Analysis (PCA)', 'Cross-Validation & Hyperparameter Tuning'],
        projects: ['Housing Price Prediction Engine', 'Customer Churn Classification Model', 'Fraud Detection System with Imbalanced Datasets']
      },
      {
        stage: 'Stage 3',
        title: 'Deep Learning & Neural Networks (PyTorch)',
        duration: '8 Weeks',
        description: 'Understand backpropagation, Convolutional Neural Networks (CNNs) for vision, and Recurrent Networks / Transformers for sequences.',
        topics: ['Feedforward Neural Networks & Backprop', 'PyTorch Tensors, Autograd & Custom Datasets', 'CNNs for Image Classification (ResNet)', 'RNNs, LSTMs & Sequence Modeling', 'Self-Attention & Transformer Architecture'],
        projects: ['Medical Image X-Ray Classifier', 'Time-Series Stock Forecasting Model', 'Transformer-based Sentiment Analysis Pipeline']
      },
      {
        stage: 'Stage 4',
        title: 'Large Language Models, Generative AI & MLOps',
        duration: '8 Weeks',
        description: 'Build RAG pipelines, fine-tune open-source LLMs (Llama 3, Mistral), deploy models with FastAPI, and track experiments using MLflow.',
        topics: ['Retrieval-Augmented Generation (RAG) with Vector DBs', 'Fine-Tuning with LoRA & QLoRA', 'LangChain & LlamaIndex Frameworks', 'FastAPI Model Serving', 'MLflow & Dockerized Model Deployment'],
        projects: ['Domain-Specific Enterprise RAG Chatbot', 'Autonomous Code Review Agent with LangChain', 'End-to-End Production ML Pipeline on Cloud']
      }
    ]
  },
  {
    id: 'backend-systems',
    title: 'Backend Engineering & Distributed Systems',
    category: 'Systems Architecture',
    tagline: 'Architect high-throughput, fault-tolerant microservices, distributed data stores, and event-driven backends.',
    icon: Database,
    color: '#3b82f6',
    difficulty: 'Intermediate',
    estimatedMonths: '6 - 9 Months',
    targetRoles: ['Backend Engineer', 'Distributed Systems Engineer', 'API Architect', 'Cloud Backend Specialist'],
    salaryRange: '₹14 - 32 LPA',
    salaryRangeINR: '₹14 - 32 LPA (₹1.15L - 2.65L/month)',
    salaryRangeUSD: '$90,000 - $160,000 / yr',
    overview: 'Deep dive into concurrency, high-performance network protocols (HTTP/2, gRPC, WebSockets), microservices decomposition, message queues (Kafka, RabbitMQ), distributed caching, and database sharding.',
    milestones: [
      {
        stage: 'Stage 1',
        title: 'Advanced Language Mastery & Concurrency (Java / Go)',
        duration: '6 Weeks',
        description: 'Master multithreading, goroutines/channels, memory management, lock contention, and non-blocking I/O.',
        topics: ['Go Goroutines & Channel Patterns / Java Concurrency', 'Memory Allocation & Garbage Collection Tuning', 'TCP/IP Socket Programming', 'Protocol Buffers & gRPC Communication'],
        projects: ['High-Performance Concurrent Web Server in Go', 'Multi-Threaded In-Memory Key-Value Store']
      },
      {
        stage: 'Stage 2',
        title: 'Database Internals, Indexing & Sharding',
        duration: '6 Weeks',
        description: 'Learn how databases work under the hood: B-Trees, WAL, ACID transactions, isolation levels, and read replicas.',
        topics: ['B-Tree & LSM-Tree Indexing Internals', 'Transaction Isolation Levels & MVCC', 'Database Replication & Read-Heavy Scaling', 'Horizontal Sharding & Consistent Hashing'],
        projects: ['Custom Mini B-Tree Database Engine', 'Distributed Multi-Node Sharded Datastore']
      },
      {
        stage: 'Stage 3',
        title: 'Event-Driven Architecture & Message Streaming',
        duration: '6 Weeks',
        description: 'Decouple microservices using asynchronous event streams with Apache Kafka and RabbitMQ.',
        topics: ['Publish-Subscribe Pattern & Message Brokers', 'Apache Kafka Partitions, Consumer Groups & Offsets', 'Event Sourcing & CQRS Architecture', 'Distributed Sagas & Idempotency'],
        projects: ['Real-Time Order Processing System with Kafka', 'Distributed Notification Engine Handling 100K msgs/sec']
      },
      {
        stage: 'Stage 4',
        title: 'System Design & High Availability at Scale',
        duration: '6 Weeks',
        description: 'Design systems that scale to millions of users: Rate Limiters, Distributed Locks, CDN, and Load Balancers.',
        topics: ['CAP & PACELC Theorems', 'Distributed Locking (Redis Redlock / ZooKeeper)', 'Rate Limiting Algorithms (Token Bucket, Leaky Bucket)', 'Designing YouTube, Uber, and WhatsApp at Scale'],
        projects: ['Distributed Rate Limiter Middleware', 'Full System Design Blueprint for Global Video Streaming']
      }
    ]
  },
  {
    id: 'dsa-mastery',
    title: 'Data Structures & Algorithms (SDE Track)',
    category: 'Problem Solving & FAANG Prep',
    tagline: 'Master the top 20 algorithmic patterns to crack Tier-1 product company technical interviews.',
    icon: Cpu,
    color: '#10b981',
    difficulty: 'Beginner',
    estimatedMonths: '4 - 6 Months',
    targetRoles: ['Software Development Engineer (SDE-1 / SDE-2)', 'Algorithms Engineer', 'Competitive Programmer'],
    salaryRange: '₹14 - 36 LPA',
    salaryRangeINR: '₹14 - 36 LPA (₹1.15L - 3.0L/month)',
    salaryRangeUSD: '$80,000 - $170,000 / yr',
    overview: 'Step-by-step master plan covering Time/Space Big-O analysis, core linear data structures, Two Pointers, Sliding Window, recursion, tree traversals, graphs, and Dynamic Programming with visual problem breakdown.',
    milestones: [
      {
        stage: 'Stage 1',
        title: 'Complexity Analysis & Linear Patterns',
        duration: '3 Weeks',
        description: 'Master Big-O asymptotic analysis, array in-place mutations, Two Pointers, and Sliding Window.',
        topics: ['Time & Space Complexity (Amortized, Worst, Best)', 'Two Pointers (Inward Convergence & Fast/Slow)', 'Fixed & Dynamic Sliding Window', 'Prefix Sums & Kadane’s Algorithm'],
        projects: ['Solved Top 50 LeetCode Array & String Benchmark Problems']
      },
      {
        stage: 'Stage 2',
        title: 'Hashing, Stacks, Queues & Linked Lists',
        duration: '4 Weeks',
        description: 'Master O(1) hash lookups, Monotonic Stacks, circular buffers, and in-place pointer manipulation.',
        topics: ['Hash Map Collision Resolution', 'Monotonic Stack (Next Greater Element)', 'Floyd’s Cycle Detection in Linked Lists', 'LRU Cache Design'],
        projects: ['Implemented Custom LRU Cache & Monotonic Stock Spanner']
      },
      {
        stage: 'Stage 3',
        title: 'Recursion, Backtracking & Binary Search',
        duration: '4 Weeks',
        description: 'Master decision trees, subset permutations, search space halving, and binary search on answers.',
        topics: ['Recursion Call Stack & Invariants', 'Backtracking (Subsets, Permutations, N-Queens)', 'Binary Search on Sorted Arrays & Inflection Points', 'Binary Search on Continuous Answer Range'],
        projects: ['Built Sudoku Solver & Aggressive Cows Optimizer']
      },
      {
        stage: 'Stage 4',
        title: 'Trees, Graphs & Dynamic Programming',
        duration: '6 Weeks',
        description: 'Master hierarchical trees, BFS/DFS, Dijkstra, Topo Sort, and 1D/2D DP memoization & tabulation.',
        topics: ['Tree Traversals (Pre, In, Post, Level Order, Views)', 'Graph BFS/DFS & Cycle Detection', 'Dijkstra & Minimum Spanning Trees', '1D/2D Dynamic Programming (Knapsack, LCS, LIS, Intervals)'],
        projects: ['Conquered 150 Blind LeetCode Curated Problem Set']
      }
    ]
  },
  {
    id: 'devops-cloud',
    title: 'DevOps, Cloud & SRE Engineering',
    category: 'Infrastructure & Cloud',
    tagline: 'Automate build pipelines, containerize microservices with Kubernetes, and manage cloud infrastructure as code.',
    icon: Cloud,
    color: '#f59e0b',
    difficulty: 'Intermediate',
    estimatedMonths: '6 - 8 Months',
    targetRoles: ['DevOps Engineer', 'Cloud Architect', 'Site Reliability Engineer (SRE)', 'Platform Engineer'],
    salaryRange: '₹13 - 30 LPA',
    salaryRangeINR: '₹13 - 30 LPA (₹1.08L - 2.5L/month)',
    salaryRangeUSD: '$95,000 - $160,000 / yr',
    overview: 'Learn Linux systems administration, Docker containerization, Kubernetes cluster management, Infrastructure as Code with Terraform, CI/CD automation with GitHub Actions, and Prometheus/Grafana observability.',
    milestones: [
      {
        stage: 'Stage 1',
        title: 'Linux Systems, Shell Scripting & Git CI/CD',
        duration: '4 Weeks',
        description: 'Command the Linux shell, processes, permissions, networking commands, and automated CI/CD workflows.',
        topics: ['Linux File System, Permissions & Systemd', 'Bash Scripting & Automation', 'Networking (DNS, SSL/TLS, Reverse Proxies, Nginx)', 'GitHub Actions & GitLab CI Automated Testing'],
        projects: ['Automated Server Health Monitoring Bash Script', 'Production Nginx Reverse Proxy with Let’s Encrypt SSL']
      },
      {
        stage: 'Stage 2',
        title: 'Docker Containerization & Image Optimization',
        duration: '4 Weeks',
        description: 'Package applications into lightweight, secure multi-stage Docker containers.',
        topics: ['Docker Engine Architecture & Namespaces', 'Multi-Stage Dockerfiles for Minimal Footprint', 'Docker Compose Multi-Container Orchestration', 'Container Security & Vulnerability Scanning'],
        projects: ['Dockerized Microservices Application with Redis & PostgreSQL']
      },
      {
        stage: 'Stage 3',
        title: 'Kubernetes Cluster Orchestration',
        duration: '6 Weeks',
        description: 'Deploy, scale, and manage resilient production workloads with Kubernetes.',
        topics: ['Pods, Deployments, ReplicaSets & Services', 'ConfigMaps, Secrets & Persistent Volumes', 'Ingress Controllers & Helm Package Manager', 'Horizontal Pod Autoscaling (HPA)'],
        projects: ['Production Kubernetes Cluster Deployed on AWS EKS with Helm']
      },
      {
        stage: 'Stage 4',
        title: 'Infrastructure as Code (Terraform) & Observability',
        duration: '6 Weeks',
        description: 'Provision cloud infrastructure declaratively and configure full-stack observability with Prometheus and Grafana.',
        topics: ['Terraform State, Modules & Cloud Providers (AWS/GCP)', 'Prometheus Metrics Scraping & AlertManager', 'Grafana Dashboards & Distributed Tracing with Jaeger', 'Site Reliability Engineering (SLI, SLO, SLA & Incident Response)'],
        projects: ['End-to-End Terraform Cloud Infrastructure with Automated Monitoring']
      }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Ethical Hacking',
    category: 'Information Security',
    tagline: 'Master defensive security, web application penetration testing, network defense, and SOC operations.',
    icon: ShieldCheck,
    color: '#ef4444',
    difficulty: 'Intermediate',
    estimatedMonths: '6 - 9 Months',
    targetRoles: ['Security Analyst', 'Penetration Tester', 'SOC Analyst', 'Application Security Engineer'],
    salaryRange: '₹12 - 26 LPA',
    salaryRangeINR: '₹12 - 26 LPA (₹1.0L - 2.15L/month)',
    salaryRangeUSD: '$90,000 - $155,000 / yr',
    overview: 'Comprehensive security curriculum covering networking protocols, Linux forensics, OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF, SSRF), Burp Suite testing, cryptography, and SIEM security monitoring.',
    milestones: [
      {
        stage: 'Stage 1',
        title: 'Networking Fundamentals & Security Core',
        duration: '4 Weeks',
        description: 'Understand TCP/IP, OSI model, packet analysis with Wireshark, and cryptography foundations.',
        topics: ['OSI & TCP/IP Protocol Analysis', 'Wireshark Packet Capture & Sniffing', 'Symmetric & Asymmetric Cryptography (AES, RSA, ECC)', 'Hashing, Digital Signatures & PKI Certificates'],
        projects: ['Network Packet Sniffer & Traffic Analysis Lab']
      },
      {
        stage: 'Stage 2',
        title: 'Web Application Penetration Testing (OWASP Top 10)',
        duration: '6 Weeks',
        description: 'Identify and exploit critical security vulnerabilities in modern web applications.',
        topics: ['SQL Injection (SQLi) & Authentication Bypasses', 'Cross-Site Scripting (XSS - Reflected/Stored/DOM)', 'Server-Side Request Forgery (SSRF) & IDOR', 'Burp Suite Professional Proxy & Intruder'],
        projects: ['Completed DVWA (Damn Vulnerable Web App) & PortSwigger Labs']
      },
      {
        stage: 'Stage 3',
        title: 'Network Defense, Firewalls & SOC Analysis',
        duration: '6 Weeks',
        description: 'Monitor, detect, and respond to threats using Security Information and Event Management (SIEM).',
        topics: ['Snort / Suricata Intrusion Detection Systems (IDS/IPS)', 'Splunk & ELK Stack Log Analysis', 'Threat Hunting & Incident Response Playbooks', 'MITRE ATT&CK Framework Mapping'],
        projects: ['Constructed Home SOC Lab with Splunk & Suricata']
      }
    ]
  },
  {
    id: 'mobile-dev',
    title: 'Mobile App Development (React Native & Flutter)',
    category: 'Cross-Platform Mobile',
    tagline: 'Build sleek iOS and Android mobile apps from a single codebase with native performance.',
    icon: Smartphone,
    color: '#06b6d4',
    difficulty: 'Beginner',
    estimatedMonths: '5 - 7 Months',
    targetRoles: ['Mobile App Developer', 'React Native Engineer', 'Flutter Specialist', 'iOS/Android App Creator'],
    salaryRange: '₹10 - 24 LPA',
    salaryRangeINR: '₹10 - 24 LPA (₹85,000 - 2.0L/month)',
    salaryRangeUSD: '$85,000 - $140,000 / yr',
    overview: 'Master cross-platform mobile architectures, native sensor integrations (Camera, GPS, Biometrics), smooth 60fps animations, offline-first local storage with SQLite/WatermelonDB, and App Store / Google Play distribution.',
    milestones: [
      {
        stage: 'Stage 1',
        title: 'React Native & Flutter Foundations',
        duration: '4 Weeks',
        description: 'Master core mobile layout widgets, navigation stacks, gesture handling, and responsive styling.',
        topics: ['React Native Core Components & Flexbox Layout', 'Flutter Widget Trees & Dart Basics', 'React Navigation / Flutter Navigator 2.0', 'Handling Gestures & Touch Feedback'],
        projects: ['Habit Tracker & Productivity App with Local Storage']
      },
      {
        stage: 'Stage 2',
        title: 'Native Device APIs & State Management',
        duration: '6 Weeks',
        description: 'Integrate hardware sensors, push notifications, and robust global state.',
        topics: ['Camera, Gallery & Location Geolocation APIs', 'Push Notifications with Firebase Cloud Messaging (FCM)', 'State Management with Redux Toolkit / Riverpod', 'Biometric Authentication (FaceID / Fingerprint)'],
        projects: ['Social Media Camera & Story App with GPS Tagging']
      },
      {
        stage: 'Stage 3',
        title: 'Offline-First Storage & App Store Release',
        duration: '4 Weeks',
        description: 'Build apps that work seamlessly offline and configure automated builds for App Store & Google Play.',
        topics: ['Offline Syncing with SQLite / WatermelonDB', 'Fastlane Automated CI/CD for Mobile', 'App Store Guidelines & Google Play Publishing', 'Performance Optimization (Hermes Engine & Profiling)'],
        projects: ['Production E-Commerce App Deployed to TestFlight & Google Play Beta']
      }
    ]
  },
  {
    id: 'blockchain-web3',
    title: 'Blockchain & Web3 Engineering',
    category: 'Decentralized Systems',
    tagline: 'Design decentralized applications, smart contracts on Ethereum, and DeFi protocols with Solidity.',
    icon: Boxes,
    color: '#8b5cf6',
    difficulty: 'Advanced',
    estimatedMonths: '6 - 8 Months',
    targetRoles: ['Smart Contract Developer', 'Web3 Full-Stack Engineer', 'DeFi Protocol Architect', 'Blockchain Auditor'],
    salaryRange: '₹16 - 40 LPA',
    salaryRangeINR: '₹16 - 40 LPA (₹1.35L - 3.3L/month)',
    salaryRangeUSD: '$105,000 - $185,000 / yr',
    overview: 'Master cryptographic foundations, EVM execution mechanics, Solidity smart contract programming, Foundry/Hardhat testing, security auditing against reentrancy attacks, and Web3 frontends with Wagmi/Ethers.',
    milestones: [
      {
        stage: 'Stage 1',
        title: 'Blockchain Fundamentals & Cryptography',
        duration: '3 Weeks',
        description: 'Understand peer-to-peer consensus, hashing, Merkle trees, and Ethereum Virtual Machine (EVM) mechanics.',
        topics: ['Proof of Work vs. Proof of Stake Consensus', 'Merkle Trees, Cryptographic Nonces & Transactions', 'EVM Gas Mechanics, Opcodes & Storage Layout', 'MetaMask & Web3 Wallet Interactions'],
        projects: ['Custom Blockchain Simulator in Python / TypeScript']
      },
      {
        stage: 'Stage 2',
        title: 'Solidity Smart Contracts & Foundry Tooling',
        duration: '6 Weeks',
        description: 'Write, compile, test, and deploy gas-efficient smart contracts using Solidity and Foundry.',
        topics: ['Solidity Syntax, Data Types & Visibility Modifiers', 'ERC-20, ERC-721 (NFT) & ERC-1155 Token Standards', 'Foundry Unit Testing & Fuzz Testing', 'Upgradeability Patterns (Proxy Contracts & Diamond Standard)'],
        projects: ['Custom ERC-20 Token & Staking Smart Contract', 'Full NFT Marketplace Contract with Royalties']
      },
      {
        stage: 'Stage 3',
        title: 'DeFi Protocols, Web3 Frontend & Security Audits',
        duration: '6 Weeks',
        description: 'Build decentralized financial protocols and secure them against reentrancy, flash loan exploits, and front-running.',
        topics: ['Automated Market Makers (AMM) & Liquidity Pools', 'Connecting Frontends via Wagmi, Viem & RainbowKit', 'Reentrancy, Front-running & Flash Loan Attacks', 'Smart Contract Static Analysis with Slither & Echidna'],
        projects: ['Decentralized AMM Token Exchange (Mini Uniswap)', 'Decentralized Lending & Borrowing Protocol']
      }
    ]
  }
];

export const LearningPaths: React.FC = () => {
  const [selectedDomainId, setSelectedDomainId] = useState<string>('full-stack');
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({
    'Stage 1': true,
    'Stage 2': true,
    'Stage 3': true,
    'Stage 4': true
  });
  const [checkedTopics, setCheckedTopics] = useState<Record<string, boolean>>({});

  const activeDomain = DOMAIN_ROADMAPS.find(d => d.id === selectedDomainId) || DOMAIN_ROADMAPS[0];

  const toggleMilestone = (stage: string) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [stage]: !prev[stage]
    }));
  };

  const toggleTopicCheck = (topicKey: string) => {
    setCheckedTopics(prev => ({
      ...prev,
      [topicKey]: !prev[topicKey]
    }));
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        
        {/* Page Hero Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 'var(--radius-full)', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', boxShadow: '0 2px 6px rgba(79, 70, 229, 0.08)' }}>
            <Compass size={16} />
            <span>Curated Engineering Career Roadmaps</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Comprehensive Engineering Roadmaps
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '720px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Industry-verified, stage-by-stage learning pathways with core skill checklists, hands-on capstone projects, and salary benchmarks.
          </p>
        </div>

        {/* Domain Selection Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '14px',
          marginBottom: '2.5rem'
        }}>
          {DOMAIN_ROADMAPS.map(domain => {
            const Icon = domain.icon;
            const isSelected = domain.id === selectedDomainId;

            return (
              <div
                key={domain.id}
                onClick={() => {
                  setSelectedDomainId(domain.id);
                  setExpandedMilestones({ 'Stage 1': true, 'Stage 2': true, 'Stage 3': true, 'Stage 4': true });
                }}
                className={`roadmap-selector-card ${isSelected ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(79, 70, 229, 0.1)' : 'var(--bg-tertiary)',
                    border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? 'var(--color-primary)' : domain.color,
                    flexShrink: 0
                  }}>
                    <Icon size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {domain.category}
                    </span>
                    <h4 style={{ fontSize: '0.975rem', fontWeight: 800, color: isSelected ? 'var(--color-primary)' : 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
                      {domain.title}
                    </h4>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} color="var(--text-muted)" /> {domain.estimatedMonths}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--color-emerald)', fontSize: '0.75rem' }}>
                    {domain.salaryRange}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Domain Deep Dive Hero Box (High Elevation) */}
        <div className="roadmap-hero-box" style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
            
            {/* Left Narrative Column */}
            <div className="roadmap-hero-narrative" style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px' }}>
                  {activeDomain.category}
                </span>
                <span className="badge badge-cyan" style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px' }}>
                  {activeDomain.milestones.length} Comprehensive Stages
                </span>
                <span className="badge badge-emerald" style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px' }}>
                  Verified Placement Curriculum
                </span>
              </div>

              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
                {activeDomain.title}
              </h2>

              <p style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.05rem', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                {activeDomain.tagline}
              </p>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', margin: '0 0 1.75rem 0', maxWidth: '680px' }}>
                {activeDomain.overview}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a 
                  href="#milestones-timeline" 
                  className="btn btn-primary"
                  style={{ padding: '10px 20px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Zap size={16} /> Explore Curriculum Stages
                </a>
                <Link to="/dsa" className="btn btn-secondary" style={{ padding: '10px 18px', fontWeight: 600 }}>
                  Practice DSA Catalog
                </Link>
                <Link to="/projects" className="btn btn-secondary" style={{ padding: '10px 18px', fontWeight: 600 }}>
                  <ExternalLink size={15} /> Capstone Projects
                </Link>
              </div>
            </div>

            {/* Right Metrics Cards Column (High Elevation) */}
            <div className="roadmap-hero-metrics" style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: '0 1 320px' }}>
              
              {/* Salary Box with Indian Rupee (INR) */}
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Indian Industry Compensation</span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <TrendingUp size={11} /> High Demand
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <strong style={{ fontSize: '1.45rem', color: 'var(--color-emerald)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                    {activeDomain.salaryRange}
                  </strong>
                  <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                    INR / Year
                  </span>
                </div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.4' }}>
                  {activeDomain.salaryRangeINR} in Indian product tech &amp; MNCs • Global: {activeDomain.salaryRangeUSD}
                </span>
              </div>

              {/* Timeline Box */}
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Estimated Roadmap Timeline
                </span>
                <strong style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                  {activeDomain.estimatedMonths}
                </strong>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Self-paced or 10-15 hrs/week dedicated study
                </span>
              </div>

              {/* Roles Box */}
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Target Job Titles
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {activeDomain.targetRoles.map(role => (
                    <span key={role} className="badge" style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.75rem', padding: '3px 10px', fontWeight: 600 }}>
                      {role}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Milestone Steps Connected Timeline Spine */}
        <div id="milestones-timeline" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                <Layers size={22} color="var(--color-primary)" />
                <span>Curriculum Milestones & Competencies</span>
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
                Check off competencies as you learn to track your completion progress.
              </p>
            </div>
            
            <button 
              onClick={() => {
                const allOpen = Object.values(expandedMilestones).every(Boolean);
                const newState: Record<string, boolean> = {};
                activeDomain.milestones.forEach(m => { newState[m.stage] = !allOpen; });
                setExpandedMilestones(newState);
              }}
              className="btn btn-secondary btn-sm"
            >
              {Object.values(expandedMilestones).every(Boolean) ? 'Collapse All Stages' : 'Expand All Stages'}
            </button>
          </div>

          {/* Timeline Container with Vertical Spine */}
          <div className="roadmap-timeline-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="roadmap-timeline-spine"></div>

            {activeDomain.milestones.map((milestone, idx) => {
              const isExpanded = Boolean(expandedMilestones[milestone.stage]);
              const completedInStage = milestone.topics.filter(t => checkedTopics[`${activeDomain.id}-${milestone.stage}-${t}`]).length;

              return (
                <div key={milestone.stage} style={{ position: 'relative' }}>
                  
                  {/* Stage Node on the timeline spine */}
                  <div className="roadmap-stage-node" title={`Stage ${idx + 1}`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>

                  {/* Milestone Card */}
                  <div className={`roadmap-card ${isExpanded ? 'is-expanded' : ''}`} style={{ padding: '1.75rem' }}>
                    
                    {/* Header */}
                    <div
                      onClick={() => toggleMilestone(milestone.stage)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        userSelect: 'none',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '260px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <span className="badge badge-primary" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                              {milestone.stage}
                            </span>
                            <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                              ⏱️ {milestone.duration}
                            </span>
                            {completedInStage > 0 && (
                              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                                ✓ {completedInStage}/{milestone.topics.length} Done
                              </span>
                            )}
                          </div>
                          <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                            {milestone.title}
                          </h4>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {isExpanded ? 'Hide Details' : 'View Checklist & Projects'}
                        </span>
                        {isExpanded ? <ChevronUp size={18} color="var(--color-primary)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.65', marginBottom: '1.5rem' }}>
                          {milestone.description}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '1.5rem' }}>
                          
                          {/* Topics Checklist with clickable checks */}
                          <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                                <CheckCircle2 size={18} />
                                <span>Core Competencies Checklist</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {completedInStage} of {milestone.topics.length} checked
                              </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {milestone.topics.map((topic, tIdx) => {
                                const topicKey = `${activeDomain.id}-${milestone.stage}-${topic}`;
                                const isChecked = Boolean(checkedTopics[topicKey]);

                                return (
                                  <div
                                    key={tIdx}
                                    onClick={() => toggleTopicCheck(topicKey)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: '10px',
                                      padding: '8px 10px',
                                      borderRadius: '8px',
                                      background: isChecked ? 'rgba(5, 150, 105, 0.08)' : '#FFFFFF',
                                      border: isChecked ? '1px solid #A7F3D0' : '1px solid var(--border-subtle)',
                                      cursor: 'pointer',
                                      transition: 'all 0.15s ease'
                                    }}
                                  >
                                    {isChecked ? (
                                      <CheckSquare size={18} color="var(--color-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    ) : (
                                      <Square size={18} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    )}
                                    <span style={{
                                      fontSize: '0.875rem',
                                      color: isChecked ? 'var(--color-emerald)' : 'var(--text-primary)',
                                      textDecoration: isChecked ? 'line-through' : 'none',
                                      fontWeight: isChecked ? 600 : 500,
                                      lineHeight: 1.4
                                    }}>
                                      {topic}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Capstone Projects & Deliverables */}
                          <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-emerald)', marginBottom: '12px' }}>
                                <Award size={18} />
                                <span>Milestone Capstone Deliverables</span>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {milestone.projects.map((proj, pIdx) => (
                                  <div
                                    key={pIdx}
                                    style={{
                                      padding: '12px 14px',
                                      background: '#FFFFFF',
                                      border: '1px solid var(--border-subtle)',
                                      borderRadius: '8px',
                                      boxShadow: 'var(--shadow-xs)'
                                    }}
                                  >
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '2px' }}>
                                      🚀 Project {pIdx + 1}
                                    </div>
                                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                      {proj}
                                    </strong>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Need reference code?
                              </span>
                              <Link to="/projects" className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
                                Browse Projects Repo →
                              </Link>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA to DSA and Visual Lab */}
        <div style={{
          marginTop: '4rem',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%)',
          border: '1px solid var(--border-medium)',
          borderRadius: '20px',
          padding: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 10px 30px -5px rgba(79, 70, 229, 0.1)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
              Ready to accelerate your engineering interviews?
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
              Step through our interactive algorithm visualizers or explore the 50 curated aptitude questions.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/aptitude" className="btn btn-secondary" style={{ padding: '10px 18px', fontWeight: 600 }}>
              Campus Aptitude Arena
            </Link>
            <Link to="/visual-lab" className="btn btn-secondary" style={{ padding: '10px 18px', fontWeight: 600 }}>
              Open Visual Lab
            </Link>
            <Link to="/dsa" className="btn btn-primary" style={{ padding: '10px 22px', fontWeight: 700 }}>
              Explore DSA Catalog <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
export default LearningPaths;

