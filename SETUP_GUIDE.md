# Setup Guide — Vishal Ranga Portfolio

This explains everything from zero: what's in the project, how to run it, how to
customize it, and how to put it online. Written assuming no prior Next.js experience.

---

## 1. What you're looking at

This is a **Next.js** website — Next.js is a framework built on top of **React** (a
library for building web UIs out of reusable pieces called "components"). Next.js adds
routing (which URL shows which page), the ability to generate fast pre-built HTML, and a
structured way to organize a real project.

The stack:
- **Next.js** — the framework, decides what page loads at what URL
- **React** — builds the actual UI out of components (`Hero.tsx`, `Navbar.tsx`, etc.)
- **TypeScript** — JavaScript with type-checking, catches mistakes before they become bugs
- **Tailwind CSS** — styling via utility classes in your markup instead of separate CSS files
- **Framer Motion** — the animation library behind the fade-ins and the hero's animated diagram
- **Lucide** — the icon set used throughout (the little SVG icons like the mail/GitHub icons)

## 2. Folder structure

```
portfolio/
├── app/                    Every folder in here = a URL route (Next.js "App Router")
│   ├── page.tsx             → the homepage (/)
│   ├── layout.tsx           → wraps every page: fonts, <html>, SEO metadata
│   ├── globals.css          → your color palette, fonts, and global styles
│   ├── robots.ts            → generates /robots.txt
│   ├── sitemap.ts           → generates /sitemap.xml
│   ├── manifest.ts          → generates the PWA manifest
│   ├── not-found.tsx        → the 404 page
│   ├── api/contact/route.ts → the server-side code the contact form submits to
│   └── projects/[slug]/     → one page per project, e.g. /projects/kubernetes-voting-app
├── components/              Reusable UI pieces used by the pages above
├── data/                    Your actual content — edit these to change what the site says
│   ├── site.ts               name, email, links, headline
│   ├── projects.ts           the 3 case studies
│   ├── certifications.ts
│   ├── skills.ts
│   └── experience.ts
├── types/index.ts           Shape definitions for the data above (TypeScript)
├── lib/utils.ts             One small helper function
├── public/                  Static files served as-is (your resume PDF, your photo)
└── package.json             The list of dependencies + the commands (npm run dev, etc.)
```

**The rule of thumb: to change what the site *says*, edit files in `data/`. To change
how it *looks or behaves*, edit files in `components/`.**

## 3. Installing and running it locally

You need **Node.js** first — it's the program that lets JavaScript run outside a browser,
which is what `npm` (Node's package manager) needs to install everything.

1. Install Node.js LTS from [nodejs.org](https://nodejs.org) if you don't have it.
2. Extract this zip into `D:\portfolio` (so `D:\portfolio\package.json` exists directly
   inside it, not nested in a subfolder).
3. Open **VS Code** → File → Open Folder → `D:\portfolio`.
4. Open a terminal in VS Code (`` Ctrl+` ``) and run:

```
npm install
```

This reads `package.json`, downloads every dependency (Next.js, React, Tailwind, etc.)
from the npm registry, and puts them in a `node_modules` folder. You only need to do
this once (and again whenever you add a new package).

```
npm run dev
```

This starts a **development server** — a small program on your computer that builds the
site and serves it at `http://localhost:3000`. "Localhost" means "this computer," and
`3000` is the **port**, an address on your machine the server is listening on. Open
`http://localhost:3000` in your browser and the browser sends a request to that local
server, which responds with the page. Save any file and the page updates automatically —
that's the dev server watching for changes.

Stop it anytime with `Ctrl+C` in the terminal.

## 3b. What's interactive, and where it lives

- **Pipeline nav** (`components/Navbar.tsx`) — the top nav is styled as CI/CD stages
  (source → principles → build → stack → verify → deploy → monitor) instead of plain
  links. It highlights the stage you're scrolled to using `hooks/useScrollSpy.ts`.
- **Command palette** (`components/CommandPalette.tsx`) — press `Ctrl+K` / `Cmd+K`
  anywhere, or click "search" in the nav. Lets you jump to any section, open a project,
  or trigger an action (resume, GitHub, email) by typing. Stage list comes from
  `data/pipeline.ts`.
- **Live infrastructure map** (`components/InfraMap.tsx`) — the animated hero graphic.
  Edit the `satellites` array to change which skills orbit the center node.
- **Deploy-log playback** (`components/ProjectsGrid.tsx`) — clicking "Run deploy log" on
  a project card plays its `deploymentFlow` steps (from `data/projects.ts`) as an
  animated terminal readout.
- **Filterable tech stack** (`components/TechStack.tsx`) — the category pills filter
  `data/skills.ts` with an animated re-layout.
- **Flip-to-verify certifications** (`components/Certifications.tsx`) — hover (desktop)
  or tap (mobile) a certification card to flip it and reveal the verify link.
- **Scroll progress bar** (`components/ScrollProgress.tsx`) — the thin emerald line
  under the very top of the viewport, tracks how far down the page you are.

## 4. Making changes

**Change your name, tagline, email, or social links** → `data/site.ts`

**Add or edit a project** → `data/projects.ts`. Copy an existing project object, change
every field, and give it a unique `slug` (this becomes the URL:
`/projects/your-slug-here`). The shape of each field is defined in `types/index.ts` if
you want to see what's required.

**Add or edit a certification** → `data/certifications.ts`. Each certification links out
to a `verifyUrl`. Right now these point to the issuers' general certification pages —
swap in your personal Credly badge / Oracle CertView / Microsoft Learn credential link
once you have it, so the link proves *you specifically* hold it.

**Change the accent color** → `app/globals.css`, the `:root` block near the top. It's
all named CSS variables (`--emerald`, `--emerald-deep`, `--ink`, `--bg`...) — change the
hex values and the whole site updates, since every component reads from these variables.

**Change fonts** → also in `globals.css`. The three fonts (Space Grotesk, Inter, IBM
Plex Mono) are installed as real npm packages (`@fontsource/...`), not loaded from
Google's servers, so the site works even with no internet connection to font CDNs. To
swap a font, `npm install @fontsource/your-font` and update the `@import` lines and the
`--font-display` / `--font-body` / `--font-mono` variables.

**Replace your photo or resume** → drop a new file into `public/images/profile.jpg` or
replace `public/Vishal-Ranga-Resume.pdf` (keeping the same filename), or rename and
update the path in `data/site.ts`.

**Replace the favicon** → swap `app/favicon.ico` for your own (32×32 or 16×16 `.ico`
file). The current one is the default Next.js icon.

## 5. Wire up the contact form

The form is fully built and validates input, but it needs an email-sending service to
actually deliver messages — I can't embed real credentials for you.

1. Sign up free at [resend.com](https://resend.com) (100 emails/day free tier).
2. Get an API key from their dashboard.
3. In your deployment platform (see below), add an environment variable:
   `RESEND_API_KEY = re_your_key_here`
4. For local testing, create a file called `.env.local` in the project root with:
   ```
   RESEND_API_KEY=re_your_key_here
   ```
   (this file is already gitignored, so it won't get committed or uploaded anywhere)

Until this is set, the form shows a clear "not configured yet" message instead of
pretending to send — visitors can still reach you via the email/LinkedIn/GitHub links
next to the form.

## 6. Deploying it

**Vercel (recommended — built by the Next.js team, zero config needed):**
1. Push the project to a GitHub repository (create one on GitHub.com, then in your
   project folder: `git init`, `git add .`, `git commit -m "portfolio"`, `git remote add
   origin <your-repo-url>`, `git push -u origin main`).
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, click "New Project,"
   select your repo, and click Deploy. It auto-detects Next.js.
3. Add the `RESEND_API_KEY` environment variable in the project's Settings → Environment
   Variables, then redeploy.
4. You'll get a free `your-project.vercel.app` URL immediately. To use your own domain,
   go to Settings → Domains and follow the prompts — Vercel handles HTTPS automatically.

**Netlify / Cloudflare Pages** work the same way: connect the GitHub repo, they detect
Next.js automatically, add the same environment variable in their dashboard.

**Before going live**, update the placeholder URL in three files — search for
`your-domain.example` in `app/layout.tsx`, `app/robots.ts`, and `app/sitemap.ts`, and
replace it with your real domain. This is what search engines and social-media link
previews use.

## 7. Keeping it maintained

- **Update dependencies**: `npm outdated` shows what's behind, `npm update` updates
  within your allowed version ranges.
- **Add a new page**: create a new folder under `app/`, e.g. `app/blog/page.tsx`, and
  it's automatically live at `/blog`.
- **Check performance**: run a Lighthouse audit in Chrome DevTools (F12 → Lighthouse
  tab) against your deployed URL.
- **Images**: this project uses Next.js's built-in `<Image>` component (in `Hero.tsx`
  and `About.tsx`), which automatically resizes and lazy-loads images — no extra setup
  needed when you swap in new ones.

---

Everything here is meant to be a starting point you can keep pulling on — if you want a
deeper walkthrough of any one part (how a specific component renders, how the App Router
decides routing, how Tailwind's utility classes work), just ask.
