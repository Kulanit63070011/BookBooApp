import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import UserDetailsModal from '../../User/UserDetailsModal';
import { addDoc, collection, onSnapshot, query, orderBy, doc, updateDoc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../../../backend/firebase';
import { useNavigation } from '@react-navigation/native';

const PorterBookDetailModal = ({ visible, postData, onClose }) => {
  const navigation = useNavigation();

  if (!visible) return null;
  const [isUserDetailsModalVisible, setUserDetailsModalVisible] = useState(false);
  const [partnerUid, setPartnerUid] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const renderPostItems = () => {
    return postData.items.map((item, index) => (
      <View style={styles.itemContainer} key={index}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
        <View style={styles.imageGrid}>
          <Image source={require('../../../assets/images/bookcover.png')} style={styles.bookImage} />
        </View>
      </View>
    ));
  };

  useEffect(() => {
    const createdBy = postData.createdBy;
    handleSelectUser(createdBy);
  }, [postData.createdBy]); // ระบุ dependencies เป็น postData.createdBy


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
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{postData.title}</Text>
          <Text style={styles.date}>
            Start Date: {postData.startDate} | End Date: {postData.endDate}
          </Text>
          <ScrollView style={styles.scrollView}>
            {renderPostItems()}
          </ScrollView>
          <Text style={styles.about}>{postData.about}</Text>
          <Text style={styles.about} onPress={() => {
            handleSelectUser(postData.createdBy);
            setUserDetailsModalVisible(true);
          }}>CHAT</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    marginBottom: 10,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  imageContainer: {
    width: '50%',
    height: 150,
    padding: 5,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  additionalImagesContainer: {
    width: '50%',
    height: 150,
    padding: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  additionalImagesText: {
    fontSize: 24,
    color: 'white',
  },
  about: {
    marginBottom: 10,
  },
  bookImage: {
    width: 150,
    height: 150,
    marginBottom: 5,
  },
  scrollView: {
    maxHeight: 300,
  },
});

export default PorterBookDetailModal;