# JobMatcher AI — AI-Powered Career Assistant

> **Live Demo:** [https://jobmatcherai.app](https://jobmatcherai.app)

JobMatcher AI is a full-stack SaaS application that analyzes resumes using Google Gemini AI and provides a comprehensive career development report — including ATS scoring, job matching, skill gap analysis, a personalized learning roadmap, interview coaching, and resume rewrite suggestions.

---

## Features

| Feature | Description |
|---|---|
| **ATS Score Audit** | Evaluates resume structure, keyword density, formatting, sections, and style with a detailed category breakdown |
| **Job Description Matching** | Compares your resume against a target JD and returns a compatibility score with missing/matching skills |
| **Skill Gap Analysis** | Identifies missing technical and soft skills with priority ratings (High/Medium/Low) |
| **Learning Roadmap** | Generates a step-by-step learning path with topic, level, estimated time, and resources |
| **Interview Coach** | Provides 5 personalized interview Q&A pairs based on your resume and target role |
| **Resume Improver** | Side-by-side before/after rewrites of your weakest resume bullets |
| **Smart Suggestions** | General career tips and skills-to-improve recommendations |
| **Job Recommendations** | 5 realistic job titles matched to your profile with skill breakdown scores |
| **Analysis History** | View, revisit, and delete all your past AI career reports |
| **PDF Report Download** | Export your full analysis as a formatted PDF |
| **Secure Auth** | JWT-based authentication with password hashing and forgot/reset password via email |

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP client with JWT interceptors |
| Lucide React | Icon library |
| Vercel Analytics and Speed Insights | Performance and user analytics |
| Vanilla CSS | Custom design system (white/light theme) |
| Google Fonts (Outfit + Plus Jakarta Sans) | Typography |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and ODM |
| Google Gemini AI (`@google/generative-ai`) | AI analysis engine |
| JWT (`jsonwebtoken`) | Authentication tokens |
| bcryptjs | Password hashing |
| Multer | Resume file upload (PDF/TXT) |
| pdf-parse | PDF text extraction |
| PDFKit | PDF report generation |
| Resend | Transactional email (password reset) |
| Helmet | HTTP security headers |
| Express Rate Limit | API abuse protection |
| Compression | Gzip response compression |
| Morgan | HTTP request logging |
| nodemon | Auto-restart in development |

### Infrastructure

| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |
| Google AI Studio | Gemini API key management |

---

## Project Structure

```
job matcher/
├── backend/
│   ├── controllers/
│   │   ├── analyzeController.js   # Resume analysis, history CRUD
│   │   ├── authController.js      # Register, login, logout, forgot/reset password
│   │   └── reportController.js    # PDF report generation and download
│   ├── middleware/
│   │   ├── auth.js                # JWT protect middleware
│   │   ├── errorHandler.js        # Global error handler
│   │   └── upload.js              # Multer file upload config
│   ├── models/
│   │   ├── Analysis.js            # Analysis schema (ATS, JD match, skills, etc.)
│   │   └── User.js                # User schema (name, email, hashed password)
│   ├── routes/
│   │   ├── analyzeRoutes.js       # /api/analyze, /api/history, /api/upload-resume
│   │   ├── authRoutes.js          # /api/auth/register, /login, /logout, /me
│   │   └── reportRoutes.js        # /api/report/:id
│   ├── services/
│   │   ├── geminiService.js       # Dynamic Gemini model discovery + AI analysis
│   │   └── emailService.js        # Password reset email via Resend
│   ├── server.js                  # Express app entry point
│   ├── package.json
│   └── .env                       # Not committed — see Environment Variables
│
└── frontend/
    ├── public/
    │   └── logo.png
    ├── src/
    │   ├── components/
    │   │   ├── ATSScore.jsx        # ATS score accordion with category breakdown
    │   │   ├── CandidateProfile.jsx# Extracted profile info display
    │   │   ├── DownloadReportBtn.jsx# PDF download trigger
    │   │   ├── InterviewPrep.jsx   # Q&A accordion
    │   │   ├── JDInput.jsx         # Job description textarea
    │   │   ├── JDMatchResult.jsx   # JD compatibility score card
    │   │   ├── JobRecommendations.jsx # 5 job title cards with match score
    │   │   ├── LearningPath.jsx    # Step-by-step learning path
    │   │   ├── LoadingSpinner.jsx  # Animated loading overlay
    │   │   ├── Navbar.jsx          # Sticky top navbar
    │   │   ├── ResumeImprover.jsx  # Before/after bullet rewrites
    │   │   ├── ResumeUploader.jsx  # Drag and drop PDF upload
    │   │   ├── SkillGap.jsx        # Missing skills with priority badges
    │   │   └── Suggestions.jsx     # Career tips list
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global auth state (login, register, logout)
    │   ├── pages/
    │   │   ├── Home.jsx            # Main page: upload + dashboard
    │   │   ├── History.jsx         # Past analyses list
    │   │   ├── Login.jsx           # Login form
    │   │   ├── SignUp.jsx          # Registration form with password strength
    │   │   ├── ForgotPassword.jsx  # Request password reset
    │   │   ├── ResetPassword.jsx   # Set new password via email token
    │   │   ├── Privacy.jsx         # Privacy policy
    │   │   ├── Terms.jsx           # Terms of service
    │   │   └── NotFound.jsx        # 404 page
    │   ├── App.jsx                 # Route declarations
    │   ├── main.jsx                # Axios config, interceptors, app bootstrap
    │   └── index.css               # Full design system
    ├── index.html                  # SEO meta, OG tags, Google Analytics
    ├── vite.config.js
    ├── .env                        # Not committed
    └── .env.production             # Not committed
```

---

## API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create new account |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |
| `GET` | `/api/auth/logout` | Public | Clear session |
| `GET` | `/api/auth/me` | Protected | Get current user |
| `POST` | `/api/auth/forgot-password` | Public | Send reset email |
| `POST` | `/api/auth/reset-password/:token` | Public | Set new password |

### Analysis Routes — `/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/upload-resume` | Protected | Upload PDF/TXT resume and extract text |
| `POST` | `/api/analyze` | Protected | Run full AI analysis |
| `POST` | `/api/match-jd` | Protected | Match resume against a JD |
| `GET` | `/api/history` | Protected | Get all past analyses |
| `GET` | `/api/analysis/:id` | Protected | Load a specific analysis |
| `DELETE` | `/api/history/:id` | Protected | Delete an analysis |

### Report Routes — `/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/report/:id` | Protected | Download PDF report |

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server status, DB state, memory, uptime |

---

## Rate Limiting

| Scope | Limit |
|---|---|
| All `/api/*` routes | 100 requests / 15 minutes per IP |
| `/api/analyze` | 10 requests / hour per IP |
| `/api/match-jd` | 10 requests / hour per IP |

---

## Environment Variables

**Never commit `.env` files. All secrets must be set only in your local environment or your hosting provider's dashboard.**

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_ai_studio_key
JWT_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
RESEND_API_KEY=your_resend_api_key
```

### Frontend (`frontend/.env`)

```env
# Leave empty in local dev — Vite proxy handles /api requests to localhost:5000
VITE_API_BASE_URL=
```

### Frontend Production (`frontend/.env.production`)

```env
# Set this in your Vercel dashboard, not in the file itself
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

---

## Getting Started — Local Development

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Google AI Studio API key
- Resend account for transactional email

### 1. Clone the repository

```bash
git clone https://github.com/Pravu772/jobmatcher.git
cd jobmatcher
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `backend/.env` with your own values (see Environment Variables above).

```bash
npm run dev     # auto-restart on file changes via nodemon
# or
npm start       # standard node start
```

Backend runs at `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

The Vite dev server proxies all `/api/*` requests to `http://localhost:5000` automatically — no manual configuration needed.

---

## Deployment

### Frontend — Vercel

1. Import the `frontend/` directory into Vercel
2. Add `VITE_API_BASE_URL` pointing to your Render backend URL in Vercel's environment settings
3. Deploy

### Backend — Render

1. Create a new Web Service on Render pointing to the `backend/` directory
2. Add all required environment variables in the Render dashboard
3. Set the start command to `npm start`

---

## AI Engine — Gemini Dynamic Model Discovery

The Gemini service queries the Google AI API at runtime to fetch all models available for your API key, filters for those that support `generateContent`, and selects the best available one automatically (preferring `gemini-2.0-flash` for speed and cost).

This prevents the app from breaking when Google deprecates or removes model names — it always uses what your key actually supports.

---

## Security

- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens sent as Authorization Bearer headers
- HTTP security headers enforced via Helmet
- CORS restricted to known frontend origins only
- Rate limiting applied to all API and analysis routes
- All `.env` files excluded from version control via `.gitignore`

---

## Analytics and Monitoring

- Google Analytics 4 — page views and user behaviour
- Vercel Analytics — real-user performance metrics
- Vercel Speed Insights — Core Web Vitals tracking
- `/health` endpoint — used for uptime monitoring to prevent cold starts on Render

---

## Pages and Routes

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home — upload resume and view dashboard | Yes |
| `/login` | Login form | No |
| `/signup` | Registration form | No |
| `/forgot-password` | Request password reset email | No |
| `/reset-password/:token` | Set new password via email link | No |
| `/history` | Past analyses | Yes |
| `/privacy` | Privacy Policy | No |
| `/terms` | Terms of Service | No |
| `*` | 404 Not Found | No |

---

## Developer

Built by Pravin M

- Portfolio: [pravindev.tech](https://pravindev.tech)

---

## License

This project is for personal and portfolio use. All rights reserved.
