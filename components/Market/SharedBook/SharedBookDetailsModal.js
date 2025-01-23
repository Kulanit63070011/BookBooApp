// SharedBookDetailsModal.js
import React, { useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import UserDetailsModal from '../../User/UserDetailsModal';
import { getDoc, doc } from 'firebase/firestore';
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
              <MaterialIcons name="close" size={24} color="#333" />
            </Pressable>
          </View>
          <View style={styles.detailsContainer}>
            <Image
              source={{ uri: bookDetails.thumbnail }}
              style={styles.bookImage}
            />
            <Text style={styles.bookTitle}>{bookDetails.title}</Text>
            <Text style={styles.bookAuthor}>by {bookDetails.author}</Text>
            <Text style={styles.sectionTitle}>About the Book</Text>
            <Text style={styles.detailText}>{bookDetails.aboutBook}</Text>
            <Text style={styles.statusText}>Detail: {bookDetails.detailSharedBook}</Text>
            <Pressable
              style={styles.chatButton}
              onPress={() => {
                handleSelectUser(bookDetails.ownerSharedBook);
                setUserDetailsModalVisible(true);
              }}
            >
              <Text style={styles.chatButtonText}>Chat with Owner</Text>
            </Pressable>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  detailsContainer: {
    alignItems: 'center',
  },
  bookImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 15,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  bookAuthor: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 500,
    color: '#555',
    marginTop: 10,
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'justify',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 500,
    marginBottom: 15,
  },
  chatButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 500,
  },
});

export default SharedBookDetailsModal;
