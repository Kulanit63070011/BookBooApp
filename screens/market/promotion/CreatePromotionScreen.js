import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../../../backend/firebase';

const CreatePromotionScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createPromotion = async () => {
    try {
      if (!title || !description) {
        console.error('Please enter all required information');
        return;
      }

      const promotionData = {
        title: title,
        description: description,
      };

      // Generate a unique ID for the promotion document
      const promotionRef = doc(collection(db, 'promotions'));

      await setDoc(promotionRef, promotionData);

      console.log('Promotion created successfully:', promotionData);

      setTitle('');
      setDescription('');
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