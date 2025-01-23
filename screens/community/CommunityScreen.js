import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { addDoc, collection, onSnapshot, query, orderBy, doc, updateDoc, getDocs, getDoc } from 'firebase/firestore';
import { auth, db } from '../../backend/firebase';
import CreatePostCommunityModal from '../../components/Community/CreatePostCommunityModal';
import EditPostCommunityModal from '../../components/Community/EditPostCommunityModal';
import communityStyles from '../../style/community/CommunityStyle';
import PostDetailsModal from '../../components/Community/PostModal';
import UserDetailsModal from '../../components/User/UserDetailsModal';
import { useNavigation } from '@react-navigation/native';

const CommunityScreen = ({ route }) => {
    const navigation = useNavigation();
    const [isCreatePostModalVisible, setCreatePostModalVisible] = useState(false);
    const [posts, setPosts] = useState([]);
    const [communityId, setCommunityId] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [editedPostContent, setEditedPostContent] = useState('');
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [selectedPostDetails, setSelectedPostDetails] = useState(null);
    const [isEditPostModalVisible, setEditPostModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUserDetailsModalVisible, setUserDetailsModalVisible] = useState(false);
    const [partnerUid, setPartnerUid] = useState(null);
    const [userProfiles, setUserProfiles] = useState({});

    // ฟังก์ชันในการแปลง timestamp เป็นวันที่
    const formatDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000); // ใช้ seconds จาก timestamp
        return date.toLocaleString('en-US', { // ปรับรูปแบบวันที่
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
    };

    useEffect(() => {
        const { communityId } = route.params;
        if (!communityId) {
            console.error('Missing communityId in route.params');
            return;
        }

        setCommunityId(communityId);

        const fetchData = async () => {
            if (communityId) {
                const postsQuery = query(
                    collection(db, 'communities', communityId, 'Posts'),
                    orderBy('createdDate', 'desc')
                );

                const unsubscribe = onSnapshot(postsQuery, async (snapshot) => {
                    const postList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

                    // Pre-fetch user data for all posts
                    const userIds = postList.map(post => post.createdBy);
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

            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data();

            await addDoc(collection(db, 'communities', communityId, 'Posts'), {
                title: newPost.title,
                content: newPost.content,
                createdBy: user.uid,
                createdByName: userData.displayName,
                createdDate: new Date(),
                likes: 0,
                dislikes: 0,
                postImage: newPost.postImage || null, // Include the image URL
            });

            setCreatePostModalVisible(false);
        } catch (error) {
            console.error('Error creating post:', error.message);
        }
    };

    const handleEditPost = async (postId, editedContent) => {
        try {
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
        } catch (error) {
            console.error('Error editing post:', error.message);
        }
    };

    const handleLikePost = async (postId, isLiked) => {
        try {
            const postRef = doc(db, 'communities', communityId, 'Posts', postId);
            const postSnapshot = await getDoc(postRef);
            const postData = postSnapshot.data();

            if (!postData) {
                console.error('Post data is undefined');
                return;
            }

            const likedBy = postData.likedBy || [];
            const dislikedBy = postData.dislikedBy || [];

            const userLiked = likedBy.includes(auth.currentUser.uid);
            const userDisliked = dislikedBy.includes(auth.currentUser.uid);

            let updatedLikes = postData.likes;
            let updatedDislikes = postData.dislikes;

            if (isLiked) {
                if (!userLiked) {
                    updatedLikes++;
                    likedBy.push(auth.currentUser.uid);

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

                    if (userLiked) {
                        updatedLikes--;
                        likedBy.splice(likedBy.indexOf(auth.currentUser.uid), 1);
                    }
                } else {
                    updatedDislikes--;
                    dislikedBy.splice(dislikedBy.indexOf(auth.currentUser.uid), 1);
                }
            }

            await updateDoc(postRef, {
                likes: updatedLikes,
                dislikes: updatedDislikes,
                likedBy,
                dislikedBy,
            });

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

    const handleCreateCalendar = () => {
        navigation.navigate('CreateCalendar', { communityId: communityId });
    };

    const handleShowCalendar = () => {
        navigation.navigate('CalendarCommunity', { communityId });
    };

    useEffect(() => {
        if (selectedPostDetails) {
            const createdBy = selectedPostDetails.createdBy;
            handleSelectUser(createdBy);
        }
    }, [selectedPostDetails]);

    const handleSelectUser = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            const userData = userDoc.data();
            // สมมติว่า 'userProfile' เป็น URL ของรูปภาพผู้ใช้
            setSelectedUser(userData);  // เก็บข้อมูล userData ที่ได้จาก 'users'
            setPartnerUid(userId); // เก็บ userId เพื่อนำไปใช้งาน
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    };

    const handleCreateChatRoom = (partnerUid) => {
        try {
            setUserDetailsModalVisible(false);
            navigation.navigate('Chat', { partnerId: partnerUid });
        } catch (error) {
            console.error('Error navigating to chat:', error);
        }
    };

    const handleOpenEditModal = (post) => {
        setSelectedPost(post); // Pass the selected post's data
        setEditPostModalVisible(true);
    };

    return (
        <View style={communityStyles.container}>
            <Pressable style={communityStyles.inputContainer} onPress={() => setCreatePostModalVisible(true)}>
                <Text style={communityStyles.postInput} numberOfLines={1} ellipsizeMode="tail">
                    What's on your mind?
                </Text>
                <Pressable style={communityStyles.createPostButton} onPress={() => setCreatePostModalVisible(true)}>
                    <Text style={communityStyles.createPostButtonText}>Create Post</Text>
                </Pressable>
                <Pressable style={communityStyles.createCalendarButton} onPress={() => handleCreateCalendar()}>
                    <Text style={communityStyles.createCalendarButtonText}>Create Calendar</Text>
                </Pressable>
                <Pressable style={communityStyles.createCalendarButton} onPress={() => handleShowCalendar()}>
                    <Text style={communityStyles.createCalendarButtonText}>View Calendar</Text>
                </Pressable>
            </Pressable>

            <ScrollView>
                {posts.map((post) => (
                    <Pressable
                        key={post.id}
                        style={communityStyles.postContainer}
                        onPress={() => { setSelectedPostDetails(post); refreshPostData(); }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Pressable
                                style={{ flexDirection: 'row', alignItems: 'center' }}
                                onPress={() => { handleSelectUser(post.createdBy); setUserDetailsModalVisible(true); }}
                            >
                                <Image
                                    source={{ uri: userProfiles[post.createdBy]?.userImage || 'default_image_url' }}
                                    style={communityStyles.profileImage}
                                />
                                <Text style={communityStyles.postTitle}>
                                    {post.createdByName}
                                </Text>
                            </Pressable>
                        </View>

                        {/* Date displayed under the user's name */}
                        <Text style={communityStyles.postDate}>
                            {formatDate(post.createdDate)} {/* Show the date */}
                        </Text>
                        <Text style={communityStyles.postTitle}>{post.title}</Text>
                        <Text>{post.content}</Text>

                        {/* Only display image if the post has a postImage */}
                        {post.postImage ? (
                            <Image
                                source={{ uri: post.postImage }}
                                style={communityStyles.postImage}
                            />
                        ) : (
                            <View style={communityStyles.noImagePlaceholder}>
                            </View>
                        )}

                        <View style={communityStyles.likeDislikeContainer}>
                            <Pressable onPress={() => handleLikePost(post.id, true)} style={communityStyles.likeButton}>
                                <MaterialIcons name="thumb-up" size={20} color="green" />
                                <Text style={communityStyles.likeDislikeText}>{post.likes} Likes</Text>
                            </Pressable>
                            <Pressable onPress={() => handleLikePost(post.id, false)} style={communityStyles.dislikeButton}>
                                <MaterialIcons name="thumb-down" size={20} color="red" />
                                <Text style={communityStyles.likeDislikeText}>{post.dislikes} Dislikes</Text>
                            </Pressable>
                            <Pressable onPress={() => { setSelectedPostDetails(post); refreshPostData(); }} style={[communityStyles.dislikeButton, { backgroundColor: '#e1e0dd' }]}>
                                <Text style={communityStyles.likeDislikeText}>Comments</Text>
                            </Pressable>
                        </View>

                        {/* เพิ่มปุ่มแก้ไข */}
                        {post.createdBy === auth.currentUser?.uid && (
                            <Pressable
                                style={communityStyles.editButton}
                                onPress={() => handleOpenEditModal(post)}
                            >
                                <MaterialIcons name="edit" size={24} color="blue" />
                            </Pressable>
                        )}
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
                post={selectedPost}
                communityId={communityId}
                handleEditPost={handleEditPost}
            />
            <PostDetailsModal
                visible={!!selectedPostDetails}
                post={selectedPostDetails}
                onClose={() => setSelectedPostDetails(null)}
                refreshPostData={refreshPostData}
                communityId={communityId}
            />
            <UserDetailsModal
                visible={isUserDetailsModalVisible}
                userDetails={selectedUser}
                partnerUid={partnerUid}
                onClose={() => setUserDetailsModalVisible(false)}
                handleCreateChatRoom={handleCreateChatRoom}
            />
        </View>
    );
};

export default CommunityScreen;