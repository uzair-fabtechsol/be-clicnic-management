# OPD Slip API — Frontend Integration Guide

Base path: `/api/v1/opd-slips`

## Auth

All routes require the user to be signed in via **httpOnly cookie** `accessToken`. Send requests with `credentials: "include"` (fetch) / `withCredentials: true` (axios). Each route requires a permission on the `opdSlips` module (`view` / `create` / `edit` / `delete`).

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
| 404 | OPD slip / patient / doctor not found |

---

## 1. Get all OPD slips

`GET /api/v1/opd-slips`

**Permission required:** `opdSlips:view`

### Query params (all optional)

| Param | Type | Default | Notes |
|---|---|---|---|
| `page` | number (int, min 1) | `1` | |
| `limit` | number (int, min 1, max 100) | `10` | |
| `patient` | string (ObjectId) | — | filter by patient id |
| `doctor` | string (ObjectId) | — | filter by doctor id |
| `visitType` | `"new" \| "followUp"` | — | |
| `paymentMethod` | `"cash" \| "card" \| "bankTransfer"` | — | |

### Example request

```
GET /api/v1/opd-slips?page=1&limit=10&visitType=new&paymentMethod=cash
```

### Example response — 200

```json
{
  "status": "success",
  "message": "OPD slips fetched successfully",
  "data": {
    "opdSlips": [
      {
        "_id": "66a1f2b3c4d5e6f7a8b9c0d1",
        "opdSlipNumber": "OPD00000001",
        "visitType": "new",
        "paymentMethod": "cash",
        "symptomsAndRemarks": "Chest pain",
        "createdAt": "2026-07-16T10:00:00.000Z",
        "updatedAt": "2026-07-16T10:00:00.000Z",
        "patientDetails": {
          "_id": "64f1c2b3a1b2c3d4e5f6a7aa",
          "mrNumber": "MR0001",
          "name": "Ali Khan",
          "fatherName": "Ahmed Khan",
          "gender": "male",
          "age": 30,
          "mobileNumber": "03001234567"
        },
        "doctorDetails": {
          "_id": "64f1c2b3a1b2c3d4e5f6a7b8",
          "name": "Dr. Sara Ahmed",
          "specialization": "Cardiologist",
          "consultationFee": 2000
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

> Note: `patient` and `doctor` id fields are replaced by `patientDetails` / `doctorDetails` populated objects on list/get-by-id responses.

---

## 2. Create OPD slip

`POST /api/v1/opd-slips`

**Permission required:** `opdSlips:create`

### Body

| Field | Type | Required | Notes |
|---|---|---|---|
| `patient` | string (ObjectId) | yes | must reference an existing patient |
| `doctor` | string (ObjectId) | yes | must reference an existing doctor |
| `paymentMethod` | `"cash" \| "card" \| "bankTransfer"` | yes | |
| `symptomsAndRemarks` | string | no | trimmed, min 1 char if provided |

### Server-side logic

- `visitType` is automatically determined: `"new"` if the patient has no prior OPD slips with this doctor, `"followUp"` otherwise.
- A billing record is automatically created for the doctor's `consultationFee`.

### Example request body

```json
{
  "patient": "64f1c2b3a1b2c3d4e5f6a7aa",
  "doctor": "64f1c2b3a1b2c3d4e5f6a7b8",
  "paymentMethod": "cash",
  "symptomsAndRemarks": "Chest pain and shortness of breath"
}
```

### Example response — 201

```json
{
  "status": "success",
  "message": "OPD slip created successfully",
  "data": {
    "opdSlip": {
      "_id": "66a1f2b3c4d5e6f7a8b9c0d1",
      "opdSlipNumber": "OPD00000001",
      "patient": "64f1c2b3a1b2c3d4e5f6a7aa",
      "doctor": "64f1c2b3a1b2c3d4e5f6a7b8",
      "visitType": "new",
      "paymentMethod": "cash",
      "symptomsAndRemarks": "Chest pain and shortness of breath",
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T10:00:00.000Z"
    }
  }
}
```

---

## 3. Get single OPD slip

`GET /api/v1/opd-slips/:id`

**Permission required:** `opdSlips:view`

### Path params

| Param | Type | Notes |
|---|---|---|
| `id` | string (ObjectId) | `400` if malformed |

### Example response — 200

Same shape as one item from the list (`patientDetails` / `doctorDetails` populated):

```json
{
  "status": "success",
  "message": "OPD slip fetched successfully",
  "data": {
    "opdSlip": {
      "_id": "66a1f2b3c4d5e6f7a8b9c0d1",
      "opdSlipNumber": "OPD00000001",
      "visitType": "new",
      "paymentMethod": "cash",
      "symptomsAndRemarks": "Chest pain and shortness of breath",
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
{ "status": "fail", "message": "OPD slip not found", "data": null }
```

---

## 4. Update OPD slip

`PATCH /api/v1/opd-slips/:id`

**Permission required:** `opdSlips:edit`

### Body (all fields optional — send only what changes)

| Field | Type | Notes |
|---|---|---|
| `paymentMethod` | `"cash" \| "card" \| "bankTransfer"` | |
| `symptomsAndRemarks` | string | trimmed, min 1 char if provided |

> `patient`, `doctor`, and `visitType` **cannot** be changed via this endpoint.

### Example request body

```json
{
  "paymentMethod": "card",
  "symptomsAndRemarks": "Updated: fever and cough"
}
```

### Example response — 200

```json
{
  "status": "success",
  "message": "OPD slip updated successfully",
  "data": {
    "opdSlip": {
      "_id": "66a1f2b3c4d5e6f7a8b9c0d1",
      "opdSlipNumber": "OPD00000001",
      "patient": "64f1c2b3a1b2c3d4e5f6a7aa",
      "doctor": "64f1c2b3a1b2c3d4e5f6a7b8",
      "visitType": "new",
      "paymentMethod": "card",
      "symptomsAndRemarks": "Updated: fever and cough",
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T11:00:00.000Z"
    }
  }
}
```

---

## 5. Delete OPD slip

`DELETE /api/v1/opd-slips/:id`

**Permission required:** `opdSlips:delete`

No body. Hard-deletes the record.

### Example response — 200

```json
{
  "status": "success",
  "message": "OPD slip deleted successfully",
  "data": null
}
```

### 404

```json
{ "status": "fail", "message": "OPD slip not found", "data": null }
```

---

## Quick reference table

| Method | Path | Permission | Body | Query | Params |
|---|---|---|---|---|---|
| GET | `/` | opdSlips:view | — | page, limit, patient, doctor, visitType, paymentMethod | — |
| POST | `/` | opdSlips:create | patient, doctor, paymentMethod, symptomsAndRemarks? | — | — |
| GET | `/:id` | opdSlips:view | — | — | id |
| PATCH | `/:id` | opdSlips:edit | paymentMethod?, symptomsAndRemarks? | — | id |
| DELETE | `/:id` | opdSlips:delete | — | — | id |
