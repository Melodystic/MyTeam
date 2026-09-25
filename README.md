# MyTeam

A web app for a team lead and a head of leads: the team, one-to-ones, meeting notes, and short employee profiles.

Data is stored locally in the browser (IndexedDB). You can move the database between browsers and devices by exporting and importing JSON. The interface is available in Russian and English.

## Stack

- React 19 + TypeScript
- Vite
- Ant Design
- React Router
- IndexedDB (`idb`)

## Features

The home screen has two modes:

- **Team** — a team for one-to-ones
- **Head of Leads** — the team list is your leads; notes and short profiles of their team members live separately

### Team

- Employee list: first name, last name, projects, and project managers
- Add, edit, and delete with confirmation
- In Head of Leads mode the button adds a lead

### Employee page (`/employee/:id`)

- **Basic needs** — a 0–5 scale, K/OT indicators, comments, and a radar chart
- **Metrics** — presets and custom metrics, a scale, comments, and a radar chart
- **Leadership style** — instructing, directing, supporting, or trusting
- **Task setting** — SMART and three ways to set a task
- **One-to-one** — preparation and outcomes with a date, a meeting archive, and questions
  - each question has a Save button: the answer is stored and the input is hidden
  - a saved answer has an Edit button
  - new questions are added at the top
- **Delegation** — notes as a list
- **Feedback** — feedback type, models (SBI, sandwich, POPS, CARE), guidelines, and comments from colleagues

### Head of Leads

- **Notes** (`/notes`) — directorate meetings, notes with leads, and a one-to-one with your manager. Each meeting has a date, preparation, outcomes, and an archive
- **Brief profiles** (`/profiles`) — a separate list of people on your leads’ teams
  - leads from the team appear here automatically and are marked “From the leads team”
  - people added only here are not added to the team
  - each profile has projects, a project manager, a lead, and dated comments (`/profiles/:id`)

### General

- Light and dark theme, RU/EN switch
- Export and import of the whole database (JSON), including Head of Leads notes and profiles
- Layout adapted for phones and tablets

## Getting started

Node.js 18+ is required.

```bash
npm install
npm run dev
```

The app opens at [http://localhost:5173/MyTeam/](http://localhost:5173/MyTeam/).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint the code (oxlint) |

## Deploy (GitHub Pages)

The site is published automatically on every push to `main`:

**https://melodystic.github.io/MyTeam/**

Once in the repository: **Settings → Pages → Source → GitHub Actions**.

After the build, `404.html` is copied into `dist` (a fallback for React Router). The Vite `base` is `/MyTeam/`.

IndexedDB is tied to the browser origin: the database on GitHub Pages is separate. Move your data with **Save database** / **Load database** in the header.

## Repository

https://github.com/Melodystic/MyTeam
