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
} from 'react-native'

const ConfirmModal = ({ isShow, setShow, content, onOk, okCancel, title }) => {
  const handleOnDelete = () => {
    onOk()
    setShow(false)
  }

  return (
    <View style={(styles.centeredView, { zIndex: 0 })}>
      <Modal
        animationType="slide"
        transparent={true}
        animationType="fade"
        visible={isShow}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.header}>
              <Text style={styles.modalTitle}>{title}</Text>
            </View>

            <View style={styles.modalContent}>
              <Text>{content}</Text>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setShow(false)}
              >
                <Text style={(styles.textStyle, { color: 'black' })}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSave]}
                onPress={() => handleOnDelete()}
              >
                <Text style={styles.textStyle}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    paddingBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: '80%',
    height: '30%',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContentContainer: {},
  modalContent: {
    flex: 1,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: 40,
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
  buttonSave: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    backgroundColor: 'red',
  },
  buttonCancel: {
    width: 70,
    marginRight: 10,
    backgroundColor: '#cccac6',
  },
  button: {
    borderRadius: 100,
    padding: 10,
    elevation: 2,
  },
})

export default ConfirmModal
