# Clinic Information API — Frontend Integration Guide

Base path: `/api/v1/clinic-information`

## Auth

All routes require the user to be signed in via **httpOnly cookie** `accessToken`. Send requests with `credentials: "include"` (fetch) / `withCredentials: true` (axios). Restricted to **admin** role only.

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
| 401 | Not signed in / expired token |
| 403 | Not an admin |

---

## 1. Update clinic information

`PATCH /api/v1/clinic-information`

**Restricted to:** `admin` role

### Body (all fields optional — send only what changes)

| Field | Type | Notes |
|---|---|---|
| `clinicName` | string | trimmed, min 1 char |
| `contactNumber` | string | trimmed, min 1 char |
| `email` | string (email) | trimmed, lowercased |
| `address` | string | trimmed, min 1 char |

### Example request body

```json
{
  "clinicName": "City Health Clinic",
  "contactNumber": "03001234567",
  "email": "info@cityhealthclinic.com",
  "address": "123 Main Street, Lahore, Pakistan"
}
```

### Example response — 200

```json
{
  "status": "success",
  "message": "Clinic information updated successfully",
  "data": {
    "clinicInformation": {
      "_id": "64f1c2b3a1b2c3d4e5f6a7aa",
      "clinicName": "City Health Clinic",
      "contactNumber": "03001234567",
      "email": "info@cityhealthclinic.com",
      "address": "123 Main Street, Lahore, Pakistan",
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T11:00:00.000Z"
    }
  }
}
```

---

## Quick reference table

| Method | Path | Role | Body |
|---|---|---|---|
| PATCH | `/` | admin | clinicName?, contactNumber?, email?, address? |
