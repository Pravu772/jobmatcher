# 🚀 JobMatcher

JobMatcher AI is a full-stack, AI-powered career assistant designed to help professionals optimize their resumes, pass Applicant Tracking Systems (ATS), and prepare for interviews. By leveraging the power of Google's Gemini AI, the platform provides deep, actionable insights into a candidate's career profile.

## ✨ Key Features

- **Secure Authentication**: Full user registration and login system secured with JWT and bcrypt.
- **Resume Parsing**: Seamlessly upload PDF resumes and extract text instantly using `pdf-parse`.
- **AI-Powered ATS Simulation**: Get a detailed breakdown of how an ATS algorithm views your resume, complete with a score out of 100.
- **Skill Gap Analysis**: Paste a Job Description to instantly identify matching skills and critical missing skills.
- **Smart Job Recommendations**: Receive personalized role suggestions based on your extracted experience and skills.
- **Custom Learning Paths**: Generate step-by-step roadmaps to acquire missing skills.
- **Interview Preparation**: AI-generated interview questions and model answers tailored specifically to the user's profile and target job.
- **Resume Improver**: Automatically rewrites weak resume bullet points into high-impact, professional statements.
- **Downloadable Reports**: Generate a professional, multi-page PDF report of your analysis with a single click using `pdfkit`.

---

## 🛠️ Technology Stack

### Frontend (Client-Side)
The frontend is built for speed, responsiveness, and a premium user experience.
- **Framework**: [React.js](https://reactjs.org/) (v18)
- **Build Tool**: [Vite](https://vitejs.dev/) for lightning-fast HMR and optimized builds.
- **Routing**: `react-router-dom` for seamless Single Page Application (SPA) navigation.
- **HTTP Client**: `axios` for communicating with the backend API.
- **Icons**: `lucide-react` for clean, professional vector SVG icons.
- **Styling**: Vanilla CSS with comprehensive CSS variables, flexbox/grid layouts, and responsive media queries.

### Backend (Server-Side)
A robust, secure, and highly scalable Node.js server.
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with `mongoose` for object data modeling.
- **AI Integration**: `@google/generative-ai` to interface with the Gemini 1.5 Pro/Flash models for advanced text analysis.
- **Authentication**: `jsonwebtoken` (JWT) for stateless sessions and `bcryptjs` for password hashing.
- **File Handling**: `multer` for handling multipart/form-data and `pdf-parse` for extracting raw text from uploaded resumes.
- **PDF Generation**: `pdfkit` to dynamically generate downloadable reports on the server.

---

## 📂 Project Structure

```text
job-matcher/
├── backend/
│   ├── controllers/      # Route handlers (auth, analyze, report generation)
│   ├── middleware/       # JWT auth guards, Multer upload configs
│   ├── models/           # Mongoose schemas (User, Analysis)
│   ├── routes/           # Express API endpoints
│   ├── services/         # External integrations (Gemini AI service)
│   ├── package.json      # Backend dependencies
│   └── server.js         # Express entry point & MongoDB connection
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI components (ATSScore, ResumeUploader, etc.)
    │   ├── context/      # React Context (AuthContext for global user state)
    │   ├── pages/        # Main route views (Home, Login, SignUp)
    │   ├── App.jsx       # Root React component & Router wrapper
    │   └── index.css     # Global stylesheets and responsive utilities
    ├── package.json      # Frontend dependencies
    └── vite.config.js    # Vite bundler configuration
```

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally on your machine.

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- A MongoDB instance (Local or MongoDB Atlas)
- A Google Gemini API Key (Get one from Google AI Studio)

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```
Install dependencies:
```bash
npm install
```
Create a `.env` file in the `backend` directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
```
Start the development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Start the Vite development server:
```bash
npm run dev
```

### 4. Access the App
Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📝 Usage Workflow
1. **Sign Up / Log In**: Create an account to securely save your analysis history.
2. **Upload Resume**: Drag and drop your PDF resume into the upload zone.
3. **Paste Job Description**: (Optional) Paste the JD you are targeting for custom skill gap analysis.
4. **Analyze**: Click "Analyze & Match" to trigger the Gemini AI engine.
5. **Review Insights**: Navigate through your ATS Score, Learning Paths, and AI Resume Improvements.
6. **Export**: Click the "Download PDF Report" button to save your personalized career dossier locally.

---
*Developed as a modern, AI-first solution for job seekers aiming to beat the ATS and land their dream roles.*
