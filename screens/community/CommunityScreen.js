import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, Button } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { addDoc, collection, onSnapshot, query, where, orderBy, doc, deleteDoc, updateDoc, getDocs, getDoc } from 'firebase/firestore';
import { auth, db } from '../../backend/firebase';
import CreatePostCommunityModal from '../../components/Community/CreatePostCommunityModal';
import EditPostCommunityModal from '../../components/Community/EditPostCommunityModal';
import communityStyles from '../../style/community/CommunityStyle';
import PostDetailsModal from '../../components/Community/PostModal';

const CommunityScreen = ({ route }) => {
    const [isCreatePostModalVisible, setCreatePostModalVisible] = useState(false);
    const [posts, setPosts] = useState([]);
    const [communityId, setCommunityId] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [editedPostContent, setEditedPostContent] = useState('');
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [selectedPostDetails, setSelectedPostDetails] = useState(null);
    const [isEditPostModalVisible, setEditPostModalVisible] = useState(false);

    useEffect(() => {
        const { communityId } = route.params;
        if (!communityId) {
            console.error('Missing communityId in route.params');
            return;
        }

        setCommunityId(communityId);

        const fetchData = async () => {
            if (communityId) {
                // Query posts in the 'Posts' collection of that community
                const postsQuery = query(
                    collection(db, 'communities', communityId, 'Posts'),
                    orderBy('createdDate', 'desc')
                );

                const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
                    const postList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                    setPosts(postList);
                });

                return () => unsubscribe();
            }
        };

        fetchData();
    }, [route.params]);

    const handleCreatePost = async (newPost) => {
        try {
            const user = auth.currentUser;

            if (!user) {
                alert('User not authenticated.');
                return;
            }

            // Get user data from the 'users' collection
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data();

            // Add a new post to the 'Posts' collection of that community
            await addDoc(collection(db, 'communities', communityId, 'Posts'), {
                title: newPost.title,
                content: newPost.content,
                createdBy: user.uid,
                createdByName: userData.displayName,
                createdDate: new Date(),
                likes: 0, // กำหนดค่า likes เป็น 0 เมื่อสร้างโพสต์ใหม่
                dislikes: 0, // กำหนดค่า dislikes เป็น 0 เมื่อสร้างโพสต์ใหม่
            });

            setCreatePostModalVisible(false);
        } catch (error) {
            console.error('Error creating post:', error.message);
        }
    };

    const handleEditPost = async (postId, editedContent) => {
        try {
            console.log('Edited content:', editedContent);
            console.log('Post ID:', postId);

            if (!communityId) {
                console.error('Community ID is undefined.');
                return;
            }
            if (!editedContent) {
                console.error('Edited content is empty or undefined.');
                return;
            }
            await updateDoc(doc(db, 'communities', communityId, 'Posts', postId), {
                content: editedContent,
            });
            // Handle other logic as needed...
        } catch (error) {
            console.error('Error editing post:', error.message);
        }
    };

    const handleLikePost = async (postId, isLiked) => {
        try {
            const postRef = doc(db, 'communities', communityId, 'Posts', postId);
            const postSnapshot = await getDoc(postRef);
            const postData = postSnapshot.data();

            // Check if the post data exists
            if (!postData) {
                console.error('Post data is undefined');
                return;
            }

            // Initialize arrays if they are undefined
            const likedBy = postData.likedBy || [];
            const dislikedBy = postData.dislikedBy || [];

            // Check if the user already liked or disliked this post
            const userLiked = likedBy.includes(auth.currentUser.uid);
            const userDisliked = dislikedBy.includes(auth.currentUser.uid);

            // Update like or dislike count based on the current state
            let updatedLikes = postData.likes;
            let updatedDislikes = postData.dislikes;

            if (isLiked) {
                if (!userLiked) {
                    updatedLikes++;
                    likedBy.push(auth.currentUser.uid);

                    // Remove user from dislikedBy array if previously disliked
                    if (userDisliked) {
                        updatedDislikes--;
                        dislikedBy.splice(dislikedBy.indexOf(auth.currentUser.uid), 1);
                    }
                } else {
                    updatedLikes--;
                    likedBy.splice(likedBy.indexOf(auth.currentUser.uid), 1);
                }
            } else {
                if (!userDisliked) {
                    updatedDislikes++;
                    dislikedBy.push(auth.currentUser.uid);

                    // Remove user from likedBy array if previously liked
                    if (userLiked) {
                        updatedLikes--;
                        likedBy.splice(likedBy.indexOf(auth.currentUser.uid), 1);
                    }
                } else {
                    updatedDislikes--;
                    dislikedBy.splice(dislikedBy.indexOf(auth.currentUser.uid), 1);
                }
            }

            // Update data in the database
            await updateDoc(postRef, {
                likes: updatedLikes,
                dislikes: updatedDislikes,
                likedBy,
                dislikedBy,
            });

            // เมื่อกดที่โพสต์ ให้เก็บรายละเอียดโพสต์ที่เลือกไว้
            setSelectedPostDetails(postData);

        } catch (error) {
            console.error('Error updating like count:', error.message);
        }
    };

    const refreshPostData = async () => {
        try {
            const postsRef = collection(db, 'communities', communityId, 'Posts');
            const snapshot = await getDocs(postsRef);
            const postList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setPosts(postList);
        } catch (error) {
            console.error('Error refreshing post data:', error.message);
        }
    };

    return (
        <View style={communityStyles.container}>
            <TouchableOpacity style={communityStyles.inputContainer} onPress={() => setCreatePostModalVisible(true)}>
                <Text style={communityStyles.postInput} numberOfLines={1} ellipsizeMode="tail">
                    What's on your mind?
                </Text>
                <TouchableOpacity onPress={() => setCreatePostModalVisible(true)}>
                    <Text>Create Post</Text>
                </TouchableOpacity>
            </TouchableOpacity>

            <ScrollView>
                {posts.map((post) => (
                    <Pressable
                        key={post.id}
                        style={communityStyles.postContainer}
                        onPress={() => {
                            setSelectedPostDetails(post);
                            refreshPostData(); // หากคุณต้องการรีเฟรชข้อมูลโพสต์เมื่อกดที่โพสต์
                        }}
                    >
                        <View>
                            <Text style={communityStyles.postTitle}>{post.createdByName}</Text>
                            {auth.currentUser.uid === post.createdBy && (
                                <Pressable
                                    onPress={() => {
                                        setSelectedPostId(post.id);
                                        setEditedPostContent(post.content);
                                        setEditPostModalVisible(true);
                                    }}
                                    style={communityStyles.editButton}>
                                    <Icon name="edit" size={20} color="red" />
                                </Pressable>
                            )}
                        </View>
                        <Text>{post.content}</Text>
                        <Pressable onPress={() => handleLikePost(post.id, true)}>
                            <Icon name="thumb-up" size={20} color="green" />
                            <Text>{post.likes} Likes</Text>
                        </Pressable>
                        <Pressable onPress={() => handleLikePost(post.id, false)}>
                            <Icon name="thumb-down" size={20} color="red" />
                            <Text>{post.dislikes} Dislikes</Text>
                        </Pressable>
                    </Pressable>
                ))}
            </ScrollView>

            <CreatePostCommunityModal
                visible={isCreatePostModalVisible}
                onClose={() => setCreatePostModalVisible(false)}
                onCreatePost={handleCreatePost}
            />
            <EditPostCommunityModal
                visible={isEditPostModalVisible}
                onClose={() => setEditPostModalVisible(false)}
                post={posts.find(post => post.id === selectedPostId)}
                communityId={communityId}
                handleEditPost={handleEditPost}
                editedPostContent={editedPostContent}
            />
            <PostDetailsModal
                visible={!!selectedPostDetails}
                post={selectedPostDetails}
                onClose={() => setSelectedPostDetails(null)}
                refreshPostData={refreshPostData}
                communityId={communityId}
            />
        </View>
    );
};

export default CommunityScreen;