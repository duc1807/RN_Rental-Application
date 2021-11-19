import React, { useEffect, useState } from 'react'
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Keyboard,
  ScrollView,
} from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

const EditModal = ({
  isShow,
  setShow,
  children,
  modalContentStyle,
  title,
  post,
}) => {
  return (
    <View style={(styles.centeredView, { zIndex: 0 })}>
      <Modal
        animationType="slide"
        transparent={true}
        animationType="fade"
        visible={isShow}
      >
        <KeyboardAvoidingView
          behavior={'position'}
          keyboardVerticalOffset={-62}
          style={styles.centeredView}
        >
          <ScrollView
            style={styles.scrollView}
            scrollEnabled={false}
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View style={styles.modalView}>
              <View style={styles.header}>
                <Text style={styles.modalTitle}>{title}</Text>
              </View>
              <View style={styles.modalContentContainer}>
                <View style={modalContentStyle}>{children}</View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    overflow: 'hidden',
  },
  scrollView: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 40,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: '100%',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    height: 40,
  },
  modalTitle: {},
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'left',
    fontWeight: '600',
    fontSize: 16,
  },
})

export default EditModal
