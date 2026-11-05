"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Terminal as TerminalIcon, X } from "lucide-react";
import { navigation, profile, projects, skillGroups } from "@/lib/portfolio";

type Entry = { command: string; output: string };
const commands = [
  "help",
  "whoami",
  "about",
  "projects",
  "experience",
  "skills",
  "education",
  "contact",
  "resume",
  "clear",
  "theme amber",
  "theme green",
  "ls",
  "pwd",
  "date",
  "exit",
];

export default function Terminal({
  open,
  onClose,
  onNavigate,
  onTheme,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
  onTheme: (theme: "amber" | "green") => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const output = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (open && !dialog.current?.open) {
      dialog.current?.showModal();
      input.current?.focus({ preventScroll: true });
    }
    if (!open) dialog.current?.close();
  }, [open]);
  useEffect(() => {
    if (open && output.current)
      output.current.scrollTop = output.current.scrollHeight;
  }, [entries, open]);

  function execute(event: FormEvent) {
    event.preventDefault();
    const raw = value.trim();
    if (!raw) return;
    const command = raw.toLowerCase().replace(/\s+/g, " ");
    setHistory((previous) => [...previous, raw]);
    setHistoryIndex(-1);
    setValue("");
    let output = "";
    const goTo = (id: string) => {
      dialog.current?.close();
      onClose();
      onNavigate(id);
    };
    const section = command.startsWith("cd ")
      ? command.slice(3).replace(/^~\/?/, "").replace(/\/$/, "")
      : command;
    if (command === "clear") {
      setEntries([]);
      return;
    }
    if (command === "exit") {
      onClose();
      return;
    }
    if (command === "help")
      output =
        "EXPLORE\n  whoami       A quick introduction\n  about        Read my story\n  projects     Explore selected work\n  experience   Follow my engineering journey\n  skills       View my technical stack\n  education    Academic background\n  contact      Get in touch\n  resume       Download my resume\n\nSHELL\n  ls / pwd     Explore this workspace\n  cd <section> Jump to a section\n  theme green  Switch to phosphor green\n  theme amber  Switch to warm amber\n  date         Current time in India\n  clear / exit Clear or close the terminal\n\nUse ↑ ↓ for history and Tab to autocomplete.";
    else if (command === "whoami")
      output = `${profile.name} — ${profile.role}\n${profile.location}\n\nI build multi-agent banking assistants, RAG and NL2SQL systems, and Python backends.\nCurrently: Emerging System Engineer (AI Engineer) at Navaera Software Services.`;
    else if (command === "ls" || command === "ls -la")
      output =
        "overview.sh  about.md  projects/  experience.log  stack.json  contact.sh\n\nTry: cd projects";
    else if (command === "pwd") output = "/home/prit/portfolio";
    else if (command === "date")
      output = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "full",
        timeStyle: "long",
      });
    else if (command === "education")
      output =
        "B.E. Information Technology\nSVIT, Vasad · 2022–2026\nCGPA: 8.46 / 10";
    else if (command === "resume") {
      const link = document.createElement("a");
      link.href = profile.resume;
      link.download = "Prit_Panchal_Resume.pdf";
      link.click();
      output = "Downloading Prit_Panchal_Resume.pdf…";
    } else if (command.startsWith("theme ")) {
      const theme = command.slice(6);
      if (theme === "amber" || theme === "green") {
        onTheme(theme);
        output = `Theme set to ${theme}.`;
      } else output = "Available themes: amber, green. Try: theme green";
    } else if (command === "skills")
      output = skillGroups
        .map((group) => `${group.title}\n  ${group.items.join(" · ")}`)
        .join("\n\n");
    else if (command === "projects")
      output =
        projects
          .map(
            (project) =>
              `${project.number}  ${project.name}\n    ${project.subtitle}\n    ${project.tags.join(" · ")}`,
          )
          .join("\n\n") + "\n\nTip: cd projects opens the project explorer.";
    else if (command === "contact")
      output = `Email: ${profile.email}\nPhone: ${profile.phone}\nLocation: ${profile.location}\n\nTip: cd contact opens the contact section.`;
    else if (
      command === "cd" ||
      command === "cd ~" ||
      command === "cd /" ||
      command === "cd .." ||
      section === "home"
    ) {
      goTo("home");
      return;
    } else if (navigation.some((item) => item.id === section)) {
      goTo(section);
      return;
    } else if (command === "sudo" || command.startsWith("sudo "))
      output = "Nice try :) You already have everything you need. Try help.";
    else
      output = `Command not found: ${raw}\nType help to see available commands.`;
    setEntries((previous) =>
      [...previous, { command: raw, output }].slice(-50),
    );
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const index =
        historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(index);
      setValue(history[index] ?? "");
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === -1) return;
      const index = historyIndex + 1;
      if (index >= history.length) {
        setHistoryIndex(-1);
        setValue("");
      } else {
        setHistoryIndex(index);
        setValue(history[index] ?? "");
      }
    } else if (event.key === "Tab" && value.trim()) {
      const matches = commands.filter((command) =>
        command.startsWith(value.toLowerCase()),
      );
      if (matches.length === 1) {
        event.preventDefault();
        setValue(matches[0]);
      }
    } else if (event.ctrlKey && event.key === "l") {
      event.preventDefault();
      setEntries([]);
    }
  }

  return (
    <dialog
      className="terminal-dialog"
      ref={dialog}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="terminal-title"
    >
      <div className="dialog-inner w-full overflow-hidden rounded-[7px]">
        <div className="window-bar">
          <span
            className="window-title flex items-center gap-[9px] text-[10px] text-[#a4b094]"
            id="terminal-title"
          >
            <TerminalIcon size={15} /> prit@portfolio: ~
          </span>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close terminal"
          >
            <X size={17} />
          </button>
        </div>
        <div
          ref={output}
          className="terminal-output"
          role="log"
          aria-label="Terminal output"
          aria-live="polite"
        >
          <p className="terminal-welcome mb-[7px] text-accent">
            Welcome to my little corner of the internet.
          </p>
          <p>
            Type <span className="accent text-accent">help</span> to get
            started. This shell explores the portfolio.
          </p>
          {entries.map((entry, index) => (
            <div className="terminal-entry mt-[23px]" key={index}>
              <p>
                <span className="green text-terminal-green">
                  prit@portfolio
                </span>
                <span className="muted text-muted">:~$ </span>
                {entry.command}
              </p>
              <pre>{entry.output}</pre>
            </div>
          ))}
        </div>
        <form className="terminal-form" onSubmit={execute}>
          <label htmlFor="terminal-input">
            <span className="green text-terminal-green">prit@portfolio</span>
            <span className="muted text-muted">:~$</span>
          </label>
          <input
            ref={input}
            id="terminal-input"
            aria-label="Terminal command"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setHistoryIndex(-1);
            }}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            enterKeyHint="send"
            spellCheck={false}
            placeholder="type a command…"
          />
          <button
            className="terminal-enter"
            aria-label="Run command"
            type="submit"
          >
            ↵
          </button>
        </form>
        <div className="terminal-hints">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> history
          </span>
          <span>
            <kbd>tab</kbd> complete
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </dialog>
  );
}
