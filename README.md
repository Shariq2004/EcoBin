# EcoBin

## AI-Powered Smart Waste Management Platform

EcoBin is a modern full-stack waste management platform built to simplify and digitalize the waste collection process. The system connects administrators, workers, and users through a centralized platform that improves waste tracking, worker assignment, and service management.

The project is developed using the MERN Stack and integrates AI-powered functionality to create a smarter and more efficient waste management experience.

---

## Overview

EcoBin was designed to solve common problems in traditional waste management systems such as inefficient worker allocation, poor tracking, delayed pickups, and lack of centralized monitoring.

The platform provides separate dashboards and functionalities for different user roles while maintaining a clean and responsive interface across devices.

---

## Core Features

### Authentication & Authorization
Secure login and registration system with role-based access control for Admins, Workers, and Users.

### Admin Dashboard
Administrators can manage workers, monitor waste collection activity, assign tasks, and track overall system performance.

### Worker Management
Workers receive assigned collection tasks based on their zones and areas, allowing organized and efficient operations.

### Zone & Area-Based Assignment
The system automatically manages worker allocation according to location-specific zones and assigned service areas.

### Waste Pickup Requests
Users can create pickup requests that are tracked and managed through the platform in real time.

### AI Integration
Generative AI APIs are integrated to enhance system intelligence and improve the user experience.

### Real-Time Status Tracking
Track request progress and collection updates dynamically throughout the workflow.

### Responsive Design
The application is optimized for desktop, tablet, and mobile devices.

### Real-Time Notifications
The system provides instant notifications and live status updates for pickup requests, worker assignments, and task progress to ensure smooth communication between users, workers, and administrators.

---

## Technology Stack

### Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- RESTful APIs
- Generative AI API Integration
- Role-Based Access Control
- Secure Environment Variables
- Cloud Deployment Services

### Deployment
- Vercel (Frontend,Admin)
- Render (Backend)

The frontend and admin of EcoBin is deployed on Vercel while the backend services are hosted on Render.

---

## Future Enhancements

- Smart Bin Monitoring
- Live GPS Tracking
- Analytics Dashboard

---

## Objectives

- Improve waste collection efficiency
- Digitize traditional waste management workflows
- Reduce manual tracking problems
- Provide better communication between users and workers
- Build a scalable and responsive management platform

## 📝 .env Setup

### Backend (`/backend`)

```env
MONGO_URL=your_mongodb_connection_string

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

GEMINI_API_KEY=your_gemini_api_key

ADMIN_ID=your_admin_id
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

JWT_SECRET=your_jwt_secret

PORT=3000
```

---

## Run the Backend

```bash
cd backend
npm install
npm run dev
```

---

## Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

## Contribution

Contributions, improvements, and suggestions are welcome. Feel free to fork the repository and submit pull requests.


---

## Developer

**Shariq**

Full Stack MERN Developer

---

## Support

If you like this project, give it a ⭐ on GitHub.
