import React, { useState } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, Pressable, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Get device screen dimensions
const { width, height } = Dimensions.get('window');

const CreatePostCommunityModal = ({ visible, onClose, onCreatePost }) => {
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [postTitle, setPostTitle] = useState('');
  const scaleAnim = new Animated.Value(1);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPostImage(result.assets[0].uri);
    }
  };

  const handleCreatePost = async () => {
    const storage = getStorage(); // Initialize Firebase Storage
    let imageUrl = null;

    if (postImage) {
      try {
        const response = await fetch(postImage); // Fetch the image file
        const blob = await response.blob(); // Convert it to a Blob

        const storageRef = ref(storage, `posts/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.jpg`);
        await uploadBytes(storageRef, blob); // Upload the Blob to Firebase Storage

        // Get the URL of the uploaded image
        imageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error('Error uploading image:', error.message);
        alert('Failed to upload image. Please try again.');
        return;
      }
    }

    const newPost = {
      title: postTitle,
      content: postText,
      createdBy: 'user_id_here',
      createdByName: 'user_name_here',
      createdDate: new Date(),
      likes: 0,
      dislikes: 0,
      postImage: imageUrl, // Save the image URL if available
    };

    console.log('New Post:', newPost);
    onCreatePost(newPost);
    setPostText('');
    setPostImage(null);
    setPostTitle('');
    onClose();
  };

  const onClosePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.8,
      useNativeDriver: true,
    }).start();
  };

  const onClosePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      {/* Close Modal by clicking outside */}
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          {/* Prevent propagation of touch events to the overlay */}
          <Pressable style={{ flex: 1 }} onPress={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                onPress={onClose}
                onPressIn={onClosePressIn}
                onPressOut={onClosePressOut}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </Animated.View>

            <Text style={styles.heading}>Create a New Post</Text>

            <TextInput
              style={styles.postInput}
              placeholder="Post Title"
              value={postTitle}
              onChangeText={(text) => setPostTitle(text)}
              placeholderTextColor="#aaa"
            />

            <TextInput
              style={[styles.postInput, { height: 120 }]} // Adjust for multiline content input
              multiline
              placeholder="Type your post here..."
              value={postText}
              onChangeText={(text) => setPostText(text)}
              placeholderTextColor="#aaa"
            />

            {/* Image Picker Section */}
            <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
              {postImage ? (
                <Image source={{ uri: postImage }} style={styles.image} />
              ) : (
                <Text style={styles.imagePlaceholder}>Tap to select an image (Optional)</Text>
              )}
            </TouchableOpacity>

            <Pressable style={styles.button} onPress={handleCreatePost}>
              <Text style={styles.buttonText}>Post</Text>
            </Pressable>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker shade for better interaction
    zIndex: 999, // Ensure it is on top
    pointerEvents: 'auto', // Allow clicks on the overlay to close the modal
  },
  container: {
    width: '90%',
    maxWidth: 600, // Increase the maximum width for larger devices
    height: '80%', // Adjust height for better use of space
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1000, // Ensure the modal content stays on top
  },
  closeButton: {
    position: 'absolute',
    top: -15,
    right: -15,
    backgroundColor: 'red',
    width: 50,
    height: 50,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001, // Close button always on top
  },
  closeText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  postInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  imagePicker: {
    width: '100%',
    height: 200,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreatePostCommunityModal;