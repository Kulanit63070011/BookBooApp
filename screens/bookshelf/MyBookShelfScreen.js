import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import BottomNavigator from '../../navigation/BottomNavigator';
import FloatingButton from '../../components/common/FloatingAddButton';
import BookDetailsModal from '../../components/BookShelf/BookDetailsModal';
import BookColumnOfCards from '../../components/BookShelf/BookColumnOfCards';
import SearchBar from '../../components/common/searchBar';
import { myBookShelfStyles } from '../../style/bookshelf/MyBookShelfStyle';
import { signUpStyles } from '../../style/user/SignUpStyle';
import { allCommunityStyles } from '../../style/community/AllCommunityStyle';
import { auth, db } from '../../backend/firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';

const MyBookShelfScreen = () => {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userBookshelfRef = collection(db, 'bookshelves', user.uid, 'myBooks');
          const querySnapshot = await getDocs(userBookshelfRef);
          const booksInBookshelf = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
          setBooks(booksInBookshelf);
        } else {
          console.log('User not authenticated');
        }
      } catch (error) {
        console.error('Error fetching user books:', error.message);
      }
    };
  
    if (isFocused) {
      fetchBooks();
    }
  }, [isFocused]);

  const deleteBook = () => {
    setIsModalVisible(false);
  };

  const openBookDetails = (book) => {
    setSelectedBook(book);
    setIsModalVisible(true);
    console.log(book);  // ตรวจสอบว่า selectedBook ได้รับข้อมูลจากการคลิกถูกต้องหรือไม่
  };

  const saveBookChanges = async (updatedDetails, bookId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userBookshelfRef = doc(db, 'bookshelves', user.uid, 'myBooks', bookId); // ระบุ document id ที่ตรงกับ bookId
        await updateDoc(userBookshelfRef, updatedDetails); // อัปเดตข้อมูลในเอกสารนั้น
  
        // อัปเดตสถานะหนังสือในแอปพลิเคชัน
        const updatedBooks = books.map(book => 
          book.id === bookId ? { ...book, ...updatedDetails } : book
        );
        setBooks(updatedBooks); // อัปเดตสถานะใน state
  
        alert('Book updated successfully');
      }
    } catch (error) {
      console.error('Error saving book changes:', error.message);
      throw error;
    }
  };

  return (
    <View style={signUpStyles.container}>
      <SafeAreaView>
        <View style={signUpStyles.titleContainer}>
          <Text style={allCommunityStyles.title}>Bookshelf</Text>
        </View>
      </SafeAreaView>
      <View style={[myBookShelfStyles.contentContainer]}>
        <SearchBar />
        <ScrollView>
          <View style={{ userSelect: 'none' }} >
            {Array.isArray(books) && books.length > 0 ? (
              <BookColumnOfCards cards={books.reverse()} onPress={openBookDetails} />
            ) : (
              <Text>No books in your bookshelf</Text>
            )}
          </View>
        </ScrollView>
      </View>
      <FloatingButton targetScreen="CreateMyBook" />
      <BottomNavigator style={myBookShelfStyles.bottomNavigator} />
      <BookDetailsModal
        visible={isModalVisible}
        bookDetails={selectedBook}
        onClose={() => setIsModalVisible(false)}
        onDelete={deleteBook}
        onSave={saveBookChanges} // นี่คือส่วนที่เราเชื่อมโยงฟังก์ชัน saveBookChanges กับ Modal
      />
    </View>
  );
};

export default MyBookShelfScreen;
