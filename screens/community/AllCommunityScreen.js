import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../backend/firebase';
import CommuColumnOfCards from '../../components/Community/CommuColumnOfCards';
import CommunityDetailsModal from '../../components/Community/CommunityDetailsModal';
import FloatingButton from '../../components/common/FloatingAddButton';
import BottomNavigator from '../../navigation/BottomNavigator';
import SearchBar from '../../components/common/searchBar';
import { allCommunityStyles } from '../../style/community/AllCommunityStyle';
import { signUpStyles } from '../../style/user/SignUpStyle';
import FilterByPopup from '../../components/Community/FilterByModal';
import { MaterialIcons } from '@expo/vector-icons';
import CommunityNavigationButtons from '../../components/Community/CommunityNavigationButtons';

const AllCommunityScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [newCommunity, setNewCommunity] = useState({name: '', description: '',});
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false); // เพิ่ม state สำหรับการควบคุมการแสดง FilterByPopup

  const addCommunity = () => {
    // ... (No changes here)
  };

  useEffect(() => {
    console.log('Modal visibility inside component:', isModalVisible);
  }, [isModalVisible]);

  useEffect(() => {
    console.log('Community details inside component:', selectedCommunity);
  }, [selectedCommunity]);

  const openCommunityDetails = (community) => {
    setSelectedCommunity(community);
    setIsModalVisible(true);
  };

  const deleteCommunity = () => {
    setIsModalVisible(false);
  };

  const navigateToCreateCommunity = () => {
    navigation.navigate('CreateCommunityScreen');
  };

  // Use onSnapshot to listen for real-time updates to the communities collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'communities'), (snapshot) => {
      const communityData = snapshot.docs.map((doc) => doc.data());
      setCommunities(communityData);
    });

    // Clean up the subscription when the component unmounts or loses focus
    return () => unsubscribe();
  }, [isFocused]);

  return (
    <View style={signUpStyles.container}>
      <SafeAreaView>
        <View style={signUpStyles.titleContainer}>
          <Text style={allCommunityStyles.title}>Community</Text>
        </View>
      </SafeAreaView>
      <View style={allCommunityStyles.contentContainer}>
        <CommunityNavigationButtons />
        <SearchBar
          value={newCommunity.name}
          onChange={(text) => setNewCommunity({ ...newCommunity, name: text })}
          onSearch={() => alert('Perform search')}
        />
        <Pressable onPress={() => setIsFilterVisible(true)}>
          <MaterialIcons name="filter-list" size={24} color="black" />
        </Pressable>
        <ScrollView>
          <View>
            {communities.length > 0 ? (
              <CommuColumnOfCards cards={communities} onPress={openCommunityDetails} />
            ) : (
              <Text>ไม่มีชุมชนที่ใช้งานอยู่</Text>
            )}
          </View>
        </ScrollView>
      </View>
      <FloatingButton targetScreen="CreateCommunity" />
      <BottomNavigator style={allCommunityStyles.bottomNavigator} />
      <CommunityDetailsModal
        visible={isModalVisible}
        communityDetails={selectedCommunity}
        onClose={() => setIsModalVisible(false)}
        onDelete={deleteCommunity}
      />
      {/* แสดง FilterByPopup ถ้า isFilterVisible เป็น true */}
      {isFilterVisible && <FilterByPopup />}
    </View>
  );
};

export default AllCommunityScreen;