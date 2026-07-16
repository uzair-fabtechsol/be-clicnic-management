# Audit Log API — Frontend Integration Guide

Base path: `/api/v1/audit-logs`

## Auth

All routes require the user to be signed in via **httpOnly cookie** `accessToken`. Send requests with `credentials: "include"` (fetch) / `withCredentials: true` (axios). Requires `auditLogs:view` permission.

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
| 400 | Zod validation failed (query) or invalid `:id` ObjectId |
| 401 | Not signed in / expired token |
| 403 | Missing `auditLogs:view` permission |
| 404 | Audit log not found |

---

## 1. Get all audit logs

`GET /api/v1/audit-logs`

**Permission required:** `auditLogs:view`

### Query params (all optional)

| Param | Type | Default | Notes |
|---|---|---|---|
| `page` | number (int, min 1) | `1` | |
| `limit` | number (int, min 1, max 100) | `10` | |
| `action` | `"patientCreated" \| "doctorAdded" \| "appointmentCancelled" \| "userLogin" \| "opdSlipGenerated"` | — | |
| `performedBy` | string (ObjectId) | — | filter by user id |

### Example request

```
GET /api/v1/audit-logs?page=1&limit=10&action=userLogin
```

### Example response — 200

```json
{
  "status": "success",
  "message": "Audit logs fetched successfully",
  "data": {
    "auditLogs": [
      {
        "_id": "66a1f2b3c4d5e6f7a8b9c0d1",
        "action": "userLogin",
        "performedBy": {
          "_id": "64f1c2b3a1b2c3d4e5f6a7aa",
          "fullName": "John Doe",
          "email": "john.doe@clinic.com"
        },
        "details": {},
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

## 2. Get single audit log

`GET /api/v1/audit-logs/:id`

**Permission required:** `auditLogs:view`

### Path params

| Param | Type | Notes |
|---|---|---|
| `id` | string (ObjectId) | `400` if malformed |

### Example response — 200

```json
{
  "status": "success",
  "message": "Audit log fetched successfully",
  "data": {
    "auditLog": {
      "_id": "66a1f2b3c4d5e6f7a8b9c0d1",
      "action": "userLogin",
      "performedBy": {
        "_id": "64f1c2b3a1b2c3d4e5f6a7aa",
        "fullName": "John Doe",
        "email": "john.doe@clinic.com"
      },
      "details": {},
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T10:00:00.000Z"
    }
  }
}
```

### 404

```json
{ "status": "fail", "message": "Audit log not found", "data": null }
```

---

## Quick reference table

| Method | Path | Permission | Query | Params |
|---|---|---|---|---|
| GET | `/` | auditLogs:view | page, limit, action, performedBy | — |
| GET | `/:id` | auditLogs:view | — | id |
