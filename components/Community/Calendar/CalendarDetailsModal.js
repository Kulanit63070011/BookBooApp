import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CalendarDetailsModal = ({ isVisible, onClose, event }) => {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.topBar}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={30} color="white" />
            </Pressable>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>ชื่อกิจกรรม:</Text>
            <Text style={styles.value}>{event.name}</Text>
            <Text style={styles.label}>วันที่เริ่ม:</Text>
            <Text style={styles.value}>{event.startDate}</Text>
            <Text style={styles.label}>เวลาเริ่ม:</Text>
            <Text style={styles.value}>{event.startTime}</Text>
            <Text style={styles.label}>รายละเอียด:</Text>
            <Text style={styles.value}>{event.description}</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  topBar: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  value: {
    marginBottom: 10,
    fontSize: 16,
    color: 'black',
  },
});

export default CalendarDetailsModal;
