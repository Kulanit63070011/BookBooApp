import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, TextInput, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../backend/firebase';
import { useNavigation } from '@react-navigation/native';

const CommunityDetailsModal = ({ visible, communityDetails, onClose, onDelete, onJoinCommunity }) => {
  const navigation = useNavigation();
  const [updatedDetails, setUpdatedDetails] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (communityDetails) {
      setUpdatedDetails({
        name: communityDetails.name,
        description: communityDetails.description,
      });
    }
  }, [communityDetails]);

  const handleInputChange = (property, value) => {
    setUpdatedDetails({
      ...updatedDetails,
      [property]: value,
    });
  };

  const handleJoinCommunity = async () => {
    try {
      const user = auth.currentUser;

      if (user && communityDetails) {
        // Update the Firestore document to add the current user to the 'members' array
        const communityDocRef = doc(db, 'communities', communityDetails.name);
        await updateDoc(communityDocRef, {
          members: arrayUnion(user.uid),
        });

        // Trigger the callback to refresh community details
        onClose();
        navigation.navigate('AllCommunity', { refresh: true });
      } else {
        console.error('No user or community details found');
      }
    } catch (error) {
      console.error('Error joining community:', error.message);
    }
  };

  if (!visible || !communityDetails) {
    return null;
  }

  const { name, description, members } = communityDetails;

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <View style={styles.topBar}>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Icon name="close" size={30} color="white" />
              </Pressable>
            </View>
            {/* Display community details */}
            <View style={styles.content}>
              <View style={{alignItems: 'center'}}>
                <Image source={require('../../assets/images/bookcover.png')} resizeMode="contain" style={styles.bookImage} />
              </View>
              <Text style={styles.label}>Community Name:</Text>
              <Text style={styles.detail}>{name}</Text>
              <Text style={styles.label}>Description:</Text>
              <Text style={styles.detail}>{description}</Text>
              {/* Display members */}
              <Text style={styles.memberCount}>{members.length} members</Text>
            </View>
            <View style={styles.actionButtonsContainer}>
              <Pressable onPress={handleJoinCommunity} style={styles.joinButton}>
                <Text style={styles.buttonText}>Join Community</Text>
              </Pressable>
            </View>
          </ScrollView>
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
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    // backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  detail: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  memberCount: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  joinButton: {
    backgroundColor: '#5B42C1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  bookImage: {
    width: 170,
    height: 200,
  },
});

export default CommunityDetailsModal;
