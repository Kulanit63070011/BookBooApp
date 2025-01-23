import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, Image, ScrollView } from "react-native";
import { fetchUserInterests, fetchCommunityData, getCurrentUserData } from "../../backend/fetchData";
import { findTopMatches, rankCommunities } from "../../models/recommendationModel";
import { calculateAge, filterUsersByAgeRange } from "../../backend/fetchData";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../backend/firebase";
import { MaterialIcons } from '@expo/vector-icons';
import CommuColumnOfCards from "../../components/Community/CommuColumnOfCards";
import CommunityDetailsModal from "../../components/Community/CommunityDetailsModal";

const CommunityRecommendationScreen = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [communityData, setCommunityData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [topMatches, setTopMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openCommunityDetails = (community) => {
    setSelectedCommunity(community);
    setIsModalVisible(true);
  };

  useEffect(() => {
    fetchUserInterests(setUserInterests);
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users.");
      }
    };
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getCurrentUserData();
      setCurrentUser(userData);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const unsubscribeCommunityData = fetchCommunityData(setCommunityData, setError);
    return () => unsubscribeCommunityData();
  }, []);

  useEffect(() => {
    if (communityData && communityData.length > 0 && userInterests && userInterests.length > 0 && currentUser) {
      setLoading(true);

      console.log("Calculating recommendations...");
      const currentUserAge = calculateAge(currentUser.birthDate);
      console.log(`Current user age: ${currentUserAge}`);

      const ageFilteredUsers = filterUsersByAgeRange(allUsers, currentUserAge);
      console.log(`Filtered users by age:`, ageFilteredUsers);

      const topMatchesData = findTopMatches(userInterests, ageFilteredUsers, currentUser.userId);
      console.log("Top user matches:", topMatchesData);
      setTopMatches(topMatchesData);

      const topUserIds = topMatchesData.map(user => user.userId);
      const rankedCommunities = rankCommunities(topUserIds, communityData);

      setRecommendations(rankedCommunities);
      setLoading(false);
    }
  }, [communityData, userInterests, allUsers, currentUser]);

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Communities</Text>

      {loading ? (
        <ActivityIndicator size={50} color="#0000ff" />
      ) : (
        <>
          {/* Display Top User Matches */}
          <Text style={styles.subtitle}>Top User Matches:</Text>
          {topMatches.length > 0 ? (
            <View style={styles.matchListContainer}>
              <FlatList
                data={topMatches}
                keyExtractor={(item) => item.userId}
                renderItem={({ item }) => (
                  <View style={styles.matchItem}>
                    <Text style={styles.matchText}>User ID: {item.userId}</Text>
                    <Text style={styles.matchText}>Similarity: {item.similarity ? item.similarity.toFixed(2) : 'N/A'}</Text>
                  </View>
                )}
              />
            </View>
          ) : (
            <Text style={styles.noRecommendationsText}>No top matches available.</Text>
          )}

          {/* Display Recommended Communities */}
          {recommendations && recommendations.length === 0 ? (
            <Text style={styles.noRecommendationsText}>No recommendations available.</Text>
          ) : (
            <ScrollView>
              <CommuColumnOfCards cards={recommendations} onPress={openCommunityDetails} />
            </ScrollView>
          )}
        </>
      )}
      <CommunityDetailsModal
        visible={isModalVisible}
        communityDetails={selectedCommunity}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, marginVertical: 10 },
  errorText: { textAlign: "center", fontSize: 18, color: "red" },
  noRecommendationsText: { textAlign: "center", fontSize: 18, color: "gray" },
  matchItem: { marginBottom: 10, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 8 },
  matchText: { fontSize: 16, color: "#333" },
  matchListContainer: { marginBottom: 20 },
});

export default CommunityRecommendationScreen;
