# GLUCOAID

GLUCOAID is a comprehensive platform designed to manage and streamline healthcare administration, focusing on doctor, patient, and hospital management. The project features a modern React frontend (with Vite) and a Node.js/Express backend, using MongoDB for data storage.

## Features

- Doctor, Patient, and Hospital Management
- Secure Authentication (Firebase)
- Schedule and Feedback Management
- Responsive Admin Dashboard
- Profile Picture Uploads
- Toast Notifications for User Feedback

## Tech Stack

- **Frontend:** React, Vite, TailwindCSS, Zustand
- **Backend:** Node.js, Express, Mongoose, Multer
- **Authentication:** Firebase
- **Database:** MongoDB

## Project Structure

```
GLUCOAID
├── client                  # React frontend
│   ├── public              # Public files
│   └── src                 # Source files
│       ├── components      # Reusable components
│       ├── pages           # Page components
│       ├── App.jsx         # Main app component
│       └── index.jsx       # Entry point
└── server                  # Node.js backend
    ├── config              # Configuration files
    ├── controllers         # Request handlers
    ├── middleware          # Custom middleware
    ├── models              # Mongoose models
    ├── routes              # Express routes
    ├── .env                # Environment variables
    ├── server.js           # Entry point
    └── package.json         # Backend dependencies
```

