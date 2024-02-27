import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { createMyBookStyles } from '../../style/bookshelf/CreateMyBookStyle';

const EditMyBookScreen = ({ visible, bookDetails, onClose, onDelete, onSave }) => {
    const [updatedDetails, setUpdatedDetails] = useState({
        title: bookDetails ? bookDetails.title : '',
        type: bookDetails ? bookDetails.type : '',
        author: bookDetails ? bookDetails.author : '',
        purchaseDate: bookDetails ? bookDetails.purchaseDate : '',
        aboutBook: bookDetails ? bookDetails.aboutBook : '',
    });

    const handleInputChange = (property, value) => {
        setUpdatedDetails({
            ...updatedDetails,
            [property]: value,
        });
    };

    const handleSave = () => {
        onSave(updatedDetails);
    };

    return (
        <View style={createMyBookStyles.modalContainer}>
            <View style={createMyBookStyles.topBar}>
                <Pressable onPress={onClose} style={createMyBookStyles.closeButton}>
                    <Text style={createMyBookStyles.buttonText}>Close</Text>
                </Pressable>
                <Pressable onPress={onDelete} style={createMyBookStyles.deleteButton}>
                    <Text style={createMyBookStyles.buttonText}>Delete</Text>
                </Pressable>
            </View>
            <View style={createMyBookStyles.modalContent}>
                <Text style={createMyBookStyles.label}>Cover Image:</Text>
                <TextInput
                    style={createMyBookStyles.input}
                    value={updatedDetails.coverImage}
                    onChangeText={(text) => handleInputChange('coverImage', text)}
                />
                <Text style={createMyBookStyles.label}>Book Title:</Text>
                <TextInput
                    style={createMyBookStyles.input}
                    value={updatedDetails.title}
                    onChangeText={(text) => handleInputChange('title', text)}
                />
                <Text style={createMyBookStyles.label}>Type:</Text>
                <TextInput
                    style={createMyBookStyles.input}
                    value={updatedDetails.type}
                    onChangeText={(text) => handleInputChange('type', text)}
                />
                <Text style={createMyBookStyles.label}>Author:</Text>
                <TextInput
                    style={createMyBookStyles.input}
                    value={updatedDetails.author}
                    onChangeText={(text) => handleInputChange('author', text)}
                />
                <Text style={createMyBookStyles.label}>Purchase Date:</Text>
                <TextInput
                    style={createMyBookStyles.input}
                    value={updatedDetails.purchaseDate}
                    onChangeText={(text) => handleInputChange('purchaseDate', text)}
                />
                <Text style={createMyBookStyles.label}>About:</Text>
                <TextInput
                    style={[createMyBookStyles.input, { height: 80 }]}
                    value={updatedDetails.aboutBook}
                    onChangeText={(text) => handleInputChange('aboutBook', text)}
                    multiline={true}
                />
            </View>
            <Pressable onPress={handleSave} style={createMyBookStyles.actionButton}>
                <Text style={createMyBookStyles.buttonText}>Save</Text>
            </Pressable>
        </View>
    );
};

export default EditMyBookScreen;
