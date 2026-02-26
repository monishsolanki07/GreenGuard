# 🌿 GreenGuard

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-4.x-092E20?style=flat&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)


### Risk-Aware Environmental Compliance Intelligence Platform

GreenGuard is a full-stack regulatory technology (RegTech) system designed to monitor industrial emissions, enforce environmental policies, and generate deterministic risk assessments with actionable analytics. It provides a dual-role architecture where regulators (Admins) supervise compliance, and Companies track their emission submissions with detailed compliance reporting.

---

## 📑 Table of Contents

- [Core Capabilities](#-core-capabilities)
- [Compliance Engine](#-compliance-engine)
- [System Architecture](#-system-architecture)
- [Technical Stack](#-technical-stack)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [PDF Reporting](#-pdf-reporting)
- [Analytics Layer](#-analytics-layer)
- [Security Features](#-security-features)
- [Installation & Setup](#-installation--setup)
- [Future Enhancements](#-future-enhancements)
- [Author](#-author)
- [License](#-license)

---

## 🚀 Core Capabilities

### 👨‍💼 Administrator

| Feature | Description |
|---|---|
| Policy Management | Create, update, activate, and deactivate pollutant policies |
| Company Control | Activate or suspend company accounts |
| Submission Oversight | View all emission submissions across the platform |
| High-Risk Detection | Identify companies with repeated HIGH threat classifications |
| Audit Logs | Track all platform activity via audit trail |
| Dashboard Analytics | Access aggregated platform-wide compliance analytics |
| Compliance Distribution | Monitor LOW / MEDIUM / HIGH breakdown with charts |

### 🏭 Company

| Feature | Description |
|---|---|
| CSV Upload | Upload structured emission data via CSV |
| Submission History | View all past emission submissions |
| Compliance Tracking | Monitor per-submission compliance status |
| Risk Scoring | Access risk scores and severity classification |
| PDF Reports | Download detailed compliance reports |
| Performance Trends | Monitor longitudinal compliance performance |

---

## 🧠 Compliance Engine

GreenGuard implements a deterministic compliance evaluation engine located at `submissions/services/compliance_engine.py`.

### Validation Pipeline

```
CSV Upload → Schema Validation → Duplicate Check → Negative Value Guard → Policy Comparison → Risk Scoring
```

### Severity Classification

| Level | Description |
|---|---|
| `MINOR` | Slight threshold breach — low environmental impact |
| `MODERATE` | Notable exceedance — requires attention |
| `CRITICAL` | Severe violation — immediate action required |

### Threat Classification

| Level | Description |
|---|---|
| `LOW` | All emissions within acceptable policy bounds |
| `MEDIUM` | Moderate exceedance detected across pollutants |
| `HIGH` | Critical policy breaches — regulatory action warranted |

---

## 📊 System Architecture

### High-Level Flow

```
┌──────────────┐     ┌──────────────────┐     ┌────────────────────────┐
│   Company    │────▶│  CSV Upload API   │────▶│   Validation Layer     │
│  (Frontend)  │     │  (submissions/)   │     │   Schema / Duplicates  │
└──────────────┘     └──────────────────┘     └───────────┬────────────┘
                                                           │
                                              ┌────────────▼────────────┐
                                              │    Compliance Engine     │
                                              │  compliance_engine.py    │
                                              │  Policy Comparison       │
                                              │  Severity + Risk Score   │
                                              └────────────┬────────────┘
                                                           │
                       ┌──────────────┬───────────────────┼─────────────────┐
                       ▼              ▼                    ▼                 ▼
               ┌──────────────┐ ┌──────────┐ ┌─────────────────┐ ┌───────────────┐
               │   Database   │ │  Admin   │ │  PDF Report     │ │   ML Engine   │
               │  (SQLite)    │ │  Panel   │ │  (reports/)     │ │  (ml_engine/) │
               └──────────────┘ └──────────┘ └─────────────────┘ └───────────────┘
```

### Request Lifecycle

```
Step 1  →  Company registers via /api/users/
Step 2  →  Admin activates the company account via adminpanel/
Step 3  →  Company uploads emission CSV via /api/submissions/
Step 4  →  Validation layer enforces schema integrity
Step 5  →  compliance_engine.py compares data against active policies
Step 6  →  Risk score and threat level are calculated and persisted
Step 7  →  report_generator.py builds a structured PDF compliance report
Step 8  →  Admin dashboard analytics update (adminpanel/views/dashboard.py)
Step 9  →  Company downloads PDF report from their dashboard
```

---

## 🏗️ Technical Stack

### Backend

| Technology | Purpose |
|---|---|
| Django 4.x | Core web framework |
| Django REST Framework | RESTful API layer |
| SimpleJWT | JWT-based authentication |
| ReportLab | PDF generation (`reports/services/report_generator.py`) |
| SQLite | Development database (`backend/db.sqlite3`) |

### Frontend

| Technology | Purpose |
|---|---|
| React 18 (Vite) | SPA framework |
| Tailwind CSS | Utility-first styling |
| Axios | HTTP client (`src/api/axios.jsx`) |
| React Router | Client-side routing |
| ESLint | Code quality enforcement |

---

## 📁 Project Structure

```
GreenGuard/
│
├── backend/
│   │
│   ├── greenguard/                        # Django project configuration
│   │   ├── settings.py                    # App settings, JWT config, CORS, media paths
│   │   ├── urls.py                        # Root URL dispatcher
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── users/                             # Custom user model & authentication
│   │   ├── models.py                      # CustomUser with ADMIN / COMPANY roles
│   │   ├── serializers.py                 # Registration & login serializers
│   │   ├── permissions.py                 # Role-based permission classes
│   │   ├── views.py                       # Register, login, profile endpoints
│   │   └── urls.py
│   │
│   ├── policies/                          # Admin-controlled pollutant policies
│   │   ├── models.py                      # PollutantPolicy model with thresholds
│   │   ├── serializers.py
│   │   ├── views.py                       # CRUD + activate/deactivate
│   │   └── urls.py
│   │
│   ├── submissions/                       # CSV ingestion, validation & compliance
│   │   ├── models.py                      # Submission & ComplianceResult models
│   │   ├── serializers.py
│   │   ├── views.py                       # Upload & history endpoints
│   │   ├── urls.py
│   │   └── services/
│   │       └── compliance_engine.py       # Core risk evaluation logic
│   │
│   ├── reports/                           # PDF report generation
│   │   ├── models.py
│   │   ├── views.py                       # Report download endpoint
│   │   ├── urls.py
│   │   └── services/
│   │       └── report_generator.py        # ReportLab PDF builder
│   │
│   ├── adminpanel/                        # Admin oversight & analytics
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views/
│   │       ├── __init__.py
│   │       ├── dashboard.py               # Aggregated platform analytics
│   │       ├── companies.py               # Company activate/suspend
│   │       ├── submissions.py             # All submissions view
│   │       ├── high_risk.py               # High-risk company detection
│   │       └── audit.py                   # Audit trail endpoints
│   │
│   ├── ml_engine/                         # ML-based analysis module
│   │   ├── models.py
│   │   └── views.py
│   │
│   ├── uploads/
│   │   ├── submissions/                   # UUID-named uploaded CSV files
│   │   └── reports/                       # Generated PDF compliance reports
│   │
│   ├── db.sqlite3
│   ├── manage.py
│   └── requirements.txt
│
├── greenguard-frontend/
│   │
│   ├── public/
│   │   └── vite.svg
│   │
│   ├── src/
│   │   │
│   │   ├── api/
│   │   │   └── axios.jsx                  # Axios instance with JWT interceptors
│   │   │
│   │   ├── components/
│   │   │   ├── AdminSidebar.jsx           # Admin navigation sidebar
│   │   │   └── Navbar.jsx                 # Top navigation bar
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx     # Platform analytics & charts
│   │   │   │   ├── AdminCompanies.jsx     # Company management
│   │   │   │   ├── AdminPolicies.jsx      # Pollutant policy CRUD
│   │   │   │   ├── AdminSubmissions.jsx   # All submissions view
│   │   │   │   ├── AdminHighRisk.jsx      # High-risk company list
│   │   │   │   └── AdminAudit.jsx         # Audit trail viewer
│   │   │   │
│   │   │   ├── company/
│   │   │   │   ├── Dashboard.jsx          # Company compliance overview
│   │   │   │   ├── Upload.jsx             # CSV emission upload
│   │   │   │   └── History.jsx            # Submission history & PDF download
│   │   │   │
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   │
│   │   ├── App.jsx                        # Root component with routing
│   │   ├── App.css
│   │   ├── main.jsx                       # Vite entry point
│   │   └── index.css
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   └── package.json
│
├── green/                                 # Python virtual environment (not committed)
└── README.md
```

---

## 📡 API Endpoints

### Authentication — `users/`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/users/register/` | Public | Register a new company account |
| `POST` | `/api/users/login/` | Public | Obtain JWT access & refresh tokens |
| `POST` | `/api/users/token/refresh/` | Public | Refresh access token |
| `GET` | `/api/users/me/` | Authenticated | Retrieve current user profile |

### Policies — `policies/`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/policies/` | Admin | List all pollutant policies |
| `POST` | `/api/policies/` | Admin | Create a new policy |
| `PUT` | `/api/policies/{id}/` | Admin | Update a policy |
| `PATCH` | `/api/policies/{id}/activate/` | Admin | Activate a policy |
| `PATCH` | `/api/policies/{id}/deactivate/` | Admin | Deactivate a policy |
| `DELETE` | `/api/policies/{id}/` | Admin | Delete a policy |

### Submissions — `submissions/`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/submissions/upload/` | Company | Upload emission CSV |
| `GET` | `/api/submissions/` | Company | List own submission history |
| `GET` | `/api/submissions/{id}/` | Company | Retrieve single submission & compliance result |

### Reports — `reports/`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/reports/{id}/` | Company | Download PDF compliance report |

### Admin Panel — `adminpanel/`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/adminpanel/dashboard/` | Admin | Platform-wide analytics |
| `GET` | `/api/adminpanel/companies/` | Admin | List all companies |
| `PATCH` | `/api/adminpanel/companies/{id}/activate/` | Admin | Activate a company |
| `PATCH` | `/api/adminpanel/companies/{id}/suspend/` | Admin | Suspend a company |
| `GET` | `/api/adminpanel/submissions/` | Admin | View all platform submissions |
| `GET` | `/api/adminpanel/high-risk/` | Admin | High-risk company list |
| `GET` | `/api/adminpanel/audit/` | Admin | Audit trail |

---

## 📄 PDF Reporting

Each submission triggers `reports/services/report_generator.py`, which builds a structured PDF containing:

- Company name and registration details
- Submission date and reference ID
- Pollutant-by-pollutant emission breakdown
- Active policy threshold comparison table
- Per-pollutant severity grading (MINOR / MODERATE / CRITICAL)
- Overall risk score
- Threat classification (LOW / MEDIUM / HIGH)
- Final compliance verdict

Generated reports are stored at `uploads/reports/compliance_report_{id}.pdf` and are downloadable from the company dashboard.

---

## 📊 Analytics Layer

The `adminpanel/views/` module powers all admin-side analytics:

- **High-risk company detection** — `high_risk.py` surfaces companies with repeated HIGH classifications
- **Compliance distribution** — platform-wide LOW / MEDIUM / HIGH breakdown via `dashboard.py`
- **Audit trail** — full activity logging accessible through `audit.py`
- **Submission oversight** — admin-level view of all company submissions via `submissions.py`
- **Company lifecycle management** — activate/suspend control via `companies.py`

---

## 🛡️ Security Features

- **JWT Authentication** — stateless token-based auth with access/refresh token rotation via SimpleJWT
- **Role-Based Permissions** — enforced via `users/permissions.py` across all endpoints
- **Admin-Only Policy Management** — pollutant policies inaccessible to company role accounts
- **Controlled Company Lifecycle** — companies cannot operate until explicitly activated by Admin
- **Strict Input Validation** — CSV schema enforcement, duplicate rejection, and negative value blocking inside `compliance_engine.py`
- **UUID File Storage** — uploaded CSVs stored with UUIDs (`uploads/submissions/`) to prevent name collisions and path traversal
- **CORS Configuration** — controlled cross-origin access configured in `greenguard/settings.py`

---

## ⚙️ Installation & Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/monishsolanki07/GreenGuard.git
cd GreenGuard

# 2. Create and activate the virtual environment
python -m venv green
source green/bin/activate        # On Windows: green\Scripts\activate

# 3. Install Python dependencies
cd backend
pip install -r requirements.txt

# 4. Apply database migrations
python manage.py migrate

# 5. Create an admin superuser
python manage.py createsuperuser

# 6. Start the development server
python manage.py runserver
```

Backend API available at `http://127.0.0.1:8000/`

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd greenguard-frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Frontend available at `http://localhost:5173/`


## 👨‍💻 Author

**Monish Solanki**

GitHub: [https://github.com/monishsolanki07](https://github.com/monishsolanki07)

---

