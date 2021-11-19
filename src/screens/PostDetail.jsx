import { Ionicons } from '@expo/vector-icons'
import React, { useCallback, useEffect, useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native'
import 'react-native-gesture-handler'
import ConfirmModal from '../components/modals/ConfirmModal'
import EditModal from '../components/modals/EditModal'
import { getDBConnection } from '../services/dbService'
import { deletePost, getPostById, updatePost } from '../services/postService'
import { Field, Form, Formik } from 'formik'
import { addApartmentValidator } from '../utils/validationSchema'
import { createCategoryTable, getCategory } from '../services/categoryService'
import { Picker } from '@react-native-picker/picker'
import { furnitureTypes } from './HomeScreen'
import SlideupModal from '../components/modals/SlideupModal'
import { ScrollView } from 'react-native-gesture-handler'

const PostDetail = ({ route, navigation }) => {
  const { postId, index } = route.params

  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [editModalShow, setEditModalShow] = useState(false)
  const [pickerModalShow, setPickerModalShow] = useState(false)
  const [selectedType, setSelectedType] = useState()
  const [categories, setCategories] = useState([])
  const [post, setPost] = useState()
  const [selectedFurniture, setSelectedFurniture] = useState()
  const [furnitureModalShow, setFurnitureModalShow] = useState(false)

  const fetchCategories = async () => {
    try {
      const db = await getDBConnection()

      await createCategoryTable(db)

      const _categories = await getCategory(db)

      if (_categories?.length) {
        setCategories(_categories)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchPost = async (id) => {
    const db = await getDBConnection()

    getPostById(db, id).then((resPost) => {
      setPost(resPost)
    })
  }

  useEffect(() => {
    fetchCategories()
    fetchPost(postId)
    setSelectedFurniture(post?.furnitureType || furnitureTypes[0].name)
  }, [])

  useEffect(() => {
    setSelectedType(post?.type || categories?.[0]?.name)
    setSelectedFurniture(post?.furnitureType || furnitureTypes[0].name)
  }, [post])

  const onDeletePost = async () => {
    const db = await getDBConnection()

    try {
      await deletePost(db, post._id)
      navigation.pop()
    } catch (error) {
      console.log('Error: ', error)
    } finally {
      setDeleteModalShow(false)
    }
  }

  const onUpdatePost = async (values) => {
    const newPost = {
      type: categories?.find((item) => item.name === selectedType).name,
      furnitureType: furnitureTypes.find(
        (item) => item.name === selectedFurniture
      ).name,
      ...values,
    }

    try {
      const db = await getDBConnection()
      await updatePost(db, post._id, newPost)
    } catch (err) {
      console.log('ERR: ', err)
    } finally {
      setEditModalShow(false)
      fetchPost(postId)
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: 'https://propsnoop.com/wp-content/uploads/2020/04/72153791_1517564738420381_4152533609095364608_o-1000x624.jpg',
          }}
        />
      </View>
      <View style={styles.apartmentNameContainer}>
        <Text style={styles.apartmentName}>
          Apartment {parseInt(index) + 1}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.apartmentContentContainer}>
          <View style={styles.leftContent}>
            <Text style={[styles.contentText]}>
              Type: {post?.type || 'None'}
            </Text>
            <Text style={[styles.contentText]}>
              Furniture: {post?.furnitureType || 'None'}
            </Text>
            <Text style={[styles.contentText]}>
              Created at: {post?.createdAt || 'None'}
            </Text>
          </View>

          <View style={styles.rightContent}>
            <View style={styles.infoWithIconContainer}>
              <Ionicons
                style={styles.icon}
                name="bed-outline"
                size={16}
                color="black"
              />
              <Text style={styles.contentText}>{post?.bedroom}</Text>
            </View>
            <View style={styles.infoWithIconContainer}>
              <Ionicons
                style={styles.icon}
                name="pricetags-outline"
                size={16}
                color="black"
              />
              <Text style={styles.contentText}>{post?.rentPrice} $</Text>
            </View>
            <View style={styles.infoWithIconContainer}>
              <Ionicons
                style={styles.icon}
                name="person"
                size={16}
                color="black"
              />
              <Text style={styles.contentText}>{post?.reporter}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.notesContainer}>
        <Text style={{ marginTop: 15, fontWeight: '600', fontSize: 17 }}>
          Notes
        </Text>
        <SafeAreaView style={{ height: 120 }}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.notesArea}>{post?.notes || 'None'}</Text>
          </ScrollView>
        </SafeAreaView>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditModalShow(true)}
        >
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setDeleteModalShow(true)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <ConfirmModal
        isShow={deleteModalShow}
        setShow={setDeleteModalShow}
        title="Delete post"
        content={`Do you want to delete this post?`}
        onOk={onDeletePost}
      />

      <EditModal
        isShow={editModalShow}
        setShow={setEditModalShow}
        title={'Edit apartment info'}
        post={post}
        modalContentStyle={styles.modalContent}
      >
        <Formik
          validationSchema={addApartmentValidator}
          initialValues={{
            createdAt: post?.createdAt || '',
            bedroom: post?.bedroom || 1,
            rentPrice: post?.rentPrice || 1,
            notes: post?.notes || '',
            reporter: post?.reporter,
          }}
          onSubmit={(values, { resetForm }) => {
            onUpdatePost(values)
            resetForm()
          }}
          on
        >
          {({
            handleChange,
            handleBlur,
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
                    {selectedType}
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
                      onBlur={handleBlur('bedroom')}
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
                        // onBlur={handleBlur('password')}
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
                        (item) =>
                          item.name ===
                          (selectedFurniture || post.furnitureType)
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
                  // onBlur={handleBlur('password')}
                  value={values.notes}
                />

                <Text style={[styles.label, { marginTop: 5 }]}>Reporter</Text>
                <TextInput
                  name="reporter"
                  placeholder="Reportner name"
                  style={styles.textInput}
                  onChangeText={handleChange('reporter')}
                  // onBlur={handleBlur('password')}
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
                    setEditModalShow(false)
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
                  <Text style={styles.textStyle}>Update</Text>
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
                      value={item.name}
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
      </EditModal>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
  },
  imageContainer: {
    flex: 3,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    marginTop: 10,
  },
  notesArea: {
    width: '100%',
    flex: 1,
    flexWrap: 'wrap',
  },
  editButton: {
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'lightgrey',
    width: 120,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 100,
    padding: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'lightgrey',
    width: 120,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  apartmentName: {
    fontSize: 18,
    fontWeight: '700',
  },
  apartmentNameContainer: {
    flex: 0.8,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
  },
  contentContainer: {
    flex: 2,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  apartmentContentContainer: {
    flex: 6,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  notesContainer: {
    flex: 3.2,
    paddingHorizontal: 15,
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  buttonContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  leftContent: {
    flex: 0.65,
    height: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  rightContent: {
    flex: 0.35,
    height: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  contentText: {
    fontSize: 14,
  },
  icon: {
    marginRight: 10,
  },
  infoWithIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** Modal styles */
  label: {
    fontSize: 11,
    marginBottom: -10,
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
  inputArea: {
    flex: 9.8,
  },
  prefix: {
    flex: 0.2,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    color: '#919191',
  },
  modalButtonContainer: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  buttonSave: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6e5096',
  },
  buttonCancel: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#bababa',
  },
  button: {
    width: 120,
    height: 40,
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export default PostDetail
