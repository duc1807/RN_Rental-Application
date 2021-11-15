import React from 'react'
import 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'

//Import screens
import HomeScreen from '../screens/HomeScreen'
import Category from '../screens/Category'
import PostDetail from '../screens/PostDetail'

const Tab = createBottomTabNavigator()
const HomeStack = createStackNavigator()

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="PostDetail" component={PostDetail} />
    </HomeStack.Navigator>
  )
}

const BotTabNavigation = () => {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName

            if (route.name === 'HomeScreen') {
              iconName = 'home'
            } else if (route.name === 'All') {
              iconName = 'md-add-circle'
            } else if (route.name === 'Category') {
              iconName = 'list-outline'
            }
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />
          },
        })}
      >
        <Tab.Screen
          options={{ headerShown: false }}
          name="HomeScreen"
          component={HomeStackScreen}
        />
        <Tab.Screen name="Category" component={Category} />
      </Tab.Navigator>
  )
}

export default BotTabNavigation
