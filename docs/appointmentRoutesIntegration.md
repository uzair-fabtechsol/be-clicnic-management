# Appointment API — Frontend Integration Guide

Base path: `/api/v1/appointments`

## Auth

All routes require the user to be signed in. Auth is via an **httpOnly cookie** named `accessToken` (set on login) — no `Authorization` header is needed, but requests must be made with `credentials: "include"` (fetch) / `withCredentials: true` (axios) so the cookie is sent.

Each route also requires a permission on the `appointments` module (`view` / `create` / `edit` / `delete`) tied to the logged-in user's role. If the user lacks it, expect a `403`.

## Common response shape

Every endpoint returns JSON in this shape:

```json
{
  "status": "success" | "fail" | "error",
  "message": "human readable message",
  "data": { ... } | null
}
```

## Common error responses

| Status | When | Body example |
|---|---|---|
| 400 | Zod validation failed (body/query) | `{ "status": "fail", "message": "Validation failed", "data": { "errors": [{ "field": "doctor", "message": "Invalid id" }] } }` |
| 400 | Invalid `:id` param (not a valid ObjectId) | `{ "status": "fail", "message": "Invalid value \"123\" for field \"id\"" ... }` |
| 400 | Business rule violation (e.g. editing a canceled/completed appointment, doctor unavailable) | `{ "status": "fail", "message": "Cannot update a canceled appointment", "data": null }` |
| 401 | Not signed in / invalid or expired token | `{ "status": "fail", "message": "You are not signed in. Please sign in to get access" }` |
| 403 | Signed in but missing the required permission | `{ "status": "fail", "message": "..." }` |
| 404 | Appointment / patient / doctor not found | `{ "status": "fail", "message": "Appointment not found", "data": null }` |
| 409 | Doctor already booked at that date & time | `{ "status": "fail", "message": "Doctor already has an appointment at this date and time" }` |

---

## 1. Get all appointments

`GET /api/v1/appointments`

**Permission required:** `appointments:view`

### Query params (all optional except pagination has defaults)

| Param | Type | Default | Notes |
|---|---|---|---|
| `page` | number (int, min 1) | `1` | |
| `limit` | number (int, min 1, max 100) | `10` | |
| `patient` | string (ObjectId) | — | filter by patient id |
| `doctor` | string (ObjectId) | — | filter by doctor id |
| `date` | date string (coerced) | — | filters appointments within that whole day (UTC day bounds) |
| `status` | `"scheduled" \| "canceled" \| "completed"` | — | |

### Example request

```
GET /api/v1/appointments?page=1&limit=10&doctor=64f1c2b3a1b2c3d4e5f6a7b8&status=scheduled&date=2026-07-20
```

### Example response — 200

```json
{
  "status": "success",
  "message": "Appointments fetched successfully",
  "data": {
    "appointments": [
      {
        "_id": "66a1f2b3c4d5e6f7a8b9c0d1",
        "appointmentNumber": "APT00000123",
        "date": "2026-07-20T00:00:00.000Z",
        "time": "1970-01-01T09:30:00.000Z",
        "notes": "Follow-up checkup",
        "status": "scheduled",
        "createdAt": "2026-07-16T10:00:00.000Z",
        "updatedAt": "2026-07-16T10:00:00.000Z",
        "patientDetails": {
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
          "address": "Lahore, Pakistan"
        },
        "doctorDetails": {
          "_id": "64f1c2b3a1b2c3d4e5f6a7b8",
          "name": "Dr. Sara Ahmed",
          "specialization": "Cardiologist",
          "qualification": "MBBS, FCPS",
          "contactNumber": "03011234567",
          "email": "sara.ahmed@clinic.com",
          "consultationFee": 2000,
          "active": true,
          "slots": [
            { "day": "monday", "from": "1970-01-01T09:00:00.000Z", "to": "1970-01-01T17:00:00.000Z" }
          ]
        }
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

> Note: `patient` and `doctor` id fields are **not** returned on list/get-by-id responses — they are replaced by the full `patientDetails` / `doctorDetails` objects (via `$lookup`), and the raw `patient`/`doctor` ObjectId fields are excluded from the projection.

> Note on `time`: the backend stores/returns `time` as a full `Date` (epoch date `1970-01-01`) with only the `HH:mm` portion meaningful. When sending `time` in requests, send it as a plain `"HH:mm"` string (see below); when displaying a received `time`, extract hours/minutes from the ISO string and ignore the date portion.

---

## 2. Create appointment

`POST /api/v1/appointments`

**Permission required:** `appointments:create`

### Body

| Field | Type | Required | Notes |
|---|---|---|---|
| `patient` | string (ObjectId) | yes | must reference an existing patient |
| `doctor` | string (ObjectId) | yes | must reference an existing doctor |
| `date` | date string | yes | any parseable date string (`z.coerce.date()`), e.g. `"2026-07-20"` |
| `time` | string | yes | strict `"HH:mm"` 24-hour format, e.g. `"09:30"` |
| `notes` | string | no | trimmed, min 1 char if provided |

### Example request body

```json
{
  "patient": "64f1c2b3a1b2c3d4e5f6a7aa",
  "doctor": "64f1c2b3a1b2c3d4e5f6a7b8",
  "date": "2026-07-20",
  "time": "09:30",
  "notes": "Follow-up checkup"
}
```

### Server-side checks (surfaced as errors)

- Patient must exist → `404 Patient not found`
- Doctor must exist → `404 Doctor not found`
- Requested `date`/`time` must fall inside one of the doctor's configured `slots` → `400 Doctor is not available at the selected date and time`
- Doctor must not already have a non-canceled appointment at that exact `date` + `time` → `409 Doctor already has an appointment at this date and time`

### Example response — 201

```json
{
  "status": "success",
  "message": "Appointment created successfully",
  "data": {
    "appointment": {
      "_id": "66a1f2b3c4d5e6f7a8b9c0d1",
      "appointmentNumber": "APT00000123",
      "patient": "64f1c2b3a1b2c3d4e5f6a7aa",
      "doctor": "64f1c2b3a1b2c3d4e5f6a7b8",
      "date": "2026-07-20T00:00:00.000Z",
      "time": "1970-01-01T09:30:00.000Z",
      "notes": "Follow-up checkup",
      "status": "scheduled",
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T10:00:00.000Z"
    }
  }
}
```

> Note: unlike the list/get-by-id endpoints, create/update/cancel/complete return the raw appointment document — `patient`/`doctor` are plain id strings here, **not** populated objects.

---

## 3. Get single appointment

`GET /api/v1/appointments/:id`

**Permission required:** `appointments:view`

### Path params

| Param | Type | Notes |
|---|---|---|
| `id` | string (ObjectId) | validated; `400` if malformed |

### Example request

```
GET /api/v1/appointments/66a1f2b3c4d5e6f7a8b9c0d1
```

### Example response — 200

Same shape as one item from the "Get all appointments" list (`patientDetails` / `doctorDetails` populated):

```json
{
  "status": "success",
  "message": "Appointment fetched successfully",
  "data": {
    "appointment": {
      "_id": "66a1f2b3c4d5e6f7a8b9c0d1",
      "appointmentNumber": "APT00000123",
      "date": "2026-07-20T00:00:00.000Z",
      "time": "1970-01-01T09:30:00.000Z",
      "notes": "Follow-up checkup",
      "status": "scheduled",
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T10:00:00.000Z",
      "patientDetails": { "...": "see patient shape above" },
      "doctorDetails": { "...": "see doctor shape above" }
    }
  }
}
```

### 404

```json
{ "status": "fail", "message": "Appointment not found", "data": null }
```

---

## 4. Update appointment

`PATCH /api/v1/appointments/:id`

**Permission required:** `appointments:edit`

### Path params

| Param | Type | Notes |
|---|---|---|
| `id` | string (ObjectId) | |

### Body (all fields optional — send only what changes)

| Field | Type | Notes |
|---|---|---|
| `date` | date string | |
| `time` | string `"HH:mm"` | |
| `notes` | string | trimmed, min 1 char if provided |

> `patient`, `doctor`, and `status` **cannot** be changed via this endpoint.

### Example request body

```json
{
  "date": "2026-07-21",
  "time": "10:00",
  "notes": "Rescheduled by patient request"
}
```

### Business rules

- Cannot update if appointment `status` is `canceled` → `400 Cannot update a canceled appointment`
- Cannot update if appointment `status` is `completed` → `400 Cannot update a completed appointment`
- If `date` and/or `time` changes, the same doctor-availability + conflict checks as create run again (`400`/`409`)

### Example response — 200

```json
{
  "status": "success",
  "message": "Appointment updated successfully",
  "data": {
    "appointment": {
      "_id": "66a1f2b3c4d5e6f7a8b9c0d1",
      "appointmentNumber": "APT00000123",
      "patient": "64f1c2b3a1b2c3d4e5f6a7aa",
      "doctor": "64f1c2b3a1b2c3d4e5f6a7b8",
      "date": "2026-07-21T00:00:00.000Z",
      "time": "1970-01-01T10:00:00.000Z",
      "notes": "Rescheduled by patient request",
      "status": "scheduled",
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T11:00:00.000Z"
    }
  }
}
```

---

## 5. Delete appointment

`DELETE /api/v1/appointments/:id`

**Permission required:** `appointments:delete`

### Path params

| Param | Type |
|---|---|
| `id` | string (ObjectId) |

No body. Hard-deletes the record (not a status change).

### Example response — 200

```json
{
  "status": "success",
  "message": "Appointment deleted successfully",
  "data": null
}
```

### 404

```json
{ "status": "fail", "message": "Appointment not found", "data": null }
```

---

## 6. Cancel appointment

`PATCH /api/v1/appointments/:id/cancel`

**Permission required:** `appointments:delete` (note: cancel is gated by the *delete* permission, not edit)

### Path params

| Param | Type |
|---|---|
| `id` | string (ObjectId) |

No body needed. Sets `status` to `"canceled"` and writes an audit log entry.

### Business rules

- Already canceled → `400 Appointment is already canceled`
- Already completed → `400 Cannot cancel a completed appointment`

### Example response — 200

```json
{
  "status": "success",
  "message": "Appointment canceled successfully",
  "data": {
    "appointment": {
      "_id": "66a1f2b3c4d5e6f7a8b9c0d1",
      "appointmentNumber": "APT00000123",
      "patient": "64f1c2b3a1b2c3d4e5f6a7aa",
      "doctor": "64f1c2b3a1b2c3d4e5f6a7b8",
      "date": "2026-07-21T00:00:00.000Z",
      "time": "1970-01-01T10:00:00.000Z",
      "notes": "Rescheduled by patient request",
      "status": "canceled",
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T12:00:00.000Z"
    }
  }
}
```

---

## 7. Complete appointment

`PATCH /api/v1/appointments/:id/complete`

**Permission required:** `appointments:edit`

### Path params

| Param | Type |
|---|---|
| `id` | string (ObjectId) |

No body needed. Sets `status` to `"completed"`.

### Business rules

- Already completed → `400 Appointment is already completed`
- Already canceled → `400 Cannot complete a canceled appointment`

### Example response — 200

```json
{
  "status": "success",
  "message": "Appointment completed successfully",
  "data": {
    "appointment": {
      "_id": "66a1f2b3c4d5e6f7a8b9c0d1",
      "appointmentNumber": "APT00000123",
      "patient": "64f1c2b3a1b2c3d4e5f6a7aa",
      "doctor": "64f1c2b3a1b2c3d4e5f6a7b8",
      "date": "2026-07-21T00:00:00.000Z",
      "time": "1970-01-01T10:00:00.000Z",
      "notes": "Rescheduled by patient request",
      "status": "completed",
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T13:00:00.000Z"
    }
  }
}
```

---

## Quick reference table

| Method | Path | Permission | Body | Query | Params |
|---|---|---|---|---|---|
| GET | `/` | appointments:view | — | page, limit, patient, doctor, date, status | — |
| POST | `/` | appointments:create | patient, doctor, date, time, notes? | — | — |
| GET | `/:id` | appointments:view | — | — | id |
| PATCH | `/:id` | appointments:edit | date?, time?, notes? | — | id |
| DELETE | `/:id` | appointments:delete | — | — | id |
| PATCH | `/:id/cancel` | appointments:delete | — | — | id |
| PATCH | `/:id/complete` | appointments:edit | — | — | id |
