import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import UserDetailsModal from '../../User/UserDetailsModal';
import { addDoc, collection, onSnapshot, query, orderBy, doc, updateDoc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../../../backend/firebase';

const SharedBookDetailsModal = ({ visible, bookDetails, onClose }) => {
  const navigation = useNavigation();
  const [isUserDetailsModalVisible, setUserDetailsModalVisible] = useState(false);
  const [partnerUid, setPartnerUid] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  if (!visible) {
    return null;
  }



  const handleSelectUser = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();
      console.log(userData)
      console.log(userId)
      setSelectedUser(userData);
      setPartnerUid(userId);
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  const handleCreateChatRoom = (partnerUid) => {
    navigation.navigate('Chat', { partnerId: partnerUid });
  };

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
              <MaterialIcons name="edit" size={20} color="red" onPress={() => navigation.navigate('EditSharedBook', { bookDetails: bookDetails })} />
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
            <Text style={styles.about} onPress={() => {
              handleSelectUser(bookDetails.ownerSharedBook);
              setUserDetailsModalVisible(true);
            }}>CHAT</Text>
          </View>
        </View>
      </View>
      <UserDetailsModal
        visible={isUserDetailsModalVisible}
        userDetails={selectedUser}
        partnerUid={partnerUid}
        onClose={() => setUserDetailsModalVisible(false)}
        handleCreateChatRoom={handleCreateChatRoom}
      />
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