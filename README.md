CipherStudio: A Web-Based React IDE

CipherStudio is a full-stack MERN application that provides a lightweight, in-browser Integrated Development Environment (IDE) for simple React projects. It features a file explorer, a live-reloading code editor, and a browser preview, all powered by @codesandbox/sandpack-react.

Projects are automatically created with a default App.js and package.json, and all file changes are automatically saved to a MongoDB database, allowing you to pick up where you left off.
# CipherStudio

CipherStudio is a browser-based, full-stack React IDE built with a MERN-style architecture. It provides an in-browser code editor (via Sandpack), a file explorer, a live preview, and persistent storage for projects and files using MongoDB.

This README explains how to run the project locally, how the repository is organized, and the important API endpoints.

Contents

- Features
- Tech stack
- Quick start (dev)
- Environment variables
- API endpoints
- Project layout
- Troubleshooting
- Contributing
- License

---

## Features

- Live in-browser editor and preview using `@codesandbox/sandpack-react`.
- File explorer with create / delete (and rename backend support).
- Autosave (debounced) to backend via a custom `useAutoSave` hook.
- Save / Load snapshots (local + server-side snapshots supported).
- Theme toggle (dark / light) and autosave toggle persisted to `localStorage`.

## Tech stack

- Backend: Node.js, Express, Mongoose (MongoDB), dotenv, CORS
- Frontend: React 18 (Vite), Tailwind CSS, Sandpack, axios, react-router

---

## Quick start (development)

Prerequisites

- Node.js 18+ (or at least v16)
- MongoDB (local or hosted Atlas)

Open two terminals (or terminal tabs): one for the backend and one for the frontend.

Backend

```bash
cd backend
npm install
# create a .env file (see Environment variables below)
npm run dev
```

Frontend

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

Notes

- The backend dev script typically runs `nodemon index.js` and listens on the port defined in your `.env` (default 8008).
- The frontend uses Vite and runs on port 5173 by default.

---

## Environment variables

Create a `.env` file in the `backend/` folder with at least the following:

```
PORT=8008
MONGODB_URI=mongodb://localhost:27017/cipherstudio
# or your Atlas connection string (mongodb+srv://...)
```

Do NOT commit secrets or `.env` files to the repository. Use `.env.example` (already included) as a template.

---

## API (important endpoints)

Base URL: http://localhost:8008/api (adjust port if you changed it)

- Projects
	- POST /api/projects     -> create a new project
	- GET  /api/projects/:id -> get project and files

- Files
	- POST   /api/files            -> create a new file (body: { projectId, name, type, content })
	- PUT    /api/files/:id        -> update file content
	- DELETE /api/files/:id        -> delete a file (simple cascade for folder children)
	- PATCH  /api/files/:id/rename -> rename a file

- Snapshots
	- POST /api/snapshots               -> save snapshot (body: { projectId, data })
	- GET  /api/snapshots/:projectId    -> list snapshots for a project
	- POST /api/snapshots/:id/restore   -> restore a snapshot (writes files back to DB)

---

## Project layout

Top-level folders:

- `backend/` - Express server, controllers, models, and routes
- `frontend/` - Vite React app, components, pages, hooks

Key frontend files

- `frontend/src/pages/IDEPage.jsx` - the main IDE page (Sandpack integration, FileExplorer)
- `frontend/src/components/FileExplorer.jsx` - left-hand file navigator
- `frontend/src/components/Navbar.jsx` - top navigation with theme and autosave controls
- `frontend/src/hooks/useAutoSave.js` - debounced autosave logic

Key backend files

- `backend/index.js` - app entry point (connects to MongoDB, registers routes)
- `backend/controllers/fileController.js` - create/update/delete/rename file logic
- `backend/controllers/snapshotController.js` - snapshot save/list/restore
- `backend/models/` - contains `Project.js`, `File.js`, and `Snapshot.js`

---

## Troubleshooting

- "Cannot use import statement outside a module": ensure `backend/package.json` contains `"type": "module"` for ES modules.
- MongoDB connection issues:
	- If using Atlas with an SRV URI and you see DNS/ECONNREFUSED errors, ensure network access is allowed and the URI is correct.
	- For quick local dev, use `mongodb://localhost:27017/cipherstudio` and run a local MongoDB instance.
- If the frontend shows a blank editor area, ensure the project has at least one file. The IDE now supplies a minimal `/App.js` default when a project is empty.

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Implement changes and add tests (where applicable)
4. Open a PR with a clear description of the change

Keep changes small and focused. If you plan a large feature, open an issue first describing the design.

---

## License

This project does not include a license by default. Add a LICENSE file if you want to specify one (e.g. MIT).

---

If you'd like, I can also:

- Add a short `frontend/README.md` and `backend/README.md` with focused instructions.
- Add a `Makefile` or `scripts/dev.sh` to start frontend+backend with one command.

If you want those, tell me which you'd prefer and I will add them next.
