import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Image, Platform } from 'react-native';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../../../backend/firebase'; 
import { createCalendarStyles } from '../../../style/community/calendar/CreateCalendarStyle';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';

const EditCalendarScreen = ({ route, navigation, onClose }) => {
    const { communityId, eventId } = route.params;
    const [updatedDetails, setUpdatedDetails] = useState({
        name: '',
        description: '',
        coverImage: '',
        startDateTime: new Date(),
        reminderDateTime: new Date(),
    });
    const [showPicker, setShowPicker] = useState({
        startDateTime: false,
        reminderDateTime: false,
    });
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const eventDoc = await getDoc(doc(db, 'communities', communityId, 'Calendars', eventId));
                if (eventDoc.exists()) {
                    const eventData = eventDoc.data();
                    setUpdatedDetails({
                        ...eventData,
                        startDateTime: new Date(eventData.startDateTime),
                        reminderDateTime: new Date(eventData.reminderDateTime),
                    });
                    // Set selectedImage to the existing image URL if present
                    setSelectedImage(eventData.coverImage);
                }
            } catch (error) {
                console.error('Error fetching event details:', error.message);
            }
        };
        fetchEventDetails();
    }, [communityId, eventId]);

    const handleInputChange = (property, value) => {
        setUpdatedDetails({
            ...updatedDetails,
            [property]: value,
        });
    };

    const handleDateTimeChange = (property, event, selectedDate) => {
        setShowPicker({ ...showPicker, [property]: false });
        if (selectedDate) {
            setUpdatedDetails({ ...updatedDetails, [property]: selectedDate });
        }
    };

    const handleSave = async () => {
        try {
            let imageUrl = updatedDetails.coverImage;
            if (selectedImage) {
                const response = await fetch(selectedImage);
                const blob = await response.blob();
                const storageRef = ref(storage, `events/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.jpg`);
                await uploadBytes(storageRef, blob);
                imageUrl = await getDownloadURL(storageRef);
            }
    
            const eventRef = doc(db, 'communities', communityId, 'Calendars', eventId);
            await updateDoc(eventRef, {
                ...updatedDetails,
                coverImage: imageUrl,
                startDateTime: updatedDetails.startDateTime.toISOString(),
                reminderDateTime: updatedDetails.reminderDateTime.toISOString(),
            });
            navigation.goBack(); // Navigate back after saving
        } catch (error) {
            console.error('Error updating event:', error.message);
        }
    };
    
    const handleDelete = async () => {
        try {
            const eventRef = doc(db, 'communities', communityId, 'Calendars', eventId);
            await deleteDoc(eventRef);
            navigation.goBack(); // Navigate back after deleting
        } catch (error) {
            console.error('Error deleting event:', error.message);
        }
    };
    

    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    return (
        <View style={createCalendarStyles.modalContainer}>
            <ScrollView contentContainerStyle={createCalendarStyles.scrollViewContainer}>
                <View style={createCalendarStyles.modalContent}>
                    <Text style={createCalendarStyles.label}>Event Name:</Text>
                    <TextInput
                        style={createCalendarStyles.input}
                        value={updatedDetails.name}
                        onChangeText={(text) => handleInputChange('name', text)}
                    />

                    <Text style={createCalendarStyles.label}>Event Description:</Text>
                    <TextInput
                        style={[createCalendarStyles.input, createCalendarStyles.textArea]}
                        value={updatedDetails.description}
                        onChangeText={(text) => handleInputChange('description', text)}
                        multiline={true}
                    />

                    <Text style={createCalendarStyles.label}>Event Start Date & Time:</Text>
                    {Platform.OS === 'web' ? (
                        <DatePicker
                            selected={updatedDetails.startDateTime}
                            onChange={(date) => handleInputChange('startDateTime', date)}
                            showTimeSelect
                            dateFormat="Pp"
                        />
                    ) : (
                        <>
                            <Pressable onPress={() => setShowPicker({ ...showPicker, startDateTime: true })}>
                                <Text>{updatedDetails.startDateTime.toLocaleString()}</Text>
                            </Pressable>
                            {showPicker.startDateTime && (
                                <DateTimePicker
                                    value={updatedDetails.startDateTime}
                                    mode="datetime"
                                    display="default"
                                    onChange={(event, date) => handleDateTimeChange('startDateTime', event, date)}
                                />
                            )}
                        </>
                    )}

                    <Text style={createCalendarStyles.label}>Reminder Date & Time:</Text>
                    {Platform.OS === 'web' ? (
                        <DatePicker
                            selected={updatedDetails.reminderDateTime}
                            onChange={(date) => handleInputChange('reminderDateTime', date)}
                            showTimeSelect
                            dateFormat="Pp"
                        />
                    ) : (
                        <>
                            <Pressable onPress={() => setShowPicker({ ...showPicker, reminderDateTime: true })}>
                                <Text>{updatedDetails.reminderDateTime.toLocaleString()}</Text>
                            </Pressable>
                            {showPicker.reminderDateTime && (
                                <DateTimePicker
                                    value={updatedDetails.reminderDateTime}
                                    mode="datetime"
                                    display="default"
                                    onChange={(event, date) => handleDateTimeChange('reminderDateTime', event, date)}
                                />
                            )}
                        </>
                    )}

                    <Text style={createCalendarStyles.label}>Event Cover Image:</Text>
                    <Pressable
                        onPress={handlePickImage}
                        style={createCalendarStyles.imagePickerArea}
                    >
                        {selectedImage ? (
                            <Image source={{ uri: selectedImage }} style={createCalendarStyles.imagePreview} />
                        ) : (
                            <Text style={createCalendarStyles.imagePlaceholder}>
                                {updatedDetails.coverImage ? "Current Image" : "Tap to select an image"}
                            </Text>
                        )}
                    </Pressable>
                </View>
            </ScrollView>

            <View style={createCalendarStyles.fixedButtonContainer}>
                <Pressable onPress={handleSave} style={createCalendarStyles.fixedActionButton}>
                    <Text style={createCalendarStyles.buttonText}>Save</Text>
                </Pressable>
                <Pressable onPress={handleDelete} style={createCalendarStyles.fixedActionButton}>
                    <Text style={createCalendarStyles.buttonText}>Delete</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default EditCalendarScreen;