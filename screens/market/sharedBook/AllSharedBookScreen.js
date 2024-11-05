import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable } from 'react-native';
import BottomNavigator from '../../../navigation/BottomNavigator';
import FloatingButton from '../../../components/common/FloatingAddButton';
import { signUpStyles } from '../../../style/user/SignUpStyle';
import SearchBar from '../../../components/common/searchBar';
import SharedBookColumnOfCards from '../../../components/Market/SharedBook/SharedBookColumnOfCards';
import SharedBookDetailsModal from '../../../components/Market/SharedBook/SharedBookDetailsModal';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../../backend/firebase';
import { MaterialIcons } from '@expo/vector-icons';
import MarketNavigationButtons from '../../../components/Market/MarketNavigationButtons';
import { fetchUserInterests } from '../../../backend/fetchData';
import { recommendBooks } from '../../../models/recommendationModel';

const AllSharedBookScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // การดึงข้อมูลความสนใจของผู้ใช้
  useEffect(() => {
    fetchUserInterests(setUserInterests);
  }, []);

  // ดึงข้อมูลหนังสือที่แชร์ทั้งหมดและเรียงลำดับตามการแนะนำ
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'sharedBooks'), (snapshot) => {
      const fetchedBooks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBooks(fetchedBooks); // เก็บข้อมูลหนังสือทั้งหมด

      // หากมีข้อมูลความสนใจของผู้ใช้ ให้ใช้ recommendBooks ในการจัดเรียงหนังสือตามความสนใจ
      if (userInterests.length > 0) {
        recommendBooks(fetchedBooks, userInterests).then((sortedBooks) => {
          setRecommendedBooks(sortedBooks);
        });
      } else {
        // เมื่อไม่มีความสนใจ แสดงหนังสือสุ่ม 5 เล่ม
        const randomBooks = fetchedBooks.sort(() => 0.5 - Math.random()).slice(0, 5);
        setRecommendedBooks(randomBooks);
      }
    });
    return unsubscribe;
  }, [userInterests]);

  const openBookDetails = (book) => {
    setSelectedBook(book);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const renderEditIcon = (book) => {
    if (auth.currentUser?.uid === book.ownerSharedBook) {
      return (
        <Pressable onPress={() => handleEditBook(book)} style={{ userSelect: 'auto' }}>
          <MaterialIcons name="edit" size={24} color="black" />
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
        <MarketNavigationButtons/>
        <SearchBar />
        <ScrollView>
          <View style={{ marginVertical: 20 }}>
            {recommendedBooks.length > 0 ? (
              <SharedBookColumnOfCards cards={recommendedBooks} onPress={openBookDetails} renderEditIcon={renderEditIcon} />
            ) : (
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
