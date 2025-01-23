import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, Alert, ScrollView, Platform, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createCalendarStyles } from '../../../style/community/calendar/CreateCalendarStyle';
import { db, auth, storage } from '../../../backend/firebase'; // Ensure storage is imported
import { collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';

const CreateCalendarScreen = ({ route }) => {
    const { communityId } = route.params || {};
    const navigation = useNavigation();

    const [communityData, setCommunityData] = useState(null);
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

    const [selectedImage, setSelectedImage] = useState(null); // New state for storing selected image

    useEffect(() => {
        if (communityId) {
            const fetchCommunity = async () => {
                const communityRef = doc(db, 'communities', communityId);
                const communitySnap = await getDoc(communityRef);
                setCommunityData(communitySnap.data());
            };

            fetchCommunity();
        } else {
            console.error('Community ID is missing');
        }
    }, [communityId]);

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
            const user = auth.currentUser;
            if (!user || !communityId) {
                console.error('User or community ID is missing');
                return;
            }

            // Upload image to Firebase if selected
            let imageUrl = '';
            if (selectedImage) {
                const response = await fetch(selectedImage);
                const blob = await response.blob();
                const storageRef = ref(storage, `events/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.jpg`);
                await uploadBytes(storageRef, blob);
                imageUrl = await getDownloadURL(storageRef); // Get the image URL
            }

            await addDoc(collection(db, 'communities', communityId, 'Calendars'), {
                ...updatedDetails,
                coverImage: imageUrl, // Save image URL
                startDateTime: updatedDetails.startDateTime.toISOString(),
                reminderDateTime: updatedDetails.reminderDateTime.toISOString(),
                createdBy: user.uid,
                createdAt: serverTimestamp(),
            });

            navigation.navigate('CalendarCommunity', { communityId });
        } catch (error) {
            console.error('Error adding calendar:', error.message);
        }
    };

    // Image picker function
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
                        style={createCalendarStyles.imagePickerArea} // Apply the background style here
                    >
                        {selectedImage ? (
                            <Image source={{ uri: selectedImage }} style={createCalendarStyles.imagePreview} />
                        ) : (
                            <Text style={createCalendarStyles.imagePlaceholder}>Tap to select an image</Text>
                        )}
                    </Pressable>
                </View>
            </ScrollView>

            <View style={createCalendarStyles.fixedButtonContainer}>
                <Pressable onPress={handleSave} style={createCalendarStyles.fixedActionButton}>
                    <Text style={createCalendarStyles.buttonText}>Create</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default CreateCalendarScreen;
