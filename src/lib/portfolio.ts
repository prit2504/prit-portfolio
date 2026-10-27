export const profile = {
  name: "Prit Panchal",
  role: "AI Engineer",
  email: "pprit2504@gmail.com",
  phone: "+91 9313975183",
  location: "Vadodara, India",
  website: "https://pprit.me",
  resume: "/Prit_Panchal_Resume.docx",
};

export const navigation = [
  { id: "home", file: "overview.sh", label: "Overview", command: "~/" },
  { id: "about", file: "about.md", label: "About", command: "~/about" },
  {
    id: "projects",
    file: "projects/",
    label: "Projects",
    command: "~/projects",
  },
  {
    id: "experience",
    file: "experience.log",
    label: "Experience",
    command: "~/experience",
  },
  { id: "skills", file: "stack.json", label: "Skills", command: "~/skills" },
  { id: "contact", file: "contact.sh", label: "Contact", command: "~/contact" },
] as const;

export const projects = [
  {
    id: "casey",
    number: "01",
    name: "Casey",
    subtitle: "Multi-agent task automation",
    category: "Agents",
    description:
      "A working team of AI agents that coordinates tools and executes multi-step tasks in an isolated sandbox.",
    tags: ["Python", "LangChain", "LangGraph"],
    status: "Working project",
    icon: "agents",
    details: [
      "Built a working automation system using LangChain-based tools and coordinated agent workflows.",
      "Integrated sandbox functionality for command execution and file operations, designed for separation from the host environment.",
      "Connected task planning, tool selection, and isolated execution into a multi-step agent workflow.",
    ],
    flow: ["Task", "Agent workflow", "Tools", "Sandbox"],
  },
  {
    id: "rag-chatbot",
    number: "02",
    name: "Document intelligence",
    subtitle: "RAG-powered document chatbot",
    category: "RAG",
    description:
      "From PDFs to grounded answers. A retrieval pipeline with semantic search and conversational memory.",
    tags: ["LangChain", "Qdrant", "FastAPI", "Docker"],
    status: "Project",
    icon: "rag",
    details: [
      "Implemented PDF ingestion, chunking, vector embeddings, semantic retrieval, and LLM-grounded question answering.",
      "Added short-term conversational context and long-term vector-backed retrieval for multi-turn document interactions.",
      "Used Qdrant for vector search, FastAPI for the backend, and Docker for packaging.",
    ],
    flow: ["PDF", "Embeddings", "Qdrant", "Grounded answer"],
  },
  {
    id: "scene-text",
    number: "03",
    name: "Reading the real world",
    subtitle: "Scene-text recognition with CRNN",
    category: "ML",
    description:
      "An end-to-end OCR pipeline that turns visual features into character sequences using CTC decoding.",
    tags: ["PyTorch", "CNN", "BiLSTM", "CTC"],
    status: "Project",
    icon: "ocr",
    details: [
      "Implemented a CRNN optical character recognition pipeline with CNN feature extraction and BiLSTM sequence modeling.",
      "Used CTC decoding to map image features to character sequences.",
      "Worked with the Synth90k and IIIT5K datasets for scene-text recognition.",
    ],
    flow: ["Image", "CNN", "BiLSTM", "CTC text"],
  },
  {
    id: "car-price",
    number: "04",
    name: "Predicting the next ride",
    subtitle: "Used-car price prediction",
    category: "ML",
    description:
      "A full-stack machine learning application connecting a Random Forest model to an interactive web frontend.",
    tags: ["scikit-learn", "FastAPI", "React", "Tailwind"],
    status: "Internship project",
    icon: "predict",
    details: [
      "Created a used-car price prediction application during the Edunet Foundation internship.",
      "Used a Random Forest model and exposed predictions through FastAPI REST endpoints.",
      "Connected the model API to a React and Tailwind frontend.",
    ],
    flow: ["Car features", "FastAPI", "Random Forest", "Estimate"],
  },
] as const;

export type Project = (typeof projects)[number];

export const experience = [
  {
    period: "APR 2026 — PRESENT",
    role: "Emerging System Engineer",
    specialization: "AI Engineer",
    company: "Navaera Software Services",
    current: true,
    bullets: [
      "Designed an AML/FINTRAC STR narration pipeline in internal testing, with observed narration time of approximately 5 minutes and support for up to 5,000 transactions per case.",
      "Built 14 deterministic transaction-pattern detectors for structuring, layering, velocity anomalies, and FX discrepancies.",
      "Separated calculations and evidence extraction from LLM narration, integrating locally hosted Qwen3-14B via vLLM with Pydantic-validated JSON and guided decoding.",
    ],
    tags: ["Python", "Qwen3-14B", "vLLM", "Pydantic"],
  },
  {
    period: "JAN 2026 — APR 2026",
    role: "AI Engineer Intern",
    specialization: "",
    company: "Navaera Software Services",
    current: false,
    bullets: [
      "Contributed to compliance-focused AI engineering initiatives and transitioned into a full-time engineering role.",
    ],
    tags: ["AI Engineering", "Compliance"],
  },
  {
    period: "JUN 2025 — JUL 2025",
    role: "Machine Learning & Power BI Intern",
    specialization: "",
    company: "Edunet Foundation · SAP-supported",
    current: false,
    bullets: [
      "Developed an interactive HR analytics dashboard with attrition, salary, and workforce KPIs in Power BI.",
      "Built a used-car price prediction app using Random Forest, FastAPI, and a React/Tailwind frontend.",
    ],
    tags: ["scikit-learn", "Power BI", "FastAPI", "React"],
  },
] as const;

export const skillGroups = [
  {
    title: "Languages",
    file: "languages",
    items: ["Python", "SQL", "JavaScript"],
  },
  {
    title: "Generative AI",
    file: "generative_ai",
    items: [
      "LangChain",
      "LangGraph",
      "RAG",
      "Qdrant",
      "Prompt engineering",
      "Structured output",
      "Pydantic",
      "MCP concepts",
    ],
  },
  {
    title: "LLM infrastructure",
    file: "infrastructure",
    items: ["vLLM", "Qwen", "Hugging Face", "Ollama", "LM Studio", "Docker"],
  },
  {
    title: "ML & backend",
    file: "ml_backend",
    items: [
      "PyTorch",
      "scikit-learn",
      "spaCy",
      "FastAPI",
      "REST APIs",
      "Git",
      "React.js",
      "Power BI",
    ],
  },
] as const;
