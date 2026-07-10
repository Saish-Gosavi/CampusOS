# Hostel Management System (Codequest 4.0)

A simple, robust, and clean repository structure for the Hostel / Inventory / Library Management System.

## Tech Stack
*   **Frontend**: React (built with Vite)
*   **Backend**: Node.js & Express.js
*   **Database**: MySQL

## Repository Structure

```
Hostel-Management/
├── frontend/             # React Frontend (Vite)
│   ├── src/              # Application source code
│   └── package.json      # Frontend package configuration
├── backend/              # Node.js Express Backend
│   ├── src/
│   │   ├── config/       # Database configuration (MySQL connection pool)
│   │   └── index.js      # App entry point
│   ├── .env.example      # Example environment variables template
│   └── package.json      # Backend package configuration
└── README.md             # Project documentation
```

## Getting Started

### 1. Database Setup
Ensure you have MySQL installed and running on your local machine. Create a new database:
```sql
CREATE DATABASE hostel_management;
```

### 2. Backend Setup
1. Open the [backend/](file:///c:/Users/saish/Hostel%20Management/Hostel-Management/backend) directory.
2. Edit the `.env` file (copied from `.env.example`) to match your local MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=hostel_management
   ```
3. Run the following to install packages and start the development server:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

### 3. Frontend Setup
1. Open the [frontend/](file:///c:/Users/saish/Hostel%20Management/Hostel-Management/frontend) directory.
2. Run the following to install packages and start the Vite dev server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
