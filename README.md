# noteAPIs 🔖

**REST API for notes with SQLite persistence and JWT authentication**

A modular REST API for creating, reading, updating, and deleting notes with secure user authentication. Built with Express (ES modules), organized into routes, controllers, repositories, and middleware for clean separation of concerns. Data persists in SQLite database.

---

## Features ✅

- **Modular architecture:** Express app split into `src/routes/`, `src/controllers/`, `src/repositories/`, and `src/middleware/`
- **JWT Authentication:** Secure token-based authentication using JSON Web Tokens
- **User management:** User registration and login with bcrypt password hashing
- **Protected routes:** All note endpoints require valid JWT token authentication
- **Repository pattern:** Data access layer separates database logic from controllers
- **SQLite persistence:** Data persists across server restarts using SQLite database
- **Global error handling:** Centralized error handling with `asyncHandler` and `errorHandler` middleware
- **Validation middleware:** Request validation for both notes and authentication
- **Full CRUD API:** `POST /notes`, `GET /notes`, `GET /notes/:id`, `PATCH /notes/:id`, `DELETE /notes/:id`
- **Comprehensive testing:** Automated tests with Vitest and Supertest
- **Postman collection:** Ready-to-use Postman collection for API testing
- **Auto database initialization:** Database and tables created automatically on first run

## Project Structure 📁

```
noteAPIs/
├── server.js                           # Entry point (initializes DB & starts app)
├── dev.sqlite3                         # SQLite database file (auto-generated)
├── src/
│   ├── app.js                          # Express app config, route mounting & error handler
│   ├── controllers/
│   │   ├── noteControllers.js          # Business logic: createNotes, getNotes, getNotesById, updateNotes, deleteNotes
│   │   └── authController.js           # Authentication: register, login
│   ├── repositories/
│   │   ├── noteRepository.js           # Data access layer: getAll, create, getById, updateById, deleteById
│   │   └── userRepository.js           # User data access: create, findByUsername, findById, verifyPassword
│   ├── middleware/
│   │   ├── asyncHandler.js             # Wraps async controllers to catch errors
│   │   ├── errorHandler.js             # Global error handling middleware
│   │   ├── authMiddleware.js           # JWT authentication: authenticateToken, generateToken
│   │   └── notemiddleware.js           # Request validation: validatesCreatedNotes, validatesUpdatedNotes
│   ├── routes/
│   │   ├── noteRouters.js              # Protected note routes (POST/GET/PATCH/DELETE)
│   │   └── authRouters.js              # Public auth routes (POST /register, POST /login)
│   └── db/
│       └── db.js                        # Knex database config & initDb function
├── test/
│   ├── notes.test.js                   # Note endpoints tests
│   └── auth.test.js                    # Authentication tests
├── NoteAPIs.postman_collection.json    # Postman collection for API testing
├── POSTMAN_TESTING.md                  # Postman testing guide
├── vitest.config.js                    # Vitest test configuration
├── package.json                        # Dependencies & scripts
└── README.md                           # This file
```

---

## Quickstart ⚡

### Prerequisites

- Node.js (use nvm or Homebrew on macOS)
- npm

### Install & Run

```bash
# Install dependencies
npm install

# Start server (production)
npm start

# Start server with auto-reload (development)
npm run dev
```

The server listens on port `3000` (or `PORT` from `.env` file) and logs:
```
Database & Notes table created!
Server running at http://localhost:3000
```

**Note:** The SQLite database (`dev.sqlite3`) and `notes` table are created automatically on first run.

---

## API Endpoints 🔧

### Authentication Endpoints

#### Register a new user
- **POST** `/auth/register`
- **Body:** `{ "username": "...", "password": "..." }`
- **Response:** `201 Created` with user object and JWT token
- **Validation:** Username and password required (password min 6 characters)

```bash
curl -X POST http://localhost:3000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"testuser","password":"password123"}'
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": { "id": 1, "username": "testuser" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
- **POST** `/auth/login`
- **Body:** `{ "username": "...", "password": "..." }`
- **Response:** `200 OK` with user object and JWT token

```bash
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"testuser","password":"password123"}'
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { "id": 1, "username": "testuser" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Note Endpoints (Protected - Authentication Required)

All note endpoints require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <your-token-here>
```

#- **POST** `/notes`
- **Body:** `{ "title": "...", "content": "..." }`
- **Response:** `201 Created` with the created note (includes `id` and `createdAt`)
- **Validation:** Both `title` and `content` required
- **Authentication:** Requires valid JWT token

```bash
# First, get a token by registering or logging in, then:
curl -X POST http://localhost:3000/notes \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{"title":"First Note","content":"Hello World"}'
```

#### List all notes
- **GET** `/notes`
- **Query Parameters:**
  - `page` (optional, default: `1`) - Page number
  - `limit` (optional, default: `10`, max: `100`) - Number of notes per page
- **Response:** `200 OK` with paginated notes and metadata
- **Authentication:** Requires valid JWT token

**Example requests:**

```bash
# Get first page (default: 10 notes)
curl http://localhost:3000/notes \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'

# Get page 2 with 5 notes per page
curl 'http://localhost:3000/notes?page=2&limit=5' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'

# Get all notes on page 1 (max 100)
curl 'http://localhost:3000/notes?limit=100' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

**Response format:**
```json
{
  "notes": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Get a single note
- **GET** `/notes/:id`
- **Response:** `200 OK` with note object or `404 Not Found`
- **Authentication:** Requires valid JWT token

```bash
curl http://localhost:3000/notes/1 \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

#### Update a note
- **PATCH** `/notes/:id`
- **Body:** `{ "title": "..." }` and/or `{ "content": "..." }` (partial updates accepted)
- **Response:** `200 OK` with updated note, or `404 Not Found`
- **Validation:** At least one of `title` or `content` required
- **Authentication:** Requires valid JWT token

```bash
curl -X PATCH http://localhost:3000/notes/1 \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{"content":"Updated content"}'
```

#### Delete a note
- **DELETE** `/notes/:id`
- **Response:** `204 No Content` on success or `404 Not Found`
- **Authentication:** Requires valid JWT token

```bash
curl -X DELETE http://localhost:3000/notes/1 \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

---

## How it works 🔄

### Authentication Flow

1. **Registration/Login:** User registers or logs in via `/auth/register` or `/auth/login`
2. **Password hashing:** Passwords are hashed using bcrypt before storing in database
3. **Token generation:** JWT token is generated with user ID and username (expires in 1 hour)
4. **Token usage:** Client includes token in `Authorization: Bearer <token>` header for protected routes
5. **Token verification:** `authenticateToken` middleware verifies token on protected routes
6. **Request authorization:** If token is valid, user info is attached to `req.user` for use in controllers

### Request Flow (Protected Routes)

1. **Request:** Client → `server.js` → `src/app.js` → `src/routes/noteRouters.js`
2. **Authentication:** `authenticateToken` middleware verifies JWT token
3. **Validation:** Middleware (`src/middleware/notemiddleware.js`) validates request body
4. **Error handling:** `asyncHandler` wraps async controllers to catch errors
5. **Business logic:** Controller (`src/controllers/noteControllers.js`) handles the operation
6. **Data access:** Repository (`src/repositories/noteRepository.js`) interacts with SQLite database
7. **Response:** Controller returns JSON with appropriate status code
8. **Error handling:** If error occurs, `errorHandler` middleware sends consistent error response

**Example flow for creating a note:**
```
POST /notes
  → authenticateToken (verifies JWT token)
  → validatesCreatedNotes (middleware)
  → asyncHandler(createNotes)
  → createNotes (controller)
  → NoteRepository.create() (repository)
  → SQLite database insert
  → res.status(201).json()
```

### Error Handling
- **Async errors:** Caught by `asyncHandler` wrapper and passed to Express error handler
- **Global handler:** `errorHandler` middleware (in `app.js`) handles all errors consistently
- **Authentication errors:**
  - `401` for missing or expired tokens
  - `403` for invalid tokens
  - `401` for invalid login credentials
- **Status codes:**
  - `500` for unexpected errors
  - `404` for not found (handled in controllers)
  - `400` for validation errors (handled in middleware)
  - `409` for duplicate username (registration)

---

## Implementation Details 🔍

### Technology Stack
- **Express 5.x:** Web framework with ES modules
- **JWT (jsonwebtoken):** Token-based authentication
- **bcrypt:** Password hashing for secure storage
- **Knex.js:** SQL query builder for SQLite
- **SQLite3:** Lightweight database for data persistence
- **dotenv:** Environment variable management
- **Vitest:** Testing framework
- **Supertest:** HTTP assertion library for testing

### Architecture Patterns
- **Repository Pattern:** Data access logic separated from business logic
- **Middleware Pattern:** Request validation and error handling via Express middleware
- **Async/Await:** Modern async handling with automatic error catching

### Database Schema
```sql
users
├── id (INTEGER PRIMARY KEY AUTOINCREMENT)
├── username (TEXT NOT NULL UNIQUE)
├── password (TEXT NOT NULL) -- bcrypt hashed
└── createdAt (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

notes
├── id (INTEGER PRIMARY KEY AUTOINCREMENT)
├── title (TEXT NOT NULL)
├── content (TEXT)
└── createdAt (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
```

### Status Codes
- `201` — Resource created
- `200` — Success (GET, PATCH, Login)
- `204` — Resource deleted (no body returned)
- `400` — Invalid request (validation errors)
- `401` — Unauthorized (missing/invalid/expired token, wrong credentials)
- `403` — Forbidden (invalid token format)
- `404` — Resource not found
- `409` — Conflict (duplicate username)
- `500` — Internal server error

---

## Environment Variables 🔐

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-here-change-in-production
```

**Required:**
- `JWT_SECRET` - Secret key for signing JWT tokens (required for authentication)

**Optional:**
- `PORT` - Server port (defaults to `3000` if not set)
- `NODE_ENV` - Environment mode (development/production)

**⚠️ Important:** Change `JWT_SECRET` to a strong random string in production!

---

## Testing 🧪

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- test/auth.test.js

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage

- **Authentication tests:** User registration, login, token validation (`test/auth.test.js`)
- **Note tests:** CRUD operations for notes (`test/notes.test.js`)

### Manual Testing with Postman

1. **Import collection:** Import `NoteAPIs.postman_collection.json` into Postman
2. **Set up environment:** Create environment with `base_url` variable
3. **Auto-save tokens:** The collection includes scripts to automatically save tokens after login/register
4. **See guide:** Check `POSTMAN_TESTING.md` for detailed testing instructions

### Manual Testing with cURL

See the endpoint examples above, or check `POSTMAN_TESTING.md` for a complete testing guide.

---

## Next Steps 💡

- Add GitHub Actions workflow for CI/CD
- Add search/filter functionality for notes
- Add request rate limiting
- Add API documentation with Swagger/OpenAPI
- Add user profile management
- Add password reset functionality
- Add note ownership (user-specific notes)

---

## Learning Notes 📚

This project demonstrates:
- **RESTful API design** with proper HTTP methods and status codes
- **JWT authentication** and secure token-based authorization
- **Password security** with bcrypt hashing
- **Separation of concerns** with routes, controllers, repositories, and middleware
- **Error handling** patterns in Express with async/await
- **Database integration** with Knex.js and SQLite
- **Testing** with Vitest and Supertest
- **ES modules** syntax for modern JavaScript
- **Middleware patterns** for authentication and validation

---