# Billing API — Frontend Integration Guide

Base path: `/api/v1/billing`

## Auth

All routes require the user to be signed in via **httpOnly cookie** `accessToken`. Send requests with `credentials: "include"` (fetch) / `withCredentials: true` (axios).

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
| 404 | Billing record not found |

---

## 1. Get all billings

`GET /api/v1/billing`

**Permission required:** `billing:view`

### Query params (all optional)

| Param | Type | Default | Notes |
|---|---|---|---|
| `page` | number (int, min 1) | `1` | |
| `limit` | number (int, min 1, max 100) | `10` | |
| `paymentStatus` | `"paid" \| "refund"` | — | |
| `paymentMethod` | `"cash" \| "card" \| "bankTransfer"` | — | |
| `search` | string | — | search by patient name / transaction id |

### Example request

```
GET /api/v1/billing?page=1&limit=10&paymentStatus=paid&paymentMethod=cash
```

### Example response — 200

```json
{
  "status": "success",
  "message": "Billings fetched successfully",
  "data": {
    "billings": [
      {
        "_id": "66a1f2b3c4d5e6f7a8b9c0d1",
        "transactionId": "TXN00000001",
        "billingType": "Consultation",
        "amount": 2000,
        "paymentMethod": "cash",
        "paymentStatus": "paid",
        "refundMethod": null,
        "refundReason": null,
        "opdSlip": "66a1f2b3c4d5e6f7a8b9c0d2",
        "patientDetails": {
          "_id": "64f1c2b3a1b2c3d4e5f6a7aa",
          "mrNumber": "MR0001",
          "name": "Ali Khan"
        },
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

## 2. Get billing stats

`GET /api/v1/billing/stats`

**Permission required:** `billing:view`

No query params.

### Example response — 200

```json
{
  "status": "success",
  "message": "Billing stats fetched successfully",
  "data": {
    "stats": {
      "totalRevenue": 50000,
      "totalRefunds": 2000,
      "totalBillings": 30,
      "totalRefundBillings": 2
    }
  }
}
```

---

## 3. Get single billing

`GET /api/v1/billing/:id`

**Permission required:** `billing:view`

### Path params

| Param | Type | Notes |
|---|---|---|
| `id` | string (ObjectId) | `400` if malformed |

### Example response — 200

```json
{
  "status": "success",
  "message": "Billing fetched successfully",
  "data": {
    "billing": {
      "_id": "66a1f2b3c4d5e6f7a8b9c0d1",
      "transactionId": "TXN00000001",
      "billingType": "Consultation",
      "amount": 2000,
      "paymentMethod": "cash",
      "paymentStatus": "paid",
      "refundMethod": null,
      "refundReason": null,
      "opdSlip": "66a1f2b3c4d5e6f7a8b9c0d2",
      "patientDetails": {
        "_id": "64f1c2b3a1b2c3d4e5f6a7aa",
        "mrNumber": "MR0001",
        "name": "Ali Khan"
      },
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T10:00:00.000Z"
    }
  }
}
```

### 404

```json
{ "status": "fail", "message": "Billing not found", "data": null }
```

---

## 4. Refund billing

`PATCH /api/v1/billing/:id/refund`

**Permission required:** `billing:edit`

### Path params

| Param | Type | Notes |
|---|---|---|
| `id` | string (ObjectId) | |

### Body

| Field | Type | Required | Notes |
|---|---|---|---|
| `refundMethod` | `"cash" \| "card" \| "bankTransfer"` | yes | |
| `refundReason` | string | yes | trimmed, min 1 char |

### Example request body

```json
{
  "refundMethod": "cash",
  "refundReason": "Patient requested refund due to cancellation"
}
```

### Business rules

- Cannot refund a billing that is already refunded → `400 Billing is already refunded`

### Example response — 200

```json
{
  "status": "success",
  "message": "Billing refunded successfully",
  "data": {
    "billing": {
      "_id": "66a1f2b3c4d5e6f7a8b9c0d1",
      "transactionId": "TXN00000001",
      "billingType": "Consultation",
      "amount": 2000,
      "paymentMethod": "cash",
      "paymentStatus": "refund",
      "refundMethod": "cash",
      "refundReason": "Patient requested refund due to cancellation",
      "opdSlip": "66a1f2b3c4d5e6f7a8b9c0d2",
      "createdAt": "2026-07-16T10:00:00.000Z",
      "updatedAt": "2026-07-16T11:00:00.000Z"
    }
  }
}
```

---

## Quick reference table

| Method | Path | Permission | Body | Query | Params |
|---|---|---|---|---|---|
| GET | `/` | billing:view | — | page, limit, paymentStatus, paymentMethod, search | — |
| GET | `/stats` | billing:view | — | — | — |
| GET | `/:id` | billing:view | — | — | id |
| PATCH | `/:id/refund` | billing:edit | refundMethod, refundReason | — | id |
