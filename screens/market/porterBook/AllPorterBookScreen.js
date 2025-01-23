import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, Pressable, } from "react-native";
import BottomNavigator from "../../../navigation/BottomNavigator";
import FloatingButton from "../../../components/common/FloatingAddButton";
import { signUpStyles } from "../../../style/user/SignUpStyle";
import SearchBar from "../../../components/common/searchBar";
import PorterBookDetailModal from "../../../components/Market/PorterBook/PorterBookDetailModal";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db, auth } from "../../../backend/firebase";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import MarketNavigationButtons from "../../../components/Market/MarketNavigationButtons";

const AllPorterBookScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [porterBooks, setPorterBooks] = useState([]);
  const [isPorter, setIsPorter] = useState(false);
  const navigation = useNavigation();

  const fetchPorterBooks = async () => {
    const eventsCollection = collection(db, "events");
    const snapshot = await getDocs(eventsCollection);
    const eventsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      eventImageUrl: doc.data().eventImage, // Assuming eventImage is stored in the Firestore document
      ...doc.data(),
    }));
    setPorterBooks(eventsData);
  };

  useEffect(() => {
    fetchPorterBooks();
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setIsPorter(userDoc.data().role === "porter");
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      checkUserRole();
      fetchPorterBooks();
    }, [])
  );

  const handlePostPress = (post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  const handleEditPost = (post) => {
    console.log("Navigating to EditPorterBook with post data:", post);  // Log the post data
    navigation.navigate("EditPorterBook", { post });
  };  

  const renderEditIcon = (post) => {
    if (auth.currentUser && post.createdBy === auth.currentUser.uid) {
      return (
        <Pressable onPress={() => handleEditPost(post)}>
          <MaterialIcons name="edit" size={24} color="black" />
        </Pressable>
      );
    }
    return null;
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const renderPostItem = ({ item: post }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => handlePostPress(post)}
    >
      <Image
        source={{ uri: post.eventImageUrl }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.date}>
          {new Date(post.startDate).toLocaleDateString()} -{" "}
          {new Date(post.endDate).toLocaleDateString()}
        </Text>
        <Text style={styles.about}>{truncateText(post.about, 150)}</Text>
        {renderEditIcon(post)}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={signUpStyles.container}>
      <SafeAreaView>
        <View style={signUpStyles.titleContainer}>
          <Text style={signUpStyles.title}>Porter Books</Text>
        </View>
      </SafeAreaView>
      <View style={signUpStyles.contentContainer}>
        <MarketNavigationButtons />
        <SearchBar />
        <FlatList
          data={porterBooks}
          renderItem={renderPostItem}
          keyExtractor={(post) => post.id}
          contentContainerStyle={styles.listContainer}
        />
        <PorterBookDetailModal
          visible={modalVisible}
          postData={selectedPost}
          onClose={() => setModalVisible(false)}
          userRole={isPorter ? "porter" : "user"}
        />
        {isPorter && (
          <View style={{ position: "absolute", bottom: 20, right: 20 }}>
            <FloatingButton targetScreen="CreateEventPost" />
          </View>
        )}
      </View>
      <BottomNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  postCard: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
  },
  about: {
    fontSize: 14,
    color: "#555",
  },
});

export default AllPorterBookScreen;
