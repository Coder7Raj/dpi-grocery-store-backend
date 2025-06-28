# 🛒 GrooFi Backend

GrooFi is a modern, responsive, and user-friendly grocery and fresh vegetable shopping web application. This repository contains the **backend** implementation of GrooFi, built with **Node.js**, **Express**, and **MongoDB**.

---

## 🚀 Backend Tech Stack

- **Node.js & Express.js** – Web server and API handling  
- **MongoDB & Mongoose** – NoSQL database and modeling  
- **JWT (jsonwebtoken)** – Authentication  
- **BcryptJS** – Password hashing  
- **Multer** – File/image upload handling  
- **Cookie-parser** – Cookie management  
- **Dotenv** – Environment variable support  
- **Nodemailer** – Sending emails  
- **CORS** – Cross-origin resource sharing  
- **Nodemon** – Auto-reload during development  

---

## 📂 Project Structure

grocery-backend/
│
├── controllers/ # Route logic (auth, users, etc.)
├── models/ # MongoDB models (User, Product, etc.)
├── routes/ # API endpoints
├── uploads/ # Uploaded image files
├── .env # Environment variables
├── index.js # Entry point
└── package.json # Project config and dependencies
---

## ⚙️ Installation & Setup

### 1. Clone the Repository
git clone https://github.com/yourusername/grocery-backend.git

2. Install Dependencies
```
npm install

```
4. Create .env File
Create a .env file in the root folder and add the following:
```bash
.env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
4. Run Development Server
npm run dev
The server will start at: http://localhost:5000
```
📦 Scripts
```bash
npm run dev	Start backend using nodemon
npm test	Run tests (currently placeholder)
