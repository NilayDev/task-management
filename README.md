# Personal Task Management Application

A personal task-management application built with **Next.js** and **MongoDB**.
It lets you create, organise, and track tasks efficiently across multiple
profiles—all in one responsive web app.

---

## 🧰 Technologies Used

| Layer            | Tech                                                                               |
|------------------|------------------------------------------------------------------------------------|
| **Full-stack**   | [Next.js](https://nextjs.org/) (App Router) — provides both the React front-end and API routes |
| **Database**     | [MongoDB](https://www.mongodb.com/) (+ Mongoose ODM)                               |
| **Styling / UI** | Tailwind CSS & Radix UI                                                         |
| **Drag & Drop**  | `@hello-pangea/dnd`                                                                |
| **State / Data** | `@tanstack/react-query`                                            |

---

## 📦 Features

### ✅ Task Management
* **CRUD**: create, read, update, delete tasks  
* Fields: **Title**, **Description**, **Due date**, **Status** (`Pending`, `In Progress`, `Completed`)

### 👥 Multiple Profiles
* Switch between different user profiles—each profile sees only its own tasks

### 🗂️ Task Organisation
* Categorise tasks (e.g. Work, Personal, Shopping)  
* **Drag-and-drop** between status columns to reprioritise quickly

### 🔍 Search & Filter
* Search by title or description  
* Filter by **Status** and **Category**

### 📱 Responsive Design
* Mobile-first layout that scales gracefully to desktop

---

## 🚀 Getting Started

### Prerequisites
* **Node.js v18+**
* A MongoDB instance (local or Atlas)

### 1  Clone the repository
```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

### 2  Install dependencies
```bash
npm install
```

### 3 Setup environments variable and Database
```bash
set environment the variable named MONGODB_URI
```

### 4 Seed the database
```bash
npm run seed
```

### 5 Start the application
```bash
npm run dev
```