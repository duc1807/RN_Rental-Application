import React, { useCallback, useEffect, useState } from 'react'
import {
  Text,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import 'react-native-gesture-handler'
import { SearchBar } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
import { Field, Form, Formik } from 'formik'
import { FlatList, TextInput } from 'react-native-gesture-handler'
import { addApartmentValidator } from '../utils/validationSchema'
import { Picker } from '@react-native-picker/picker'
import { getDBConnection } from '../services/dbService'
import { createCategoryTable, getCategory } from '../services/categoryService'
import {
  createPostTable,
  deletePostTable,
  getPost,
  savePost,
} from '../services/postService'
import PostCard from '../components/PostCard'
import { useIsFocused } from '@react-navigation/native'
import PopupModal from '../components/modals/PopupModal'
import SlideupModal from '../components/modals/SlideupModal'

export const furnitureTypes = [
  {
    name: 'Furnished',
  },
  {
    name: 'Unfurnished',
  },
  {
    name: 'Part Furnished',
  },
]

const HomeScreen = ({ navigation }) => {
  const [addModalShow, setAddModalShow] = useState(false)
  const [pickerModalShow, setPickerModalShow] = useState(false)
  const [furnitureModalShow, setFurnitureModalShow] = useState(false)
  const [searchKey, setSearchKey] = useState('')
  const [selectedType, setSelectedType] = useState()
  const [selectedFurniture, setSelectedFurniture] = useState()
  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])
  const [filteredPost, setFilteredPost] = useState([])

  const isFocused = useIsFocused()

  const loadDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection()

      // await deletePostTable(db)

      await createPostTable(db)

      const _posts = await getPost(db)
      console.log("Response: ", _posts);
      if (_posts?.length) {
        
        setPosts(_posts)
        setFilteredPost(_posts)
      } else {
        setPosts([])
        setFilteredPost([])
      }
    } catch (error) {
      console.error(error)
    }
  }, [])

  const fetchData = async () => {
    try {
      const db = await getDBConnection()

      await createCategoryTable(db)

      const _categories = await getCategory(db)

      if (_categories?.length) {
        setCategories(_categories)
        setSelectedType(_categories[0]._id)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (isFocused) {
      fetchData()
      loadDataCallback()
      setSearchKey('')
      setSelectedFurniture(furnitureTypes[0].name)
    }
  }, [isFocused])

  useEffect(() => {
    if (!searchKey) {
      setFilteredPost(posts)
    }
    const newPosts = posts.filter((item) => item.type.includes(searchKey))
    setFilteredPost(newPosts)
  }, [searchKey])

  const onChangeSearch = (search) => {
    setSearchKey(search)
  }

  const showModal = () => {
    setAddModalShow(true)
  }

  const onAddPost = async (values, resetForm) => {
    const newPost = {
      type: categories.find((item) => item._id === selectedType).name,
      furnitureType: furnitureTypes.find(
        (item) => item.name === selectedFurniture
      ).name,
      ...values,
    }
    try {
      const db = await getDBConnection()
      const addedPost = await savePost(db, newPost)
      resetForm()
      navigation.navigate('PostDetail', {
        postId: addedPost.insertId,
        index: addedPost.insertId,
      })
    } catch (err) {
      throw new Error("Error when add new post")
    } finally {
      loadDataCallback()
      setAddModalShow(false)
    }
  }

  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <PopupModal
        isShow={addModalShow}
        setShow={setAddModalShow}
        modalContentStyle={styles.modalContent}
        title="Add new apartment for rent"
      >
        <Formik
          validationSchema={addApartmentValidator}
          initialValues={{
            createdAt: '',
            bedroom: 1,
            rentPrice: 1,
            notes: '',
            reporter: '',
          }}
          onSubmit={(values, { resetForm }) => {
            onAddPost(values, resetForm)
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
                <TouchableOpacity onPress={() => setPickerModalShow(true)}>
                  <Text style={styles.label}>Apartment type</Text>
                  <Text
                    disabled
                    name="type"
                    placeholder="Apartment type"
                    style={styles.textInput}
                  >
                    {categories.find((item) => item._id === selectedType)?.name}
                  </Text>
                </TouchableOpacity>

                <View style={styles.groupInputContainer}>
                  <View style={styles.leftGroupContainer}>
                    <Text style={styles.label}>Bedrooms</Text>
                    <TextInput
                      type="number"
                      name="bedroom"
                      placeholder="Bedroom"
                      maxLength={2}
                      style={[styles.textInput]}
                      onChangeText={handleChange('bedroom')}
                      value={values.bedroom.toString()}
                    />
                    {errors.bedroom && (
                      <Text style={{ fontSize: 10, color: 'red' }}>
                        {errors.bedroom}
                      </Text>
                    )}
                  </View>

                  <View style={styles.rightGroupContainer}>
                    <Text style={styles.label}>Rent price</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        name="rentPrice"
                        type="number"
                        maxLength={8}
                        placeholder="Rent price"
                        style={styles.inputArea}
                        onChangeText={handleChange('rentPrice')}
                        value={values.rentPrice.toString()}
                      />
                      <Text style={styles.prefix}>$</Text>
                    </View>
                    {errors.rentPrice && (
                      <Text style={{ fontSize: 10, color: 'red' }}>
                        {errors.rentPrice}
                      </Text>
                    )}
                  </View>
                </View>

                <TouchableOpacity onPress={() => setFurnitureModalShow(true)}>
                  <Text style={[styles.label, { marginTop: 5 }]}>
                    Furniture
                  </Text>
                  <Text
                    disabled
                    name="type"
                    placeholder="Furniture type"
                    style={styles.textInput}
                  >
                    {
                      furnitureTypes.find(
                        (item) => item.name === selectedFurniture
                      ).name
                    }
                  </Text>
                </TouchableOpacity>

                <Text style={[styles.label, { marginTop: 5 }]}>Created at</Text>
                <TextInput
                  name="notes"
                  placeholder="DD-MM-YYYY"
                  style={styles.textInput}
                  onChangeText={handleChange('createdAt')}
                  value={values.createdAt}
                />
                {errors.createdAt && (
                  <Text style={{ fontSize: 10, color: 'red' }}>
                    {errors.createdAt}
                  </Text>
                )}

                <Text style={[styles.label, { marginTop: 5 }]}>Notes</Text>
                <TextInput
                  name="notes"
                  placeholder="Notes"
                  style={styles.textInput}
                  onChangeText={handleChange('notes')}
                  value={values.notes}
                />

                <Text style={[styles.label, { marginTop: 5 }]}>Reporter</Text>
                <TextInput
                  name="reporter"
                  placeholder="Reportner name"
                  style={styles.textInput}
                  onChangeText={handleChange('reporter')}
                  value={values.reporter}
                />
                {errors.reporter && (
                  <Text style={{ fontSize: 10, color: 'red' }}>
                    {errors.reporter}
                  </Text>
                )}
              </View>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => {
                    setAddModalShow(false)
                    resetForm()
                  }}
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

              <SlideupModal
                isShow={pickerModalShow}
                setShow={setPickerModalShow}
                title={'Select apartment type'}
              >
                <Picker
                  selectedValue={selectedType}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedType(itemValue)
                  }
                >
                  {categories.map((item, index) => (
                    <Picker.Item
                      key={index}
                      label={item.name}
                      value={item._id}
                    />
                  ))}
                </Picker>
              </SlideupModal>

              {/** Select furniture */}
              <SlideupModal
                isShow={furnitureModalShow}
                setShow={setFurnitureModalShow}
                title={'Select furniture type'}
              >
                <Picker
                  selectedValue={selectedFurniture}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedFurniture(itemValue)
                  }
                >
                  {furnitureTypes.map((item, index) => (
                    <Picker.Item
                      key={index}
                      label={item.name}
                      value={item.name}
                    />
                  ))}
                </Picker>
              </SlideupModal>
            </>
          )}
        </Formik>
      </PopupModal>

      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <SearchBar
            containerStyle={{ backgroundColor: 'white' }}
            inputContainerStyle={{ backgroundColor: '#f0f0f0' }}
            lightTheme="true"
            placeholder="Type Here..."
            onChangeText={onChangeSearch}
            value={searchKey}
          />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={() => showModal()}
          >
            <Ionicons name="add-sharp" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <SafeAreaView style={styles.content}>
          <FlatList
            data={filteredPost}
            renderItem={({ item, index }) => (
              <PostCard
                loadDataCallback={loadDataCallback}
                post={item}
                index={index}
                navigation={navigation}
              />
            )}
            keyExtractor={(item) => item._id}
          />
        </SafeAreaView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  headerContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'green',
  },
  headerLeft: {
    flex: 4,
    display: 'flex',
    justifyContent: 'center',
  },
  headerRight: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    flex: 8,
    paddingHorizontal: 10,
  },
  content: {
    height: '100%',
  },
  modalContent: {
    width: '100%',
  },
  addButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#1c6efc',
  },
  buttonSave: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    backgroundColor: '#1c6efc',
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
  modalButtonContainer: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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
  inputContainer: {
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    height: 40,
    padding: 10,
    marginTop: 12,
    marginBottom: 5,
    borderColor: '#d6d6d6',
  },
  inputArea: {
    flex: 9.8,
  },
  prefix: {
    flex: 0.2,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    color: '#919191',
  },
  groupInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
  },
  leftGroupContainer: {
    flex: 4,
    marginRight: 10,
  },
  rightGroupContainer: {
    flex: 6,
  },
  label: {
    fontSize: 11,
    marginBottom: -10,
  },
})

export default HomeScreen
