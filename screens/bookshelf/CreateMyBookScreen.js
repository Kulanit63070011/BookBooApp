import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, Image, ScrollView } from 'react-native';
import { collection, doc, setDoc, getDoc, addDoc } from 'firebase/firestore';
import { db, auth } from '../../backend/firebase';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = 'AIzaSyDuKh_ecx2W1ZsbdK_j0U9mSEgMYxNcbgs';

const CreateMyBookScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userNote, setUserNote] = useState(''); // state สำหรับเก็บ note

  const categories = [
    'General novels', 'Romantic novels', 'Fantasy novels', 'Sci-fi novels',
    'Adventure novels', 'Detective novels', 'Horror novels', 'Serial novels',
    'Cartoons & Anime','Finance and Investment', 'Market Accounting', 'Psychology', 'Self-Development',
    'Education', 'Language', 'Law', 'Creative Design', 'Politics', 'Computer Science',
    'History', 'Religious Beliefs', 'Pets', 'Health', 'Travel', 'Music and Entertainment',
    'Food', 'Art', 'Others'
  ];

  const searchBooks = async () => {
    try {
      const response = await axios.get(GOOGLE_BOOKS_API_URL, {
        params: { q: searchQuery,
          key: API_KEY,
         }
      });
      setSearchResults(response.data.items || []);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  const saveBookToFirestore = async () => {
    if (!selectedBook || !selectedCategory) {
      console.error('Please complete all required fields');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated.');
        return;
      }

      const bookData = {
        bookId: selectedBook.id,
        title: selectedBook.volumeInfo.title,
        author: selectedBook.volumeInfo.authors?.join(', '),
        aboutBook: selectedBook.volumeInfo.description,
        thumbnail: selectedBook.volumeInfo.imageLinks?.thumbnail,
        category: selectedCategory,
        detailBookByUser: userNote || null,
      };

      const userBookshelfRef = doc(db, 'bookshelves', user.uid);
      const bookshelfSnap = await getDoc(userBookshelfRef);

      if (!bookshelfSnap.exists()) {
        await setDoc(userBookshelfRef, { userId: user.uid });
      }

      await addDoc(collection(userBookshelfRef, 'myBooks'), bookData);
      console.log('Book added to bookshelf successfully:', bookData);

      setSearchQuery('');
      setSearchResults([]);
      setSelectedBook(null);
      setSelectedCategory('');
      setUserNote('');
      navigation.navigate('MyBookShelf', { refresh: true });
    } catch (error) {
      console.error('Error adding book to bookshelf:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add a Book to Your Shelf</Text>
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
        <View>
          <Text style={styles.label}>Selected Book:</Text>
          <Text style={styles.selectedBookText}>Title: {selectedBook.volumeInfo.title}</Text>
          <Text style={styles.selectedBookText}>Author: {selectedBook.volumeInfo.authors?.join(', ')}</Text>
          <Image
            source={{ uri: selectedBook.volumeInfo.imageLinks?.thumbnail }}
            style={styles.thumbnail}
          />
        </View>
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

      <Text style={styles.label}>Select a Category:</Text>
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

      <Text style={styles.label}>Add a Note (optional):</Text>
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        placeholder="Add any notes here..."
        value={userNote}
        onChangeText={setUserNote}
        multiline
      />

      <Pressable style={styles.createButton} onPress={saveBookToFirestore}>
        <Text style={styles.buttonText}>Save Book</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f9fc', // สีพื้นหลังที่ดูสะอาด
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    marginBottom: 16,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: 'gray',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
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
  bookItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  bookItem: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
    flexShrink: 1,
  },
  thumbnail: {
    width: 60,
    height: 90,
    borderRadius: 4,
  },
  selectedBookText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  createButton: {
    backgroundColor: 'red',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default CreateMyBookScreen;
