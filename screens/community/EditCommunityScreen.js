import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../backend/firebase';

const EditCommunityScreen = ({ route, navigation }) => {
  const { communityDetails } = route.params;
  const [updatedDetails, setUpdatedDetails] = useState({
    name: communityDetails?.name || '',
    description: communityDetails?.description || '',
    category: communityDetails?.type || '',
    coverImage: communityDetails?.imageCommu || '',
  });

  const handleInputChange = (property, value) => {
    setUpdatedDetails({
      ...updatedDetails,
      [property]: value,
    });
  };

  // Function to pick image from the gallery
  const pickImage = async () => {
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
      setUpdatedDetails({ ...updatedDetails, coverImage: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    try {
      const communityRef = doc(db, 'communities', communityDetails.communityId);

      // Upload new image if changed
      let updatedImageUrl = updatedDetails.coverImage;
      if (updatedDetails.coverImage !== communityDetails.imageCommu) {
        const response = await fetch(updatedDetails.coverImage);
        const blob = await response.blob();
        const storageRef = ref(storage, `communityImages/${updatedDetails.name}`);
        await uploadBytes(storageRef, blob);
        updatedImageUrl = await getDownloadURL(storageRef);
      }

      // Update community details in Firestore
      await updateDoc(communityRef, {
        name: updatedDetails.name,
        description: updatedDetails.description,
        type: updatedDetails.category,  // Keeping the category unchanged
        imageCommu: updatedImageUrl,
      });

      alert('Community updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating community:', error.message);
      alert('Failed to update community. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      const communityRef = doc(db, 'communities', communityDetails.communityId);
      await deleteDoc(communityRef);
      alert('Community deleted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting community:', error.message);
      alert('Failed to delete community. Please try again.');
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Community',
      'Are you sure you want to delete this community?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: handleDelete },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Community</Text>

      {/* Community Name Input */}
      <Text style={styles.label}>Community Name</Text>
      <TextInput
        style={styles.input}
        value={updatedDetails.name}
        onChangeText={(text) => handleInputChange('name', text)}
        placeholder="Community Name"
      />

      {/* Description Input */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={updatedDetails.description}
        onChangeText={(text) => handleInputChange('description', text)}
        placeholder="Description"
      />

      {/* Category Display (non-editable) */}
      <Text style={styles.label}>Category</Text>
      <View style={[styles.input, styles.readOnly]}>
        <Text style={styles.textInputText}>{updatedDetails.category}</Text>
      </View>

      {/* Pick Cover Image */}
      <Pressable onPress={pickImage} style={styles.imagePicker}>
        <Text style={styles.imageText}>Pick a cover image</Text>
      </Pressable>

      {updatedDetails.coverImage ? (
        <Image source={{ uri: updatedDetails.coverImage }} style={styles.imagePreview} />
      ) : null}

      {/* Save Button */}
      <Pressable onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>

      {/* Delete Button */}
      <Pressable onPress={confirmDelete} style={styles.deleteButton}>
        <Text style={styles.buttonText}>Delete Community</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  readOnly: {
    backgroundColor: '#f0f0f0',
  },
  textInputText: {
    fontSize: 16,
    color: '#333',
  },
  imagePicker: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  imageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditCommunityScreen;