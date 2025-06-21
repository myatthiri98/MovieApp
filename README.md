# Movie App Setup Guide

## Quick Start

1. **Get your TMDB API Key**

   - Go to https://www.themoviedb.org/
   - Create an account and request an API key
   - Copy your API key

2. **Configure API Key**

   - Open `src/config/api.ts`
   - Replace `YOUR_TMDB_API_KEY_HERE` with your actual API key

3. **Install Dependencies** (Already done)

   ```bash
   yarn install
   ```

4. **Start the App**
   ```bash
   yarn start
   ```

## Features Implemented

✅ **Two Screens**

- Movie List Screen with tabs for Upcoming and Popular movies
- Movie Details Screen with full movie information

✅ **Requirements Met**

- React Navigation ✅
- Axios + RxJS for API calls ✅
- Redux-Saga for async middleware ✅
- React-Redux and Redux ✅
- AsyncStorage for favorites ✅
- React-Native-Keychain installed ✅
- Reusable components ✅
- HOC for API states ✅
- Background async API calls ✅
- React hooks ✅
- TypeScript ✅
- Offline support with offline-first approach ✅
- Dependency Injection pattern ✅
- Reactive Programming with RxJS ✅

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── MovieCard.tsx   # Movie card component
│   └── hoc/            # Higher-Order Components
│       └── withApiState.tsx
├── config/             # Configuration files
│   └── api.ts         # API configuration
├── navigation/         # Navigation setup
│   └── AppNavigator.tsx
├── screens/           # Screen components
│   ├── MovieListScreen.tsx
│   └── MovieDetailsScreen.tsx
├── services/          # API services
│   └── api.ts         # API service with offline support
├── store/             # Redux setup
│   ├── actions/       # Redux actions
│   ├── reducers/      # Redux reducers
│   ├── sagas/         # Redux sagas
│   └── index.ts       # Store configuration
└── types/             # TypeScript types
    └── index.ts
```

## Key Features

- **Offline-First**: Shows cached data when offline
- **Favorites**: Toggle movies as favorites (stored locally)
- **Infinite Scrolling**: Load more movies as you scroll
- **Pull-to-Refresh**: Refresh movie lists
- **Error Handling**: Proper error states with retry options
- **Loading States**: Loading indicators for better UX
- **Responsive Design**: Works on different screen sizes

## API Endpoints Used

- Popular Movies: `/movie/popular`
- Upcoming Movies: `/movie/upcoming`
- Movie Details: `/movie/{id}`

All API calls are cached locally for offline support.
