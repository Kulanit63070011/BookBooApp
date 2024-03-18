import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../../backend/firebase'; // Import your Firestore instance and auth

const CreateSharedBookScreen = ({ navigation }) => {
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [aboutBook, setAboutBook] = useState('');
  const [status, setStatus] = useState('');

  const createBook = async () => {
    try {
      // ตรวจสอบข้อมูลที่จำเป็น
      if (!bookTitle || !author || !aboutBook || !status) {
        console.error('Please enter all required information');
        return;
      }

      // ตรวจสอบว่า auth มีค่าหรือไม่ก่อนที่คุณจะเรียกใช้งาน
      if (!auth.currentUser) {
        console.error('User is not authenticated.');
        return;
      }

      // ข้อมูลของหนังสือ
      const bookData = {
        title: bookTitle,
        author: author,
        aboutBook: aboutBook,
        status: status,
        ownerSharedBook: auth.currentUser.uid, // เพิ่มฟิลด์ ownerSharedBook ด้วยไอดีของผู้ใช้ปัจจุบัน
      };

      // เขียนข้อมูลหนังสือลงใน Firestore
      const docRef = await addDoc(collection(db, 'sharedBooks'), bookData);

      console.log('Book created successfully:', bookData);

      // ล้างข้อมูลหนังสือหลังจากบันทึก
      setBookTitle('');
      setAuthor('');
      setAboutBook('');
      setStatus('');

      // นำผู้ใช้กลับไปยังหน้าหลักหลังจากบันทึกสำเร็จ
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
        placeholder="Book Title"
        value={bookTitle}
        onChangeText={setBookTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="About Book"
        multiline={true}
        value={aboutBook}
        onChangeText={setAboutBook}
      />
      <TextInput
        style={styles.input}
        placeholder="Status"
        value={status}
        onChangeText={setStatus}
      />
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

export default CreateSharedBookScreen;