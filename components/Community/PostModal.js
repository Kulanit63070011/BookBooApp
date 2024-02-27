import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { addDoc, collection, query, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../backend/firebase';

const PostDetailsModal = ({ visible, post, onClose, refreshPostData, communityId }) => {
  // Destructure post data
  const { title, content, likes, dislikes, createdByName } = post || {};

  // State variables for managing new comment input and existing comments
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const getComments = async () => {
      try {
        const commentsRef = collection(db, 'communities', communityId, 'Posts', post.id, 'Comments');
        const q = query(commentsRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedComments = [];
          snapshot.forEach((doc) => {
            fetchedComments.push({
              id: doc.id,
              ...doc.data()
            });
          });
          setComments(fetchedComments);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    // Fetch comments only if the component is visible and post data exists
    if (visible && post) {
      getComments();
    }
  }, [visible, post, communityId]);

  // Function to handle adding a new comment
  const handleAddComment = async () => {
    try {
      // Check if newComment is defined and not an empty string after trimming
      if (newComment && newComment.trim() !== '') {
        // Check if communityId and post.id are valid
        if (!communityId || !post.id) { // ใช้งานค่า communityId และ post.id ที่รับเข้ามา
          console.error('Invalid communityId or post id.');
          return;
        }

        // Add a new comment document to the 'Comments' collection within the post's subcollection
        const commentRef = collection(db, 'communities', communityId, 'Posts', post.id, 'Comments');
        const newCommentRef = await addDoc(commentRef, {
          content: newComment,
          createdAt: new Date(),
          createdBy: auth.currentUser.uid,
          createdByName: auth.currentUser.displayName,
        });

        // Log the newly added comment data from Firestore
        console.log('Newly added comment:', {
          id: newCommentRef.id,
          content: newComment,
          createdAt: new Date(),
          createdBy: auth.currentUser.uid,
          createdByName: auth.currentUser.displayName,
        });

        // Update the local state of comments to include the new comment
        setComments(prevComments => [...prevComments, {
          id: newCommentRef.id,
          content: newComment,
          createdAt: new Date(),
          createdBy: auth.currentUser.uid,
          createdByName: auth.currentUser.displayName,
        }]);

        // Refresh post data without updating the local state of comments
        refreshPostData();

        // Close the modal after adding the comment
        onClose();
      }
    } catch (error) {
      console.error('Error adding comment:', error.message, error);
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.topBar}>
            <Pressable onPress={() => onClose()} style={styles.closeButton}>
              <Icon name="close" size={30} color="red" />
            </Pressable>
          </View>
          <ScrollView>
            <View style={styles.formContainer}>
              <Text style={styles.label}>Post Title:</Text>
              <Text style={styles.content}>{title}</Text>
              <Text style={styles.label}>Content:</Text>
              <Text style={styles.content}>{content}</Text>
              <Text style={styles.label}>Created By:</Text>
              <Text style={styles.content}>{createdByName}</Text>
              <View style={styles.likesContainer}>
                <Icon name="thumb-up" size={20} color="green" />
                <Text style={styles.likeCount}>{likes} Likes</Text>
              </View>
              <View style={styles.dislikesContainer}>
                <Icon name="thumb-down" size={20} color="red" />
                <Text style={styles.dislikeCount}>{dislikes} Dislikes</Text>
              </View>
            </View>
            {comments.map((comment, index) => (
              <View key={`${comment.id}-${index}`}>
                <View>
                  <Text>{comment.content}</Text>
                  <Text>{comment.createdByName}</Text>
                  {comment.createdAt instanceof Date ? (
                    <Text>{comment.createdAt.toLocaleString()}</Text>
                  ) : (
                    <Text>{new Date(comment.createdAt.toDate()).toLocaleString()}</Text>
                  )}
                </View>
              </View>
            ))}
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              multiline={true}
              value={newComment}
              onChangeText={(text) => setNewComment(text)}
            />
            <Pressable onPress={handleAddComment} style={styles.commentButton}>
              <Text style={styles.commentButtonText}>Add Comment</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    maxHeight: '80%',
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  content: {
    marginBottom: 10,
    fontSize: 16,
    color: 'black',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  likeButtonText: {
    marginLeft: 5,
    color: 'green',
  },
  likeCount: {
    fontSize: 16,
    color: 'green',
  },
  dislikesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  dislikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  dislikeButtonText: {
    marginLeft: 5,
    color: 'red',
  },
  dislikeCount: {
    fontSize: 16,
    color: 'red',
  },
  commentsContainer: {
    marginTop: 20,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentText: {
    fontSize: 16,
    marginBottom: 5,
  },
  commentInput: {
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 5,
    color: 'black',
  },
  commentButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  commentButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default PostDetailsModal;
