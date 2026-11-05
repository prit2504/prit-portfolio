"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  Code2,
  Copy,
  Cpu,
  FileCode2,
  FileJson,
  FileText,
  Folder,
  GitBranch,
  GraduationCap,
  Layers3,
  Mail,
  MapPin,
  Menu,
  Network,
  PanelLeftClose,
  Phone,
  Send,
  Sparkles,
  Terminal as TerminalIcon,
  X,
} from "lucide-react";
import {
  experience,
  navigation,
  profile,
  projects,
  Project,
  skillGroups,
} from "@/lib/portfolio";
import Terminal from "./terminal";
import { cn } from "@/lib/utils";
import { useSectionNavigation } from "@/hooks/use-section-navigation";

const sectionIcons = [
  TerminalIcon,
  FileText,
  Folder,
  GitBranch,
  FileJson,
  Mail,
];
const filters = ["All projects", "Platforms", "RAG"] as const;
const ascii = [
  "██████╗ ██████╗ ",
  "██╔══██╗██╔══██╗",
  "██████╔╝██████╔╝",
  "██╔═══╝ ██╔═══╝ ",
  "██║     ██║     ",
  "╚═╝     ╚═╝     ",
].join("\n");

function SectionTitle({
  number,
  command,
  title,
  description,
}: {
  number: string;
  command: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading mb-9 max-[760px]:mb-7">
      <div className="section-command mb-4 flex items-center gap-[11px] text-[10px] text-[#a3aa97] max-[760px]:mb-[15px]">
        <span>{number}</span>
        <span className="green text-terminal-green">❯</span> {command}
      </div>
      <h2 id={`section-title-${number}`}>
        {title}
        <span className="accent text-accent">.</span>
      </h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  if (project.icon === "pixel")
    return (
      <div className="project-visual agent-visual" aria-hidden="true">
        <div className="visual-label">
          <span className="status-dot" /> pixeldrift.tools
        </div>
        <div className="agent-graph">
          <div className="graph-node task-node">
            <FileText size={16} /> PDF tools
          </div>
          <div className="graph-stem" />
          <div className="graph-node orchestrator">
            <Layers3 size={17} /> browser processing
          </div>
          <div className="graph-branches" />
          <div className="graph-children">
            <span><Folder size={16} /> images</span>
            <span><FileText size={16} /> documents</span>
          </div>
        </div>
        <span className="visual-footnote">private files · local processing</span>
      </div>
    );
    return (
      <div className="project-visual rag-visual" aria-hidden="true">
        <div className="visual-label">retrieval.pipeline</div>
        <div className="rag-diagram">
          <div className="document-stack">
            <FileText size={33} />
          </div>
          <span className="flow-line" />
          <div className="vector-grid">
            {Array.from({ length: 25 }, (_, i) => (
              <i key={i} style={{ opacity: 0.2 + ((i * 7) % 9) / 10 }} />
            ))}
          </div>
          <span className="flow-line" />
          <div className="answer-bubble">
            <Sparkles size={19} />
            <i />
            <i />
          </div>
        </div>
        <span className="visual-footnote">ingest → retrieve → reason</span>
      </div>
    );
}

function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (project && !ref.current?.open) ref.current?.showModal();
    if (!project) ref.current?.close();
  }, [project]);
  return (
    <dialog
      ref={ref}
      className="project-dialog"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="project-title"
    >
      <div className="dialog-inner w-full overflow-hidden rounded-[7px]">
        {project && (
          <>
            <div className="window-bar">
              <span className="window-title flex items-center gap-[9px] text-[10px] text-[#a4b094]">
                <Folder size={15} /> ~/projects/{project.id}
              </span>
              <button
                className="icon-button"
                onClick={onClose}
                aria-label="Close project details"
              >
                <X size={18} />
              </button>
            </div>
            <ProjectVisual project={project} />
            <div className="project-detail-content">
              <div className="eyebrow">
                {project.category} / {project.status}
              </div>
              <h2 id="project-title">{project.name}</h2>
              <p className="project-subtitle mt-[5px] font-sans text-[11px] text-[#939d85]">
                {project.subtitle}
              </p>
              <p>{project.description}</p>
              <h3>Inside the project</h3>
              <ul>
                {project.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              <h3>Architecture</h3>
              <div className="architecture mb-6 flex flex-wrap items-center gap-[9px]">
                {project.flow.map((step, index) => (
                  <span key={step}>
                    {index > 0 && <ArrowRight size={14} />}
                    <b>{step}</b>
                  </span>
                ))}
              </div>
              <div className="tags flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <a
                className="text-link mt-[26px] inline-flex items-center gap-2 text-[10px] text-accent hover:text-foreground"
                href={`mailto:${profile.email}?subject=${encodeURIComponent(`Let's talk about ${project.name}`)}`}
              >
                Discuss this project <ArrowUpRight size={15} />
              </a>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}

export default function Portfolio() {
  const { active, navigate: scrollToSection } = useSectionNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [theme, setTheme] = useState<"amber" | "green">("amber");
  const [filter, setFilter] =
    useState<(typeof filters)[number]>("All projects");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const terminalTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("prit-portfolio-theme");
      if (saved === "amber" || saved === "green") setTheme(saved);
    } catch {
      /* Storage is optional. */
    }
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);
  useEffect(() => {
    const handleKey = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setMenuOpen(false);
        setTerminalOpen((previous) => !previous);
      }
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  const overlayOpen = menuOpen || terminalOpen || selectedProject !== null;
  useEffect(() => {
    if (!overlayOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [overlayOpen]);

  function navigate(id: string) {
    setMenuOpen(false);
    scrollToSection(id);
  }
  function openTerminal() {
    setMenuOpen(false);
    setTerminalOpen(true);
  }
  function changeTheme(nextTheme: "amber" | "green") {
    setTheme(nextTheme);
    try {
      localStorage.setItem("prit-portfolio-theme", nextTheme);
    } catch {
      /* Storage is optional. */
    }
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => {
      setCopied(false);
      setCopyError(false);
    }, 3000);
  }

  const activeItem =
    navigation.find((item) => item.id === active) ?? navigation[0];
  const visibleProjects =
    filter === "All projects"
      ? projects
      : projects.filter((project) => project.category === filter);

  return (
    <div className="workspace min-h-screen bg-background" data-theme={theme}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="titlebar">
        <div className="titlebar-brand flex items-center gap-[9px] text-[15px] font-semibold max-[760px]:text-sm">
          <span className="brand-icon flex text-accent">
            <TerminalIcon size={18} />
          </span>
          <span>
            pprit<span className="muted text-muted">.me</span>
          </span>
          <span className="titlebar-divider">/</span>
          <span className="titlebar-caption">personal workspace</span>
        </div>
        <div className="titlebar-center">prit@portfolio: ~</div>
        <div className="titlebar-right ml-auto flex items-center gap-[26px]">
          <span className="connection flex items-center gap-[7px] text-[10px] text-muted max-[760px]:hidden">
            <i className="status-dot" /> system online
          </span>
          <button
            ref={terminalTrigger}
            className="command-toggle"
            onClick={openTerminal}
            aria-label="Open interactive terminal"
          >
            <TerminalIcon size={14} />
            <span>Terminal</span>
            <kbd>Ctrl K</kbd>
          </button>
        </div>
        <button
          className="mobile-menu icon-button"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="sidebar"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {menuOpen && (
        <button
          className="sidebar-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <aside
        className={cn("sidebar", menuOpen && "is-open")}
        id="sidebar"
        aria-label="Portfolio explorer"
      >
        <div className="explorer-label">
          EXPLORER <PanelLeftClose size={14} />
        </div>
        <div className="explorer-root">
          <ChevronDown size={14} />
          <Folder size={15} />
          <span>portfolio</span>
          <span className="folder-count">6</span>
        </div>
        <nav aria-label="Main navigation">
          {navigation.map((item, index) => {
            const Icon = sectionIcons[index];
            return (
              <a
                key={item.id}
                href={item.id === "home" ? "#home" : `#${item.id}`}
                className={cn("nav-item", active === item.id && "active")}
                aria-current={active === item.id ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(item.id);
                }}
              >
                <Icon size={16} />
                <span>{item.file}</span>
                {active === item.id && <span className="nav-active-dot" />}
              </a>
            );
          })}
        </nav>
        <div className="sidebar-block">
          <div className="sidebar-label">CURRENTLY</div>
          <div className="current-role">
            <span className="status-dot" />
            <span>Full-Stack AI Engineer</span>
          </div>
          <p>@ Navaera Software Services</p>
          <span className="sidebar-location">
            <MapPin size={12} /> Vadodara, India
          </span>
        </div>
        <div className="sidebar-bottom">
          <div className="terminal-tip">
            <span className="tip-icon">✦</span>
            <p>
              More of a terminal person?
              <br />
              <button onClick={openTerminal}>
                Try the interactive shell <ArrowUpRight size={12} />
              </button>
            </p>
          </div>
          <a className="sidebar-resume" href={profile.resume} download>
            <ArrowDownToLine size={15} /> Download resume <span>.pdf</span>
          </a>
          <div className="theme-row">
            <span>COLOR THEME</span>
            <div role="group" aria-label="Color theme">
              <button
                className={cn("theme-option", theme === "amber" && "selected")}
                onClick={() => changeTheme("amber")}
                aria-label="Use amber theme"
                aria-pressed={theme === "amber"}
              >
                <span className="theme-dot amber" aria-hidden="true" /> Amber
              </button>
              <button
                className={cn("theme-option", theme === "green" && "selected")}
                onClick={() => changeTheme("green")}
                aria-label="Use green theme"
                aria-pressed={theme === "green"}
              >
                <span className="theme-dot phosphor" aria-hidden="true" /> Green
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="editor">
        <div className="editor-tabs">
          <div className="editor-tab">
            <TerminalIcon size={14} />
            <span>{activeItem.file}</span>
            <span className="tab-dot" />
          </div>
          <span className="editor-tab-hint">read, explore, connect.</span>
        </div>
        <main id="main">
          <div className="content-wrap mx-auto max-w-[1320px] px-[62px] min-[1600px]:px-20 max-[1250px]:px-[38px] max-[760px]:max-w-[690px] max-[760px]:px-[25px] max-[480px]:px-[21px]">
            <section
              id="home"
              className="hero section-anchor flex min-h-[680px] flex-col min-[1600px]:min-h-[750px]"
              aria-labelledby="hero-title"
            >
              <div className="breadcrumb">
                <span>home</span>
                <ChevronRight size={12} />
                <span>prit</span>
                <ChevronRight size={12} />
                <span className="accent text-accent">portfolio</span>
                <span className="breadcrumb-permissions">drwxr-xr-x</span>
              </div>
              <div className="hero-content">
                <div className="hero-copy">
                  <div className="hero-command">
                    <span className="green text-terminal-green">
                      prit@portfolio
                    </span>
                    <span className="muted text-muted">:~$</span> whoami
                    <span className="block-cursor" />
                  </div>
                  <div className="eyebrow hero-eyebrow">
                    HELLO, WORLD. I&apos;M
                  </div>
                  <h1 id="hero-title">
                    Prit
                    <br />
                    Panchal
                    <span className="accent text-accent" aria-hidden="true">
                      _
                    </span>
                    <span className="hero-role leading-normal">
                      <span className="accent text-accent" aria-hidden="true">
                        ❯
                      </span>{" "}
                      Full-Stack AI Engineer <span className="role-slash">/</span>{" "}
                      <span className="muted text-muted">Generative AI</span>
                    </span>
                  </h1>
                  <p className="hero-description">
                    Building multi-agent AI assistants, RAG systems,
                    <br className="desktop-break" /> and reliable Python backends for banking
                    backends.
                  </p>
                  <p className="hero-specialties">
                    Generative AI <span>·</span> Multi-agent systems{" "}
                    <span>·</span> Python
                  </p>
                  <div className="hero-actions">
                    <a
                      className="button button-primary"
                      href="#projects"
                      onClick={(event) => {
                        event.preventDefault();
                        navigate("projects");
                      }}
                    >
                      <Folder size={16} /> Explore my work{" "}
                      <ArrowDown size={15} />
                    </a>
                    <a
                      className="button button-secondary"
                      href={`mailto:${profile.email}`}
                    >
                      <Mail size={16} /> Let&apos;s talk{" "}
                      <ArrowUpRight size={15} />
                    </a>
                  </div>
                  <div className="hero-location">
                    <MapPin size={13} />
                    <span>Vadodara, India</span>
                    <span className="dot-separator">·</span>
                    <span>Building with purpose.</span>
                  </div>
                </div>
                <div className="hero-terminal">
                  <div className="window-bar">
                    <div className="window-dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </div>
                    <span>system_info.sh</span>
                    <TerminalIcon size={13} />
                  </div>
                  <div className="system-terminal">
                    <p className="terminal-command">
                      <span className="green text-terminal-green">❯</span>{" "}
                      neofetch
                    </p>
                    <div className="neofetch">
                      <pre className="ascii-mark" aria-label="PP monogram">
                        {ascii}
                      </pre>
                      <div className="neofetch-info">
                        <strong>
                          prit<span className="muted text-muted">@</span>
                          portfolio
                        </strong>
                        <span className="info-divider">──────────────────</span>
                        <p>
                          <span>Role</span> Full-Stack AI Engineer
                        </p>
                        <p>
                          <span>Focus</span> Agents & RAG
                        </p>
                        <p>
                          <span>Lang</span> Python / TypeScript
                        </p>
                        <p>
                          <span>Shell</span> Curiosity
                        </p>
                        <p>
                          <span>Editor</span> VS Code
                        </p>
                        <p>
                          <span>Location</span> India 🇮🇳
                        </p>
                      </div>
                    </div>
                    <div className="color-palette" aria-hidden="true">
                      {[
                        "#565a50",
                        "#b77865",
                        "#a7b888",
                        "#d5b477",
                        "#8a9eae",
                        "#b69bb3",
                        "#92b9ad",
                        "#dedbd0",
                      ].map((color) => (
                        <i key={color} style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <div className="system-divider" />
                    <div className="system-current">
                      <span className="muted text-muted">
                        # currently building
                      </span>
                      <p>
                        <span className="green text-terminal-green">◆</span>{" "}
                        LLM-powered automation
                      </p>
                      <p>
                        <span className="green text-terminal-green">◆</span>{" "}
                        Reliable Python backends
                      </p>
                    </div>
                    <div className="terminal-bottom-line">
                      <span className="green text-terminal-green">❯</span>
                      <span className="block-cursor" />
                      <span className="muted text-muted">
                        always learning, always shipping.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hero-footer">
                <span>
                  <span className="green text-terminal-green">01</span> / 06{" "}
                  <span className="muted text-muted">— a little about me</span>
                </span>
                <a
                  href="#about"
                  onClick={(event) => {
                    event.preventDefault();
                    navigate("about");
                  }}
                >
                  scroll to explore <ArrowDown size={13} />
                </a>
              </div>
            </section>

            <section
              id="about"
              className="content-section section-anchor"
              aria-labelledby="section-title-01"
            >
              <SectionTitle
                number="01"
                command="cat about.md"
                title="Engineering intelligence"
                description="A little context behind the commands."
              />
              <div className="about-grid">
                <div className="about-prose">
                  <p>
                    I&apos;m Prit, an AI Engineer who enjoys taking an idea from{" "}
                    <span className="bright text-foreground">
                      “what if” to a working system.
                    </span>{" "}
                    I work across agentic workflows, retrieval-augmented generation, natural-language-to-SQL, and full-stack applications with a
                    focus on building reliable, useful systems.
                  </p>
                  <p>
                    At Navaera Software Services, I work on compliance-focused
                    AI: combining deterministic transaction analysis with
                    structured LLM narration. My approach is simple — let code
                    handle the numbers, and give the model grounded evidence to
                    work with.
                  </p>
                  <p>
                    Outside that work, I build independent products, including{" "}
                    <span className="accent text-accent">Casey</span>, a browser-based PDF and image tools platform, and explore document intelligence with RAG.
                  </p>
                  <div className="about-principle">
                    <Code2 size={19} />
                    <span>
                      Ground the output. Isolate the execution.
                      <br />
                      <span className="muted text-muted">
                        Build something that actually works.
                      </span>
                    </span>
                  </div>
                </div>
                <div className="about-facts">
                  <div className="facts-title">
                    <FileCode2 size={14} /> impact.yaml{" "}
                    <span>INTERNAL TESTING</span>
                  </div>
                  <div className="fact-row">
                    <strong>
                      ~5<span>min</span>
                    </strong>
                    <p>
                      STR narration time
                      <br />
                      <span>versus hours previously</span>
                    </p>
                  </div>
                  <div className="fact-row">
                    <strong>5,000</strong>
                    <p>
                      transactions supported
                      <br />
                      <span>per compliance case</span>
                    </p>
                  </div>
                  <div className="fact-row">
                    <strong>14</strong>
                    <p>
                      rule-based detectors
                      <br />
                      <span>deterministic Python logic</span>
                    </p>
                  </div>
                  <p className="fact-note">
                    Observed in an internally tested AML/FINTRAC narration
                    pipeline.
                  </p>
                </div>
              </div>
            </section>

            <section
              id="projects"
              className="content-section section-anchor"
              aria-labelledby="section-title-02"
            >
              <SectionTitle
                number="02"
                command="ls -la projects/"
                title="Selected projects"
                description="Products and engineering projects, from browser-based tools to grounded document intelligence."
              />
              <div className="project-toolbar mb-[23px] flex items-center justify-between gap-3">
                <div
                  className="project-filters flex flex-wrap gap-[5px] max-[480px]:gap-0.5"
                  role="group"
                  aria-label="Filter projects"
                >
                  {filters.map((item) => (
                    <button
                      key={item}
                      onClick={() => setFilter(item)}
                      aria-pressed={filter === item}
                      className={filter === item ? "selected" : ""}
                    >
                      {item}
                      {item === "All projects" && (
                        <span>{projects.length}</span>
                      )}
                    </button>
                  ))}
                </div>
                <span
                  className="project-count whitespace-nowrap text-[9px] text-dim max-[480px]:text-[8px]"
                  aria-live="polite"
                >
                  {visibleProjects.length} directories
                </span>
              </div>
              <div className="project-grid grid grid-cols-1 items-stretch gap-6 min-[481px]:grid-cols-2 max-[1050px]:gap-[17px] max-[760px]:gap-[18px] max-[480px]:gap-[22px]">
                {visibleProjects.map((project) => (
                  <article className="project-card" key={project.id}>
                    <button
                      className="project-open flex h-full w-full flex-col bg-transparent p-0 text-left"
                      onClick={() => setSelectedProject(project)}
                      aria-label={`View ${project.name} project details`}
                    >
                      <ProjectVisual project={project} />
                      <div className="project-card-content">
                        <div className="project-card-top mb-[13px] flex items-center gap-2.5">
                          <span className="project-number text-[9px] text-dim">
                            /{project.number}
                          </span>
                          <span className="project-category">
                            {project.category}
                          </span>
                          <ArrowUpRight size={18} />
                        </div>
                        <h3>{project.name}</h3>
                        <div className="project-subtitle mt-[5px] font-sans text-[11px] text-[#939d85]">
                          {project.subtitle}
                        </div>
                        <p>{project.description}</p>
                        <div className="tags flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                        <div className="project-card-footer">
                          <span>
                            <Circle size={7} fill="currentColor" />{" "}
                            {project.status}
                          </span>
                          <span>
                            Explore project <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section
              id="experience"
              className="content-section section-anchor"
              aria-labelledby="section-title-03"
            >
              <SectionTitle
                number="03"
                command="git log --oneline"
                title="Professional experience"
                description="Building production-oriented AI systems for banking and compliance workflows."
              />
              <div className="timeline relative ml-[5px]">
                {experience.map((job, index) => (
                  <article className="timeline-item" key={job.role}>
                    <div
                      className={cn("timeline-node", job.current && "current")}
                    />
                    <div className="timeline-date">
                      {job.period}
                      {job.current && (
                        <span className="current-badge">HEAD</span>
                      )}
                      <span className="commit-hash">
                        {["a1e2026", "b7f2026", "c3d2025"][index]}
                      </span>
                    </div>
                    <div className="timeline-content">
                      <h3>{job.role}</h3>
                      {job.specialization && (
                        <span className="job-specialization">
                          {job.specialization}
                        </span>
                      )}
                      <p className="company">{job.company}</p>
                      <ul>
                        {job.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                      <div className="tags flex flex-wrap gap-1.5">
                        {job.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="education-panel">
                <div className="education-icon">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <span className="eyebrow">EDUCATION / 2022–2026</span>
                  <h3>B.E. Information Technology</h3>
                  <p>SVIT, Vasad</p>
                </div>
                <div className="cgpa">
                  <strong>
                    8.46<span>/10</span>
                  </strong>
                  <span>CGPA</span>
                </div>
              </div>
            </section>

            <section
              id="skills"
              className="content-section section-anchor"
              aria-labelledby="section-title-04"
            >
              <SectionTitle
                number="04"
                command="cat stack.json"
                title="Technical skills"
                description="Languages, agent frameworks, LLM infrastructure, backend, frontend, and observability."
              />
              <div className="skills-grid grid grid-cols-1 gap-5 min-[481px]:grid-cols-2 max-[760px]:gap-[15px]">
                {skillGroups.map((group, index) => {
                  const Icon = [Braces, Sparkles, Cpu, Layers3][index];
                  return (
                    <article className="skill-card" key={group.title}>
                      <div className="skill-card-heading flex items-center justify-between text-accent">
                        <Icon size={19} />
                        <span>0{index + 1}</span>
                      </div>
                      <h3>{group.title}</h3>
                      <div className="skill-code-label">
                        &quot;{group.file}&quot;: [
                      </div>
                      <div className="skill-items">
                        {group.items.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                      <span className="skill-close text-[10px] text-[#6c795d]">
                        ]
                      </span>
                    </article>
                  );
                })}
              </div>
              <div className="stack-note">
                <span className="green text-terminal-green">✓</span> Always
                adding to the stack.
                <span className="muted text-muted">
                  {" "}
                  Curiosity is a dependency.
                </span>
              </div>
            </section>

            <section
              id="contact"
              className="content-section contact-section section-anchor"
              aria-labelledby="section-title-05"
            >
              <SectionTitle
                number="05"
                command="./contact.sh"
                title="Let's build something"
                description="Have an interesting problem, a project, or an idea? Let's talk."
              />
              <div className="contact-grid">
                <div>
                  <a className="contact-email" href={`mailto:${profile.email}`}>
                    {profile.email}
                    <ArrowUpRight size={25} />
                  </a>
                  <div className="contact-copy mt-3 flex items-center gap-2.5">
                    <button onClick={copyEmail} className="copy-button">
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      {copied ? "Copied to clipboard" : "Copy email address"}
                    </button>
                    <span
                      role="status"
                      className="copy-feedback text-[8px] text-accent"
                    >
                      {copyError
                        ? "Please select and copy the email above."
                        : ""}
                    </span>
                  </div>
                  <div className="contact-links">
                    <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>
                      <Phone size={14} />
                      {profile.phone}
                    </a>
                    <span>
                      <MapPin size={14} />
                      {profile.location}
                    </span>
                  </div>
                  <a
                    className="button button-primary contact-cta"
                    href={`mailto:${profile.email}?subject=Let's%20build%20something`}
                  >
                    <Send size={16} /> Say hello <ArrowUpRight size={15} />
                  </a>
                </div>
                <div className="contact-code">
                  <div>
                    <span className="muted text-muted">
                      # a good conversation starts here
                    </span>
                  </div>
                  <p>
                    <span className="code-purple">def</span>{" "}
                    <span className="accent text-accent">start_something</span>
                    ():
                  </p>
                  <p className="indent">
                    idea ={" "}
                    <span className="green text-terminal-green">
                      "your next big thing"
                    </span>
                  </p>
                  <p className="indent">
                    <span className="code-purple">return</span>{" "}
                    collaborate(idea)
                  </p>
                  <p className="code-last-line mt-5">
                    <span className="green text-terminal-green">❯</span>{" "}
                    <span className="block-cursor" />
                  </p>
                </div>
              </div>
            </section>

            <footer className="page-footer">
              <a
                href="#home"
                className="footer-brand"
                onClick={(event) => {
                  event.preventDefault();
                  navigate("home");
                }}
              >
                <TerminalIcon size={16} /> pprit.me
              </a>
              <span>Built with Next.js. Powered by curiosity.</span>
              <a
                href="#home"
                onClick={(event) => {
                  event.preventDefault();
                  navigate("home");
                }}
              >
                Back to top <ArrowUpRight size={13} />
              </a>
            </footer>
          </div>
        </main>
      </div>

      <footer className="statusbar">
        <div>
          <span className="status-branch">
            <GitBranch size={12} /> main*
          </span>
          <span className="status-ready">
            <Check size={12} /> ready
          </span>
          <span className="status-path">
            ~/portfolio/{active === "home" ? "" : active}
          </span>
        </div>
        <div>
          <button onClick={openTerminal}>
            <TerminalIcon size={12} /> Open terminal <kbd>Ctrl K</kbd>
          </button>
          <span className="status-encoding">UTF-8</span>
          <span className="status-language">
            <Code2 size={12} /> TypeScript
          </span>
          <span className="status-theme">
            <i className="status-dot" /> {theme}
          </span>
        </div>
      </footer>
      <Terminal
        open={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onNavigate={navigate}
        onTheme={changeTheme}
      />
      <ProjectDialog
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
