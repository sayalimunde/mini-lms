# Mini Online Learning Management System (LMS)
<!-- ## Learn Hub Mini Courses -->

A platform for creating and managing online courses.

This is a mini Learning Management System (LMS) built using React for the frontend and Firebase for the backend. It supports two types of users: Students and Instructors. Instructors can create courses, add lessons, and manage course content. Students can browse and view courses and lessons.

## Features
* User Authentication: Firebase Authentication is used for secure login and registration. Users can register either as a Student or an Instructor.

* Instructor Features:
  * Create new courses
  * Add lessons to courses
  * Edit or delete courses and lessons
* Student Features:
  * Browse available courses
  * Enroll in courses
  * Watch lessons within a course
* Dashboard:
  * Instructors can view and manage their created courses and lessons.
  * Students can view all available courses, enrolled courses, and watch lessons.
  * Responsive Design: The application is designed to be mobile-friendly and accessible on all devices.

## Tech Stack
* Frontend: React.js
* Backend: Firebase
* Firebase Authentication for user authentication
* Firebase Firestore for storing courses, lessons, and user data
* Authentication: Firebase Authentication (Email/Password-based login)
  
## Firebase Setup

This application uses Firebase for authentication and data storage. Follow these steps to set up your Firebase project:

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password sign-in method)
3. Create a Firestore database
4. Get your Firebase configuration from Project Settings > General > Your apps > SDK setup and configuration

### Environment Variables

For development, the Firebase configuration is hardcoded in `vite.config.ts`. For production or more secure deployment:

- Create a `.env` file in the root directory with the following variables:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Security Rules

Ensure your Firestore security rules protect your data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Implement your security rules here
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```


## Development

To start the development server:

```bash
npm run dev
```

## Firestore Security Rules

Set up the following Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Courses collection
    match /courses/{courseId} {
      allow read: if true; // Anyone can read courses
      allow create: if request.auth != null && 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "instructor";
      allow update, delete: if request.auth != null && 
                            resource.data.createdBy == request.auth.uid;
    }
    
    // Lessons collection
    match /lessons/{lessonId} {
      allow read: if true; // Anyone can read lessons
      allow create: if request.auth != null &&
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "instructor";
      allow update, delete: if request.auth != null &&
                            get(/databases/$(database)/documents/courses/$(resource.data.courseId)).data.createdBy == request.auth.uid;
    }
  }
}
```

# mini-lms
97b746f25eba8cefb2c62710c970bea0dc3e3c31
