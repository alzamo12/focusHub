# 📚 FocusHub

<div align="center">

### 🚀 An All-in-One Study Toolkit for Students

**Plan • Organize • Learn • Track • Achieve**

## 🔗 Live Links

<div align="center">

### 🌍 Frontend
**https://focus-hub-63922.firebaseapp.com**

### ⚙️ Backend API
**https://focus-hub-server.vercel.app**

</div>

---

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![Firebase](https://img.shields.io/badge/Firebase-Authentication-FFCA28?style=for-the-badge&logo=firebase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38B2AC?style=for-the-badge&logo=tailwind-css)
![DaisyUI](https://img.shields.io/badge/DaisyUI-Components-5A0EF8?style=for-the-badge)

</div>

---

## 🌟 About FocusHub

**FocusHub** is a modern productivity platform built specifically for students. It combines multiple study tools into one place, allowing users to manage their academic life efficiently.

Instead of switching between different apps for notes, schedules, budgets, AI assistance, and study planning, FocusHub provides everything inside a single dashboard.

---

# ✨ Features
### 📅 Class Management

- **Client Route:** `/dashboard/class-schedule-tracker`
- **Server Route:** `/api/classes`

- Add, edit and delete classes
- View upcoming and previous classes
- Calendar integration
- Group classes by date
- Pagination support
- Detailed class information

---

### ✅ Task Management

- **Client Route:** `/dashboard/tasks`
- **Server Route:** `/api/tasks`

- Create and organize study tasks
- Update task status
- Delete tasks
- Date-wise grouping
- Pagination
- Detailed task information

---

### 📝 Smart Notes

- **Client Route:** `/dashboard/notes`
- **Server Route:** `/api/notes`

- Rich Text Editor (React Quill)
- Image Upload
- Tables
- Lists
- Code Blocks
- AI Generated Notes

---

### 🤖 AI Study Assistant

#### AI Question Generator

- **Client Route:** `/dashboard/generate-questions`
- **Server Route:** `/api/generate-questions`

- AI Question Generator

#### AI Note Generator

- **Client Route:** `/dashboard/notes`
- **Server Route:** `/api/generate-notes`

- AI Note Generator
- Rate Limited API
- Markdown & Rich Text Support

---

### 💰 Budget Tracker

#### Budget

- **Client Route:** `/dashboard/budgets`
- **Server Route:** `/api/budget`

- Add Budget
- Budget Overview

#### Expense

- **Client Route:** `/dashboard/budgets`
- **Server Route:** `/api/expenses`

- Add Expenses
- Expense Categories

---

### 📊 Dashboard

- **Client Route:** `/dashboard`
- **Server Route:** `/api/dashboard`

- Interactive Calendar
- Upcoming Classes
- Upcoming Tasks
- Quick Overview
- Productivity Dashboard

### 🔐 Authentication

- Firebase Authentication
- Google Login
- JWT Authorization
- Protected Routes
- Secure API Requests

---

# 🛠 Tech Stack

## Frontend

- React
- React Router
- React Query (TanStack Query)
- Axios
- Tailwind CSS
- DaisyUI
- React Hook Form
- React Quill
- FullCalendar
- React Icons
- Firebase
- domPurify
- date-fns
- lucide react
- motion
- react select
- react timekeeper
- react toastify
- sweet alert 2

## Backend

- Node.js
- Express.js
- MongoDB
- Firebase Admin SDK
- JWT
- Cloudinary
- vercel
- cors
- dotenv
- sanitize HTML
- Gemini AI API

---

# 📁 Project Structure

```
FocusHub
│
├── focus-hub-client
├── focus-hub-server
└── README.md
```

---

# 💻 Client Structure

```
focus-hub-client
│
├── src
│   ├── assets
│   ├── components
│   ├── css
│   ├── data
│   ├── features
│   ├── hooks
│   ├── layout
│   ├── pages
│   ├── providers
│   ├── router
│   ├── services
│   ├── utils
│   ├── App.jsx
│   └── main.jsx
│
├── public
├── package.json
└── vite.config.js
```

---

# ⚙️ Server Structure

```
focus-hub-server
│
├── src
│   ├── config
│   │
│   ├── controllers
│   │   ├── users.controller.js
│   │   ├── class.controller.js
│   │   ├── task.controller.js
│   │   ├── note.controller.js
│   │   ├── budget.controller.js
│   │   ├── expense.controller.js
│   │   └── ai.controller.js
│   │   └── dashboard.controller.js
│   │
│   ├── middleware
│   │
│   ├── routes
│   │   ├── users.routes.js
│   │   ├── class.routes.js
│   │   ├── task.routes.js
│   │   ├── note.routes.js
│   │   ├── budget.routes.js
│   │   ├── expense.routes.js
│   │   └── ai.routes.js
│   │   └── dashboard.routes.js
│   │
│   ├── services
│   │   ├── users.service.js
│   │   ├── class.service.js
│   │   ├── task.service.js
│   │   ├── note.service.js
│   │   ├── budget.service.js
│   │   ├── expense.service.js
│   │   └── ai.service.js
│   │   └──  dashboard.service.js
│   │
│   ├── utils
│   │
│   ├── app.js
│   ├── index.js
│   └── prompt.js
│
├── package.json
└── vercel.json
```

---

# 🔐 Authentication Flow

```
User
   │
   ▼
Firebase Authentication
   │
   ▼
JWT Generation
   │
   ▼
Protected API
   │
   ▼
MongoDB
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/alzamo12/focusHub.git
```

---

## Client

```bash
cd focus-hub-client
npm install
npm run dev
```

---

## Server

```bash
cd focus-hub-server
npm install
npm run dev
```

---

# 🔑 Environment Variables

## Client

```env
VITE_apiKey
VITE_authDomain
VITE_projectId
VITE_storageBucket
VITE_messagingSenderId
VITE_appId
VITE_cloudinary_url
```

---

## Server

```env
PORT
DB_USER
DB_PASS
GEMINI_API_KEY
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
FIREBASE_ACCESS_TOKEN
ACCESS_TOKEN
```

---

# 📸 Screenshots

> Add screenshots of:

- Landing Page
- Dashboard
- Calendar
- Notes
- AI Generator
- Budget Tracker
- Task Manager

---

# 🎯 Future Improvements

- Study Analytics
- Exam Countdown
- Pomodoro Timer
- Collaboration
- Notifications
- Mobile App
- Offline Support

---

# 🤝 Contributing

Contributions, issues and feature requests are welcome.

Feel free to fork the project and submit a pull request.

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

---

<div align="center">

### Made with ❤️ for Students

**FocusHub — Learn Smarter, Stay Organized.**

</div>