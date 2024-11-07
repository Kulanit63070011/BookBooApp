import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, Image, ScrollView } from 'react-native';
import { collection, doc, setDoc, getDoc, addDoc } from 'firebase/firestore';
import { db, auth } from '../../backend/firebase';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

const CreateMyBookScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userNote, setUserNote] = useState(''); // state สำหรับเก็บ note

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
      <Text style={styles.title}>Add Book to My Bookshelf</Text>
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
      <Text style={styles.label}>Note (optional):</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
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

export default CreateMyBookScreen;
