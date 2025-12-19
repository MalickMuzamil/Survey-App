# 📊 Survey-App

**Enterprise-Grade Role-Based Survey Management System (Frontend + Backend)**

![Architecture](https://img.shields.io/badge/Architecture-Monorepo-yellow)
![Frontend](https://img.shields.io/badge/Frontend-Angular-red)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-green)
![Database](https://img.shields.io/badge/Database-MySQL-blue)
![Auth](https://img.shields.io/badge/Auth-JWT-orange)

---

## 🚀 Overview

**Survey-App** is a **secure, role-based survey management system** built using the **MEAN Stack** with **MySQL** as the database.  
It is designed for organizations where **hierarchical access control** is critical.

✔ Seniors can manage and review surveys  
✔ Juniors can only access permitted data  
✔ Strict **role-based guards** prevent unauthorized access  

---

## 🧩 Tech Stack

### 🎨 Frontend
- Angular
- TypeScript
- Angular Guards
- Role-Based Routing
- Responsive UI

### ⚙️ Backend
- Node.js
- Express.js
- JWT Authentication
- Role-Based Authorization
- RESTful APIs

### 🗄️ Database
- MySQL
- Relational Schema Design
- Secure Data Access

---

## 🏗️ Architecture

Survey-App (Monorepo)
│

├── Frontend (Angular)

│ ├── Guards

│ ├── Services

│ ├── Components

│ └── Role-Based Routing

│

├── Backend (Node.js / Express)

│ ├── Controllers

│ ├── Routes

│ ├── Middleware

│ ├── Models

│ └── Auth & Access Control

│

└── Database (MySQL)

---

## 👥 User Roles & Permissions

| Role    | View Surveys | Create Surveys | Delete Surveys | View Senior Data |

|--------|--------------|---------------|----------------|------------------|

| Senior | ✅ Yes       | ✅ Yes        | ✅ Yes         | ✅ Yes           |

| Junior | ✅ Limited   | ❌ No         | ❌ No          | ❌ No            |

> 🔒 Juniors **cannot view senior-level surveys**  

> 🔒 Seniors have **full control**

---

## 🔐 Security Features

- JWT Authentication

- Role-Based Guards (Frontend & Backend)

- Protected API Routes

- Secure Password Handling

- Access Middleware

---

## 📡 API Highlights

- `POST /auth/login`

- `POST /auth/register`

- `GET /surveys`

- `POST /surveys`

- `DELETE /surveys/:id`

- Role-restricted endpoints

---

## ⚡ Setup Instructions

### 1️⃣ Clone Repository

git clone https://github.com/MalickMuzamil/Survey-App.git

cd Survey-App

2️⃣ Backend Setup

cd Backend

npm install

npm start

3️⃣ Frontend Setup

cd Frontend

npm install

ng serve

---

🌍 Environment Variables

Create .env in Backend:

PORT=5000

DB_HOST=localhost

DB_USER=root

DB_PASSWORD=yourpassword

DB_NAME=survey_db

JWT_SECRET=your_secret_key

---

📌 Key Highlights

✅ Enterprise-ready architecture

✅ Proper separation of concerns

✅ Secure & scalable

✅ Clean and maintainable code

✅ Real-world role-based access control

---


📄 License

This project is licensed under the MIT License.

---


👨‍💻 Author

Malick Muzamil

Full-Stack Developer (MEAN Stack)
