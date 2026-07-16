# Patient API — Frontend Integration Guide

Base path: `/api/v1/patients`

## Auth

All routes require the user to be signed in via **httpOnly cookie** `accessToken`. Send requests with `credentials: "include"` (fetch) / `withCredentials: true` (axios). Each route requires a permission on the `patients` module (`view` / `create` / `edit` / `delete`).

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
| 403 | Missing required permission |
| 404 | Patient not found |
| 409 | CNIC already registered |

---

## 1. Get all patients

`GET /api/v1/patients`

**Permission required:** `patients:view`

### Query params (all optional)

| Param | Type | Default | Notes |
|---|---|---|---|
| `page` | number (int, min 1) | `1` | |
| `limit` | number (int, min 1, max 100) | `10` | |
| `search` | string | — | search by name, MR number, CNIC, mobile |
| `gender` | `"male" \| "female" \| "other"` | — | |
| `bloodGroup` | `"A+" \| "A-" \| "B+" \| "B-" \| "AB+" \| "AB-" \| "O+" \| "O-"` | — | |

### Example request

```
GET /api/v1/patients?page=1&limit=10&gender=male&bloodGroup=O%2B
```

### Example response — 200

```json
{
  "status": "success",
  "message": "Patients fetched successfully",
  "data": {
    "patients": [
      {
        "_id": "64f1c2b3a1b2c3d4e5f6a7aa",
        "mrNumber": "MR0001",
        "name": "Ali Khan",
        "fatherName": "Ahmed Khan",
        "gender": "male",
        "age": 30,
        "dateOfBirth": "1996-01-01T00:00:00.000Z",
        "mobileNumber": "03001234567",
        "cnic": "35202-1234567-1",
        "bloodGroup": "O+",
        "emergencyContact": "03007654321",
        "address": "Lahore, Pakistan",
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

## 2. Create patient

`POST /api/v1/patients`

**Permission required:** `patients:create`

### Body

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | trimmed, min 1 char |
| `fatherName` | string | yes | trimmed, min 1 char |
| `gender` | `"male" \| "female" \| "other"` | yes | |
| `age` | number (int) | yes | min 0, max 150 |
| `dateOfBirth` | date string | yes | `z.coerce.date()` |
| `mobileNumber` | string | yes | trimmed, min 1 char |
| `cnic` | string | yes | format `XXXXX-XXXXXXX-X` |
| `bloodGroup` | `"A+" \| "A-" \| "B+" \| "B-" \| "AB+" \| "AB-" \| "O+" \| "O-"` | yes | |
| `emergencyContact` | string | yes | trimmed, min 1 char |
| `address` | string | yes | trimmed, min 1 char |

### Example request body

```json
{
  "name": "Ali Khan",
  "fatherName": "Ahmed Khan",
  "gender": "male",
  "age": 30,
  "dateOfBirth": "1996-01-01",
  "mobileNumber": "03001234567",
  "cnic": "35202-1234567-1",
  "bloodGroup": "O+",
  "emergencyContact": "03007654321",
  "address": "Lahore, Pakistan"
}
```

### Example response — 201

```json
{
  "status": "success",
  "message": "Patient created successfully",
  "data": {
    "patient": {
      "_id": "64f1c2b3a1b2c3d4e5f6a7aa",
      "mrNumber": "MR0001",
      "name": "Ali Khan",
      "fatherName": "Ahmed Khan",
      "gender": "male",
      "age": 30,
      "dateOfBirth": "1996-01-01T00:00:00.000Z",
      "mobileNumber": "03001234567",
      "cnic": "35202-1234567-1",
      "bloodGroup": "O+",
      "emergencyContact": "03007654321",
      "address": "Lahore, Pakistan",
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T10:00:00.000Z"
    }
  }
}
```

---

## 3. Get single patient

`GET /api/v1/patients/:id`

**Permission required:** `patients:view`

### Path params

| Param | Type | Notes |
|---|---|---|
| `id` | string (ObjectId) | `400` if malformed |

### Example response — 200

```json
{
  "status": "success",
  "message": "Patient fetched successfully",
  "data": {
    "patient": {
      "_id": "64f1c2b3a1b2c3d4e5f6a7aa",
      "mrNumber": "MR0001",
      "name": "Ali Khan",
      "fatherName": "Ahmed Khan",
      "gender": "male",
      "age": 30,
      "dateOfBirth": "1996-01-01T00:00:00.000Z",
      "mobileNumber": "03001234567",
      "cnic": "35202-1234567-1",
      "bloodGroup": "O+",
      "emergencyContact": "03007654321",
      "address": "Lahore, Pakistan",
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T10:00:00.000Z"
    }
  }
}
```

### 404

```json
{ "status": "fail", "message": "Patient not found", "data": null }
```

---

## 4. Update patient

`PATCH /api/v1/patients/:id`

**Permission required:** `patients:edit`

### Body (all fields optional — send only what changes)

| Field | Type | Notes |
|---|---|---|
| `name` | string | trimmed, min 1 char |
| `fatherName` | string | trimmed, min 1 char |
| `gender` | `"male" \| "female" \| "other"` | |
| `age` | number (int) | min 0, max 150 |
| `dateOfBirth` | date string | |
| `mobileNumber` | string | trimmed, min 1 char |
| `cnic` | string | format `XXXXX-XXXXXXX-X` |
| `bloodGroup` | `"A+" \| ...` | |
| `emergencyContact` | string | trimmed, min 1 char |
| `address` | string | trimmed, min 1 char |

### Example response — 200

```json
{
  "status": "success",
  "message": "Patient updated successfully",
  "data": {
    "patient": { "...": "updated patient object" }
  }
}
```

---

## 5. Delete patient

`DELETE /api/v1/patients/:id`

**Permission required:** `patients:delete`

No body. Hard-deletes the record.

### Example response — 200

```json
{
  "status": "success",
  "message": "Patient deleted successfully",
  "data": null
}
```

### 404

```json
{ "status": "fail", "message": "Patient not found", "data": null }
```

---

## Quick reference table

| Method | Path | Permission | Body | Query | Params |
|---|---|---|---|---|---|
| GET | `/` | patients:view | — | page, limit, search, gender, bloodGroup | — |
| POST | `/` | patients:create | name, fatherName, gender, age, dateOfBirth, mobileNumber, cnic, bloodGroup, emergencyContact, address | — | — |
| GET | `/:id` | patients:view | — | — | id |
| PATCH | `/:id` | patients:edit | any patient fields | — | id |
| DELETE | `/:id` | patients:delete | — | — | id |
