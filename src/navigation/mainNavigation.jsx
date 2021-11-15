import React from 'react'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

//Import screens
import BotTabNavigation from './BotTabNavigation'
import LoginScreen from '../screens/Login'

const HomeStack = createStackNavigator()

const MainStackNavigation = () => {
  return (
    <NavigationContainer>
      <HomeStack.Navigator initialRouteName={"Login"}>
        <HomeStack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <HomeStack.Screen
          options={{ headerShown: false }}
          name="Homepage"
          component={BotTabNavigation}
        />
      </HomeStack.Navigator>
    </NavigationContainer>
  )
}

export default MainStackNavigation
