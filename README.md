













































# 🌾 FarmOps: Comprehensive Farm Management System

![FarmOps Banner](https://img.shields.io/badge/Status-Development_Ready-success?style=for-the-badge)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

FarmOps is a modern, end-to-end farm management solution built for both farmers and administrators. It empowers agricultural businesses to digitize their operations, track key metrics, and seamlessly interact through a centralized digital ecosystem.

The system is composed of three main architectures:
1. **Backend API** (NestJS & MongoDB)
2. **Web Admin Dashboard** (Next.js)
3. **Farmer Mobile Application** (React Native & Expo)

---

## ✨ Key Features

### 🚜 For Farmers (Mobile App)
- **Account Registration & Login**: Self-service registration flow with auto-login capabilities.
- **Farm Overview Dashboard**: Instantly view global statistics including livestock count, milk production volume, and revenue estimations.
- **Herd & Livestock Management**: Keep track of animal health, breed, age, and vaccination phases per farm.
- **Milk Production Logging**: Efficiently record and track daily milk production.
- **Worker Management**: Add and manage farm workers and staff.

### 👑 For Administrators (Web Admin Dashboard)
- **Global Overview**: Secure dashboard view outlining system-wide farm statistics.
- **Farmer & Farm Management**: Perform CRUD operations on registered farmers and their corresponding farms.
- **Agricultural Supervision**: Oversee livestock analytics and milk production outputs.
- **Role-Based Access Control**: Fully protected and authenticated admin routing.

### ⚙️ Core Infrastructure
- **Secure Authentication**: Robust JWT authentication and bcrypt password hashing across the platform.
- **Dynamic Context**: Full state management for user authentication and selected active farm tracking.
- **Scalable Document Database**: Powered entirely via MongoDB.

---

## 🛠️ Tech Stack

| Component | Technologies Used |
| :--- | :--- |
| **Backend** | NestJS, TypeScript, MongoDB, Mongoose, Passport (JWT), Bcrypt |
| **Web Admin** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons |
| **Mobile App** | React Native, Expo (SDK 54), Expo Router, Axios, AsyncStorage |

---

## 📂 Project Structure

```text
FarmOps/
├── backend/                    # Core NestJS REST API
│   ├── src/
│   │   ├── auth/              # Authentication logic & Passport strategies
│   │   ├── users/             # User management
│   │   ├── farms/             # Farm CRUD modules
│   │   ├── livestock/         # Livestock tracking modules
│   │   ├── milk/              # Milk production APIs
│   │   └── admin/             # Central Admin controllers
│   └── main.ts                # API Entry point (Port 3005)
│
├── web-admin/                  # Next.js Administrator Dashboard
│   ├── app/
│   │   ├── (dashboard)/       # Protected CMS routes & pages
│   │   └── auth/              # Admin Login
│   ├── components/            # Shared UI elements (Sidebar, Auth HOC)
│   └── lib/                   # Pre-configured Axios API clients
│
└── mobile-app/                 # Expo/React Native Farmer App
    ├── app/                   
    │   ├── (tabs)/            # App primary tab navigation
    │   ├── farm/[farmId]/     # Dynamic per-farm routing
    │   └── login.tsx          # Public auth routes
    ├── contexts/              # Global state (Auth & Active Farm)
    └── lib/                   # Pre-configured Axios API clients
```

---

## 🚀 Getting Started

To run FarmOps locally, you'll need all three components running concurrently. 

### Prerequisites
- **Node.js**: v18 or newer
- **MongoDB**: A running local instance or MongoDB Atlas Connection String
- **Expo Go App**: To scan the QR code and test the mobile application.

### 1. Start the Backend API
The backend acts as the single source of truth and must be started first.
```bash
cd backend
npm install
# Set up your .env variables (e.g. MONGO_URI, JWT_SECRET)
npm run start:dev
```
*API will run on [http://localhost:3005](http://localhost:3005)*

### 2. Start the Web Admin Dashboard
```bash
cd web-admin
npm install
npm run dev
```
*Admin Dashboard will run on [http://localhost:3000](http://localhost:3000)*

### 3. Start the Mobile Application
```bash
cd mobile-app
npm install 
npm start
```
*Scan the generated QR code in your terminal using the Expo Go mobile app.*

> **⚠️ Note on Mobile Testing:** Ensure your API client in `mobile-app/lib/api.ts` correctly points to your backend instance. If testing on a physical device, change `localhost` to your computer's local network IP address.

---

## 🔐 Default Testing Credentials

**Administrator Account** (Use in Web Admin)
- **Email:** `admin@myfarmops.app`
- **Password:** `password`
- **Role:** `admin`

**Farmer Account** (Use in Mobile App)
- You can create a new Farmer dynamically using the Mobile App's **Registration Screen**.

---

## 👨‍💻 Author

Built and maintained by **Omar Bourra**

---
*Status: MVP Development Completed. System ready for production deployment.*
