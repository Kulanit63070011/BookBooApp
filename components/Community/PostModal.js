import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ScrollView, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
        if (!communityId || !post.id) { 
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
              <MaterialIcons name="close" size={30} color="red" />
            </Pressable>
          </View>
          <ScrollView>
            <View style={styles.postDetails}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.content}>{content}</Text>
              <Text style={styles.createdBy}>By {createdByName}</Text>
              <View style={styles.likesContainer}>
                <MaterialIcons name="thumb-up" size={20} color="green" />
                <Text style={styles.likeCount}>{likes} Likes</Text>
                <MaterialIcons name="thumb-down" size={20} color="red" />
                <Text style={styles.dislikeCount}>{dislikes} Dislikes</Text>
              </View>
            </View>
            <View style={styles.commentsContainer}>
              <Text style={styles.commentsHeader}>Comments</Text>
              {comments.map((comment, index) => (
                <View key={`${comment.id}-${index}`} style={styles.comment}>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                  <Text style={styles.commentAuthor}>By {comment.createdByName}</Text>
                  <Text style={styles.commentDate}>{comment.createdAt instanceof Date ? (
                    comment.createdAt.toLocaleString()
                  ) : (
                    new Date(comment.createdAt.toDate()).toLocaleString()
                  )}</Text>
                </View>
              ))}
            </View>
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
  postDetails: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  createdBy: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 5,
    marginRight: 20,
  },
  dislikeCount: {
    marginRight: 20,
  },
  commentsContainer: {
    marginBottom: 20,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  comment: {
    marginBottom: 10,
  },
  commentContent: {
    fontSize: 16,
  },
  commentAuthor: {
    fontSize: 14,
    color: 'gray',
  },
  commentDate: {
    fontSize: 12,
    color: 'gray',
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
