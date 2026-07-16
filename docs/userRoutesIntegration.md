# User API — Frontend Integration Guide

Base path: `/api/v1/users`

## Auth

All routes require the user to be signed in via **httpOnly cookie** `accessToken`. Send requests with `credentials: "include"` (fetch) / `withCredentials: true` (axios). Most routes require a permission on the `users` module (`view` / `create` / `edit` / `delete`). The `/:id/status` route is restricted to **admin** role only.

## Common response shape

```json
{
  "status": "success" | "fail" | "error",
  "message": "human readable message",
  "data": { ... } | null
}
```

## Common error responses

| Status | When |
|---|---|
| 400 | Zod validation failed (body/query) or invalid `:id` ObjectId |
| 401 | Not signed in / expired token |
| 403 | Missing required permission or not admin |
| 404 | User not found |
| 409 | Email already in use |

---

## 1. Update own profile

`PATCH /api/v1/users/profile`

**Auth required.** No specific permission needed — any signed-in user can update their own profile.

### Body

| Field | Type | Required | Notes |
|---|---|---|---|
| `fullName` | string | yes | trimmed, min 1 char |

### Example request body

```json
{
  "fullName": "John Doe"
}
```

### Example response — 200

```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "64f1c2b3a1b2c3d4e5f6a7aa",
      "fullName": "John Doe",
      "email": "john.doe@clinic.com",
      "role": "admin",
      "active": true,
      "permissions": [],
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T11:00:00.000Z"
    }
  }
}
```

---

## 2. Get all users

`GET /api/v1/users`

**Permission required:** `users:view`

### Query params (all optional)

| Param | Type | Default | Notes |
|---|---|---|---|
| `page` | number (int, min 1) | `1` | |
| `limit` | number (int, min 1, max 100) | `10` | |
| `search` | string | — | search by name or email |
| `role` | `"admin" \| "receptionist"` | — | |

### Example request

```
GET /api/v1/users?page=1&limit=10&role=receptionist
```

### Example response — 200

```json
{
  "status": "success",
  "message": "Users fetched successfully",
  "data": {
    "users": [
      {
        "_id": "64f1c2b3a1b2c3d4e5f6a7aa",
        "fullName": "John Doe",
        "email": "john.doe@clinic.com",
        "role": "receptionist",
        "active": true,
        "permissions": [
          { "resource": "patients", "actions": ["view", "create"] }
        ],
        "createdAt": "2026-07-16T10:00:00.000Z",
        "updatedAt": "2026-07-16T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalDocuments": 1,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

---

## 3. Create user

`POST /api/v1/users`

**Permission required:** `users:create`

### Body

| Field | Type | Required | Notes |
|---|---|---|---|
| `fullName` | string | yes | trimmed, min 1 char |
| `email` | string (email) | yes | trimmed, lowercased |
| `password` | string | yes | min 8 chars |
| `role` | `"admin" \| "receptionist"` | yes | |
| `permissions` | array of permission objects | no | default `[]` |

#### Permission object

| Field | Type | Notes |
|---|---|---|
| `resource` | `"patients" \| "appointments" \| "opdSlips" \| "billing" \| "doctors" \| "users" \| "settings" \| "reports" \| "auditLogs" \| "dashboard"` | |
| `actions` | array of `"view" \| "create" \| "edit" \| "delete"` | default `[]` |

### Example request body

```json
{
  "fullName": "Jane Smith",
  "email": "jane.smith@clinic.com",
  "password": "securePass123",
  "role": "receptionist",
  "permissions": [
    { "resource": "patients", "actions": ["view", "create", "edit"] },
    { "resource": "appointments", "actions": ["view", "create"] }
  ]
}
```

### Example response — 201

```json
{
  "status": "success",
  "message": "User created successfully",
  "data": {
    "user": {
      "_id": "64f1c2b3a1b2c3d4e5f6a7bb",
      "fullName": "Jane Smith",
      "email": "jane.smith@clinic.com",
      "role": "receptionist",
      "active": true,
      "permissions": [
        { "resource": "patients", "actions": ["view", "create", "edit"] },
        { "resource": "appointments", "actions": ["view", "create"] }
      ],
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T10:00:00.000Z"
    }
  }
}
```

---

## 4. Get single user

`GET /api/v1/users/:id`

**Permission required:** `users:view`

### Path params

| Param | Type | Notes |
|---|---|---|
| `id` | string (ObjectId) | `400` if malformed |

### Example response — 200

```json
{
  "status": "success",
  "message": "User fetched successfully",
  "data": {
    "user": {
      "_id": "64f1c2b3a1b2c3d4e5f6a7bb",
      "fullName": "Jane Smith",
      "email": "jane.smith@clinic.com",
      "role": "receptionist",
      "active": true,
      "permissions": [],
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T10:00:00.000Z"
    }
  }
}
```

### 404

```json
{ "status": "fail", "message": "User not found", "data": null }
```

---

## 5. Update user

`PATCH /api/v1/users/:id`

**Permission required:** `users:edit`

### Body (all fields optional — send only what changes)

| Field | Type | Notes |
|---|---|---|
| `fullName` | string | trimmed, min 1 char |
| `email` | string (email) | trimmed, lowercased |
| `role` | `"admin" \| "receptionist"` | |
| `permissions` | array of permission objects | replaces entire permissions array |

### Example response — 200

```json
{
  "status": "success",
  "message": "User updated successfully",
  "data": {
    "user": { "...": "updated user object" }
  }
}
```

---

## 6. Delete user

`DELETE /api/v1/users/:id`

**Permission required:** `users:delete`

No body. Hard-deletes the record.

### Example response — 200

```json
{
  "status": "success",
  "message": "User deleted successfully",
  "data": null
}
```

### 404

```json
{ "status": "fail", "message": "User not found", "data": null }
```

---

## 7. Set user active status

`PATCH /api/v1/users/:id/status`

**Restricted to:** `admin` role

### Body

| Field | Type | Required | Notes |
|---|---|---|---|
| `active` | boolean | yes | `true` to activate, `false` to deactivate |

### Example request body

```json
{ "active": false }
```

### Example response — 200

```json
{
  "status": "success",
  "message": "User status updated successfully",
  "data": {
    "user": {
      "_id": "64f1c2b3a1b2c3d4e5f6a7bb",
      "fullName": "Jane Smith",
      "email": "jane.smith@clinic.com",
      "role": "receptionist",
      "active": false,
      "permissions": [],
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T12:00:00.000Z"
    }
  }
}
```

---

## Quick reference table

| Method | Path | Auth | Body | Query | Params |
|---|---|---|---|---|---|
| PATCH | `/profile` | Any signed-in user | fullName | — | — |
| GET | `/` | users:view | — | page, limit, search, role | — |
| POST | `/` | users:create | fullName, email, password, role, permissions? | — | — |
| GET | `/:id` | users:view | — | — | id |
| PATCH | `/:id` | users:edit | fullName?, email?, role?, permissions? | — | id |
| DELETE | `/:id` | users:delete | — | — | id |
| PATCH | `/:id/status` | admin only | active | — | id |
