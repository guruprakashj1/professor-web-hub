
# Firebase Setup Instructions

To use this application with Firebase, follow these steps:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Follow the setup wizard to create your project

## 2. Enable Firestore Database

1. In your Firebase project console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database

## 3. Get Firebase Configuration

1. In your Firebase project console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and choose "Web" (</> icon)
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 4. Update Firebase Configuration

1. Open `src/config/firebase.ts`
2. Replace the placeholder values with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## 5. Deploy to Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase in your project: `firebase init`
   - Select "Hosting"
   - Choose your existing project
   - Set public directory to `dist`
   - Configure as single-page app: Yes
   - Don't overwrite existing files
4. Build your app: `npm run build`
5. Deploy: `firebase deploy`

## 6. Security Rules (Optional but Recommended)

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to portal data
    match /portal/{document} {
      allow read: if true;
      allow write: if request.auth != null; // Require authentication for writes
    }
    
    // Allow anyone to create contact messages
    match /contact-messages/{document} {
      allow read, write: if true;
    }
    
    // Allow anyone to create applications
    match /applications/{document} {
      allow read, write: if true;
    }
  }
}
```

## Environment Variables

The Firebase configuration is stored directly in the code. For production apps, consider using environment variables, but for a professor's portfolio site, the current approach is acceptable since all data will be public anyway.

## Data Migration

Your existing JSON files in `/public/data/` will no longer be used. The application will automatically initialize Firebase with default data on first load.
