# Doctor API — Frontend Integration Guide

Base path: `/api/v1/doctors`

## Auth

All routes require the user to be signed in via **httpOnly cookie** `accessToken`. Send requests with `credentials: "include"` (fetch) / `withCredentials: true` (axios). Each route requires a permission on the `doctors` module (`view` / `create` / `edit` / `delete`).

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
| 404 | Doctor not found |
| 409 | Email already in use |

---

## 1. Get all doctors

`GET /api/v1/doctors`

**Permission required:** `doctors:view`

### Query params (all optional)

| Param | Type | Default | Notes |
|---|---|---|---|
| `page` | number (int, min 1) | `1` | |
| `limit` | number (int, min 1, max 100) | `10` | |
| `search` | string | — | search by name |
| `specialization` | string | — | filter by specialization |
| `active` | `"true" \| "false"` | — | filter by active status |

### Example request

```
GET /api/v1/doctors?page=1&limit=10&specialization=Cardiologist&active=true
```

### Example response — 200

```json
{
  "status": "success",
  "message": "Doctors fetched successfully",
  "data": {
    "doctors": [
      {
        "_id": "64f1c2b3a1b2c3d4e5f6a7b8",
        "name": "Dr. Sara Ahmed",
        "specialization": "Cardiologist",
        "qualification": "MBBS, FCPS",
        "contactNumber": "03011234567",
        "email": "sara.ahmed@clinic.com",
        "consultationFee": 2000,
        "active": true,
        "slots": [
          { "day": "Monday", "from": "1970-01-01T09:00:00.000Z", "to": "1970-01-01T17:00:00.000Z" }
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

> Note on `slots.from` / `slots.to`: stored as full `Date` (epoch `1970-01-01`) — only the `HH:mm` portion is meaningful. When sending slots in requests, send `from`/`to` as `"HH:mm"` strings; when displaying, extract hours/minutes from the ISO string.

---

## 2. Create doctor

`POST /api/v1/doctors`

**Permission required:** `doctors:create`

### Body

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | trimmed, min 1 char |
| `specialization` | string | yes | trimmed, min 1 char |
| `qualification` | string | yes | trimmed, min 1 char |
| `contactNumber` | string | yes | trimmed, min 1 char |
| `email` | string (email) | yes | trimmed, lowercased |
| `consultationFee` | number | yes | min 0 |
| `active` | boolean | no | default `true` |
| `slots` | array of slot objects | no | default `[]` |

#### Slot object

| Field | Type | Required | Notes |
|---|---|---|---|
| `day` | `"Monday" \| "Tuesday" \| "Wednesday" \| "Thursday" \| "Friday" \| "Saturday" \| "Sunday"` | yes | |
| `from` | string `"HH:mm"` | yes | must be before `to` |
| `to` | string `"HH:mm"` | yes | |

### Example request body

```json
{
  "name": "Dr. Sara Ahmed",
  "specialization": "Cardiologist",
  "qualification": "MBBS, FCPS",
  "contactNumber": "03011234567",
  "email": "sara.ahmed@clinic.com",
  "consultationFee": 2000,
  "active": true,
  "slots": [
    { "day": "Monday", "from": "09:00", "to": "17:00" },
    { "day": "Wednesday", "from": "09:00", "to": "17:00" }
  ]
}
```

### Example response — 201

```json
{
  "status": "success",
  "message": "Doctor created successfully",
  "data": {
    "doctor": {
      "_id": "64f1c2b3a1b2c3d4e5f6a7b8",
      "name": "Dr. Sara Ahmed",
      "specialization": "Cardiologist",
      "qualification": "MBBS, FCPS",
      "contactNumber": "03011234567",
      "email": "sara.ahmed@clinic.com",
      "consultationFee": 2000,
      "active": true,
      "slots": [
        { "day": "Monday", "from": "1970-01-01T09:00:00.000Z", "to": "1970-01-01T17:00:00.000Z" },
        { "day": "Wednesday", "from": "1970-01-01T09:00:00.000Z", "to": "1970-01-01T17:00:00.000Z" }
      ],
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T10:00:00.000Z"
    }
  }
}
```

---

## 3. Get single doctor

`GET /api/v1/doctors/:id`

**Permission required:** `doctors:view`

### Path params

| Param | Type | Notes |
|---|---|---|
| `id` | string (ObjectId) | `400` if malformed |

### Example response — 200

```json
{
  "status": "success",
  "message": "Doctor fetched successfully",
  "data": {
    "doctor": {
      "_id": "64f1c2b3a1b2c3d4e5f6a7b8",
      "name": "Dr. Sara Ahmed",
      "specialization": "Cardiologist",
      "qualification": "MBBS, FCPS",
      "contactNumber": "03011234567",
      "email": "sara.ahmed@clinic.com",
      "consultationFee": 2000,
      "active": true,
      "slots": [
        { "day": "Monday", "from": "1970-01-01T09:00:00.000Z", "to": "1970-01-01T17:00:00.000Z" }
      ],
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T10:00:00.000Z"
    }
  }
}
```

### 404

```json
{ "status": "fail", "message": "Doctor not found", "data": null }
```

---

## 4. Update doctor

`PATCH /api/v1/doctors/:id`

**Permission required:** `doctors:edit`

### Body (all fields optional — send only what changes)

| Field | Type | Notes |
|---|---|---|
| `name` | string | trimmed, min 1 char |
| `specialization` | string | trimmed, min 1 char |
| `qualification` | string | trimmed, min 1 char |
| `contactNumber` | string | trimmed, min 1 char |
| `email` | string (email) | trimmed, lowercased |
| `consultationFee` | number | min 0 |
| `active` | boolean | |
| `slots` | array of slot objects | replaces entire slots array |

### Example response — 200

```json
{
  "status": "success",
  "message": "Doctor updated successfully",
  "data": {
    "doctor": { "...": "updated doctor object" }
  }
}
```

---

## 5. Delete doctor

`DELETE /api/v1/doctors/:id`

**Permission required:** `doctors:delete`

No body. Hard-deletes the record.

### Example response — 200

```json
{
  "status": "success",
  "message": "Doctor deleted successfully",
  "data": null
}
```

### 404

```json
{ "status": "fail", "message": "Doctor not found", "data": null }
```

---

## Quick reference table

| Method | Path | Permission | Body | Query | Params |
|---|---|---|---|---|---|
| GET | `/` | doctors:view | — | page, limit, search, specialization, active | — |
| POST | `/` | doctors:create | name, specialization, qualification, contactNumber, email, consultationFee, active?, slots? | — | — |
| GET | `/:id` | doctors:view | — | — | id |
| PATCH | `/:id` | doctors:edit | any doctor fields | — | id |
| DELETE | `/:id` | doctors:delete | — | — | id |
