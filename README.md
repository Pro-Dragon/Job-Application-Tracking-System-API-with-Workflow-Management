
# 🧑‍💼 Job Application Tracking System (ATS) – Backend

A production-style backend system for managing job applications with **role-based access control**, **state-machine-driven workflows**, and **asynchronous email notifications**.

This project demonstrates real-world backend engineering concepts beyond basic CRUD.

---

## 🚀 Features Overview

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Supported roles:
  - `CANDIDATE`
  - `RECRUITER`
  - `HIRING_MANAGER` (view-only, optional)

### 💼 Job Management
- Recruiters can:
  - Create jobs
  - Update jobs
  - Close jobs
  - List jobs
- Jobs are scoped to a company

### 📄 Application Workflow (State Machine)
Applications follow a strict workflow:

```
APPLIED → SCREENING → INTERVIEW → OFFER → HIRED
              ↘
             REJECTED
```

- Invalid transitions are blocked
- Rejection is allowed from any stage
- All transitions are audited

### 🕒 Application History (Audit Log)
- Every stage change is recorded
- Tracks:
  - From stage
  - To stage
  - Changed by
  - Timestamp

### 📬 Asynchronous Email Notifications
- Redis + BullMQ used for background jobs
- Emails sent without blocking API responses
- Notifications:
  - Candidate → application submitted & stage changes
  - Recruiter → new application received

---

## 🏗️ Architecture

### Layered Architecture
```
Routes → Controllers → Services → Prisma (DB)
                          ↓
                     Message Queue
                          ↓
                    Background Worker
```

- **Controllers**: Handle HTTP request/response
- **Services**: Business logic & workflows
- **Prisma**: Database access & transactions
- **Worker**: Handles emails asynchronously

---

## 🗃️ Database Design (ERD)

Entities:
- User
- Company
- Job
- Application
- ApplicationHistory

Key relationships:
- Company → Jobs (1:N)
- Job → Applications (1:N)
- User → Applications (Candidate)
- Application → ApplicationHistory (1:N)

> ERD diagram included separately (draw.io / Prisma Studio)

---

## 🔑 Role-Based Access Control (RBAC)

| Endpoint | Candidate | Recruiter | Hiring Manager |
|--------|-----------|-----------|----------------|
| Apply to Job | ✅ | ❌ | ❌ |
| View Own Applications | ✅ | ❌ | ❌ |
| Create Job | ❌ | ✅ | ❌ |
| Manage Applications | ❌ | ✅ | 👁️ |
| Change Application Stage | ❌ | ✅ | ❌ |

---

## 📡 API Endpoints (Summary)

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Jobs (Recruiter)
- `POST /jobs`
- `GET /jobs`
- `PATCH /jobs/:id`
- `PATCH /jobs/:id/close`

### Applications
- `POST /applications` (Candidate)
- `GET /applications/my` (Candidate)
- `GET /applications/job/:jobId` (Recruiter)
- `PATCH /applications/:id/stage` (Recruiter)

All protected routes require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🧪 Testing

### Manual Testing
- Postman collection included:
  - `ATS-Backend.postman_collection.json`

> If Postman UI fails to import directly, use **Raw JSON import** or test using the documented endpoints above.

### Automated Tests
- Unit & integration tests are conceptually designed
- Due to time constraints, tests are described but not implemented

---

## ⚙️ Environment Setup

### Requirements
- Node.js ≥ 18
- PostgreSQL
- Redis (v5+ recommended)
- Docker (optional)

### Environment Variables (`.env`)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ats_db
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

---

## ▶️ Running the Project

```bash
npm install
npx prisma migrate dev
npm run dev
```

### Start Email Worker
```bash
node src/workers/email.worker.js
```

---

## 🎥 Demo Video
A short 3–5 minute demo video walks through:
1. Candidate registration & application
2. Recruiter reviewing and changing application stage
3. Email notifications being triggered

---

## 📌 Notes
- Sensitive data is stored securely via environment variables
- Prisma transactions ensure data consistency
- Application logic mirrors real ATS systems

---

## ✅ Project Status

✔ Functional REST API  
✔ State machine enforced  
✔ Async background processing  
✔ RBAC implemented  
✔ Audit trail maintained  
✔ Production-style architecture  

---

## 👨‍💻 Author

Dhanush Nagisetti  
Backend Developer | B.Tech AIML

---
