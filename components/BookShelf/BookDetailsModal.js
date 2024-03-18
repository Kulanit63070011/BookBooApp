import React, { useState } from 'react';
import { Modal, View, Text, Pressable, TextInput, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BookDetailsModal = ({ visible, bookDetails, onClose, onDelete, onSave }) => {
  if (!visible || !bookDetails) {
    return null;
  }

  const [updatedDetails, setUpdatedDetails] = useState({
    ...bookDetails,
  });

  const handleInputChange = (property, value) => {
    setUpdatedDetails({
      ...updatedDetails,
      [property]: value,
    });
  };

  const handleSave = () => {
    onSave(updatedDetails, bookDetails.id);
    onClose(); // Close the modal after saving the data
  };

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={[styles.topBar]}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', fontSize: 25 }}>Edit My Book</Text>
            <Pressable onPress={onClose} style={[styles.closeButton, { userSelect: 'none' }]}>
              <Icon name="close" size={30} color="white" />
            </Pressable>
          </View>
          <ScrollView>
            <View style={styles.formContainer}>
              <Image
                source={require('../../assets/images/bookcover.png')}
                resizeMode="cover"
                style={styles.modalImage}
              />
              <Text style={styles.label}>Book Title:</Text>
              <TextInput
                style={styles.input}
                value={updatedDetails.title}
                onChangeText={(text) => handleInputChange('title', text)}
              />
              <Text style={styles.label}>Type:</Text>
              <TextInput
                style={styles.input}
                value={updatedDetails.bookType}
                onChangeText={(text) => handleInputChange('bookType', text)}
              />
              <Text style={styles.label}>Author:</Text>
              <TextInput
                style={styles.input}
                value={updatedDetails.author}
                onChangeText={(text) => handleInputChange('author', text)}
              />
              <Text style={styles.label}>Purchase Date:</Text>
              <TextInput
                style={styles.input}
                value={updatedDetails.purchaseDate}
                onChangeText={(text) => handleInputChange('purchaseDate', text)}
              />
              <Text style={styles.label}>About Book:</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                value={updatedDetails.aboutBook}
                onChangeText={(text) => handleInputChange('aboutBook', text)}
                multiline={true}
              />
            </View>
          </ScrollView>
          <View style={styles.bottomBar}>
            <Pressable onPress={handleSave} style={[styles.actionButton, { userSelect: 'auto', marginRight: 10 }]}>
              <Text style={{ color: '#4542C1' }}>Save</Text>
            </Pressable>
            <Pressable onPress={onDelete} style={[styles.actionButton, { backgroundColor: 'red', userSelect: 'auto' }]}>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    backgroundColor: 'white'
  },
  actionButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
    alignItems: 'center',
    width: '45%'
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