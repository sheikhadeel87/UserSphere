# UserSphere API Documentation

REST API for user management with JWT authentication.

**Base URL:** `http://localhost:3000/api`

---

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### Auth Routes

#### Register

Create a new admin account.

```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:** `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

---

#### Login

Authenticate and receive a JWT token.

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

**Error:** `401 Unauthorized`
```json
{
  "message": "Invalid email or password"
}
```

---

#### Get Current User

Get the authenticated user's profile.

```
GET /auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "user": {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

---

### User Routes

#### Get All Users

Fetch paginated list of users.

```
GET /users
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 100) |
| `sort` | string | `-createdAt` | Sort field (prefix `-` for descending) |
| `city` | string | - | Filter by city |
| `isActive` | boolean | - | Filter by active status |
| `minAge` | number | - | Minimum age filter |
| `maxAge` | number | - | Maximum age filter |

**Response:** `200 OK`
```json
{
  "message": "Users fetched",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "data": [
    {
      "_id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "age": 28,
      "city": "lahore",
      "isActive": true,
      "createdAt": "2026-02-27T10:30:00.000Z"
    }
  ]
}
```

---

#### Get User by ID

```
GET /users/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "User fetched",
  "data": {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 28,
    "city": "lahore",
    "isActive": true
  }
}
```

---

#### Create User

```
POST /users
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "age": 25,
  "city": "Karachi",
  "isActive": true
}
```

**Response:** `201 Created`
```json
{
  "message": "User created",
  "data": {
    "_id": "64abc456...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "age": 25,
    "city": "karachi",
    "isActive": true
  }
}
```

---

#### Update User (Partial)

```
PATCH /users/:id
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (any fields to update)
```json
{
  "age": 26,
  "isActive": false
}
```

**Response:** `200 OK`
```json
{
  "message": "User updated",
  "data": { ... }
}
```

---

#### Replace User (Full)

```
PUT /users/:id
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (all fields required)
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "age": 26,
  "city": "Islamabad",
  "isActive": true
}
```

**Response:** `200 OK`
```json
{
  "message": "User replaced",
  "data": { ... }
}
```

---

#### Delete User

**Admin only** - Requires admin role.

```
DELETE /users/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "User deleted"
}
```

**Error:** `403 Forbidden` (if not admin)
```json
{
  "message": "Admin access required"
}
```

---

### Statistics Routes (Public)

#### Get City Stats

```
GET /users/stats
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "city": "lahore",
      "totalUsers": 10,
      "activeUsers": 8,
      "averageAge": 28.5
    },
    {
      "city": "karachi",
      "totalUsers": 7,
      "activeUsers": 5,
      "averageAge": 32.1
    }
  ]
}
```

---

#### Get General Stats

```
GET /users/general-stats
```

**Response:** `200 OK`
```json
{
  "totalUsers": 25,
  "totalCities": 5,
  "cityNames": ["lahore", "karachi", "islamabad", "gujranwala", "hyderabad"]
}
```

---

#### Filter Users

```
GET /users/filter
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search in name, email, city |
| `ageFrom` | number | Minimum age |
| `ageTo` | number | Maximum age |
| `isActive` | boolean | Filter by status |

**Response:** `200 OK`
```json
{
  "data": [...],
  "meta": {
    "total": 5,
    "totalPages": 1
  }
}
```

---

#### Get User Names

```
GET /users/names
```

**Response:** `200 OK`
```json
{
  "names": ["John Doe", "Jane Doe", "Bob Smith"]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "message": "Error description"
}
```

### Common Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Missing/invalid token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found |
| `500` | Internal Server Error |

---

## Data Models

### User

```javascript
{
  name: String,      // required, 2-20 chars
  email: String,     // required, unique, valid email
  age: Number,       // required, 1-100
  city: String,      // optional, auto-lowercased
  isActive: Boolean  // default: true
}
```

### Admin

```javascript
{
  name: String,      // required
  email: String,     // required, unique
  password: String,  // required, hashed with bcrypt
  role: String       // default: "admin"
}
```

---

## Environment Variables

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/usersphere
JWT_SECRET=your-secret-key
FRONTEND_ORIGIN=http://localhost:5173
```

---

Built with Express.js + MongoDB
