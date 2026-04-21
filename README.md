# 🎓 University Students Team Matching Platform

![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Express](https://img.shields.io/badge/Express.js-Framework-lightgrey)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue)
![EJS](https://img.shields.io/badge/EJS-Templating-orange)

---

## 📌 Overview

This platform is designed to help university students both **find suitable teammates** and **connect with advisors** for their academic projects.

Students can create , aapply , and publish projects, specify required skills, and build teams, while also searching for advisors to supervise their work.  
Advisors can browse student projects and choose to advise projects that match their expertise.

The system aims to simplify collaboration and improve the quality of student projects by combining **team formation** and **advisor matching** in one platform.

---

## 🚀 Features

### 👨‍🎓 Students
- Create, edit, delete projects
- Specify required skills and team size
- Browse and join projects
- Request advisor for project instucting
- accept or reject other applicants
- View their own projects

### 👨‍🏫 Advisors
- View student project requests
- accept or reject student requests
- Monitor academic work

### 🛠️ Admin
- Manage categories
- Manage announcements
- Manage user roles
- Control platform data

---

## 🧑‍💻 Tech Stack

| Layer      | Technology        |
|------------|------------------|
| Frontend   | EJS, HTML, CSS   |
| Backend    | Node.js, Express |
| Database   | MySQL            |
| Auth       | Sessions         |
| Encryption | Bcrypt           |
|
---

## 🗄️ Database Structure

Main tables:
- `roles`
- `categories`
- `departments`
- `users`
- `students`
- `advisors`
- `student_projects`
- `categories`
- `advisor_requests`
- `Admins`
- `advisors`
- `students`
- `Announcements`
- `Applications`
- `Sessions` 

Relationships:
Initial ER diagram (There are changes ..)
<img width="1241" height="690" alt="Screenshot 2026-04-21 165732" src="https://github.com/user-attachments/assets/f8ef2140-b848-4510-b817-100346b08d4f" />
---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
