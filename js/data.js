window.PORTFOLIO_DATA = {
  projects: [
    {
      id: "notepilot",
      title: "NotePilot",
      role: "Real-Time AI Meeting Intelligence Assistant",
      year: "2026",
      stack: "Manifest V3 Chrome Extension, Python, Web Audio API, WebSockets, OpenAI Whisper, FFmpeg",
      summary: "Real-time meeting copilot for Google Meet that captures tab audio with explicit user permissions and runs local live transcription with zero cloud API billing.",
      architecture: [
        "Captured live Google Meet tab audio streams using chrome.tabCapture and converted raw streams into 16-bit PCM chunks via the Web Audio API.",
        "Streamed low-latency binary audio frames over persistent WebSockets to an asynchronous Python backend.",
        "Integrated open-source OpenAI Whisper with local FFmpeg bindings for continuous, privacy-first transcription without external API costs."
      ],
      repoUrl: "https://github.com/Shushant-556",
      demoVideo: "demos/notepilot.mp4"
    },
    {
      id: "medchain",
      title: "MedChain",
      role: "Decentralized Encrypted Healthcare EHR Platform",
      year: "2026",
      stack: "Next.js 15, TypeScript 5, Solidity 0.8, Hardhat, Prisma, IPFS, WebCrypto AES-256-GCM",
      summary: "Sovereign patient health record platform adhering to HL7 FHIR R4 healthcare standards with zero plaintext clinical data stored on servers.",
      architecture: [
        "Implemented client-side envelope encryption using WebCrypto AES-256-GCM so medical records are encrypted before leaving the browser.",
        "Stored encrypted payloads on content-addressed IPFS nodes to eliminate centralized single points of failure.",
        "Deployed Ethereum EVM smart contracts in Solidity 0.8 for immutable audit logging, integrity proofs, and patient-controlled cryptographic consent."
      ],
      repoUrl: "https://github.com/Shushant-556",
      demoVideo: "demos/medchain.mp4"
    },
    {
      id: "weather-ncr",
      title: "Hyperlocal Weather & Extreme Event Forecasting",
      role: "Delhi NCR Machine Learning Pipeline",
      year: "2026",
      stack: "Python, Scikit-learn, Pandas, NumPy, Streamlit, Joblib",
      summary: "End-to-end environmental forecasting system trained on a 422 MB historical meteorological and air pollution dataset for Delhi NCR.",
      architecture: [
        "Engineered lag-based temporal sequence features (t+1, lag-1, lag-2) to strictly eliminate data leakage across time-series splits.",
        "Trained Random Forest models predicting PM2.5, PM10, and temperature with 2 to 3 degree Celsius MAE.",
        "Built multi-parameter threshold heuristics for real-time fog detection and pollution spikes, surfaced in an interactive Streamlit dashboard."
      ],
      repoUrl: "https://github.com/Shushant-556",
      demoVideo: "demos/weather.mp4"
    },
    {
      id: "gfg-autosolver",
      title: "GFG AutoSolver Pro",
      role: "Developer Productivity & Automated CI/CD Pipeline",
      year: "2026",
      stack: "FastAPI, Manifest V3 Extension, Docker Compose, OpenAI API, APScheduler, GitHub Contents API",
      summary: "Automated developer workflow combining browser problem parsing, structured LLM code generation, local compilation checks, and GitHub persistence.",
      architecture: [
        "Built a Manifest V3 extension and FastAPI service that parses algorithmic problem statements and generates structured solutions via the OpenAI API.",
        "Added automated local javac compilation verification before accepting any generated solution.",
        "Containerized the pipeline with Docker Compose, scheduled batch runs using APScheduler, and committed verified code via the GitHub Contents API."
      ],
      repoUrl: "https://github.com/Shushant-556",
      demoVideo: "demos/autosolver.mp4"
    },
    {
      id: "placewise",
      title: "PlaceWise AI",
      role: "Augmented Product Visualization Platform",
      year: "2025",
      stack: "JavaScript, WebGL, 3D Model Rendering, Computer Vision Placement",
      summary: "Browser-based spatial visualization app rendering true-to-scale 3D furniture and appliance models over live camera feeds.",
      architecture: [
        "Combined live camera feeds with WebGL 3D model rendering for real-time spatial inspection without native app installs.",
        "Implemented computer-vision-assisted placement and scale calibration so users can evaluate product fit in their actual rooms."
      ],
      repoUrl: "https://github.com/Shushant-556",
      demoVideo: "demos/placewise.mp4"
    }
  ],
  experience: [
    {
      period: "Jun 2026 - Aug 2026",
      org: "Siemens Industry Software & AICTE",
      role: "Data Science Master Virtual Intern",
      meta: "Certificate ID: 4b0da287dc6d33b93827",
      points: [
        "Constructed end-to-end data analytics and predictive modeling pipelines across complex datasets.",
        "Executed exploratory data analysis, feature engineering, and cross-validated regression and classification models."
      ]
    },
    {
      period: "Apr 2026 - Jun 2026",
      org: "EduSkills Foundation & AICTE",
      role: "DevOps & Cloud Automation Virtual Intern (Grade O)",
      meta: "Outstanding 90-100% | Certificate ID: 4845ac603a932aaabd28",
      points: [
        "Engineered containerized build and runtime workflows using Docker and Docker Compose.",
        "Configured automated GitHub Actions CI/CD pipelines for linting, testing, and deployment readiness."
      ]
    },
    {
      period: "Sep 2025 - Oct 2025",
      org: "IIT Delhi Rendezvous",
      role: "Campus Ambassador",
      meta: "Greater Noida / New Delhi",
      points: [
        "Spearheaded digital outreach and on-ground student engagement across collegiate channels, reaching over 1,000 students."
      ]
    }
  ],
  skills: [
    {
      category: "Languages",
      items: "Python, JavaScript (ES6+), TypeScript, Solidity, SQL, Java, C++, HTML5, CSS3"
    },
    {
      category: "AI, ML & NLP",
      items: "PyTorch, Scikit-learn, OpenAI API, Prompt Engineering, Whisper STT, Pandas, NumPy, Time-Series Modeling, Shapely, Folium"
    },
    {
      category: "Web & Full-Stack",
      items: "Next.js 15, React.js, React Native (Expo), Node.js, Express.js, FastAPI, Web Audio API, WebSockets, RESTful APIs"
    },
    {
      category: "Cloud, DevOps & Systems",
      items: "Oracle Cloud Infrastructure (OCI), Docker, Docker Compose, GitHub Actions, APScheduler, Linux/Bash, FFmpeg"
    },
    {
      category: "Blockchain & Security",
      items: "Solidity 0.8, Hardhat, IPFS / Filecoin, WebCrypto API (AES-256-GCM), EVM Smart Contracts"
    },
    {
      category: "Databases & Tools",
      items: "MongoDB, PostgreSQL, SQLite, MySQL, Prisma ORM, Mongoose, Git, Postman"
    }
  ],
  education: [
    {
      period: "2024 - 2028",
      institution: "IILM University, Greater Noida",
      degree: "B.Tech in Computer Science and Engineering",
      score: "CGPA 9.30 / 10.00",
      detail: "Coursework: Data Structures & Algorithms, DBMS, Operating Systems, Software Engineering, OOP, Applied Statistics"
    },
    {
      period: "2023 - 2024",
      institution: "Aditya University",
      degree: "Senior Secondary (Intermediate - Science)",
      score: "87%",
      detail: ""
    },
    {
      period: "2021 - 2022",
      institution: "Kendriya Vidyalaya",
      degree: "Secondary (High School - Class X)",
      score: "92%",
      detail: ""
    }
  ],
  certifications: [
    { title: "Oracle Cloud Infrastructure Generative AI Professional", issuer: "Oracle" },
    { title: "DevOps & Cloud Automation Virtual Internship (Grade O)", issuer: "EduSkills & AICTE" },
    { title: "Data Science Master Virtual Internship", issuer: "Siemens & AICTE" },
    { title: "GenAI Powered Data Analytics Simulation", issuer: "TATA" },
    { title: "Artificial Intelligence Learning", issuer: "HP LIFE" },
    { title: "Introduction to Data Science", issuer: "IBM" },
    { title: "Exploring Blockchain", issuer: "Skillsoft" },
    { title: "CS50: Introduction to Computer Science", issuer: "Harvard University" }
  ]
};
