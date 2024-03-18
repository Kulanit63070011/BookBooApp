import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable } from 'react-native';
import BottomNavigator from '../../../navigation/BottomNavigator';
import FloatingButton from '../../../components/common/FloatingAddButton';
import { signUpStyles } from '../../../style/user/SignUpStyle';
import SearchBar from '../../../components/common/searchBar';
import SharedBookColumnOfCards from '../../../components/Market/SharedBook/SharedBookColumnOfCards';
import SharedBookDetailsModal from '../../../components/Market/SharedBook/SharedBookDetailsModal';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../backend/firebase';
import { onSnapshot } from 'firebase/firestore';
import { auth } from '../../../backend/firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EditSharedBookScreen from './EditSharedBookScreen'; // เพิ่มการนำเข้า EditSharedBookScreen

const AllSharedBookScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'sharedBooks'), (snapshot) => {
      const fetchedBooks = [];
      snapshot.forEach((doc) => {
        fetchedBooks.push({ id: doc.id, ...doc.data() });
      });
      setBooks(fetchedBooks);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'sharedBooks'));
        const fetchedBooks = [];
        querySnapshot.forEach((doc) => {
          fetchedBooks.push({ id: doc.id, ...doc.data() });
        });
        setBooks(fetchedBooks);
      } catch (error) {
        console.error('Error fetching books:', error.message);
      }
    };
    fetchBooks();
  }, []);

  const openBookDetails = (book) => {
    setSelectedBook(book);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const renderEditIcon = (book) => {
    if (auth.currentUser && book.ownerSharedBook === auth.currentUser.uid) {
      return (
        <Pressable onPress={() => handleEditBook(book)} style={{ userSelect: 'auto' }}>
          <Icon name="edit" size={24} color="black" />
        </Pressable>
      );
    }
    return null;
  };
  
  const handleEditBook = (book) => {
    navigation.navigate('EditSharedBook', { bookDetails: book });
  };

  return (
    <View style={signUpStyles.container}>
      <SafeAreaView>
        <View style={signUpStyles.titleContainer}>
          <Text style={signUpStyles.title}>Shared Books</Text>
        </View>
      </SafeAreaView>
      <View style={signUpStyles.contentContainer}>
        <SearchBar />
        <ScrollView>
          <View style={{ marginVertical: 20 }}>
            {books.length > 0 ? (
              <SharedBookColumnOfCards cards={books} onPress={openBookDetails} renderEditIcon={renderEditIcon} />) : (
              <Text>No shared books available</Text>
            )}
          </View>
        </ScrollView>
      </View>
      <FloatingButton targetScreen="CreateSharedBook" />
      <BottomNavigator />
      <SharedBookDetailsModal
        visible={isModalVisible}
        bookDetails={selectedBook}
        onClose={closeModal}
      />
    </View>
  );
};

export default AllSharedBookScreen;