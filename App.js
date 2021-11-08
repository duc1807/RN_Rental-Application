import React from 'react'
import { StyleSheet } from 'react-native'
import 'react-native-gesture-handler'
import { ToastProvider } from 'react-native-toast-notifications'

//Import Bottom Tab Navigation
import BotTabNavigation from './src/navigation/BotTabNavigation'

export default function App() {
  return (
    <ToastProvider placement="top" duration={2000} animationType="slide-in">
      <BotTabNavigation />
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
