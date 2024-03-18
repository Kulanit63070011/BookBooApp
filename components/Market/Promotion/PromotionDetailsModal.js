import React from 'react';
import { View, Text, Modal, Pressable, Image, StyleSheet } from 'react-native';

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
          <Image
            source={require('../../../assets/images/promotion.png')}
            style={styles.image}
          />
          <Text style={styles.title}>{promotion.title}</Text>
          <Text>{promotion.description}</Text>

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
    width: '80%', // ปรับความกว้างของ Modal ตามต้องการ
    height: '50%',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'blue',
  },
});

export default PromotionDetailsModal;
