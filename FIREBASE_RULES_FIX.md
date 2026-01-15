# Firebase Security Rules Update

## Issue
The upload script is failing with "Missing or insufficient permissions" when trying to write questions to subcollections.

## Solution
You need to update your Firebase Firestore security rules to allow writing to the questions subcollection.

### Steps to Fix:

1. **Go to Firebase Console**
   - Open https://console.firebase.google.com
   - Select your project

2. **Navigate to Firestore Database**
   - Click on "Firestore Database" in the left menu
   - Click on the "Rules" tab

3. **Update Your Security Rules**

Replace your current rules with these updated rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Papers collection - allow read for all, write for authenticated users
    match /papers/{paperId} {
      allow read: if true;
      allow write: if request.auth != null;

      // Questions subcollection - allow read for all, write for authenticated users
      match /questions/{questionId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }

    // Test attempts - only accessible by the user who created them
    match /testAttempts/{attemptId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }

    // Subscriptions - only accessible by the owner
    match /subscriptions/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. **Publish the Rules**
   - Click "Publish" button to save your changes

5. **Retry Upload**
   - Go back to your app
   - Navigate to Profile → Admin Panel
   - Try uploading the mock data again

## What These Rules Do:

- **Papers and Questions**: Anyone can read, but only authenticated users can write
- **Test Attempts**: Users can only read/write their own attempts
- **Subscriptions**: Users can only access their own subscription data

## Important Notes:

- These rules allow any authenticated user to upload papers and questions
- In production, you might want to restrict this to admin users only
- You can add additional checks like checking for an admin role

### More Secure (Admin Only) Version:

If you want to restrict uploads to admin users only:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Papers collection
    match /papers/{paperId} {
      allow read: if true;
      allow write: if isAdmin();  // Only admins can write

      // Questions subcollection
      match /questions/{questionId} {
        allow read: if true;
        allow write: if isAdmin();  // Only admins can write
      }
    }

    // Rest of rules...
  }
}
```

## After Fixing:

Once you've updated the rules and published them:
1. Wait a few seconds for the rules to propagate
2. Try the upload again from the Admin Panel
3. The script now includes delays to avoid bandwidth limits
4. The upload will take 2-3 minutes to complete
