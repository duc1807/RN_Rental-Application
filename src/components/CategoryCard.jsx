import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
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
  const successToast = useRef()

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

  const resetForm = () => {
    setEditModalShow(false)
    setCategoryName(category.name)
  }

  const onUpdateCategory = async () => {
    if (categoryName === category.name) {
      setEditModalShow(false)
      return
    }

    const db = await getDBConnection()

    const duplicatedCategory = await getCategoryByName(db, categoryName)
    if (duplicatedCategory.length) {
      toastRef.current.show('This category has existed', {
        type: 'danger',
        placement: 'top',
      })
      return
    }

    try {
      await updateCategory(db, category._id, categoryName)
      successToast.current.show('Category updated successful', {
        type: 'success',
        placement: 'top',
      })
    } catch (error) {
      console.error(error)
    } finally {
      setEditModalShow(false)
      loadDataCallback()
    }
  }

  return (
    <View style={styles.categoryCard}>
      <Toast
          style={{ zIndex: 100, position: 'absolute', top: -200 }}
          ref={successToast}
        />
      <View style={styles.cardLeft}>
        <Text style={styles.categoryName} numberOfLines={1}>
          {category?.name}
        </Text>
      </View>
      <View style={styles.cardRight}>
        <TouchableOpacity onPress={() => setEditModalShow(true)}>
          <MaterialCommunityIcons name="pencil" size={25} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDeleteModalShow(true)}>
          <Ionicons name="ios-trash-sharp" size={25} color="red" />
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
        <Toast
          style={{ zIndex: 100, position: 'absolute', top: -200 }}
          ref={toastRef}
        />
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
              onPress={() => resetForm()}
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
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  cardLeft: {
    flex: 7,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    width: '94%',
  },
  cardRight: {
    flex: 3,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingRight: 10,
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
    backgroundColor: '#6e5096',
  },
  buttonCancel: {
    marginRight: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#bababa',
  },
  button: {
    width: 90,
    borderRadius: 100,
    padding: 10,
    elevation: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
