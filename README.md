# TEFPrep Pro

A professional French certification preparation mobile app built with React Native and Expo. Help users master the Test d'Évaluation de Français (TEF) with interactive practice tests and comprehensive study materials.

## Features

### Core Functionality
- **Interactive MCQ Tests**: Take timed practice tests with real-time scoring
- **Detailed Results**: Review performance with question-by-question analysis
- **Progress Tracking**: Monitor improvement across all test categories
- **User Authentication**: Secure login with email/password
- **Subscription Management**: Free and premium content tiers
- **Multiple Categories**: Covers all TEF sections
  - Compréhension Orale
  - Expression Écrite
  - Compréhension Écrite
  - Expression Orale
  - Vocabulaire et Grammaire
  - Test Complet

### User Experience
- Modern minimal design with professional purple/blue palette
- Intuitive navigation with bottom tabs
- Timer during tests with auto-submit
- Explanation for each question
- Difficulty levels (Beginner, Intermediate, Advanced)
- Clean, distraction-free test interface

## Tech Stack

- **Frontend**: React Native + Expo
- **Language**: TypeScript
- **Backend**: Firebase (Authentication + Firestore)
- **State Management**: React Context API
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Payments**: Stripe (subscription management)

## Project Structure

```
EcommerceApp/
├── src/
│   ├── config/
│   │   └── firebase.ts          # Firebase configuration
│   ├── context/
│   │   ├── AuthContext.tsx      # User authentication
│   │   ├── CartContext.tsx      # Legacy (to be removed)
│   │   └── SubscriptionContext.tsx  # Subscription management
│   ├── navigation/
│   │   └── AppNavigator.tsx     # App navigation setup
│   ├── screens/
│   │   ├── HomeScreen.tsx       # Main dashboard
│   │   ├── LoginScreen.tsx      # Authentication
│   │   ├── ProductsScreen.tsx   # Browse papers (to be renamed)
│   │   ├── TestScreen.tsx       # MCQ test interface
│   │   ├── TestResultsScreen.tsx # Results and review
│   │   └── ProfileScreen.tsx    # User profile
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── utils/
│   │   ├── colors.ts            # App color palette
│   │   └── mockData.ts          # Sample papers and questions
│   └── components/              # Reusable components
├── assets/                      # Images and icons
├── App.tsx                      # Root component
├── app.json                     # Expo configuration
├── SETUP_GUIDE.md              # Complete setup instructions
└── DEPLOYMENT.md               # Store deployment guide
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator (optional)
- Expo Go app on your phone (for testing)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd EcommerceApp
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at https://console.firebase.com
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Copy your config to `src/config/firebase.ts`
   - See SETUP_GUIDE.md for detailed instructions

4. Start the development server:
```bash
npm start
```

5. Run on your device:
   - Scan QR code with Expo Go (iOS/Android)
   - Press `i` for iOS simulator (Mac only)
   - Press `a` for Android emulator
   - Press `w` for web browser

## Configuration

### Firebase Setup

Update `src/config/firebase.ts` with your Firebase credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

See `SETUP_GUIDE.md` for complete Firebase setup instructions.

### Branding Customization

Colors are defined in `src/utils/colors.ts`:
- Primary: #5B21B6 (Purple)
- Secondary: #3B82F6 (Blue)
- Success: #10B981 (Green)
- Error: #EF4444 (Red)

Update these to match your brand.

## Data Management

### Adding Practice Papers

Papers and questions can be added through:

1. **Firebase Console** (manual):
   - Add documents to `papers` collection
   - Include questions array in each paper

2. **Admin Panel** (to be built):
   - Create UI for adding/editing papers
   - Upload questions in bulk
   - Manage premium status

### Sample Data Structure

Currently using mock data in `src/utils/mockData.ts`. Replace with real Firebase data for production.

## Subscription Model

The app supports two subscription tiers:

- **Free Tier**: Access to non-premium papers
- **Premium Tier**: Access to all papers
  - Monthly: $9.99/month
  - Yearly: $99/year

Stripe integration setup instructions in `SETUP_GUIDE.md`.

## Deployment

### Build for App Stores

```bash
# Login to Expo
eas login

# Initialize EAS
eas init

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

See `DEPLOYMENT.md` for complete deployment guide.

### App Store Requirements

- **iOS Bundle ID**: com.tefprep.pro
- **Android Package**: com.tefprep.pro
- **Category**: Education
- **Age Rating**: 4+
- **Price**: Free (with in-app purchases)

## Testing

### Current Mock Data

The app includes sample TEF papers:
- 6 practice papers across different categories
- Sample MCQ questions in French
- Different difficulty levels

### Test User Flow

1. Open app → Browse papers
2. Select a paper → View details
3. Start test → Answer questions
4. Complete test → View results
5. Review incorrect answers

## Roadmap

- [x] Core app structure
- [x] Firebase integration
- [x] User authentication
- [x] MCQ test interface
- [x] Results and review
- [x] Subscription context
- [ ] Stripe payment integration
- [ ] Admin panel for content management
- [ ] Progress analytics dashboard
- [ ] Push notifications
- [ ] Offline mode
- [ ] Social sharing
- [ ] Leaderboards
- [ ] Google Sign-In
- [ ] Dark mode

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - feel free to use this project for your own apps.

## Support

For setup help and deployment questions, see:
- `SETUP_GUIDE.md` - Complete Firebase and configuration guide
- `DEPLOYMENT.md` - App store submission instructions

## Acknowledgments

- Built with React Native and Expo
- Firebase for backend services
- Stripe for payment processing
- React Navigation for routing

---

**Ready to help students master French certification!** 🇫🇷📚
