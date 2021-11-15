import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'
import React, { useRef, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native'
import { loginValidator } from '../utils/validationSchema'
import Toast from 'react-native-toast-notifications'

const LoginScreen = ({ navigation }) => {
  const toastRef = useRef()

  const onLogin = (values, resetForm) => {
    const { username, password } = values

    if (username === 'admin' && password === 'Admin123') {
      navigation.navigate('Homepage')
      resetForm()
    } else {
      toastRef.current.show('Username or password is incorrect', {
        type: 'danger',
        placement: 'top',
      })
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.applicationNameContainer}>
        <Text style={styles.applicationName}>RentalZ</Text>
      </View>

      <Toast style={{ zIndex: 100, marginTop: 30 }} ref={toastRef} />

      <StatusBar style="auto" />

      <Formik
        validationSchema={loginValidator}
        initialValues={{
          username: '',
          password: '',
        }}
        onSubmit={(values, { resetForm }) => {
          onLogin(values, resetForm)
        }}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          isValid,
          resetForm,
        }) => (
          <>
            <View>
              <Text style={[styles.label, { marginTop: 5 }]}>Username</Text>
              <TextInput
                name="username"
                placeholder="Username"
                style={styles.textInput}
                onChangeText={handleChange('username')}
                value={values.username}
              />
              {errors.username && (
                <Text style={{ fontSize: 10, color: 'red' }}>
                  {errors.username}
                </Text>
              )}

              <Text style={[styles.label, { marginTop: 5 }]}>Password</Text>
              <TextInput
                name="password"
                type
                placeholder="Password"
                style={styles.textInput}
                secureTextEntry={true}
                onChangeText={handleChange('password')}
                value={values.password}
              />
              {errors.password && (
                <Text style={{ fontSize: 10, color: 'red' }}>
                  {errors.password}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    height: 40,
    marginTop: 12,
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    width: 240,
    borderColor: '#d6d6d6',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: -10,
  },
  applicationNameContainer: {
    width: '100%',
    height: '20%',
    marginTop: -100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  applicationName: {
    fontSize: 34,
    fontFamily: 'PingFangTC-Regular',
    fontWeight: '700',
    color: '#6e5096',
    marginBottom: 60,
  },
  loginBtn: {
    width: 240,
    borderRadius: 25,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#6e5096',
  },
  loginText: {
    color: 'white',
  },
})
