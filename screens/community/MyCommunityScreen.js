import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView } from 'react-native';
import BottomNavigator from '../../navigation/BottomNavigator';
import FloatingButton from '../../components/common/FloatingAddButton';
import { useNavigation } from '@react-navigation/native';
import { signUpStyles } from '../../style/user/SignUpStyle';
import { allCommunityStyles } from '../../style/community/AllCommunityStyle';
import MyCommuColumnOfCards from '../../components/Community/MyCommuColumnOfCards';
import { db, auth } from '../../backend/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { updateDoc, arrayRemove, doc } from 'firebase/firestore';
import SearchBar from '../../components/common/searchBar';

const MyCommunityScreen = () => {
  const navigation = useNavigation();
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
  });

  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const q = query(collection(db, 'communities'), where('members', 'array-contains', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const communityData = snapshot.docs.map((doc) => doc.data());
        setCommunities(communityData);
      });

      return () => unsubscribe();
    }
  }, []);

  const openCommunityDetails = (communityId) => {
    navigation.navigate('Community', { communityId });
  };


  const deleteCommunity = () => {
    setIsModalVisible(false);
  };

  const isOwner = (community) => {
    const user = auth.currentUser;
    return user && community.createdBy === user.uid;
  };

  const leaveCommunity = async (community) => {
    const user = auth.currentUser;
    alert('hello');
    if (user && community && community.communityId
    ) {
      try {
        if (!isOwner(community)) {
          const communityRef = doc(db, 'communities', community.communityId
          );
          await updateDoc(communityRef, {
            members: arrayRemove(user.uid),
          });
          alert('hello2');
          setIsModalVisible(false);
        } else {
          alert("คุณไม่สามารถออกจากชุมชนของคุณเองได้");
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการออกจากชุมชน: ', error);
      }
    }
  };

  return (
    <View style={signUpStyles.container}>
      <SafeAreaView>
        <View style={signUpStyles.titleContainer}>
          <Text style={allCommunityStyles.title}>ชุมชนของฉัน</Text>
        </View>
      </SafeAreaView>
      <View style={[allCommunityStyles.contentContainer]}>
        <SearchBar
          value={newCommunity.name}
          onChange={(text) => setNewCommunity({ ...newCommunity, name: text })}
          onSearch={() => alert('Perform search')}
        />
        <ScrollView>
          <View>
            {communities.length > 0 ? (
              <MyCommuColumnOfCards
                cards={communities}
                onPress={(community) => openCommunityDetails(community.communityId)}
                onLeave={(community) => leaveCommunity(community)}
                cardWidth={170}
                isOwner={isOwner}
              />
            ) : (
              <Text>No communities available</Text>
            )}
          </View>
        </ScrollView>
      </View>
      <FloatingButton targetScreen="CreateCommunity" />
      <BottomNavigator style={allCommunityStyles.bottomNavigator} />
    </View>
  );
};

export default MyCommunityScreen;