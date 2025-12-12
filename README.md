# HackerNews Reader

A modern React Native mobile application for reading HackerNews articles with offline support, notifications, and a beautiful Material Design 3 interface.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Expo CLI** (will be installed automatically with npm install)
- **iOS Simulator** (for macOS users) or **Android Studio** (for Android development)
- **Expo Go** app on your physical device (optional, for testing on real devices)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd react-native-dev-test
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory (optional, defaults are provided):

```bash
# HackerNews API Configuration
EXPO_PUBLIC_HN_API_BASE_URL=https://hacker-news.firebaseio.com/v0

# Algolia API Configuration (for mobile articles search)
EXPO_PUBLIC_ALGOLIA_API_BASE_URL=https://hn.algolia.com/api/v1
EXPO_PUBLIC_ALGOLIA_MOBILE_QUERY=mobile
EXPO_PUBLIC_ALGOLIA_HITS_PER_PAGE=30

# API Configuration
EXPO_PUBLIC_API_TIMEOUT=10000
EXPO_PUBLIC_API_MAX_RETRIES=3
EXPO_PUBLIC_API_RETRY_DELAY=1000
EXPO_PUBLIC_API_BATCH_SIZE=20
EXPO_PUBLIC_API_MAX_CONCURRENT=5

# Error Tracking (optional)
EXPO_PUBLIC_SENTRY_DSN=
```

**Note:** The app will work with default values if you don't create a `.env` file.

### 4. Start the Development Server

```bash
npm start
```

This will start the Expo development server. You can then:

- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan the QR code with Expo Go app on your physical device
- Press `w` to open in web browser

### 5. Run on Specific Platform

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📱 Features

- **Multiple Feed Types**: Top Stories, New Stories, Best Stories, and Ask HN
- **Offline Support**: Articles are cached locally using SQLite
- **Read/Unread Tracking**: Mark articles as read/unread
- **Save Articles**: Save articles for later reading
- **Favorites**: Mark articles as favorites
- **Dark Mode**: Automatic theme switching based on system preferences
- **Push Notifications**: Get notified about new top stories
- **Background Sync**: Automatic background fetching of new articles
- **Swipe Actions**: Swipe to mark as read, save, favorite, or delete
- **WebView Integration**: Read full articles in-app

## 🏗️ Project Structure

```
app/
├── components/          # Reusable UI components (atoms, molecules, organisms)
├── config/             # Configuration files
├── hooks/              # Custom React hooks
├── navigation/         # Navigation configuration
├── screens/            # Screen components
├── services/           # API, database, notifications services
├── store/              # State management (Zustand)
├── theme/              # Theme and styling
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## ⚠️ Important Notes

### Database

The app uses **Expo SQLite** for local storage. The database is automatically initialized on first launch. All articles, read status, favorites, and saved articles are stored locally.

### Permissions

The app requires the following permissions:

- **iOS**: Background fetch and notifications (configured in `app.json`)
- **Android**: 
  - `RECEIVE_BOOT_COMPLETED` - For background tasks
  - `SCHEDULE_EXACT_ALARM` - For scheduled notifications
  - `USE_EXACT_ALARM` - For precise notification timing

### Background Tasks

The app uses Expo's Background Fetch API to periodically fetch new articles even when the app is in the background. This is configured automatically on app initialization.

### Notifications

On first launch, the app will request notification permissions. You can manage notification settings in the Settings screen.

## 🛠️ Troubleshooting

### Metro Bundler Issues

If you encounter issues with Metro bundler:

```bash
# Clear cache and restart
npm start -- --clear
```

### Database Issues

If you need to reset the database:

1. Uninstall the app from your device/simulator
2. Reinstall and the database will be recreated

### iOS Simulator Issues

If iOS Simulator doesn't open:

1. Ensure Xcode is installed
2. Run `xcode-select --install` if needed
3. Open Xcode and accept license agreements

### Android Emulator Issues

1. Ensure Android Studio is installed
2. Create an Android Virtual Device (AVD) in Android Studio
3. Start the emulator before running `npm run android`

## 📦 Build for Production

To build the app for production:

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

**Note:** You'll need to set up Expo Application Services (EAS) for production builds.

## 🔧 Development Tools

- **React Native Debugger**: For debugging React Native apps
- **React DevTools**: Included with Expo
- **Flipper**: For advanced debugging (optional)
