import React from 'react';
import { View, Text, Modal, Pressable, Image, ScrollView, StyleSheet } from 'react-native';

const PromotionDetailsModal = ({ visible, promotion, onClose }) => {
  if (!visible || !promotion) {
    return null;
  }

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
          
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Image
              source={promotion.promotionImage ? { uri: promotion.promotionImage } : require('../../../assets/images/promotion.png')}
              style={styles.image}
            />
            <Text style={styles.title}>{promotion.title}</Text>
            <Text style={styles.description}>{promotion.description}</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
    width: '85%', // Adjust the width for better responsiveness
    maxHeight: '80%', // Prevents modal from becoming too tall
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 15,
    borderRadius: 5,
    alignSelf: 'center', // Center the image
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333', // Dark color for readability
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555', // Lighter color for description text
    textAlign: 'center',
    marginBottom: 20, // Add space before the close button
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PromotionDetailsModal;
