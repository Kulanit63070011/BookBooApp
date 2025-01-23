import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { addDoc, collection, onSnapshot, query, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../backend/firebase';

const PostDetailsModal = ({ visible, post, onClose, communityId }) => {
  const { title, content, likes, dislikes, createdByName, id, postImage } = post || {};
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null); // Track the comment being edited
  const [editedCommentText, setEditedCommentText] = useState(''); // Track the edited comment text

  useEffect(() => {
    const getComments = async () => {
      try {
        const commentsRef = collection(db, 'communities', communityId, 'Posts', id, 'Comments');
        const q = query(commentsRef);
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const fetchedComments = [];
          const userIds = [];

          snapshot.forEach((doc) => {
            const commentData = doc.data();
            fetchedComments.push({ id: doc.id, ...commentData });
            userIds.push(commentData.createdBy);
          });

          // Fetch user profiles for all comments
          const userDataPromises = userIds.map(userId =>
            getDoc(doc(db, 'users', userId))
              .then(userDoc => ({ userId, data: userDoc.data() }))
          );
          const userDataResults = await Promise.all(userDataPromises);

          const userProfilesData = userDataResults.reduce((acc, { userId, data }) => {
            acc[userId] = data;
            return acc;
          }, {});

          setUserProfiles(userProfilesData);
          setComments(fetchedComments);
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (visible && post) {
      getComments();
    }
  }, [visible, post, communityId]);

  const handleAddComment = async () => {
    try {
      if (newComment && newComment.trim() !== '') {
        const user = auth.currentUser;

        if (!user) {
          alert('User not authenticated.');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        const commentRef = collection(db, 'communities', communityId, 'Posts', id, 'Comments');
        await addDoc(commentRef, {
          content: newComment,
          createdAt: new Date(),
          createdBy: user.uid,
          createdByName: userData.displayName,
        });

        setNewComment(''); // Reset the input field
      }
    } catch (error) {
      console.error('Error adding comment:', error.message, error);
    }
  };

  const handleEditComment = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        alert('User not authenticated.');
        return;
      }

      const commentRef = doc(db, 'communities', communityId, 'Posts', id, 'Comments', editingCommentId);
      await updateDoc(commentRef, {
        content: editedCommentText,
        updatedAt: new Date(),
      });

      alert('Comment updated successfully!');
      setEditingCommentId(null); // Reset the editing state
      setEditedCommentText(''); // Reset the edited comment text
    } catch (error) {
      console.error('Error updating comment:', error.message);
    }
  };

  const handleStartEditing = (commentId, commentContent) => {
    setEditingCommentId(commentId);
    setEditedCommentText(commentContent);
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.topBar}>
            <Pressable onPress={() => onClose()} style={styles.closeButton}>
              <MaterialIcons name="close" size={30} color="white" />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.postDetails}>
              {postImage && (
                <Image source={{ uri: postImage }} style={styles.postImage} />
              )}
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.content}>{content}</Text>
              <Text style={styles.createdBy}>By {createdByName}</Text>
              <View style={styles.likesContainer}>
                <View style={styles.likeItem}>
                  <MaterialIcons name="thumb-up" size={20} color="green" />
                  <Text style={styles.likeCount}>{likes} Likes</Text>
                </View>
                <View style={styles.dislikeItem}>
                  <MaterialIcons name="thumb-down" size={20} color="red" />
                  <Text style={styles.dislikeCount}>{dislikes} Dislikes</Text>
                </View>
              </View>
            </View>

            <View style={styles.commentsContainer}>
              <Text style={styles.commentsHeader}>Comments</Text>
              {comments.map((comment) => (
                <View key={comment.id} style={styles.comment}>
                  <View style={styles.commentHeader}>
                    <View style={styles.profilePicContainer}>
                      {userProfiles[comment.createdBy] && userProfiles[comment.createdBy].userImage ? (
                        <Image
                          source={{ uri: userProfiles[comment.createdBy].userImage }}
                          style={styles.profilePic}
                        />
                      ) : (
                        <MaterialIcons name="account-circle" size={30} color="#555" />
                      )}
                    </View>
                    <Text style={styles.commentAuthor}>{comment.createdByName}</Text>
                  </View>
                  {editingCommentId === comment.id ? (
                    <View>
                      <TextInput
                        style={styles.commentInput}
                        value={editedCommentText}
                        onChangeText={setEditedCommentText}
                        placeholder="Edit your comment"
                      />
                      <TouchableOpacity
                        onPress={handleEditComment}
                        style={styles.saveButton}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={styles.commentContent}>{comment.content}</Text>
                  )}
                  <Text style={styles.commentDate}>
                    {comment.updatedAt
                      ? `Edited: ${new Date(comment.updatedAt.seconds * 1000).toLocaleString()}`
                      : `Posted: ${new Date(comment.createdAt.seconds * 1000).toLocaleString()}`}
                  </Text>
                  {comment.createdBy === auth.currentUser.uid && editingCommentId !== comment.id && (
                    <TouchableOpacity
                      onPress={() => handleStartEditing(comment.id, comment.content)}
                      style={styles.editButton}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

            </View>

            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                multiline={true}
                value={newComment}
                onChangeText={setNewComment}
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity
                onPress={handleAddComment}
                style={styles.commentButton}
                activeOpacity={0.7}
              >
                <Text style={styles.commentButtonText}>Add Comment</Text>
              </TouchableOpacity>
            </View>
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
    width: '90%',
    maxHeight: '85%',
    padding: 20,
    elevation: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 30,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  postDetails: {
    marginBottom: 20,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
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
    justifyContent: 'space-between',
  },
  likeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dislikeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 5,
    fontSize: 14,
  },
  dislikeCount: {
    marginLeft: 5,
    fontSize: 14,
  },
  commentsContainer: {
    marginTop: 20,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  comment: {
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePicContainer: {
    marginRight: 10,
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentContent: {
    fontSize: 16,
    marginBottom: 10,
  },
  commentDate: {
    fontSize: 12,
    color: 'gray',
  },
  editButton: {
    marginTop: 10,
  },
  editButtonText: {
    fontSize: 14,
    color: 'blue',
  },
  commentInputContainer: {
    marginTop: 20,
  },
  commentInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
  commentButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  commentButtonText: {
    color: 'white',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '30%', // กำหนดขนาดตามต้องการ
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PostDetailsModal;