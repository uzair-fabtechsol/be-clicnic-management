# Dashboard API — Frontend Integration Guide

Base path: `/api/v1/dashboard`

## Auth

All routes require the user to be signed in via **httpOnly cookie** `accessToken`. Send requests with `credentials: "include"` (fetch) / `withCredentials: true` (axios). Requires `dashboard:view` permission.

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
| 401 | Not signed in / expired token |
| 403 | Missing `dashboard:view` permission |

---

## 1. Get dashboard stats

`GET /api/v1/dashboard/stats`

**Permission required:** `dashboard:view`

### Example response — 200

```json
{
  "status": "success",
  "message": "Dashboard stats fetched successfully",
  "data": {
    "stats": {
      "totalPatients": 120,
      "totalDoctors": 8,
      "totalAppointmentsToday": 15,
      "totalRevenueToday": 30000
    }
  }
}
```

---

## 2. Get revenue last 7 days

`GET /api/v1/dashboard/revenue-last-7-days`

**Permission required:** `dashboard:view`

### Example response — 200

```json
{
  "status": "success",
  "message": "Revenue last 7 days fetched successfully",
  "data": {
    "revenue": [
      { "date": "2026-07-10", "amount": 12000 },
      { "date": "2026-07-11", "amount": 8500 },
      { "date": "2026-07-12", "amount": 15000 },
      { "date": "2026-07-13", "amount": 9000 },
      { "date": "2026-07-14", "amount": 11000 },
      { "date": "2026-07-15", "amount": 7500 },
      { "date": "2026-07-16", "amount": 13000 }
    ]
  }
}
```

---

## 3. Get recent patients

`GET /api/v1/dashboard/recent-patients`

**Permission required:** `dashboard:view`

### Example response — 200

```json
{
  "status": "success",
  "message": "Recent patients fetched successfully",
  "data": {
    "patients": [
      {
        "_id": "64f1c2b3a1b2c3d4e5f6a7aa",
        "mrNumber": "MR0001",
        "name": "Ali Khan",
        "gender": "male",
        "age": 30,
        "mobileNumber": "03001234567",
        "createdAt": "2026-07-16T10:00:00.000Z"
      }
    ]
  }
}
```

---

## 4. Get recent OPD slips

`GET /api/v1/dashboard/recent-opd-slips`

**Permission required:** `dashboard:view`

### Example response — 200

```json
{
  "status": "success",
  "message": "Recent OPD slips fetched successfully",
  "data": {
    "opdSlips": [
      {
        "_id": "66a1f2b3c4d5e6f7a8b9c0d1",
        "opdSlipNumber": "OPD00000001",
        "visitType": "new",
        "paymentMethod": "cash",
        "patientDetails": {
          "_id": "64f1c2b3a1b2c3d4e5f6a7aa",
          "mrNumber": "MR0001",
          "name": "Ali Khan"
        },
        "doctorDetails": {
          "_id": "64f1c2b3a1b2c3d4e5f6a7b8",
          "name": "Dr. Sara Ahmed",
          "specialization": "Cardiologist"
        },
        "createdAt": "2026-07-16T10:00:00.000Z"
      }
    ]
  }
}
```

---

## 5. Get doctors availability today

`GET /api/v1/dashboard/doctors-availability-today`

**Permission required:** `dashboard:view`

### Example response — 200

```json
{
  "status": "success",
  "message": "Doctors availability fetched successfully",
  "data": {
    "doctors": [
      {
        "_id": "64f1c2b3a1b2c3d4e5f6a7b8",
        "name": "Dr. Sara Ahmed",
        "specialization": "Cardiologist",
        "consultationFee": 2000,
        "slots": [
          { "day": "Wednesday", "from": "1970-01-01T09:00:00.000Z", "to": "1970-01-01T17:00:00.000Z" }
        ],
        "available": true
      }
    ]
  }
}
```

---

## Quick reference table

| Method | Path | Permission |
|---|---|---|
| GET | `/stats` | dashboard:view |
| GET | `/revenue-last-7-days` | dashboard:view |
| GET | `/recent-patients` | dashboard:view |
| GET | `/recent-opd-slips` | dashboard:view |
| GET | `/doctors-availability-today` | dashboard:view |
