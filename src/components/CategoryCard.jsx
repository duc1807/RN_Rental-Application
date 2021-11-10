import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import {
  Text,
  View,
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import 'react-native-gesture-handler'
import { TextInput } from 'react-native-gesture-handler'
import Toast from 'react-native-toast-notifications'

import {
  deleteCategory,
  getCategoryByName,
  updateCategory,
} from '../services/categoryService'
import { getDBConnection } from '../services/dbService'
import ConfirmModal from './modals/ConfirmModal'
import PopupModal from './modals/PopupModal'

const CategoryCard = ({ category, loadDataCallback }) => {
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [editModalShow, setEditModalShow] = useState(false)
  const [categoryName, setCategoryName] = useState(category.name || '')

  const toastRef = useRef()

  const onDeleteCategory = async () => {
    try {
      const db = await getDBConnection()
      await deleteCategory(db, category._id)
    } catch (error) {
      console.error(error)
    } finally {
      setDeleteModalShow(false)
      loadDataCallback()
    }
  }

  const onInputChange = (value) => {
    setCategoryName(value)
  }

  const onUpdateCategory = async () => {
    const db = await getDBConnection()

    const duplicatedCategory = await getCategoryByName(db, categoryName)
    if (duplicatedCategory?.length) {
      toastRef.current.show('This category has existed.', {
        type: 'danger',
        placement: 'top',
      })
      return
    }

    try {
      await updateCategory(db, category._id, categoryName)
    } catch (error) {
      console.error(error)
    } finally {
      setEditModalShow(false)
      loadDataCallback()
    }
  }

  return (
    <View style={styles.categoryCard}>
      <View style={styles.cardLeft}>
        <Text style={styles.categoryName}>{category?.name}</Text>
      </View>
      <View style={styles.cardRight}>
        <TouchableOpacity onPress={() => setEditModalShow(true)}>
          <Ionicons name="md-pencil-sharp" size={24} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDeleteModalShow(true)}>
          <Ionicons name="ios-trash-sharp" size={24} color="red" />
        </TouchableOpacity>
      </View>

      <ConfirmModal
        isShow={deleteModalShow}
        setShow={setDeleteModalShow}
        title="Delete category"
        content={`Do you want to delete property ${category?.name}?`}
        onOk={onDeleteCategory}
      />

      <PopupModal
        isShow={editModalShow}
        setShow={setEditModalShow}
        title="Edit category"
      >
        <Toast style={{ zIndex: 100 }} ref={toastRef} />
        <View style={styles.editModalContent}>
          <View style={styles.editTextContainer}>
            <TextInput
              style={styles.textInput}
              value={categoryName}
              onChangeText={onInputChange}
            ></TextInput>
          </View>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={() => setEditModalShow(false)}
            >
              <Text style={(styles.textStyle, { color: 'black' })}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonUpdate]}
              onPress={() => onUpdateCategory()}
            >
              <Text style={styles.textStyle}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </PopupModal>
    </View>
  )
}

const styles = StyleSheet.create({
  categoryCard: {
    width: '100%',
    borderRadius: 4,
    height: 80,
    backgroundColor: 'white',
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 10,
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  cardLeft: {
    flex: 7,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardRight: {
    flex: 3,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  editModalContent: {
    height: 120,
    display: 'flex',
  },
  editTextContainer: {
    flex: 2,
  },
  modalButtonContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonUpdate: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    backgroundColor: 'blue',
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
  textInput: {
    height: 40,
    marginTop: 12,
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    borderColor: '#d6d6d6',
  },
})

export default CategoryCard
