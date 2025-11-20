# Meal Tracker App

A complete mobile-first meal tracking application with authentication, onboarding, and core meal tracking functionality.

## Features

- 🔐 **Authentication**: Email/password signup and login with Firebase
- 🎯 **Onboarding**: 3-step setup (Goal, Activity Level, Dietary Preference)
- 📸 **Photo Capture**: Take photos of meals to track macros
- 🤖 **AI Analysis**: Mock AI service analyzes meals and extracts macros
- 📊 **Dashboard**: View daily progress with macro rings and meal history
- 📱 **Mobile-First**: Optimized for mobile devices with touch-friendly UI

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Authentication & Database**: Firebase (Auth, Firestore)
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project (for authentication and database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd inajiffy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Get your Firebase config values

4. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Set up Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /meals/{mealId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
       match /dailyTotals/{docId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── onboarding/    # Onboarding flow components
│   ├── camera/         # Camera/photo capture
│   ├── results/        # Meal analysis results
│   ├── dashboard/      # Dashboard and progress views
│   └── shared/         # Reusable components
├── hooks/              # Custom React hooks
├── store/              # Zustand state management
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── config/             # Firebase configuration
```

## App Flow

1. **Signup/Login** → User creates account or logs in
2. **Onboarding** → 3-step setup:
   - Select weight goal (Lose/Maintain/Gain)
   - Select activity level
   - Select dietary preference
   - Daily macro targets are calculated automatically
3. **Camera View** → Main app screen to capture meals
4. **Results Screen** → View analyzed meal with macros, adjust portion, save or skip
5. **Dashboard** → View daily progress, macro rings, and meal history

## Key Features

### Macro Calculator
- Calculates TDEE (Total Daily Energy Expenditure) based on activity level
- Adjusts calories based on goal (lose: -500, maintain: 0, gain: +300)
- Splits macros: 30% protein, 40% carbs, 30% fat

### Image Processing
- Compresses images to < 1MB before analysis
- Uses Canvas API for resizing and compression
- Mock AI service simulates meal analysis (2-3 second delay)

### Data Persistence
- User profiles stored in Firestore `users` collection
- Meals stored in `meals` collection
- Daily totals aggregated in `dailyTotals` collection

## Testing Checklist

- [ ] New user can sign up and complete onboarding in < 2 minutes
- [ ] Camera opens instantly on app launch
- [ ] Photo → results → saved takes < 10 seconds
- [ ] App works on iPhone Safari and Android Chrome
- [ ] Macros are calculated correctly
- [ ] Daily totals update immediately after saving meal
- [ ] User can navigate back to camera from dashboard
- [ ] App handles poor internet gracefully
- [ ] All buttons provide visual feedback
- [ ] Text is readable without zooming

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Future Enhancements

- [ ] Real AI meal recognition API integration
- [ ] Meal streaks and achievements
- [ ] Weekly reports and insights
- [ ] Barcode scanning for packaged foods
- [ ] Integration with fitness trackers
- [ ] Custom meal templates
- [ ] Social accountability features
- [ ] Recipe suggestions based on macro targets

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
