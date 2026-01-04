# noteAPIs 🔖

**Simple in-memory Express API for notes**

This tiny project exposes a REST API for creating, reading, updating, and deleting notes. It's intentionally simple: data is stored in memory and does not persist across restarts. The main entry point is `server.js` and the project uses ES modules (`"type": "module"` in `package.json`).

---

## Features ✅

- Minimal Express app (`server.js`) using `express.json()` for parsing JSON bodies
- In-memory store: `notes` array and a numeric `noteId` counter
- Routes: `POST /notes`, `GET /notes`, `GET /notes/:id`, `PATCH /notes/:id`, `DELETE /notes/:id`

## Quickstart ⚡

Prerequisites:

- Node.js (use nvm or Homebrew on macOS)

Install & run:

```bash
# install deps
npm install

# start server
npm start

# (recommended for development)
# npm i -D nodemon
# add a script: "dev": "nodemon server.js" and run `npm run dev`
```

The server will listen on port `3000` by default and log `Server running at http://localhost:3000`.

---

## API Endpoints 🔧

- Create a note

  - POST /notes
  - Body: `{ "title": "...", "content": "..." }`
  - Response: `201 Created` with the created note (includes `id` and `createdAt`)

  Example:

  ```bash
  curl -sS -X POST http://localhost:3000/notes -H 'Content-Type: application/json' \
    -d '{"title":"First","content":"Hello"}'
  ```

- List notes

  - GET /notes
  - Response: `200 OK` with an array of notes

- Get single note

  - GET /notes/:id
  - Response: `200 OK` or `404 Not Found` (invalid `id` returns `400`)

- Update a note

  - PATCH /notes/:id
  - Body: `{ "title": "..." }` and/or `{ "content": "..." }` (partial updates accepted)
  - Response: `200 OK` with the updated note, or `400/404` for invalid data/not found

- Delete a note

  - DELETE /notes/:id
  - Response: `204 No Content` on success or `404 Not Found`

---

## Implementation details & conventions 🔍

- ES module project (`package.json` has `"type": "module"`)
- `notes` is an in-memory array and `noteId` (numeric) is used to generate IDs
- Request validation is implemented as middleware in `server.js`:
  - `validatesCreatedNotes` requires both `title` and `content` for `POST /notes`
  - `validatesUpdatedNotes` should require at least one of `title` or `content` for `PATCH /notes/:id` (this is a known area to improve)
- Status codes used in the project:
  - `201` on create
  - `204` on delete
  - `400` for bad requests (invalid id or missing fields)
  - `404` when resource not found

---

## Suggestions / Next tasks 💡

- Split `server.js` into `routes/notes.js` and `middleware/validateNote.js` for clarity
- Add tests (recommendation: `supertest` + `vitest` or `jest`) and a simple GitHub Actions workflow

---

## Contributing & Support 🤝

Feel free to open issues or PRs. If you'd like, I can apply the router/middleware split and add example tests and a `dev` script.

---

