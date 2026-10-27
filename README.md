# Prit Panchal — Terminal Portfolio

A complete Linux-terminal-inspired portfolio built with Next.js App Router, React, TypeScript, Tailwind CSS v4, and Lucide icons. Content is based on the supplied resume.

## Run locally

Requires Node.js 20.9 or newer and npm.

```sh
npm install
npm run dev
```

Open http://localhost:3000.

The local network preview at `http://192.168.56.1:3000` is explicitly allowed in `next.config.ts` so the development connection and interactive controls work there. If your network address changes, add the new trusted hostname to `allowedDevOrigins` and restart the dev server. Production hosting does not use this development setting.

## Production

```sh
npm run typecheck
npm run build
npm start
```

The site can run on any host that supports Next.js. No API keys or database are required. Local development works without environment variables.

## On-page SEO

The page includes a focused title and description, author metadata, a single visible H1 with name and role, descriptive section headings, semantic sections, Open Graph and Twitter metadata, and server-rendered ProfilePage/Person JSON-LD based on the resume. All four projects and the experience content are present in the initial HTML, including when JavaScript is disabled.

The `/social-image` route generates a 1200 × 630 PNG matching the terminal theme. `/robots.txt` permits crawling. `/sitemap.xml` lists the homepage once; section fragments are not separate pages.

The production domain is configured as **https://pprit.me** in `src/lib/portfolio.ts`. Builds use this domain automatically for canonical links, social image tags, the Open Graph page URL, profile identifiers, and the sitemap. No environment variable is required.

To override the domain for another deployment, set `SITE_URL` before building:

```dotenv
SITE_URL=https://pprit.me
```

Use an absolute origin without a path. If you set an override locally, put it in `.env.local`; configure the same value in your hosting provider's environment **before building**, then rebuild/redeploy. The social image route still works locally.

After public deployment, verify the URL with Google Search Console and submit `/sitemap.xml`. Search Console ownership and indexing happen on the deployed domain; they are not performed by this local project.

## Browser verification

```sh
npm run build
npm run test:e2e
```

The Playwright checks cover desktop and mobile rendering, project filters and dialogs, terminal commands, navigation, themes, contact links, clipboard access, resume downloads, server-rendered SEO tags, structured data, crawler files, and the social image. The test configuration uses a locally installed Google Chrome and starts its own production server on port 3100. Screenshots and traces are saved in the ignored `.qa/` directory.

Use `npm run format` to format source files and `npm run format:check` to check formatting.

## Frontend stack

- **Tailwind CSS v4** with the official PostCSS plugin, theme tokens, responsive utilities, and shared `@apply` components
- **Lucide React** for consistent SVG icons
- **clsx + tailwind-merge** through `src/lib/utils.ts` for safe conditional class composition
- Native HTML dialogs for focus trapping and Escape support
- **Playwright** for desktop and mobile browser verification

## Features

- Responsive explorer navigation and active section tracking
- Resume-based overview, background, experience, education, projects, skills, and contact
- Filterable projects with keyboard-accessible detail dialogs and architecture diagrams
- Interactive portfolio terminal with command history and tab completion
- Amber and phosphor-green themes, saved locally
- Downloadable original DOCX resume, email links, click-to-call, and clipboard copy
- Metadata, Open Graph tags, custom favicon, reduced-motion support, and a skip link

## Terminal

Open the terminal with **Ctrl+K** (or **Cmd+K** on macOS), the header button, or the status bar.

| Command                                      | Action                                                                        |
| -------------------------------------------- | ----------------------------------------------------------------------------- |
| `help`                                       | Show all commands                                                             |
| `whoami`                                     | Show a short introduction                                                     |
| `about`, `experience`                        | Jump to the relevant section                                                  |
| `projects`, `skills`, `education`, `contact` | Print resume content                                                          |
| `cd projects`                                | Jump to a section; also supports about, skills, experience, contact, and home |
| `resume`                                     | Download the resume                                                           |
| `theme green`, `theme amber`                 | Change the accent theme                                                       |
| `ls`, `pwd`, `date`                          | Explore the virtual workspace                                                 |
| `clear`, `exit`                              | Clear output or close the terminal                                            |

Use ↑/↓ for history, Tab to complete a unique command, Ctrl+L to clear output, and Escape to close. This is a simulated portfolio shell; it does not execute system commands.

## Customize

- `src/lib/portfolio.ts`: contact details, navigation, projects, experience, and skills
- `src/components/portfolio.tsx`: overview, biography, layout, and visual components
- `src/components/terminal.tsx`: terminal commands and behavior
- `src/app/globals.css`: Tailwind imports, `@theme` tokens, shared components, and terminal artwork
- `src/app/layout.tsx`: page metadata
- `public/Prit_Panchal_Resume.docx`: downloadable resume

Google Fonts are loaded with `display=swap`; system monospace and sans-serif fallbacks work if fonts are unavailable. The application itself requires no third-party service.

The resume's GitHub and LinkedIn fields are placeholders, so the site does not include fabricated profile URLs or project repository links. Add verified URLs when available. AML pipeline results retain their original internal-testing qualification. Project visuals are schematic illustrations, not live model outputs.
