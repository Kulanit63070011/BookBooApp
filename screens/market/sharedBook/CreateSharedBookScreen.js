import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, Image } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../../backend/firebase';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

const CreateSharedBookScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [status, setStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'General novels', 'Romantic novels', 'Fantasy novels', 'Sci-fi novels',
    'Adventure novels', 'Detective novels', 'Horror novels', 'Serial novels',
    'General cartoons', 'Romantic cartoons', 'Fantasy cartoons', 'Sci-fi cartoons',
    'Adventure cartoons', 'Detective cartoons', 'Horror cartoons', 'Serial cartoons',
    'Finance and Investment', 'Market Accounting', 'Psychology', 'Self-Development',
    'Education', 'Language', 'Law', 'Creative Design', 'Politics', 'Computer Science',
    'History', 'Religious Beliefs', 'Pets', 'Health', 'Travel', 'Music and Entertainment',
    'Food', 'Art', 'Others'
  ];

  // ฟังก์ชันสำหรับการค้นหาหนังสือ
  const searchBooks = async () => {
    try {
      const response = await axios.get(GOOGLE_BOOKS_API_URL, {
        params: { q: searchQuery }
      });
      setSearchResults(response.data.items || []);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  // ฟังก์ชันสำหรับการเพิ่มหนังสือลง Firestore
  const createBook = async () => {
    if (!selectedBook || !status || !selectedCategory) {
      console.error('Please complete all required fields');
      return;
    }

    try {
      if (!auth.currentUser) {
        console.error('User is not authenticated.');
        return;
      }

      const bookData = {
        book_id: selectedBook.id,
        title: selectedBook.volumeInfo.title,
        author: selectedBook.volumeInfo.authors?.join(', '),
        aboutBook: selectedBook.volumeInfo.description,
        thumbnail: selectedBook.volumeInfo.imageLinks?.thumbnail, // เก็บ URL รูปปกจาก Google Books
        status: status,
        category: selectedCategory,
        ownerSharedBook: auth.currentUser.uid,
      };

      await addDoc(collection(db, 'sharedBooks'), bookData);

      console.log('Book created successfully:', bookData);

      setSearchQuery('');
      setSearchResults([]);
      setSelectedBook(null);
      setStatus('');
      setSelectedCategory('');
      navigation.navigate('AllSharedBook');
    } catch (error) {
      console.error('Error creating book:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Shared Book</Text>
      <TextInput
        style={styles.input}
        placeholder="Search for a book"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Pressable style={styles.searchButton} onPress={searchBooks}>
        <Text style={styles.buttonText}>Search</Text>
      </Pressable>

      {selectedBook ? (
        <>
          <Text style={styles.label}>Selected Book:</Text>
          <Text style={styles.selectedBookText}>Title: {selectedBook.volumeInfo.title}</Text>
          <Text style={styles.selectedBookText}>Author: {selectedBook.volumeInfo.authors?.join(', ')}</Text>
          <Text style={styles.selectedBookText}>Description: {selectedBook.volumeInfo.description}</Text>
          <Image source={{ uri: selectedBook.volumeInfo.imageLinks?.thumbnail }} style={styles.thumbnail} />
        </>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => setSelectedBook(item)}>
              <View style={styles.bookItemContainer}>
                <Image source={{ uri: item.volumeInfo.imageLinks?.thumbnail }} style={styles.thumbnail} />
                <Text style={styles.bookItem}>{item.volumeInfo.title}</Text>
              </View>
            </Pressable>
          )}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Status"
        value={status}
        onChangeText={setStatus}
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

      <Pressable style={styles.createButton} onPress={createBook}>
        <Text style={styles.buttonText}>Create Book</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
  searchButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  bookItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  bookItem: {
    fontSize: 16,
    padding: 10,
    flexShrink: 1,
  },
  thumbnail: {
    width: 50,
    height: 75,
    marginRight: 10,
  },
  selectedBookText: {
    fontSize: 16,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
});

export default CreateSharedBookScreen;
