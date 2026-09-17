# Auth Microservice

A stateless RESTful authentication microservice built with **Node.js, Express.js, and PostgreSQL**. The project follows **SOLID principles** and a layered software architecture to separate authentication logic, data access, request handling, and middleware concerns.

## Features

* **Stateless Authentication** — Uses signed JSON Web Tokens (JWT) for authentication.
* **Password Hashing** — Passwords are salted and hashed using `bcrypt` with 12 salt rounds.
* **SQL Injection Prevention** — Uses parameterized SQL queries through PostgreSQL's `pg` connection pool.
* **Brute-Force Protection** — Applies IP-based rate limiting to sensitive authentication endpoints.
* **HTTP Security Hardening** — Uses `helmet` to add security-related HTTP response headers.
* **Layered Architecture** — Separates responsibilities across repositories, services, controllers, routes, and middleware.

## Tech Stack

| Technology           | Purpose                                  |
| -------------------- | ---------------------------------------- |
| Node.js              | Runtime environment                      |
| Express.js           | REST API framework                       |
| PostgreSQL           | Relational database                      |
| `pg`                 | PostgreSQL client and connection pooling |
| `bcrypt`             | Password hashing                         |
| `jsonwebtoken`       | JWT generation and verification          |
| `helmet`             | HTTP security headers                    |
| `express-rate-limit` | Rate limiting                            |
| `dotenv`             | Environment variable management          |

## Architecture

The application follows a layered architecture:

```text
auth-microservice/
├── config/
│   └── # Database connection pool setup
├── controllers/
│   └── # HTTP request/response handling
├── middlewares/
│   └── # JWT authentication and rate limiting
├── repositories/
│   └── # Parameterized SQL database operations
├── routes/
│   └── # Express route definitions
├── services/
│   └── # Business logic, password hashing, and token issuance
├── .env
│   └── # Environment configuration (not committed to Git)
└── server.js
    └── # Application entry point
```

### Request Flow

```text
Client
  │
  ▼
Routes
  │
  ▼
Middleware
  │
  ▼
Controller
  │
  ▼
Service
  │
  ▼
Repository
  │
  ▼
PostgreSQL
```

This separation keeps HTTP handling, business logic, and database operations independent from one another.

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

* **Node.js 18+**
* **PostgreSQL**

### 1. Clone the Repository

```bash
git clone https://github.com/AcChav/auth-microservice.git
cd auth-microservice
```

### 2. Install Dependencies

```bash
npm install express pg bcrypt jsonwebtoken dotenv helmet express-rate-limit
npm install -D nodemon
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/auth_db
JWT_SECRET=super_secret_signing_key_change_in_production
JWT_EXPIRES_IN=1h
```

> **Important:** Do not commit your `.env` file or production secrets to version control.

### 4. Set Up the Database

Create the `users` table in PostgreSQL:

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Start the Service

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

The service runs on the port specified by `PORT` in your `.env` file.

---

# API Reference

Base URL:

```text
http://localhost:5000
```

## Authentication

### Register User

Creates a new user account.

**Endpoint**

```http
POST /api/auth/register
```

**Rate Limit**

`10 requests / 15 minutes`

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "strongPassword123"
}
```

**Response — `201 Created`**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2026-09-17T11:23:11.000Z"
  }
}
```

---

### Login

Authenticates an existing user and returns a JWT.

**Endpoint**

```http
POST /api/auth/login
```

**Rate Limit**

`10 requests / 15 minutes`

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "strongPassword123"
}
```

**Response — `200 OK`**

```json
{
  "token": "<jwt_string>",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

---

### Get User Profile

Returns the authenticated user's profile.

**Endpoint**

```http
GET /api/auth/profile
```

**Authentication**

Requires a valid JWT in the `Authorization` header:

```http
Authorization: Bearer <token>
```

**Response — `200 OK`**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2026-09-17T11:23:11.000Z"
  }
}
```

**Response — `401 Unauthorized`**

```json
{
  "error": "Authorization token required"
}
```

---

## Security

The service incorporates several security measures:

* Passwords are never stored in plaintext; they are hashed using `bcrypt`.
* SQL queries use parameterized statements to reduce SQL injection risk.
* JWTs provide stateless authentication.
* Authentication endpoints are protected by IP-based rate limiting.
* `helmet` provides additional HTTP security headers.
* Sensitive configuration values are stored through environment variables.

