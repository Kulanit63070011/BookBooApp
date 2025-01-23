import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../../backend/firebase'; // Import your Firestore instance
import { updateDoc, doc, deleteDoc } from 'firebase/firestore'; // Import Firestore methods
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage

const EditPostCommunityModal = ({ visible, onClose, post, communityId, handleEditPost }) => {
    const [editedPostTitle, setEditedPostTitle] = useState(post?.title || '');
    const [editedPostContent, setEditedPostContent] = useState(post?.content || '');
    const [editedPostImage, setEditedPostImage] = useState(post?.postImage || null);

    useEffect(() => {
        setEditedPostTitle(post?.title || '');
        setEditedPostContent(post?.content || '');
        setEditedPostImage(post?.postImage || null);
    }, [post]);

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
            setEditedPostImage(result.assets[0].uri);
        }
    };

    const handleSaveChanges = async () => {
        if (!communityId) {
            console.error('Community ID is undefined.');
            return;
        }

        if (
            editedPostTitle === post.title &&
            editedPostContent === post.content &&
            editedPostImage === post.postImage
        ) {
            console.log('No changes detected. Nothing to update.');
            onClose();
            return;
        }

        let imageUrl = post.postImage;
        if (editedPostImage && editedPostImage !== post.postImage) {
            const storage = getStorage();
            try {
                const response = await fetch(editedPostImage);
                const blob = await response.blob();
                const storageRef = ref(storage, `posts/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.jpg`);
                await uploadBytes(storageRef, blob);
                imageUrl = await getDownloadURL(storageRef);
            } catch (error) {
                console.error('Error uploading image:', error.message);
                alert('Failed to upload image. Please try again.');
                return;
            }
        }

        try {
            await updateDoc(doc(db, 'communities', communityId, 'Posts', post.id), {
                title: editedPostTitle,
                content: editedPostContent,
                postImage: imageUrl,
            });
            onClose();
        } catch (error) {
            console.error('Error editing post:', error.message);
        }
    };


    const handleDeletePost = async () => {
        if (!communityId) {
            console.error('Community ID is undefined.');
            return;
        }

        try {
            await deleteDoc(doc(db, 'communities', communityId, 'Posts', post.id));
            onClose();
        } catch (error) {
            console.error('Error deleting post:', error.message);
        }
    };

    return (
        <Modal transparent={true} visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.heading}>Edit Post</Text>

                    {/* TextInput for Title */}
                    <TextInput
                        style={styles.postInput}
                        placeholder="Edit your post title..."
                        value={editedPostTitle}
                        onChangeText={(text) => setEditedPostTitle(text)}
                    />

                    {/* TextInput for Content */}
                    <TextInput
                        style={[styles.postInput, { height: 100 }]}
                        multiline
                        placeholder="Edit your post content..."
                        value={editedPostContent}
                        onChangeText={(text) => setEditedPostContent(text)}
                    />

                    {/* Image Picker */}
                    <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
                        {editedPostImage ? (
                            <Image source={{ uri: editedPostImage }} style={styles.image} />
                        ) : (
                            <Text style={styles.imagePlaceholder}>Tap to select an image (Optional)</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
                            <Text style={styles.buttonText}>Save Changes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleDeletePost}>
                            <Text style={styles.buttonText}>Delete Post</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
                        </TouchableOpacity>
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
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxWidth: 500, // Improved max width for large screens
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    postInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 12,
        marginBottom: 20,
        height: 100,
        textAlignVertical: 'top', // Ensures text is top-aligned in multiline input
    },
    imagePicker: {
        width: '100%',
        height: 200,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    imagePlaceholder: {
        color: '#aaa',
        fontSize: 16,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#ccc',
    },
    cancelText: {
        color: '#333',
    },
});

export default EditPostCommunityModal;
