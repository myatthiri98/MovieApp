import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { RootStackParamList } from '../types'
import MovieListScreen from '../screens/MovieListScreen'
import MovieDetailsScreen from '../screens/MovieDetailsScreen'

const Stack = createStackNavigator<RootStackParamList>()

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MovieList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitle: '',
          gestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="MovieList"
          component={MovieListScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MovieDetails"
          component={MovieDetailsScreen}
          options={({ route }) => ({
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            title: route.params?.movie?.title || 'Movie Details',
            headerBackTitle: '',
            headerShown: true,
            gestureEnabled: true,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
