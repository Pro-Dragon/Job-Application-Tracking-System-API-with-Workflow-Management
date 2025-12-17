# ATS Backend – Job Application Tracking System

## 📌 Overview
This project is a backend system for a **Job Application Tracking System (ATS)**.  
It manages job postings, candidate applications, application workflows, and asynchronous email notifications using a background worker.

The system goes beyond basic CRUD by implementing:
- A **state machine** for application stages
- **Role-Based Access Control (RBAC)**
- **Asynchronous processing** using Redis + BullMQ
- **Audit logging** for all application stage changes

This project is designed to resemble real-world backend systems used in hiring platforms.

---

## 🏗️ Architecture Overview

The application follows a **layered architecture**:

```
Routes → Controllers → Services → Database (Prisma)
                     → Message Queue (Redis)
                     → Background Worker (Email)
```

### Components
- **Express API**: Handles HTTP requests and authentication
- **Prisma ORM**: Database access and schema management
- **PostgreSQL**: Primary relational database
- **Redis + BullMQ**: Message queue for background jobs
- **Email Worker**: Separate process that sends emails asynchronously

### Background Worker Flow
1. API triggers an email event (e.g., application submitted)
2. Email job is pushed to Redis queue
3. Worker consumes the job and sends the email
4. API remains responsive (non-blocking)

---

## 🔄 Application Workflow (State Machine)

Valid application stages:

```
APPLIED → SCREENING → INTERVIEW → OFFER → HIRED
```
- An application can move to **REJECTED** from any stage
- Invalid transitions (e.g., APPLIED → OFFER) are blocked

State transition logic is centralized in a dedicated service.

---

## 🔐 Role-Based Access Control (RBAC)

| Endpoint / Action | Candidate | Recruiter | Hiring Manager |
|------------------|-----------|-----------|----------------|
| Register / Login | ✅ | ✅ | ✅ |
| Create Job | ❌ | ✅ | ❌ |
| Update / Close Job | ❌ | ✅ | ❌ |
| Apply to Job | ✅ | ❌ | ❌ |
| View Own Applications | ✅ | ❌ | ❌ |
| View Job Applications | ❌ | ✅ | 🟡 |
| Change Application Stage | ❌ | ✅ | ❌ |

🟡 Hiring Manager access is simplified as per task allowance.

---

## 🗄️ Database Schema (ERD)

Main tables:
- **User** (roles: CANDIDATE, RECRUITER, HIRING_MANAGER)
- **Company**
- **Job**
- **Application**
- **ApplicationHistory**

Relationships:
- Company → Jobs (1:N)
- Job → Applications (1:N)
- Application → ApplicationHistory (1:N)
- User → Applications (Candidate)
- User → ApplicationHistory (changedBy)

All relations use foreign key constraints to ensure data integrity.

---

## 🌐 API Features

### Authentication
- Register
- Login (JWT-based authentication)

### Jobs (Recruiter only)
- Create job
- Update job
- Close job (soft delete)
- List jobs

### Applications
- Candidate applies to job
- Recruiter updates application stage
- Candidate views own applications
- Recruiter views applications by job

---

## 📬 Asynchronous Email Notifications

Emails are sent asynchronously for:
- Candidate: application submission & stage changes
- Recruiter: new application received

This is implemented using:
- **BullMQ**
- **Redis**
- **Dedicated email worker**

---

## ⚙️ Environment Setup

### Prerequisites
- Node.js ≥ 18
- PostgreSQL
- Docker (for Redis)

### Environment Variables (`.env`)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ats_db
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### Installation
```bash
npm install
```

### Database Setup
```bash
npx prisma migrate dev
npx prisma generate
```

### Start Redis
```bash
docker run -d -p 6379:6379 redis:7
```

### Start API Server
```bash
npm run dev
```

### Start Email Worker
```bash
node src/workers/email.worker.js
```

---

## 🧪 Testing Strategy

Due to time constraints, automated tests were not implemented.

### Planned Tests
- **Unit Tests**
  - Application stage transition validation
  - Role-based authorization logic
- **Integration Tests**
  - Candidate application flow
  - Recruiter stage update flow
  - Authorization enforcement

The architecture supports easy addition of tests in the future.

---

## 📮 Postman Collection
A Postman collection is provided to test all API endpoints, including:
- Authentication
- Jobs
- Applications
- Protected routes

---

## 🎥 Video Demonstration
A short video (3–5 minutes) demonstrates:
1. Candidate applying to a job
2. Recruiter reviewing the application
3. Application stage update
4. Email notifications being triggered

---

## ✅ Conclusion
This project demonstrates:
- Complex workflow management
- Asynchronous backend processing
- Secure RBAC implementation
- Clean and maintainable backend architecture

It reflects real-world backend engineering practices used in modern hiring platforms.
