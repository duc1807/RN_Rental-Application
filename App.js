import React from 'react'
import { StyleSheet } from 'react-native'
import 'react-native-gesture-handler'
import { ToastProvider } from 'react-native-toast-notifications'

//Import Bottom Tab Navigation
import MainStackNavigation from './src/navigation/mainNavigation'

export default function App() {
  return (
    <ToastProvider placement="top" duration={1000} animationType="slide-in">
      <MainStackNavigation />
    </ToastProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
