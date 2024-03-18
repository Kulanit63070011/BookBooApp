import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';
import { db, auth } from '../../backend/firebase'; // Import your Firestore instance and auth
import { updateDoc, doc, deleteDoc } from 'firebase/firestore'; // Import updateDoc, doc, and deleteDoc from Firestore

const EditPostCommunityModal = ({ visible, onClose, post, communityId, handleEditPost }) => {
    const [editedPostContent, setEditedPostContent] = useState(post?.content || '');

    const handleSaveChanges = async () => {
        try {
            if (!communityId) {
                console.error('Community ID is undefined.');
                return;
            }
            if (!editedPostContent) {
                console.error('Edited content is empty or undefined.');
                return;
            }
            await updateDoc(doc(db, 'communities', communityId, 'Posts', post.id), {
                content: editedPostContent,
            });
            // Handle other logic as needed...
        } catch (error) {
            console.error('Error editing post:', error.message);
        }
    };

    const handleDeletePost = async () => {
        try {
            if (!communityId) {
                console.error('Community ID is undefined.');
                return;
            }
            // Delete the post from the database
            await deleteDoc(doc(db, 'communities', communityId, 'Posts', post.id));
            // Close the modal
            onClose();
            // Handle other logic as needed...
        } catch (error) {
            console.error('Error deleting post:', error.message);
        }
    };

    return (
        <Modal transparent={true} visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.heading}>Edit Post</Text>
                    <TextInput
                        style={styles.postInput}
                        multiline
                        placeholder="Edit your post here..."
                        value={editedPostContent}
                        onChangeText={(text) => setEditedPostContent(text)}
                    />
                    <View style={styles.buttonContainer}>
                        <Button title="Save Changes" onPress={handleSaveChanges} />
                        <Button title="Delete Post" onPress={handleDeletePost}/>

                        <Button title="Cancel" onPress={onClose} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = {
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
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    postInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        height: 100,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
};

export default EditPostCommunityModal;
