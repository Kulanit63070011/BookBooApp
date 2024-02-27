import React, { useState } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, Pressable } from 'react-native';

const CreatePostCommunityModal = ({ visible, onClose, onCreatePost }) => {
  const [postText, setPostText] = useState('');

  const handleCreatePost = () => {
    const newPost = {
      title: 'name', // คุณสามารถปรับเปลี่ยนตามความต้องการ
      content: postText,
    };

    // ส่งข้อมูลโพสต์ไปยัง handleCreatePost ที่รับมันเข้ามา
    onCreatePost(newPost);

    // เคลียร์ค่า postText เมื่อโพสต์ถูกสร้างขึ้น
    setPostText('');

    // ปิด Modal
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.heading}>Create a New Post</Text>
        <TextInput
          style={styles.postInput}
          multiline
          placeholder="Type your post here..."
          value={postText}
          onChangeText={(text) => setPostText(text)}
        />
        <Pressable style={styles.button} onPress={handleCreatePost}>
          <Text style={styles.buttonText}>Post</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CreatePostCommunityModal;