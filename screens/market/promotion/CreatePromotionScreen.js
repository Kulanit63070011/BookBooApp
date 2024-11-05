import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, Platform } from 'react-native';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../../../backend/firebase';
import * as ImagePicker from 'expo-image-picker';

const CreatePromotionScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const selectImage = async () => {
    console.log("Selecting image..."); // เพิ่มบรรทัดนี้
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log("Result from image library:", result); // เพิ่มบรรทัดนี้
    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };  
  
  const createPromotion = async () => {
    try {
      if (!title || !description) {
        console.error('Please enter all required information');
        return;
      }

      const promotionData = {
        title: title,
        description: description,
        imageUri: imageUri || null,
      };

      const promotionRef = doc(collection(db, 'promotions'));
      await setDoc(promotionRef, promotionData);

      console.log('Promotion created successfully:', promotionData);
      setTitle('');
      setDescription('');
      setImageUri(null);
      alert('Promotion created successfully');
    } catch (error) {
      console.error('Error creating promotion:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Promotion</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Description"
        multiline={true}
        value={description}
        onChangeText={setDescription}
      />
      <Pressable style={styles.imageButton} onPress={selectImage}>
        <Text style={styles.buttonText}>Select Image</Text>
      </Pressable>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
      <Pressable style={styles.createButton} onPress={createPromotion}>
        <Text style={styles.buttonText}>Create Promotion</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  imageButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreatePromotionScreen;
