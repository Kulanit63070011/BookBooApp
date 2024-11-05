import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { fetchUserInterests, fetchCommunityData } from "../../backend/fetchData";
import { recommendCommunities } from "../../models/recommendationModel";

const CommunityRecommendationScreen = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [communityData, setCommunityData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribeUserInterests = fetchUserInterests(setUserInterests);
    return () => unsubscribeUserInterests();
  }, []);

  useEffect(() => {
    const unsubscribeCommunityData = fetchCommunityData(setCommunityData, setError);
    return () => unsubscribeCommunityData();
  }, []);

  useEffect(() => {
    if (communityData.length > 0) {
      if (userInterests.length > 0) {
        recommendCommunities(communityData, userInterests)
          .then((recommended) => setRecommendations(recommended))
          .catch((error) => setError("Error generating recommendations"));
      } else {
        // ถ้าไม่มีความสนใจ ให้แสดงชุมชนแบบสุ่ม
        const randomRecommendations = communityData.sort(() => 0.5 - Math.random()).slice(0, 10);
        setRecommendations(randomRecommendations);
      }
    }
  }, [communityData, userInterests]);

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Communities</Text>
      {recommendations.length === 0 ? (
        <Text style={styles.noRecommendationsText}>No recommendations available.</Text>
      ) : (
        <FlatList
          data={recommendations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable style={styles.card}>
              <Text style={styles.communityName}>{item.name}</Text>
              <Text style={styles.scoreText}>Type: {item.type}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  errorText: { textAlign: "center", fontSize: 18, color: "red" },
  noRecommendationsText: { textAlign: "center", fontSize: 18, color: "gray" },
  card: { padding: 15, marginVertical: 10, backgroundColor: "#f9f9f9", borderRadius: 8 },
  communityName: { fontSize: 20, fontWeight: "600" },
  scoreText: { fontSize: 16, color: "#555" },
});

export default CommunityRecommendationScreen;
