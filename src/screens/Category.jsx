import { Ionicons } from '@expo/vector-icons'
import { Formik } from 'formik'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import 'react-native-gesture-handler'
import {
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler'
import { deleteDatabase } from 'react-native-sqlite-storage'
import CategoryCard from '../components/CategoryCard'
import {
  createCategoryTable,
  deleteTable,
  getCategory,
  getCategoryByName,
  saveCategory,
} from '../services/categoryService'
import {
  addCategoryValidator,
  loginValidationSchema,
} from '../utils/validationSchema'
import { v4 as uuid } from 'uuid'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getDBConnection } from '../services/dbService'
import Toast from 'react-native-toast-notifications'
import PopupModal from '../components/modals/PopupModal'

const Category = ({ navigation }) => {
  const [addModalShow, setAddModalShow] = useState(false)
  const [categories, setCategories] = useState([])
  const [errorMsg, setErrorMsg] = useState('')

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => setAddModalShow(true)}
        >
          <Text style={{ fontWeight: '600', fontSize: 15 , color: '#507fde'}}>Add</Text>
        </TouchableOpacity>
      ),
    })
  }, [navigation])

  const toastRef = useRef()

  const loadDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection()

      // deleteCategoryTable(db)

      await createCategoryTable(db)

      const storedTodoItems = await getCategory(db)

      if (storedTodoItems?.length) {
        setCategories(storedTodoItems)
      } else {
        // const newCategory = await saveCategory(db, initCategory)
        setCategories([])
      }
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    loadDataCallback()
  }, [loadDataCallback])

  const renderItem = ({ item }) => (
    <CategoryCard category={item} loadDataCallback={loadDataCallback} />
  )

  const onSaveCategory = async (values) => {
    const db = await getDBConnection()

    const duplicatedCategory = await getCategoryByName(db, values.name)
    if (duplicatedCategory?.length) {
      toastRef.current.show('This category has existed', {
        type: 'danger',
        placement: 'top',
      })
      setErrorMsg('This category has existed.')
      return
    }
    try {
      await saveCategory(db, values)
    } catch (error) {
      console.log('Error: ', error)
    } finally {
      loadDataCallback()
      setAddModalShow(false)
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <PopupModal
        isShow={addModalShow}
        setShow={setAddModalShow}
        modalContentStyle={styles.modalContent}
        title="Add new property type"
      >
        <Formik
          validationSchema={addCategoryValidator}
          initialValues={{
            name: '',
          }}
          onSubmit={(values) => onSaveCategory(values)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            isValid,
          }) => (
            <>
              <View>
                <TextInput
                  name="name"
                  placeholder="Category name"
                  style={styles.textInput}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                {errors.name && (
                  <Text style={{ fontSize: 10, color: 'red' }}>
                    {errors.name}
                  </Text>
                )}
              </View>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => setAddModalShow(false)}
                >
                  <Text style={(styles.textStyle, { color: 'black' })}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonSave]}
                  onPress={handleSubmit}
                  disabled={!isValid}
                >
                  <Text style={styles.textStyle}>Add</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>

        <Toast style={{ zIndex: 100, position: 'absolute', top: -200 }} ref={toastRef} />
      </PopupModal>

      <SafeAreaView style={styles.content}>
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      </SafeAreaView>

      {/** Action button */}
      {/* <View style={{ position: 'absolute', bottom: 15, right: 20 }}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddModalShow(true)}
        >
          <Ionicons name="add-sharp" size={26} color="white" />
        </TouchableOpacity>
      </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    width: '100%',
  },
  content: {
    height: '100%',
    width: '100%',
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    height: 55,
    backgroundColor: '#1c6efc',
  },
  addButton: {
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    height: 55,
    backgroundColor: '#1c6efc',
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
  modalButtonContainer: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSave: {
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
    height: 38,
    borderRadius: 100,
    padding: 10,
    elevation: 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: '600',
  },
})

export default Category
