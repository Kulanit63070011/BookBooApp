import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, collection, addDoc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../backend/firebase';
import { createMyBookStyles } from '../../style/bookshelf/CreateMyBookStyle';

const CreateMyBookScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [bookType, setBookType] = useState('');
  const [author, setAuthor] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [aboutBook, setAboutBook] = useState('');

  const handleSaveToFirestore = async (bookData) => {
    try {
      const user = auth.currentUser;
  
      if (!user) {
        console.error('User not found.');
        return;
      }
  
      const bookshelfId = user.uid; // ใช้ UID ของผู้ใช้เป็น bookshelfId
  
      // ตรวจสอบว่ามีชั้นหนังสือของผู้ใช้อยู่แล้วหรือไม่
      const bookshelfRef = doc(db, 'bookshelves', bookshelfId);
      const bookshelfSnap = await getDoc(bookshelfRef);
  
      if (!bookshelfSnap.exists()) {
        // ถ้าไม่มีให้สร้างชั้นหนังสือใหม่ของผู้ใช้
        await setDoc(bookshelfRef, { books: [bookData] });
      } else {
        // ถ้ามีให้เพิ่มหนังสือลงในชั้นหนังสือของผู้ใช้
        const existingBooks = bookshelfSnap.data().books || [];
        await updateDoc(bookshelfRef, { books: [...existingBooks, bookData] });
      }
  
      alert('Book saved successfully');
    } catch (error) {
      console.error('Error saving book to Firestore:', error.message);
      throw error;
    }
  };
  
  
  const handleSave = async () => {
    try {
      const user = auth.currentUser;

      if (!title || !author) {
        alert('Please enter required information (book title and author)');
        return;
      }

      if (user) {
        // เพิ่มข้อมูลหนังสือลงใน Firestore
        const bookData = {
          title,
          bookType,
          author,
          purchaseDate,
          aboutBook,
          userId: user.uid,
          bookshelfId: 'weqoOmYwAwQDoN5Mn8Mn' // ระบุ bookshelfId ที่คุณต้องการเก็บหนังสือไว้
        };

        await handleSaveToFirestore(bookData);

        // ล้างข้อมูลหนังสือที่ใส่ใน input fields หลังจากบันทึก
        setTitle('');
        setBookType('');
        setAuthor('');
        setPurchaseDate('');
        setAboutBook('');

        alert('Book saved successfully');
      } else {
        console.error('User not found');
      }
      navigation.navigate('MyBookShelf', { refresh: true });
    } catch (error) {
      console.error('Error saving book:', error.message);
    }
  };

  return (
    <View style={createMyBookStyles.modalContainer}>
      <View style={createMyBookStyles.modalContent}>
        <Text style={createMyBookStyles.label}>Book Title:</Text>
        <TextInput
          style={createMyBookStyles.input}
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <Text style={createMyBookStyles.label}>Book Type:</Text>
        <TextInput
          style={createMyBookStyles.input}
          value={bookType}
          onChangeText={(text) => setBookType(text)}
        />
        <Text style={createMyBookStyles.label}>Author:</Text>
        <TextInput
          style={createMyBookStyles.input}
          value={author}
          onChangeText={(text) => setAuthor(text)}
        />
        <Text style={createMyBookStyles.label}>Purchase Date:</Text>
        <TextInput
          style={createMyBookStyles.input}
          value={purchaseDate}
          onChangeText={(text) => setPurchaseDate(text)}
        />
        <Text style={createMyBookStyles.label}>About the Book:</Text>
        <TextInput
          style={[createMyBookStyles.input, { height: 80 }]}
          value={aboutBook}
          onChangeText={(text) => setAboutBook(text)}
          multiline={true}
        />
      </View>
      <Pressable onPress={handleSave} style={[createMyBookStyles.actionButton, { userSelect: 'auto' }]}>
        <Text style={createMyBookStyles.buttonText}>Save</Text>
      </Pressable>
    </View>
  );
};

export default CreateMyBookScreen;
