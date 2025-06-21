import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { RootStackParamList } from '@/types'
import MovieListScreen from '@/screens/MovieListScreen'
import MovieDetailsScreen from '@/screens/MovieDetailsScreen'
import {
  SCREEN_NAMES,
  NAVIGATION_CONFIG,
  COLORS,
  FONT_WEIGHTS,
  STRINGS,
} from '@/constants'

const Stack = createStackNavigator<RootStackParamList>()

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={SCREEN_NAMES.MovieList}
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.textWhite,
          headerTitleStyle: {
            fontWeight: FONT_WEIGHTS.bold,
          },
          headerBackTitle: NAVIGATION_CONFIG.headerBackTitle,
          gestureEnabled: NAVIGATION_CONFIG.gestureEnabled,
        }}
      >
        <Stack.Screen
          name={SCREEN_NAMES.MovieList}
          component={MovieListScreen}
          options={{
            headerShown: NAVIGATION_CONFIG.screens.movieList.headerShown,
          }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.MovieDetails}
          component={MovieDetailsScreen}
          options={({ route }) => ({
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
            headerTintColor: COLORS.textWhite,
            title: route.params?.movie?.title || STRINGS.movies.movieDetails,
            headerBackTitle: NAVIGATION_CONFIG.headerBackTitle,
            headerShown: NAVIGATION_CONFIG.screens.movieDetails.headerShown,
            gestureEnabled:
              NAVIGATION_CONFIG.screens.movieDetails.gestureEnabled,
            headerBackTitleVisible: false, // Clean iOS back button
            headerTruncatedBackTitle: STRINGS.actions.back,
            headerLeft: undefined, // Ensure default back button is used
            headerBackAccessibilityLabel: STRINGS.accessibility.backButton,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
