import React, { useState } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, Pressable, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CreatePostCommunityModal = ({ visible, onClose, onCreatePost }) => {
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState(null); // ตั้งค่าเริ่มต้นเป็น null
  const [postTitle, setPostTitle] = useState(''); // เพิ่ม state สำหรับ post title

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
      setPostImage(result.assets[0].uri);
    }
  };

const handleCreatePost = () => {
    const newPost = {
        title: postTitle, // รวม title ใน newPost
        content: postText,
        createdBy: "user_id_here", // ระบุ user ID ของผู้สร้างโพสต์
        createdByName: "user_name_here", // ระบุชื่อผู้สร้างโพสต์
        createdDate: new Date(), // ระบุวันและเวลาเมื่อโพสต์ถูกสร้าง
        likes: 0,
        dislikes: 0,
        postImage: postImage || null, // เก็บ postImage เป็น null ถ้าไม่มีการแนบภาพ
    };

    console.log("New Post:", newPost); // แสดง newPost ใน console เพื่อตรวจสอบ

    onCreatePost(newPost); // เรียกใช้ฟังก์ชันเพื่อสร้างโพสต์
    setPostText('');
    setPostImage(null); // รีเซ็ต postImage เป็น null
    setPostTitle(''); // รีเซ็ต title
    onClose();
};


  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.heading}>Create a New Post</Text>
        <TextInput
          style={styles.postInput}
          placeholder="Post Title"
          value={postTitle}
          onChangeText={(text) => setPostTitle(text)} // จัดการ input title
        />
        <TextInput
          style={styles.postInput}
          multiline
          placeholder="Type your post here..."
          value={postText}
          onChangeText={(text) => setPostText(text)}
        />
        
        {/* Image Picker Section */}
        <TouchableOpacity onPress={handlePickImage}>
          <View style={styles.imagePicker}>
            {postImage ? (
              <Image source={{ uri: postImage }} style={styles.image} />
            ) : (
              <Text style={styles.imagePlaceholder}>Tap to select an image</Text>
            )}
          </View>
        </TouchableOpacity>

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
    height: 40, // ปรับความสูงสำหรับ title input
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  imagePlaceholder: {
    color: '#888',
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
