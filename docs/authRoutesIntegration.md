# Auth API — Frontend Integration Guide

Base path: `/api/v1/auth`

## Auth

Cookie-based auth. On successful sign-in the server sets an **httpOnly cookie** named `accessToken`. All protected routes require this cookie — send requests with `credentials: "include"` (fetch) / `withCredentials: true` (axios).

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
| 400 | Zod validation failed |
| 401 | Not signed in / invalid or expired token |
| 403 | Forbidden |

---

## 1. Sign in

`POST /api/v1/auth/signin`

No auth required.

### Body

| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string (email) | yes | trimmed, lowercased |
| `password` | string | yes | min 1 char |

### Example request body

```json
{
  "email": "john.doe@clinic.com",
  "password": "secret123"
}
```

### Example response — 200

Sets `accessToken` httpOnly cookie. Also sets a `refreshToken` httpOnly cookie used by `/rotate-token`.

```json
{
  "status": "success",
  "message": "Signed in successfully",
  "data": {
    "user": {
      "_id": "64f1c2b3a1b2c3d4e5f6a7aa",
      "fullName": "John Doe",
      "email": "john.doe@clinic.com",
      "role": "admin",
      "active": true,
      "permissions": [
        { "resource": "patients", "actions": ["view", "create", "edit", "delete"] }
      ],
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T10:00:00.000Z"
    }
  }
}
```

### Error — 401

```json
{ "status": "fail", "message": "Invalid email or password", "data": null }
```

---

## 2. Rotate token

`POST /api/v1/auth/rotate-token`

No auth required. Uses the `refreshToken` httpOnly cookie to issue a new `accessToken` cookie.

No body needed.

### Example response — 200

```json
{
  "status": "success",
  "message": "Token rotated successfully",
  "data": null
}
```

### Error — 401

```json
{ "status": "fail", "message": "Invalid or expired refresh token", "data": null }
```

---

## 3. Get current user

`GET /api/v1/auth/me`

**Auth required.**

### Example response — 200

```json
{
  "status": "success",
  "message": "User fetched successfully",
  "data": {
    "user": {
      "_id": "64f1c2b3a1b2c3d4e5f6a7aa",
      "fullName": "John Doe",
      "email": "john.doe@clinic.com",
      "role": "admin",
      "active": true,
      "permissions": [
        { "resource": "patients", "actions": ["view", "create", "edit", "delete"] }
      ],
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T10:00:00.000Z"
    }
  }
}
```

---

## 4. Change password

`PATCH /api/v1/auth/change-password`

**Auth required.**

### Body

| Field | Type | Required | Notes |
|---|---|---|---|
| `currentPassword` | string | yes | min 1 char |
| `newPassword` | string | yes | min 8 chars |
| `confirmPassword` | string | yes | must match `newPassword` |

### Example request body

```json
{
  "currentPassword": "oldSecret123",
  "newPassword": "newSecret456",
  "confirmPassword": "newSecret456"
}
```

### Example response — 200

```json
{
  "status": "success",
  "message": "Password changed successfully",
  "data": null
}
```

### Error — 400

```json
{ "status": "fail", "message": "Current password is incorrect", "data": null }
```

---

## Quick reference table

| Method | Path | Auth | Body |
|---|---|---|---|
| POST | `/signin` | No | email, password |
| POST | `/rotate-token` | No (refresh cookie) | — |
| GET | `/me` | Yes | — |
| PATCH | `/change-password` | Yes | currentPassword, newPassword, confirmPassword |
