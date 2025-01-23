import React from 'react';
import { Modal, View, Text, Pressable, ScrollView, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../backend/firebase'; // Import db จาก firebase
import { addDoc, collection } from 'firebase/firestore'; // เพิ่ม collection และ addDoc ไปในการนำเข้า
import { auth } from '../../backend/firebase';

const UserDetailsModal = ({ visible, userDetails, onClose, partnerUid, handleCreateChatRoom }) => {
  const handleChat = async () => {
    onClose();
    navigation.navigate('Chat', { userDetails });

    // Check if user and userDetails are valid
    if (!user || !userDetails.displayName) {
      console.error('Error creating chat room: User is undefined or has no displayName');
      return;
    }

    // Create chat room with the partnerUid
    handleCreateChatRoom(partnerUid);
  };
  
  const navigation = useNavigation();
  const user = auth.currentUser;

  if (!visible || !userDetails || !user) { 
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.topBar}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={30} color="white" />
          </Pressable>
        </View>
        <ScrollView>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Name: {userDetails.displayName}</Text>
            <Text style={styles.label}>About Me: {userDetails.aboutMe}</Text>
            <View style={styles.imageContainer}>
              <Image source={{ uri: userDetails.userImage }} style={styles.profileImage} />
            </View>
          </View>
        </ScrollView>
        <Pressable onPress={handleChat} style={styles.actionButton}>
          <Text style={styles.buttonText}>CHAT</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  topBar: {
    paddingTop: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  modalContent: {
    marginBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center', // Center content horizontally
  },
  label: {
    marginBottom: 5,
    fontSize: 26,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  imageContainer: {
    alignItems: 'center', // Center content horizontally
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // Half of width and height to make it a circle
  },
});

export default UserDetailsModal;