# Postman Testing Guide for Authentication 🔐

This guide will walk you through testing the authentication system in Postman.

## Prerequisites

1. Make sure your server is running:
   ```bash
   npm run dev
   ```

2. Ensure `JWT_SECRET` is set in your `.env` file:
   ```env
   JWT_SECRET=your-secret-key-here
   ```

---

## Step-by-Step Testing

### Step 1: Register a New User

1. **Method:** `POST`
2. **URL:** `http://localhost:3000/auth/register`
3. **Headers:**
   - `Content-Type`: `application/json`
4. **Body** (raw JSON):
   ```json
   {
     "username": "postmantest",
     "password": "password123"
   }
   ```
5. **Expected Response (201):**
   ```json
   {
     "message": "User created successfully",
     "user": {
       "id": 1,
       "username": "postmantest"
     },
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```
6. **Copy the `token` value** - you'll need it for protected routes!

---

### Step 2: Login with Existing User

1. **Method:** `POST`
2. **URL:** `http://localhost:3000/auth/login`
3. **Headers:**
   - `Content-Type`: `application/json`
4. **Body** (raw JSON):
   ```json
   {
     "username": "postmantest",
     "password": "password123"
   }
   ```
5. **Expected Response (200):**
   ```json
   {
     "message": "Login successful",
     "user": {
       "id": 1,
       "username": "postmantest"
     },
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

---

### Step 3: Create a Note (Protected Route)

1. **Method:** `POST`
2. **URL:** `http://localhost:3000/notes`
3. **Headers:**
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer YOUR_TOKEN_HERE`
     - Replace `YOUR_TOKEN_HERE` with the token from Step 1 or 2
4. **Body** (raw JSON):
   ```json
   {
     "title": "My First Protected Note",
     "content": "This note was created using a JWT token!"
   }
   ```
5. **Expected Response (201):**
   ```json
   {
     "id": 1,
     "title": "My First Protected Note",
     "content": "This note was created using a JWT token!",
     "createdAt": "2024-..."
   }
   ```

---

### Step 4: Test Authentication Failures

#### Without Token (Should fail)
1. **Method:** `POST`
2. **URL:** `http://localhost:3000/notes`
3. **Headers:** Only `Content-Type: application/json` (no Authorization header)
4. **Expected Response (401):**
   ```json
   {
     "error": "Access token required"
   }
   ```

#### With Invalid Token (Should fail)
1. **Method:** `POST`
2. **URL:** `http://localhost:3000/notes`
3. **Headers:**
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer invalid_token_here`
4. **Expected Response (403):**
   ```json
   {
     "error": "Invalid token"
   }
   ```

#### Wrong Password (Should fail)
1. **Method:** `POST`
2. **URL:** `http://localhost:3000/auth/login`
3. **Body:**
   ```json
   {
     "username": "postmantest",
     "password": "wrongpassword"
   }
   ```
4. **Expected Response (401):**
   ```json
   {
     "error": "Invalid username or password"
   }
   ```

---

## Pro Tips: Using Postman Environment Variables

Instead of copying/pasting tokens, use Postman Environment Variables:

### Setup Environment Variables

1. Click **Environments** in the left sidebar
2. Click **+** to create a new environment
3. Name it "Local Development"
4. Add variables:
   - `base_url` = `http://localhost:3000`
   - `token` = (leave empty for now)
   - `username` = `postmantest`

5. **Select the environment** from the dropdown (top right)

### Use Variables in Requests

- **URL:** `{{base_url}}/auth/register`
- **Authorization Header:** `Bearer {{token}}`

### Auto-Save Token After Login

1. In your **Login** request, go to the **Tests** tab
2. Add this script:
   ```javascript
   if (pm.response.code === 200) {
       const response = pm.response.json();
       pm.environment.set("token", response.token);
       console.log("Token saved to environment!");
   }
   ```
3. Now after login, the token will automatically be saved!

### Extract Token from Register Request

Add the same script to your **Register** request's **Tests** tab to auto-save the token after registration.

---

## Complete Test Scenarios

### Scenario 1: Full Registration → Create Note Flow
1. Register a new user
2. Copy the token from response
3. Use token to create a note
4. Verify note was created successfully

### Scenario 2: Login → Get Notes Flow
1. Login with existing user
2. Get token from response
3. Use token to GET `/notes` (should return user's notes)

### Scenario 3: Token Expiration
1. Get a token
2. Wait for it to expire (default: 1 hour)
3. Try to use expired token → Should get 401 "Token has expired"

### Scenario 4: Validation Testing
1. Try registering without username → Should get 400
2. Try registering with short password (< 6 chars) → Should get 400
3. Try registering duplicate username → Should get 409
4. Try login with missing password → Should get 400

---

## Postman Collection Import (Optional)

If you want a ready-made collection, I can provide the JSON export. Would you like me to create that?

---

## Quick Reference: All Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login user |
| POST | `/notes` | ✅ | Create note |
| GET | `/notes` | ✅ | Get all notes |
| GET | `/notes/:id` | ✅ | Get note by ID |
| PATCH | `/notes/:id` | ✅ | Update note |
| DELETE | `/notes/:id` | ✅ | Delete note |

---

**Happy Testing! 🚀**
