export const profile = {
  name: "Prit Panchal",
  role: "Full-Stack AI Engineer | Generative AI",
  email: "pprit2504@gmail.com",
  phone: "+91 9313975183",
  location: "Vadodara, India",
  website: "https://pprit.me",
  resume: "/Prit_Panchal_Resume.docx",
  summary:
    "AI Engineer with one year of hands-on experience building LLM-powered applications for banking clients. Developing CASEY, a multi-tenant, multi-agent AI assistant, and designed an AML/FINTRAC STR narration pipeline that reduced narration time from hours to about five minutes.",
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
    id: "pixeldrift",
    number: "01",
    name: "PixelDrift",
    subtitle: "Online PDF & image tools platform",
    category: "Platforms",
    description:
      "A responsive web platform for everyday PDF and image workflows, designed to keep file processing in the browser.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    status: "Deployed platform",
    icon: "pixel",
    url: "https://pixeldrift.online",
    details: [
      "Built and deployed a responsive platform for PDF merge, split, and compression, plus image compression, resizing, and conversion.",
      "Implemented browser-side processing so files never leave the user's device.",
      "Added SEO metadata and responsive navigation.",
    ],
    flow: ["Select file", "Process locally", "Export result"],
  },
  {
    id: "rag-chatbot",
    number: "02",
    name: "RAG-powered Document Chatbot",
    subtitle: "Document Q&A with semantic retrieval",
    category: "RAG",
    description:
      "A document question-answering application that grounds LLM responses in retrieved source content.",
    tags: ["Python", "LangChain", "Qdrant", "FastAPI", "Docker"],
    status: "Personal project",
    icon: "rag",
    url: null,
    details: [
      "Built PDF ingestion, chunking, embeddings, and Qdrant semantic retrieval.",
      "Generated LLM answers grounded in the source documents.",
      "Added short-term conversational context for follow-up questions.",
    ],
    flow: ["PDF ingestion", "Chunk & embed", "Qdrant retrieval", "Grounded answer"],
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
      "Developing CASEY, a multi-agent AI assistant embedded in Navaera's banking product, using a multi-tenant architecture that keeps each bank client's data securely isolated.",
      "Built a RAG pipeline over product guides, user manuals, and FINTRAC reporting forms using Qdrant and a self-hosted Qwen3.5-9B model on vLLM; the system is Dockerized.",
      "Implemented an NL2SQL agent that converts natural-language business questions into SQL, executes queries, and returns clear, user-friendly answers.",
      "Developed LangChain, LangGraph, and DeepAgents workflows for end-to-end task execution when required tools and APIs are available, with recommendations or manual steps otherwise.",
      "Added Redis-backed session memory for checkpoints, conversation history, and session keys; exposed services through FastAPI and added Prometheus, Grafana, Loki, and Langfuse observability.",
    ],
    tags: [
      "Python",
      "LangChain",
      "LangGraph",
      "DeepAgents",
      "Qdrant",
      "Redis",
      "FastAPI",
      "Docker",
      "Prometheus",
      "Grafana",
      "Loki",
      "Langfuse",
    ],
  },
  {
    period: "APR 2026 — PRESENT",
    role: "CASEY Narration Pipeline",
    specialization: "AML / FINTRAC STR Generation · Navaera",
    company: "Navaera Software Services",
    current: false,
    bullets: [
      "Designed an end-to-end pipeline that generates Suspicious Transaction Report narratives from transaction data; internal testing reduced narration time from hours to about five minutes for cases with up to 5,000 transactions.",
      "Built 14 deterministic, Pandas-based detectors for structuring, layering, velocity anomalies, and FX discrepancies, keeping counts, amounts, and evidence calculations in Python.",
      "Restricted the LLM to language generation using locally hosted Qwen3-14B on vLLM, Pydantic-validated JSON, and guided decoding to keep narratives structured and factually grounded.",
    ],
    tags: ["Python", "Pandas", "Qwen3-14B", "vLLM", "Pydantic", "FINTRAC"],
  },
  {
    period: "JAN 2026 — APR 2026",
    role: "AI Engineer Intern",
    specialization: "",
    company: "Navaera Software Services",
    current: false,
    bullets: [
      "Worked on compliance-focused AI engineering initiatives before converting to a full-time role.",
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
      "Built an interactive Power BI HR analytics dashboard covering KPIs, attrition, salary trends, and workforce insights.",
      "Developed a full-stack used-car price prediction application using Random Forest, FastAPI, React, and Tailwind CSS.",
    ],
    tags: ["Power BI", "Random Forest", "FastAPI", "React", "Tailwind CSS"],
  },
] as const;

export const skillGroups = [
  {
    title: "Languages",
    file: "languages",
    items: ["Python", "SQL", "JavaScript", "TypeScript"],
  },
  {
    title: "GenAI & agents",
    file: "genai_agents",
    items: [
      "LangChain",
      "LangGraph",
      "DeepAgents",
      "Multi-agent systems",
      "RAG",
      "NL2SQL",
      "Prompt engineering",
    ],
  },
  {
    title: "LLM & retrieval",
    file: "llm_retrieval",
    items: ["vLLM", "Ollama", "Hugging Face", "PyTorch", "Qdrant"],
  },
  {
    title: "Backend & data",
    file: "backend_data",
    items: [
      "FastAPI",
      "REST APIs",
      "Pydantic",
      "Pandas",
      "Redis",
      "Multi-tenant architecture",
    ],
  },
  {
    title: "DevOps & observability",
    file: "devops_observability",
    items: ["Docker", "Git", "Prometheus", "Grafana", "Loki", "Langfuse"],
  },
  {
    title: "Frontend",
    file: "frontend",
    items: ["React.js", "Next.js", "Tailwind CSS"],
  },
] as const;
