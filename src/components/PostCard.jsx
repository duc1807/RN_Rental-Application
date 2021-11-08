import { Ionicons } from '@expo/vector-icons'
import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

const PostCard = ({ post, index, navigation }) => {
  const onPress = () => {
    navigation.navigate('PostDetail', {
      postId: post._id,
      index: index,
    })
  }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.postCard}>
      <View style={styles.leftContainer}>
        <Image
          style={styles.image}
          source={{
            uri: 'https://www.xlcncm.com/images/products/vertical-honing.jpg',
          }}
        />
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.apartmentNameContainer}>
          <Text style={styles.apartmentName}>Apartment {index + 1}</Text>
        </View>
        <View style={styles.apartmentContentContainer}>
          <View style={styles.leftContent}>
            <Text style={[styles.contentText]}>
              Type: {post.type || 'None'}
            </Text>
            <Text style={[styles.contentText]}>
              Furniture: {post.furnitureType || 'None'}
            </Text>
            <Text style={[styles.contentText]}>
              Created at: {post.createdAt || 'None'}
            </Text>
          </View>

          <View style={styles.rightContent}>
            <View style={styles.infoWithIconContainer}>
              <Ionicons
                style={styles.icon}
                name="ios-bed"
                size={16}
                color="black"
              />
              <Text style={styles.contentText}>{post.bedroom}</Text>
            </View>
            <View style={styles.infoWithIconContainer}>
              <Ionicons
                style={styles.icon}
                name="pricetags-outline"
                size={16}
                color="black"
              />
              <Text style={styles.contentText}>{post.rentPrice} $</Text>
            </View>
            <View style={styles.infoWithIconContainer}>
              <Ionicons
                style={styles.icon}
                name="person"
                size={16}
                color="black"
              />
              <Text style={styles.contentText}>{post.reporter}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  postCard: {
    width: '100%',
    borderRadius: 4,
    height: 120,
    marginTop: 10,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  leftContainer: {
    flex: 3,
    height: '100%',
    marginRight: 10,
  },
  rightContainer: {
    flex: 7,
    height: '100%',
    display: 'flex',
  },
  infoWithIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  apartmentNameContainer: {
    flex: 2.5,
    width: '100%',
  },
  apartmentName: {
    fontSize: 17,
    fontWeight: '600',
  },
  apartmentContentContainer: {
    flex: 7.5,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  leftContent: {
    flex: 0.7,
    height: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  rightContent: {
    flex: 0.3,
    height: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  contentText: {
    fontSize: 12,
  },
  icon: {
    marginRight: 10,
  },
})

export default PostCard
