# E-commerce Warehouse Management System

A full-stack application for managing e-commerce warehouse operations, built with Next.js frontend and Node.js/Express backend.

## Project Structure

```
Ecom-Warehouse/
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js 13+ app directory
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
└── backend/          # Node.js/Express API
    ├── routes/       # API route handlers
    ├── models/       # Database models
    ├── controllers/  # Business logic
    ├── middleware/   # Custom middleware
    └── package.json  # Backend dependencies
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   ```bash
   cd ../backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## Features

- **Frontend (Next.js)**
  - Modern React with TypeScript
  - Server-side rendering
  - Responsive design
  - Real-time updates

- **Backend (Node.js/Express)**
  - RESTful API
  - User authentication
  - Product management
  - Inventory tracking
  - Order processing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request
