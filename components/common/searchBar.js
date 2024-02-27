// SearchBar.js
import React from 'react';
import { View, TextInput, Pressable, Image } from 'react-native';
import { allCommunityStyles } from '../../style/community/AllCommunityStyle';

const SearchBar = ({ value, onChange, onSearch }) => {
  return (
    <View style={allCommunityStyles.bookInputContainer}>
      <TextInput
        style={allCommunityStyles.input}
        placeholder="Community Name"
        value={value}
        onChangeText={onChange}
      />
      <Pressable onPress={onSearch} style={{ paddingLeft: 20 }}>
        <Image
          source={require('../../assets/icons/searchIcon.png')}
          style={{ width: 24, height: 24 }}
        />
      </Pressable>
    </View>
  );
};

export default SearchBar;
