import React from 'react'
import { Platform } from 'react-native'
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
            ...(Platform.OS === 'ios'
              ? {
                  headerBackTitle: 'Back',
                  headerBackTitleVisible: true,
                  headerBackTitleStyle: {
                    fontSize: 16,
                  },
                }
              : {
                  headerBackTitle: '',
                }),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
