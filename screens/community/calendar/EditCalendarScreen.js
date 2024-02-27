import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput } from 'react-native';
import BottomNavigator from '../../../navigation/BottomNavigator';
import { createCommuStyles } from '../../../style/community/CreateCommuStyle';

const EditCalendarScreen = ({ visible, communityDetails, onClose, onDelete, onSave }) => {
    const [updatedDetails, setUpdatedDetails] = useState({
        name: communityDetails ? communityDetails.name : '',
        description: communityDetails ? communityDetails.description : '',
        category: communityDetails ? communityDetails.category : '',
        coverImage: communityDetails ? communityDetails.coverImage : '',
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
        <View style={createCommuStyles.modalContainer}>
            <View style={createCommuStyles.topBar}>
            </View>
            <View style={createCommuStyles.modalContent}>
                <Text style={createCommuStyles.label}>ชื่อกิจกรรม:</Text>
                <TextInput
                    style={createCommuStyles.input}
                    value={updatedDetails.coverImage}
                    onChangeText={(text) => handleInputChange('coverImage', text)}
                />
                <Text style={createCommuStyles.label}>วันที่เริ่มกิจกรรม:</Text>
                <TextInput
                    style={createCommuStyles.input}
                    value={updatedDetails.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                />
                <Text style={createCommuStyles.label}>เวลาเริ่มกิจกรรม:</Text>
                <TextInput
                    style={createCommuStyles.input}
                    value={updatedDetails.category}
                    onChangeText={(text) => handleInputChange('category', text)}
                />
                <Text style={createCommuStyles.label}>รายละเอียด:</Text>
                <TextInput
                    style={[createCommuStyles.input, { height: 80 }]}
                    value={updatedDetails.description}
                    onChangeText={(text) => handleInputChange('description', text)}
                    multiline={true}
                />
                <Text style={createCommuStyles.label}>วันที่แจ้งเตือน:</Text>
                <TextInput
                    style={[createCommuStyles.input, { height: 80 }]}
                    value={updatedDetails.description}
                    onChangeText={(text) => handleInputChange('description', text)}
                    multiline={true}
                />
                <Text style={createCommuStyles.label}>เวลาแจ้งเตือน:</Text>
                <TextInput
                    style={[createCommuStyles.input, { height: 80 }]}
                    value={updatedDetails.description}
                    onChangeText={(text) => handleInputChange('description', text)}
                    multiline={true}
                />
            </View>
            <Pressable onPress={handleSave} style={createCommuStyles.actionButton}>
                <Text style={createCommuStyles.buttonText}>sav edit</Text>
            </Pressable>
            <Pressable onPress={handleSave} style={createCommuStyles.actionButton}>
                <Text style={createCommuStyles.buttonText}>delete</Text>
            </Pressable>
        </View>
    );
};

export default EditCalendarScreen;