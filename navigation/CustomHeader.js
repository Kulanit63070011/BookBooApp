import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';

const CustomHeader = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <ArrowLeftIcon size={20} color="white" />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7743DB',
    height: 60, // Set your desired height
    paddingTop:0
  },
  backButton: {
    position: 'absolute',
    left: 20,
    paddingTop:0
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    paddingTop: 20
  },
});

export default CustomHeader;