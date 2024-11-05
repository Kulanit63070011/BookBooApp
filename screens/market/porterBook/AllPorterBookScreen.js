import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, SafeAreaView, Pressable } from 'react-native';
import BottomNavigator from '../../../navigation/BottomNavigator';
import FloatingButton from '../../../components/common/FloatingAddButton';
import { signUpStyles } from '../../../style/user/SignUpStyle';
import SearchBar from '../../../components/common/searchBar';
import PorterBookDetailModal from '../../../components/Market/PorterBook/PorterBookDetailModal';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../../backend/firebase'; // นำเข้า Firebase Firestore instance ที่ชื่อ db
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // เพิ่มการนำเข้า useFocusEffect
import MarketNavigationButtons from '../../../components/Market/MarketNavigationButtons';

const AllPorterBookScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [porterBooks, setPorterBooks] = useState([]);
    const navigation = useNavigation();

    const fetchPorterBooks = async () => {
        const porterBooksCollection = collection(db, 'porterBooks');
        const snapshot = await getDocs(porterBooksCollection);
        const porterBooksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPorterBooks(porterBooksData);
    };

    useEffect(() => {
        fetchPorterBooks();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchPorterBooks();
        }, [])
    );

    const handlePostPress = (post) => {
        setSelectedPost(post);
        setModalVisible(true);
    };

    const handleEditPost = (post) => {
        navigation.navigate('EditPorterBook', { post });
    };

    const renderEditIcon = (post) => {
        if (auth.currentUser && post.createdBy === auth.currentUser.uid) {
            return (
                <Pressable onPress={() => handleEditPost(post)} style={{ userSelect: 'auto' }}>
                    <MaterialIcons name="edit" size={24} color="black" />
                </Pressable>
            );
        }
        return null;
    };

    const renderPostItem = ({ item: post }) => (
        <View>
            <ScrollView>
                <TouchableOpacity style={styles.postCard} onPress={() => handlePostPress(post)}>
                <View style={styles.postTitleContainer}>
                    <Text style={styles.postTitle}>{post.title}</Text>
                    {renderEditIcon && (
                        <View style={styles.editIconContainer}>
                            {renderEditIcon(post)}
                        </View>
                    )}
                </View>
                    <Text style={styles.date}>
                        Start Date: {post.startDate} | End Date: {post.endDate}
                    </Text>
                    <Text style={styles.about}>{post.about}</Text>
                    {/* <Text style={styles.itemTitle}>Items:</Text>
                        {post.items.map((item, index) => (
                            <View key={index} style={styles.itemContainer}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemPrice}>{item.price}</Text>
                            </View>
                        ))} */}
                    <View style={styles.imageGrid}>
                        <Image source={require('../../../assets/images/bookcover.png')} style={styles.bookImage} />
                        <Image source={require('../../../assets/images/bookcover.png')} style={styles.bookImage} />
                        <Image source={require('../../../assets/images/bookcover.png')} style={styles.bookImage} />
                        <Image source={require('../../../assets/images/bookcover.png')} style={styles.bookImage} />
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );

    return (
        <View style={signUpStyles.container}>
            <SafeAreaView>
                <View style={signUpStyles.titleContainer}>
                    <Text style={signUpStyles.title}>Porter Books</Text>
                </View>
            </SafeAreaView>
            <View style={signUpStyles.contentContainer}>
                <MarketNavigationButtons/>
                <SearchBar />
                <FlatList
                    data={porterBooks}
                    renderItem={renderPostItem}
                    keyExtractor={(post) => post.id}
                    contentContainerStyle={styles.listContainer}
                />
                <PorterBookDetailModal visible={modalVisible} postData={selectedPost} onClose={() => setModalVisible(false)} />
                <FloatingButton targetScreen="CreatePorterBook" />
                <BottomNavigator />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#C0C0C0"
    },
    listContainer: {
        paddingBottom: 20,
    },
    postCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    date: {
        marginBottom: 10,
    },
    about: {
        marginBottom: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    itemName: {
        flex: 1,
        marginRight: 10,
    },
    itemPrice: {
        flex: 1,
        textAlign: 'right',
    },
    bookImage: {
        width: 150,
        height: 150,
        marginBottom: 5,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    editIconContainer: {
        justifyContent: 'center',
        alignItems: "flex-end",
        paddingRight: 10,
    },
    postTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default AllPorterBookScreen;