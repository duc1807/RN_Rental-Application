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
    onOk && onOk()
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
              <Text style={{textAlign: 'center'}}>{content}</Text>
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
    textAlign: 'center'
  },
  modalButtonContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 15,
    width: '100%',
    justifyContent: 'center',
    justifyContent: 'center',
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
    backgroundColor: 'red',
  },
  buttonCancel: {
    marginRight: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#bababa'
  },
  button: {
    width: 100,
    height: 38,
    borderRadius: 100,
    padding: 10,
    elevation: 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
})

export default ConfirmModal
