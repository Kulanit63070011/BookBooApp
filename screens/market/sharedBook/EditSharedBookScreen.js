import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, Picker, Alert } from 'react-native';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../backend/firebase';

const EditSharedBookScreen = ({ route, navigation }) => {
  const { bookDetails } = route.params;
  const [editedDetailSharedBook, setEditedDetailSharedBook] = useState(bookDetails.detailSharedBook);
  const [selectedCategory, setSelectedCategory] = useState(bookDetails.category);

  const categories = [
    'General novels', 'Romantic novels', 'Fantasy novels', 'Sci-fi novels',
    'Adventure novels', 'Detective novels', 'Horror novels', 'Serial novels',
    'Cartoons & Anime', 'Finance and Investment', 'Market Accounting', 'Psychology', 'Self-Development',
    'Education', 'Language', 'Law', 'Creative Design', 'Politics', 'Computer Science',
    'History', 'Religious Beliefs', 'Pets', 'Health', 'Travel', 'Music and Entertainment',
    'Food', 'Art', 'Others'
  ];

  const saveChanges = async () => {
    try {
      if (!editedDetailSharedBook || !selectedCategory) {
        console.error('Please complete the required fields');
        return;
      }

      const editedBookData = {
        book_id: bookDetails.book_id,
        title: bookDetails.title,
        author: bookDetails.author,
        aboutBook: bookDetails.aboutBook,
        detailSharedBook: editedDetailSharedBook,
        category: selectedCategory,
        ownerSharedBook: bookDetails.ownerSharedBook,
        thumbnail: bookDetails.thumbnail,
      };

      const docRef = doc(db, 'sharedBooks', bookDetails.id);
      await setDoc(docRef, editedBookData);
      console.log('Book details updated successfully:', editedBookData);

      navigation.goBack();
    } catch (error) {
      console.error('Error updating book details:', error.message);
    }
  };

  const deleteBook = async () => {
    try {
      console.log('Deleting book:', bookDetails.id);  // Add this log for debugging
      const docRef = doc(db, 'sharedBooks', bookDetails.id);
      await deleteDoc(docRef);  // Delete the document
      console.log('Book deleted successfully');
      navigation.goBack();  // Go back after deleting
    } catch (error) {
      console.error('Error deleting book:', error.message);
    }
  };


  useEffect(() => {
    setEditedDetailSharedBook(bookDetails.detailSharedBook);
    setSelectedCategory(bookDetails.category);
  }, [bookDetails]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Shared Book</Text>

      <Image source={{ uri: bookDetails.thumbnail }} style={styles.thumbnail} />

      <Text style={styles.text}>Title: {bookDetails.title}</Text>
      <Text style={styles.text}>Author: {bookDetails.author}</Text>
      <Text style={styles.text}>About the Book: {bookDetails.aboutBook}</Text>

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Detail about Shared Book"
        multiline={true}
        value={editedDetailSharedBook}
        onChangeText={setEditedDetailSharedBook}
      />

      <Text style={styles.label}>Select Book Category:</Text>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a category" value="" />
        {categories.map((category, index) => (
          <Picker.Item label={category} value={category} key={index} />
        ))}
      </Picker>

      <Pressable style={styles.saveButton} onPress={saveChanges}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </Pressable>

      <Pressable style={styles.deleteButton} onPress={deleteBook}>
        <Text style={styles.buttonText}>Delete Book</Text>
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
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
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
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  thumbnail: {
    width: 100,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  picker: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
});

export default EditSharedBookScreen;