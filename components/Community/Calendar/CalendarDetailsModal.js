import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Image, ScrollView } from 'react-native';
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
          <ScrollView contentContainerStyle={styles.detailsContainer}>
            {/* Display Event Image */}
            {event.coverImage ? (
              <Image source={{ uri: event.coverImage }} style={styles.eventImage} />
            ) : (
              <View style={styles.noImageContainer}>
                <Text>No Image Available</Text>
              </View>
            )}

            {/* Display Event Details */}
            <Text style={styles.label}>Event Name:</Text>
            <Text style={styles.value}>{event.name || 'No Name Available'}</Text>

            <Text style={styles.label}>Start Date & Time:</Text>
            <Text style={styles.value}>{event.startDateTime || 'No Start Date'}</Text>

            <Text style={styles.label}>Reminder Date & Time:</Text>
            <Text style={styles.value}>{event.reminderDateTime || 'No Reminder Date'}</Text>

            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{event.description || 'No Description Available'}</Text>
          </ScrollView>
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
    borderRadius: 15,
    elevation: 10,
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  topBar: {
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 30,
  },
  detailsContainer: {
    marginTop: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    marginBottom: 15,
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
});

export default CalendarDetailsModal;