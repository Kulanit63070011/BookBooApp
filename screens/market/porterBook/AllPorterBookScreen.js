import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Pressable,
} from "react-native";
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

  const renderPostItem = ({ item: post }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => handlePostPress(post)}
    >
      <View style={styles.postTitleContainer}>
        <Text style={styles.postTitle}>{post.title}</Text>
        {renderEditIcon(post)}
      </View>
      <Text style={styles.date}>
        Start Date: {new Date(post.startDate).toLocaleDateString()} | End Date:{" "}
        {new Date(post.endDate).toLocaleDateString()}
      </Text>
      <Text style={styles.about}>{post.about}</Text>
      <View style={styles.imageGrid}>
        {post.eventImageUrl ? (
          <Image
            source={{ uri: post.eventImageUrl }}
            style={styles.bookImage}
          />
        ) : (
          <Text>No Image Available</Text>
        )}
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
        <BottomNavigator />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C0C0C0",
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  date: {
    marginBottom: 10,
    fontStyle: "italic",
  },
  about: {
    marginBottom: 10,
  },
  bookImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  postTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default AllPorterBookScreen;
