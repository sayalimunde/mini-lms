# Learn Hub Mini Courses

A platform for creating and managing online courses.

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
