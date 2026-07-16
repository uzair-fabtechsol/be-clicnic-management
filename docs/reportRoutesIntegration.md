# Reports API — Frontend Integration Guide

Base path: `/api/v1/reports`

## Auth

All routes require the user to be signed in via **httpOnly cookie** `accessToken`. Send requests with `credentials: "include"` (fetch) / `withCredentials: true` (axios). Requires `reports:view` permission.

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
| 400 | Zod validation failed (query) |
| 401 | Not signed in / expired token |
| 403 | Missing `reports:view` permission |

---

## Shared query params

### List endpoints (`/patients`, `/doctors`, `/financial`, `/opd`)

| Param | Type | Default | Notes |
|---|---|---|---|
| `page` | number (int, min 1) | `1` | |
| `limit` | number (int, min 1, max 100) | `10` | |
| `from` | date string | — | filter from date (inclusive), `z.coerce.date()` |
| `to` | date string | — | filter to date (inclusive), `z.coerce.date()` |

### Stats endpoints (`/patients/stats`, `/financial/stats`, `/opd/stats`)

| Param | Type | Notes |
|---|---|---|
| `from` | date string | optional, `z.coerce.date()` |
| `to` | date string | optional, `z.coerce.date()` |

---

## 1. Get patients report stats

`GET /api/v1/reports/patients/stats`

**Permission required:** `reports:view`

### Example request

```
GET /api/v1/reports/patients/stats?from=2026-07-01&to=2026-07-31
```

### Example response — 200

```json
{
  "status": "success",
  "message": "Patients report stats fetched successfully",
  "data": {
    "stats": {
      "totalPatients": 45,
      "newPatients": 12,
      "malePatients": 28,
      "femalePatients": 15,
      "otherPatients": 2
    }
  }
}
```

---

## 2. Get patients report

`GET /api/v1/reports/patients`

**Permission required:** `reports:view`

### Example response — 200

```json
{
  "status": "success",
  "message": "Patients report fetched successfully",
  "data": {
    "patients": [
      {
        "_id": "64f1c2b3a1b2c3d4e5f6a7aa",
        "mrNumber": "MR0001",
        "name": "Ali Khan",
        "gender": "male",
        "age": 30,
        "bloodGroup": "O+",
        "mobileNumber": "03001234567",
        "createdAt": "2026-07-16T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalDocuments": 45,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

## 3. Get doctors report

`GET /api/v1/reports/doctors`

**Permission required:** `reports:view`

### Example response — 200

```json
{
  "status": "success",
  "message": "Doctors report fetched successfully",
  "data": {
    "doctors": [
      {
        "_id": "64f1c2b3a1b2c3d4e5f6a7b8",
        "name": "Dr. Sara Ahmed",
        "specialization": "Cardiologist",
        "totalAppointments": 30,
        "totalOpdSlips": 25,
        "totalRevenue": 50000
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalDocuments": 8,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

---

## 4. Get financial report stats

`GET /api/v1/reports/financial/stats`

**Permission required:** `reports:view`

### Example response — 200

```json
{
  "status": "success",
  "message": "Financial report stats fetched successfully",
  "data": {
    "stats": {
      "totalRevenue": 150000,
      "totalRefunds": 5000,
      "netRevenue": 145000,
      "totalTransactions": 75
    }
  }
}
```

---

## 5. Get financial report

`GET /api/v1/reports/financial`

**Permission required:** `reports:view`

### Example response — 200

```json
{
  "status": "success",
  "message": "Financial report fetched successfully",
  "data": {
    "billings": [
      {
        "_id": "66a1f2b3c4d5e6f7a8b9c0d1",
        "transactionId": "TXN00000001",
        "amount": 2000,
        "paymentMethod": "cash",
        "paymentStatus": "paid",
        "patientName": "Ali Khan",
        "doctorName": "Dr. Sara Ahmed",
        "createdAt": "2026-07-16T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalDocuments": 75,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

## 6. Get OPD report stats

`GET /api/v1/reports/opd/stats`

**Permission required:** `reports:view`

### Example response — 200

```json
{
  "status": "success",
  "message": "OPD report stats fetched successfully",
  "data": {
    "stats": {
      "totalOpdSlips": 60,
      "newVisits": 40,
      "followUpVisits": 20
    }
  }
}
```

---

## 7. Get OPD report

`GET /api/v1/reports/opd`

**Permission required:** `reports:view`

### Example response — 200

```json
{
  "status": "success",
  "message": "OPD report fetched successfully",
  "data": {
    "opdSlips": [
      {
        "_id": "66a1f2b3c4d5e6f7a8b9c0d1",
        "opdSlipNumber": "OPD00000001",
        "visitType": "new",
        "paymentMethod": "cash",
        "patientName": "Ali Khan",
        "doctorName": "Dr. Sara Ahmed",
        "createdAt": "2026-07-16T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalDocuments": 60,
      "totalPages": 6,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

## Quick reference table

| Method | Path | Permission | Query |
|---|---|---|---|
| GET | `/patients/stats` | reports:view | from?, to? |
| GET | `/patients` | reports:view | page, limit, from?, to? |
| GET | `/doctors` | reports:view | page, limit, from?, to? |
| GET | `/financial/stats` | reports:view | from?, to? |
| GET | `/financial` | reports:view | page, limit, from?, to? |
| GET | `/opd/stats` | reports:view | from?, to? |
| GET | `/opd` | reports:view | page, limit, from?, to? |
