/* ==========================================================================
   PORTFOLIO DATA — VERIFIED SOURCE OF TRUTH
   Shushant Tiwari | Zero Fabricated Credentials, Metrics, or Unverified URLs
   ========================================================================== */

window.PortfolioData = {
  identity: {
    name: 'Shushant Tiwari',
    tagline: 'Developer | Engineer | Technology Enthusiast',
    location: 'Greater Noida / Delhi NCR, India',
    phone: '+91 9798107584',
    phoneHref: 'tel:+919798107584',
    email: 'shushanttiwari2036@gmail.com',
    emailHref: 'mailto:shushanttiwari2036@gmail.com',
    github: 'https://github.com/Shushant-556',
    linkedin: 'https://linkedin.com/in/shushant-tiwari',
    portfolioUrl: 'https://shushant-556.github.io/Portfolio',
    university: 'IILM University, Greater Noida',
    degree: 'BTech — Computer Science and Engineering',
    cgpa: '9.30/10',
    projectCount: '05'
  },

  sectionNarratives: [
    { id: 'hero', index: '01', label: 'Hero', sceneState: 'Complete Metallic Sculpture' },
    { id: 'about', index: '02', label: 'About', sceneState: 'Component Separation' },
    { id: 'projects', index: '03', label: 'Projects', sceneState: 'Project Node Orbit' },
    { id: 'skills', index: '04', label: 'Skills', sceneState: 'Technical Network' },
    { id: 'experience', index: '05', label: 'Experience', sceneState: 'Chronological Spine' },
    { id: 'education', index: '06', label: 'Education', sceneState: 'Architectural Lattice' },
    { id: 'certifications', index: '07', label: 'Certifications', sceneState: 'Credential Gallery' },
    { id: 'contact', index: '08', label: 'Contact', sceneState: 'Sculptural Reassembly' }
  ],

  projects: [
    {
      id: 'notepilot',
      number: '01',
      name: 'NOTEPILOT',
      subtitle: 'Real-Time AI Meeting Intelligence Assistant',
      visualType: 'notepilot',
      visualCaption: 'Procedural Audio-Reactive Visualization — Original Conceptual Render',
      statusBadge: 'Audio + Local STT Architecture',
      summary:
        'A browser-to-local-backend meeting copilot engineered to capture Google Meet tab audio, stream live audio chunks over WebSockets, and run local OpenAI Whisper speech-to-text transcription without cloud transcription billing.',
      techStack: [
        'Manifest V3 Chrome Extension',
        'Python',
        'Web Audio API',
        'WebSockets',
        'OpenAI Whisper',
        'FFmpeg'
      ],
      caseStudy: {
        overview:
          'NotePilot pairs a Manifest V3 Chrome Extension with an asynchronous Python backend to capture live Google Meet tab audio and generate local transcriptions using OpenAI Whisper.',
        problem:
          'Live meeting transcription tools frequently require recurring cloud API subscriptions and transmit sensitive meeting audio to third-party servers.',
        solution:
          'Engineered a local-first pipeline that captures browser tab audio via the Web Audio API, streams encoded chunks over WebSockets to a Python server, processes streams with FFmpeg, and transcribes speech locally using Whisper.',
        architecture:
          '[Google Meet Tab] -> [Chrome Extension MV3 + Web Audio API]\n        |\n        v (Chunked Binary Stream via WebSockets)\n[Python Async Backend] -> [FFmpeg Audio Normalization] -> [Local OpenAI Whisper STT]\n        |\n        v\n[Live Transcript & Action-Item Retrieval Interface]',
        highlights: [
          'Manifest V3 browser extension audio capture tailored for Google Meet tabs.',
          'Low-overhead WebSocket streaming pipeline linking browser capture to local Python processing.',
          'FFmpeg preprocessing for consistent chunk formatting prior to Whisper inference.',
          'Local-first transcription architecture designed to avoid external cloud STT API fees.'
        ],
        challenges: [
          'Balancing chunk duration against transcription latency and Whisper contextual accuracy.',
          'Handling Manifest V3 service worker lifecycles during long-running audio capture sessions.',
          'Managing local CPU/RAM consumption on consumer hardware during real-time inference.'
        ],
        testingAndResults:
          'Described in the original portfolio as functioning end-to-end for Google Meet tab audio capture, WebSocket streaming, and local Whisper transcription. No independent latency or WER benchmark logs were included in the source materials.',
        repository: {
          status: 'Requires direct repository URL update',
          profileUrl: 'https://github.com/Shushant-556',
          note: 'Individual repository URL was not provided in the source materials; linked to GitHub profile.'
        },
        demo: {
          available: false,
          note: 'Runs locally via Chrome Extension (Manifest V3) paired with a local Python WebSocket backend; no public hosted demo URL.'
        }
      }
    },
    {
      id: 'medchain',
      number: '02',
      name: 'MEDCHAIN',
      subtitle: 'Decentralized Encrypted Healthcare EHR Platform',
      visualType: 'medchain',
      visualCaption: 'Procedural Distributed Node Network — Original Conceptual Render',
      statusBadge: 'Academic Research Prototype',
      summary:
        'A decentralized electronic health record architecture combining client-side WebCrypto AES-256-GCM encryption, content-addressed IPFS storage, patient-driven consent controls, and Solidity smart contracts for immutable audit logging.',
      techStack: [
        'Next.js',
        'TypeScript',
        'Solidity',
        'Hardhat',
        'Prisma',
        'IPFS',
        'WebCrypto AES-256-GCM'
      ],
      caseStudy: {
        overview:
          'MedChain is a full-stack decentralized healthcare data management prototype built to give patients direct control over encrypted medical records while giving authorized clinicians verifiable access.',
        problem:
          'Centralized hospital databases create single points of failure for sensitive medical records, fragment cross-institution interoperability, and limit patient visibility into who accessed their data.',
        solution:
          'Encrypts clinical documents client-side using WebCrypto AES-256-GCM before upload, stores ciphertext using content-addressed IPFS storage, manages metadata via Prisma, and records consent and integrity commitments on EVM smart contracts developed with Solidity and Hardhat.',
        architecture:
          '[Patient / Clinician Client (Next.js + TypeScript)]\n        |\n        +--> [WebCrypto AES-256-GCM Client-Side Encryption]\n        |          |\n        |          v\n        |    [IPFS Content-Addressed Ciphertext Storage (CID)]\n        |\n        +--> [Solidity Smart Contracts (Hardhat / EVM)] -> Consent & Audit Log\n        |\n        +--> [Prisma ORM] -> Structured Application Metadata',
        highlights: [
          'Zero-plaintext server storage model using browser-native WebCrypto AES-256-GCM encryption.',
          'Tamper-evident record commitments and consent audit trails via Solidity smart contracts.',
          'Role-based views separating patient consent control from clinician record access.',
          'Content-addressed decentralized storage workflow backed by IPFS.'
        ],
        challenges: [
          'Coordinating off-chain encrypted file storage with on-chain hash commitments and consent state.',
          'Designing key-handling workflows that preserve confidentiality without degrading usability.',
          'Keeping gas overhead low by storing only cryptographic hashes and access events on-chain.'
        ],
        testingAndResults:
          'Developed and documented as an academic major project and research prototype demonstrated with synthetic medical records. Explicitly scoped as a research prototype rather than a certified clinical production platform.',
        repository: {
          status: 'Requires direct repository URL update',
          profileUrl: 'https://github.com/Shushant-556',
          note: 'Individual repository URL was not provided in the source materials; linked to GitHub profile.'
        },
        demo: {
          available: false,
          note: 'Academic prototype configured for local Hardhat/Next.js execution; no public production deployment URL.'
        }
      }
    },
    {
      id: 'weather-forecasting',
      number: '03',
      name: 'HYPERLOCAL WEATHER & EXTREME EVENT FORECASTING',
      subtitle: 'Delhi NCR Environmental & Atmospheric Predictive Modelling',
      visualType: 'weather',
      visualCaption: 'Procedural Atmospheric Contour Layer — Original Conceptual Render',
      statusBadge: 'Time-Series ML Pipeline',
      summary:
        'A regional machine learning forecasting pipeline targeting Delhi NCR weather and air-quality extremes, engineering temporal features from historical environmental datasets to model temperature, PM2.5, PM10, fog, and pollution conditions.',
      techStack: [
        'Python',
        'Scikit-learn',
        'Pandas',
        'NumPy',
        'Streamlit',
        'Joblib'
      ],
      caseStudy: {
        overview:
          'An applied environmental data science project focused on hyperlocal forecasting for the Delhi NCR region, combining historical meteorological and air-quality series with an interactive Streamlit dashboard.',
        problem:
          'Broad city-level weather summaries often miss localized winter fog, temperature swings, and acute PM2.5/PM10 pollution spikes across the Delhi NCR corridor.',
        solution:
          'Constructed a Python feature-engineering and regression workflow using Pandas, NumPy, and Scikit-learn, persisted trained estimators with Joblib, and exposed forecast exploration through a Streamlit web interface.',
        architecture:
          '[Historical Delhi NCR Weather & AQI Datasets]\n        |\n        v\n[Pandas / NumPy Cleaning & Lag Feature Engineering]\n        |\n        v\n[Scikit-learn Predictive Models (Temperature, PM2.5, PM10, Fog)]\n        |\n        v (Serialized via Joblib)\n[Streamlit Interactive Forecasting Dashboard]',
        highlights: [
          'Multi-variable environmental modelling spanning temperature, PM2.5, PM10, fog, and pollution indicators.',
          'Structured time-series lag and rolling feature engineering built with Pandas and NumPy.',
          'Reproducible model serialization via Joblib for fast inference inside Streamlit.',
          'Interactive parameter inspection designed for exploring Delhi NCR extreme-event conditions.'
        ],
        challenges: [
          'Handling missing sensor intervals and seasonal distribution shifts in regional air-quality records.',
          'Balancing model complexity and memory footprint during training on large tabular series.'
        ],
        testingAndResults:
          'Original portfolio and resume materials describe training Random Forest time-series models on a 422MB Delhi NCR environmental dataset with reported MAE around 2–3°C. These figures are preserved as claims from the original portfolio and have not been independently audited here.',
        repository: {
          status: 'Requires direct repository URL update',
          profileUrl: 'https://github.com/Shushant-556',
          note: 'Individual repository URL was not provided in the source materials; linked to GitHub profile.'
        },
        demo: {
          available: false,
          note: 'Runs locally via Streamlit (`streamlit run`); no verified public hosted URL provided.'
        }
      }
    },
    {
      id: 'gfg-autosolver',
      number: '04',
      name: 'GFG AUTOSOLVER PRO',
      subtitle: 'Developer Productivity & Coding Automation Platform',
      visualType: 'gfg',
      visualCaption: 'Procedural Pipeline & Code State Visualizer — Original Conceptual Render',
      statusBadge: 'Active Redevelopment & Debugging',
      summary:
        'A coding workflow automation platform combining a FastAPI backend, Manifest V3 Chrome Extension, AI API integration, Docker Compose orchestration, APScheduler jobs, and GitHub API persistence for problem capture and Java solution generation.',
      techStack: [
        'FastAPI',
        'Chrome Extension Manifest V3',
        'Docker Compose',
        'AI API Integration',
        'GitHub API',
        'APScheduler'
      ],
      caseStudy: {
        overview:
          'GFG AutoSolver Pro explores end-to-end developer automation: capturing coding problem statements from the browser, generating Java solutions via AI APIs, checking compilation, and persisting solutions via the GitHub API.',
        problem:
          'Managing repetitive problem capture, local verification, and structured GitHub archiving across daily algorithmic practice involves significant manual context switching.',
        solution:
          'Architected a modular system pairing a Manifest V3 Chrome Extension with a containerized FastAPI service, APScheduler task orchestration, AI-assisted Java code generation, compilation checks, and GitHub API commits.',
        architecture:
          '[Browser Problem Page] -> [Chrome Extension Manifest V3]\n        |\n        v (REST API)\n[FastAPI Service (Docker Compose + APScheduler)]\n        |\n        +--> [AI API Java Code Generation]\n        +--> [Compilation Verification Step]\n        +--> [GitHub API Persistence]',
        highlights: [
          'Decoupled FastAPI backend orchestrated with Docker Compose and APScheduler.',
          'Manifest V3 extension capture pipeline linked to structured backend endpoints.',
          'Automated GitHub API commit integration for archiving generated code.',
          'Iterative debugging focus on compilation validation and API reliability.'
        ],
        challenges: [
          'Handling dynamic DOM changes on external coding platforms during browser capture.',
          'Ensuring generated Java solutions consistently pass compilation and edge-case constraints.',
          'Stabilizing end-to-end automation across redevelopment and debugging cycles.'
        ],
        testingAndResults:
          'Status Notice: This project has undergone significant redevelopment and debugging. Core architectural components (problem capture, FastAPI orchestration, AI-assisted generation, compilation checking, and GitHub persistence) are implemented at varying stages; full end-to-end production reliability is explicitly NOT claimed.',
        repository: {
          status: 'Requires direct repository URL update',
          profileUrl: 'https://github.com/Shushant-556',
          note: 'Individual repository URL was not provided in the source materials; linked to GitHub profile.'
        },
        demo: {
          available: false,
          note: 'Under active redevelopment for local FastAPI + Chrome Extension environments; no live hosted demo.'
        }
      }
    },
    {
      id: 'placewise-ai',
      number: '05',
      name: 'PLACEWISE AI',
      subtitle: 'Augmented Product Visualization Platform',
      visualType: 'placewise',
      visualCaption: 'Procedural Spatial Placement Grid — Original Conceptual Render',
      statusBadge: 'WebGL Spatial Concept',
      summary:
        'An interactive spatial visualization concept combining JavaScript, WebGL 3D model rendering, and computer-vision-assisted placement ideas to preview products inside real-world perspective environments.',
      techStack: [
        'JavaScript',
        'WebGL',
        '3D Model Rendering',
        'Computer-Vision-Assisted Placement'
      ],
      caseStudy: {
        overview:
          'PlaceWise AI focuses on bridging 3D browser rendering with environment-aware product placement, allowing users to inspect spatial proportions and perspective directly on the web.',
        problem:
          'Static 2D product photography makes it difficult to judge scale, orientation, and spatial fit inside real rooms before purchasing.',
        solution:
          'Combines browser-based WebGL 3D model rendering in JavaScript with computer-vision-assisted placement concepts to align virtual product geometry with environmental perspective planes.',
        architecture:
          '[Camera / Scene Frame Input]\n        |\n        v\n[Computer-Vision-Assisted Surface & Perspective Estimation]\n        |\n        v\n[JavaScript + WebGL 3D Rendering Pipeline]\n        |\n        v\n[Interactive Product Placement & Inspection Viewport]',
        highlights: [
          'Browser-native WebGL rendering pipeline built in JavaScript.',
          'Perspective-aware 3D object orientation and spatial scale exploration.',
          'Environment-assisted placement workflow designed for web accessibility without native app installs.'
        ],
        challenges: [
          'Maintaining smooth WebGL frame rates across diverse mobile and laptop GPUs.',
          'Aligning virtual lighting and perspective planes convincingly with real-world environments.'
        ],
        testingAndResults:
          'Presented according to the original portfolio concepts covering JavaScript, WebGL rendering, and computer-vision-assisted placement. No independent performance or user-study metrics were provided in the source materials.',
        repository: {
          status: 'Requires direct repository URL update',
          profileUrl: 'https://github.com/Shushant-556',
          note: 'Individual repository URL was not provided in the source materials; linked to GitHub profile.'
        },
        demo: {
          available: false,
          note: 'No live hosted demo URL was provided in the original source materials.'
        }
      }
    }
  ],

  skills: [
    {
      id: 'languages',
      label: 'Programming Languages',
      description: 'Core systems, application, smart-contract, and web languages used across academic and engineering projects.',
      items: ['Python', 'JavaScript', 'TypeScript', 'Solidity', 'SQL', 'Java', 'C++', 'HTML5', 'CSS3']
    },
    {
      id: 'ai-ml',
      label: 'AI / Machine Learning',
      description: 'Applied machine learning, speech recognition, LLM integration, time-series modelling, and geospatial analysis.',
      items: [
        'PyTorch',
        'Scikit-learn',
        'OpenAI API',
        'Prompt Engineering',
        'Whisper STT',
        'Pandas',
        'NumPy',
        'Time-Series Modeling',
        'Shapely',
        'Folium'
      ]
    },
    {
      id: 'web',
      label: 'Web Development',
      description: 'Full-stack frameworks, real-time audio/socket interfaces, and modern API engineering.',
      items: [
        'Next.js',
        'React',
        'React Native',
        'Node.js',
        'Express',
        'FastAPI',
        'Web Audio API',
        'WebSockets',
        'REST APIs'
      ]
    },
    {
      id: 'cloud-devops',
      label: 'Cloud / DevOps',
      description: 'Containerization, CI/CD automation, cloud infrastructure, media processing, and Linux tooling.',
      items: [
        'Oracle Cloud Infrastructure',
        'Docker',
        'Docker Compose',
        'GitHub Actions',
        'APScheduler',
        'Linux / Bash',
        'FFmpeg'
      ]
    },
    {
      id: 'blockchain',
      label: 'Blockchain / Security',
      description: 'Smart contracts, decentralized storage, and browser-native authenticated encryption.',
      items: ['Solidity', 'Hardhat', 'IPFS / Filecoin', 'WebCrypto', 'AES-256-GCM', 'EVM']
    },
    {
      id: 'databases',
      label: 'Databases / Tools',
      description: 'Relational and document databases, ORMs, version control, and API testing workflows.',
      items: ['MongoDB', 'PostgreSQL', 'SQLite', 'MySQL', 'Prisma', 'Mongoose', 'Git', 'Postman']
    }
  ],

  experience: [
    {
      organization: 'Siemens Industry Software & AICTE',
      role: 'Data Science Master Virtual Internship',
      period: 'June 2026 – August 2026',
      highlight: null,
      certificateId: '4b0da287dc6d33b93827',
      focus: [
        'Data analytics and structured exploratory data analysis (EDA).',
        'Predictive modelling pipelines and regression workflows.',
        'Feature engineering and model cross-validation practices.'
      ]
    },
    {
      organization: 'EduSkills Foundation & AICTE',
      role: 'DevOps & Cloud Automation Virtual Internship',
      period: 'April 2026 – June 2026',
      highlight: 'Grade: O — Outstanding',
      certificateId: '4845ac603a932aaabd28',
      focus: [
        'Containerized service workflows using Docker and Docker Compose.',
        'Continuous integration and deployment pipelines via GitHub Actions.',
        'Applied DevOps and cloud automation methodologies.'
      ]
    },
    {
      organization: 'IIT Delhi Rendezvous',
      role: 'Campus Ambassador',
      period: 'September 2025 – October 2025',
      highlight: 'Student Outreach & Festival Coordination',
      certificateId: null,
      focus: [
        'Represented Rendezvous \'25 (IIT Delhi) on campus to drive student outreach and festival awareness.',
        'Coordinated peer engagement, event promotion, and campus-level communication.'
      ]
    }
  ],

  education: [
    {
      institution: 'IILM University, Greater Noida',
      credential: 'BTech — Computer Science and Engineering',
      period: '2024–2028',
      scoreLabel: 'CGPA',
      scoreValue: '9.30/10',
      detail: 'Undergraduate engineering program focused on computer science fundamentals, AI systems, distributed architectures, and software engineering.'
    },
    {
      institution: 'Aditya University',
      credential: 'Senior Secondary',
      period: '2023–2024',
      scoreLabel: 'Percentage',
      scoreValue: '87%',
      detail: 'Completed senior secondary academic curriculum in science and mathematics.'
    },
    {
      institution: 'Kendriya Vidyalaya',
      credential: 'Class X',
      period: '2021–2022',
      scoreLabel: 'Percentage',
      scoreValue: '92%',
      detail: 'Secondary school foundation with distinction across core quantitative and analytical subjects.'
    }
  ],

  certifications: [
    {
      index: '01',
      title: 'Oracle Cloud Infrastructure Generative AI Professional',
      issuer: 'Oracle',
      category: 'Cloud & Generative AI',
      credentialId: null,
      note: 'Professional certification in OCI Generative AI services and LLM workflows.'
    },
    {
      index: '02',
      title: 'DevOps & Cloud Automation Virtual Internship — Grade O',
      issuer: 'EduSkills & AICTE',
      category: 'DevOps & Cloud',
      credentialId: '4845ac603a932aaabd28',
      note: 'Completed with Grade O (Outstanding) across Docker, Docker Compose, and GitHub Actions.'
    },
    {
      index: '03',
      title: 'Data Science Master Virtual Internship',
      issuer: 'Siemens & AICTE',
      category: 'Data Science & ML',
      credentialId: '4b0da287dc6d33b93827',
      note: 'Focused on data analytics, EDA, feature engineering, predictive modelling, and cross-validation.'
    },
    {
      index: '04',
      title: 'GenAI Powered Data Analytics Simulation',
      issuer: 'TATA',
      category: 'AI & Analytics',
      credentialId: null,
      note: 'Practical simulation applying generative AI methods to structured analytics tasks.'
    },
    {
      index: '05',
      title: 'Artificial Intelligence Learning',
      issuer: 'HP LIFE',
      category: 'Artificial Intelligence',
      credentialId: null,
      note: 'Foundational certification covering practical AI concepts and real-world applications.'
    },
    {
      index: '06',
      title: 'Introduction to Data Science',
      issuer: 'IBM',
      category: 'Data Science',
      credentialId: null,
      note: 'Core data science methodologies, tooling, and analytical problem-solving.'
    },
    {
      index: '07',
      title: 'Exploring Blockchain',
      issuer: 'Skillsoft',
      category: 'Blockchain',
      credentialId: null,
      note: 'Distributed ledger principles, cryptographic integrity, and decentralized architectures.'
    },
    {
      index: '08',
      title: 'CS50 Introduction to Computer Science',
      issuer: 'Harvard (HarvardX)',
      category: 'Computer Science',
      credentialId: '8c8f93d7a2acdb412456',
      note: 'Verified HarvardX CS50x certificate covering algorithms, memory, data structures, and web systems.'
    }
  ]
};
