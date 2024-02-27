import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import BottomNavigator from '../../navigation/BottomNavigator';
import FloatingButton from '../../components/common/FloatingAddButton';
import BookDetailsModal from '../../components/BookShelf/BookDetailsModal';
import BookColumnOfCards from '../../components/BookShelf/BookColumnOfCards';
import { myBookShelfStyles } from '../../style/bookshelf/MyBookShelfStyle';
import { signUpStyles } from '../../style/user/SignUpStyle';
import { auth, db } from '../../backend/firebase';
import { collection, getDocs, query, where, doc, getDoc, setDoc } from 'firebase/firestore';

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
          // สร้าง query เพื่อดึงข้อมูลหนังสือของผู้ใช้ปัจจุบันจากคอลเล็กชัน "bookshelves"
          const userBookshelfRef = doc(db, 'bookshelves', user.uid);
          const bookshelfSnap = await getDoc(userBookshelfRef);

          if (bookshelfSnap.exists()) {
            const bookshelfData = bookshelfSnap.data();
            const booksInBookshelf = bookshelfData.books || [];

            setBooks(booksInBookshelf);
          } else {
            console.log('User bookshelf not found');
          }
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
  };

  const saveBookChanges = async (updatedDetails, bookId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userBookshelfRef = doc(db, 'bookshelves', user.uid);
        const bookshelfSnap = await getDoc(userBookshelfRef);
  
        if (bookshelfSnap.exists()) {
          const bookshelfData = bookshelfSnap.data();
          let booksInBookshelf = bookshelfData.books || [];
  
          // สร้างรายการใหม่โดยเฉพาะสำหรับหนังสือที่มีการเปลี่ยนแปลง
          const updatedBooks = booksInBookshelf.map(book => {
            if (book.id === bookId) {
              return { ...book, ...updatedDetails };
            }
            return book;
          });
  
          // อัปเดตหนังสือเฉพาะที่มีการเปลี่ยนแปลงใน Firestore
          await setDoc(userBookshelfRef, { books: updatedBooks }, { merge: true });
          setBooks(updatedBooks);
        } else {
          console.log('User bookshelf not found');
        }
      }
    } catch (error) {
      console.error('Error saving book changes:', error.message);
    }
  };
  
  return (
    <View style={signUpStyles.container}>
      <SafeAreaView>
        <View style={signUpStyles.titleContainer}>
          <Text style={myBookShelfStyles.title}>ชั้นหนังสือ</Text>
        </View>
      </SafeAreaView>
      <View style={[myBookShelfStyles.contentContainer]}>
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