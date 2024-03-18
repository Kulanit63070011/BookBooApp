import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const SharedBookDetailsModal = ({ visible, bookDetails, onClose }) => {
  const navigation = useNavigation();
  if (!visible || !bookDetails) {
    return null;
  }

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.topBar}>
            <Text style={styles.modalTitle}>Book Details</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
            {/* <Pressable>
              <Icon name="edit" size={20} color="red" onPress={() => navigation.navigate('EditSharedBook', { bookDetails: bookDetails })} />
            </Pressable> */}
          </View>
          <View style={styles.detailsContainer}>
            <Image
              source={require('../../../assets/images/bookcover.png')}
              style={styles.bookImage}
            />
            <Text style={styles.detailText}>Title: {bookDetails.title}</Text>
            <Text style={styles.detailText}>Author: {bookDetails.author}</Text>
            <Text style={styles.detailText}>About Book: {bookDetails.aboutBook}</Text>
            <Text style={styles.detailText}>Status: {bookDetails.status}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: 'blue',
  },
  detailsContainer: {
    marginTop: 10,
    alignItems: 'center', // จัดวางภาพและข้อความตรงกลาง
  },
  bookImage: {
    width: 100,
    height: 150,
    marginBottom: 10,
    borderRadius: 5,
  },
  detailText: {
    marginBottom: 10,
  },
});

export default SharedBookDetailsModal;