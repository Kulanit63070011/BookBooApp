import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../backend/firebase';

const EditSharedBookScreen = ({ route, navigation }) => {
  const { bookDetails } = route.params;
  const [editedTitle, setEditedTitle] = useState(bookDetails.title);
  const [editedAuthor, setEditedAuthor] = useState(bookDetails.author);
  const [editedAboutBook, setEditedAboutBook] = useState(bookDetails.aboutBook);
  const [editedStatus, setEditedStatus] = useState(bookDetails.status);

  const saveChanges = async () => {
    try {
      // ตรวจสอบข้อมูลที่จำเป็น
      if (!editedTitle || !editedAuthor || !editedAboutBook || !editedStatus) {
        console.error('Please enter all required information');
        return;
      }

      // ข้อมูลที่จะเขียนลงใน Firestore
      const editedBookData = {
        title: editedTitle,
        author: editedAuthor,
        aboutBook: editedAboutBook,
        status: editedStatus,
        ownerSharedBook: bookDetails.ownerSharedBook, // เพิ่มข้อมูล ownerSharedBook กลับเข้าไป
      };

      // เขียนข้อมูลลงใน Firestore
      const docRef = doc(db, 'sharedBooks', bookDetails.id); // ใช้ ID ของหนังสือเป็น document ID
      await setDoc(docRef, editedBookData);

      console.log('Book details updated successfully:', editedBookData);

      // กลับไปยังหน้าหลักหลังจากบันทึกสำเร็จ
      navigation.goBack();
    } catch (error) {
      console.error('Error updating book details:', error.message);
    }
  };

  const deleteBook = async () => {
    alert('delete book section')
    try {
      // ลบข้อมูลหนังสือ
      const docRef = doc(db, 'sharedBooks', bookDetails.id);
      await deleteDoc(docRef);
    
      console.log('Book deleted successfully');
    
      // กลับไปยังหน้าหลักหลังจากลบสำเร็จ
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting book:', error.message);
    }
  };
  
  const confirmDelete = () => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'OK', onPress: deleteBook }
      ],
      { cancelable: false }
    );
  };  

  // เรียกใช้งาน useEffect เมื่อ bookDetails มีการเปลี่ยนแปลง (หลังจากการลบหนังสือที่แชร์)
  useEffect(() => {
    setEditedTitle(bookDetails.title);
    setEditedAuthor(bookDetails.author);
    setEditedAboutBook(bookDetails.aboutBook);
    setEditedStatus(bookDetails.status);
  }, [bookDetails]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Shared Book</Text>
      <TextInput
        style={styles.input}
        placeholder="Book Title"
        value={editedTitle}
        onChangeText={setEditedTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        value={editedAuthor}
        onChangeText={setEditedAuthor}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="About Book"
        multiline={true}
        value={editedAboutBook}
        onChangeText={setEditedAboutBook}
      />
      <TextInput
        style={styles.input}
        placeholder="Status"
        value={editedStatus}
        onChangeText={setEditedStatus}
      />
      <Pressable style={styles.saveButton} onPress={saveChanges}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </Pressable>
      <Pressable style={styles.deleteButton} onPress={confirmDelete}>
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
    backgroundColor: 'red',
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

export default EditSharedBookScreen;