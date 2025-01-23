import React, { useState } from 'react';
import { Modal, View, Text, Pressable, TextInput, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../backend/firebase';

const BookDetailsModal = ({ visible, bookDetails, onClose, onSave }) => {
  if (!visible || !bookDetails) {
    return null;
  }

  const categories = [
    'General novels', 'Romantic novels', 'Fantasy novels', 'Sci-fi novels',
    'Adventure novels', 'Detective novels', 'Horror novels', 'Serial novels',
    'Cartoons & Anime', 'Finance and Investment', 'Market Accounting', 'Psychology', 'Self-Development',
    'Education', 'Language', 'Law', 'Creative Design', 'Politics', 'Computer Science',
    'History', 'Religious Beliefs', 'Pets', 'Health', 'Travel', 'Music and Entertainment',
    'Food', 'Art', 'Others'
  ];

  const [updatedDetails, setUpdatedDetails] = useState({
    ...bookDetails,
    detailBookByUser: bookDetails.detailBookByUser || "",  // Ensure it's not null
  });

  const handleInputChange = (property, value) => {
    setUpdatedDetails({
      ...updatedDetails,
      [property]: value || "",  // Default to an empty string if value is null
    });
  };

  const handleSave = () => {
    console.log(updatedDetails);  // Check the updated details before saving
    onSave(updatedDetails, bookDetails.id);
    onClose();
  };

  const onDelete = async (bookId) => {
    if (!bookId) {
      console.log("No book ID provided");
      return;
    }

    try {
      const bookDocRef = doc(db, 'bookshelves', auth.currentUser.uid, 'myBooks', bookId);
      const bookDoc = await getDoc(bookDocRef);

      if (bookDoc.exists()) {
        await deleteDoc(bookDocRef);
        console.log('Book deleted successfully');
      } else {
        console.log('Book not found');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };



  const handleDelete = () => {
    console.log("Delete button pressed");
    console.log("Book ID to delete:", bookDetails.id);  // Log the book ID to be deleted
    onDelete(bookDetails.id);
    onClose();
  };

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.topBar}>
            <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold' }}>Edit My Book</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={30} color="white" />
            </Pressable>
          </View>
          <ScrollView>
            <View style={styles.formContainer}>
              {/* Dynamically display the book cover */}
              {bookDetails.thumbnail ? (
                <Image
                  source={{ uri: bookDetails.thumbnail }}
                  resizeMode="cover"
                  style={styles.modalImage}
                />
              ) : (
                <Image
                  source={require('../../assets/images/bookcover.png')}
                  resizeMode="cover"
                  style={styles.modalImage}
                />
              )}
              <Text style={styles.label}>Book Title:</Text>
              <TextInput
                style={styles.input}
                value={updatedDetails.title}
                editable={false} // Can't edit the title
              />
              <Text style={styles.label}>Type:</Text>
              <Picker
                selectedValue={updatedDetails.bookType}
                onValueChange={(value) => handleInputChange('bookType', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select a category" value="" />
                {categories.map((category, index) => (
                  <Picker.Item label={category} value={category} key={index} />
                ))}
              </Picker>
              <Text style={styles.label}>Author:</Text>
              <TextInput
                style={styles.input}
                value={updatedDetails.author}
                editable={false} // Can't edit the author
              />
              <Text style={styles.label}>About Book:</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                value={updatedDetails.aboutBook || ""}  // Ensure empty string if null or undefined
                editable={false}
                multiline={true}
              />
              <TextInput
                style={[styles.input, { height: 80 }]}
                value={updatedDetails.detailBookByUser || ""}
                onChangeText={(text) => handleInputChange('detailBookByUser', text)}
                placeholder="Add your personal notes here"
                multiline={true}
              />
            </View>
          </ScrollView>
          <View style={styles.bottomBar}>
            <Pressable onPress={handleSave} style={styles.actionButton}>
              <Text style={{ color: '#4542C1' }}>Save</Text>
            </Pressable>
            <Pressable onPress={handleDelete} style={[styles.actionButton, { backgroundColor: 'red' }]}>
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FD1919',
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
  },
  formContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    paddingLeft: 5,
    color: 'black',
    backgroundColor: 'white',
  },
  actionButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  modalImage: {
    width: 150,
    height: 200,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4542C1',
    paddingVertical: 10,
  },
});

export default BookDetailsModal;