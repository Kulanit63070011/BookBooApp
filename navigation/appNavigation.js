import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/user/WelcomeScreen';
import SignUpScreen from '../screens/user/SignUpScreen';
import CustomHeader from './CustomHeader';
import MyBookShelfScreen from '../screens/bookshelf/MyBookShelfScreen';
import CreateMyBookScreen from '../screens/bookshelf/CreateMyBookScreen';
import LoginScreen from '../screens/user/LoginScreen';
import CreateCommunityScreen from '../screens/community/CreateCommunityScreen';
import EditCommunityScreen from '../screens/community/EditCommunityScreen';
import AllCommunityScreen from '../screens/community/AllCommunityScreen';
import MyCommunityScreen from '../screens/community/MyCommunityScreen';
import CreateCalendarScreen from '../screens/community/calendar/CreateCalendarScreen';
import EditCalendarScreen from '../screens/community/calendar/EditCalendarScreen';
import EditProfileScreen from '../screens/user/EditProfileScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import AllChatScreen from '../screens/chat/AllChatScreen';
import MyProfileScreen from '../screens/user/MyProfileScreen';
import MyNotificationScreen from '../screens/user/MyNotificationScreen';
import CalendarCommunityScreen from '../screens/community/calendar/CalendarCommunityScreen';
import CommunityScreen from '../screens/community/CommunityScreen';
import AllSharedBookScreen from '../screens/market/sharedBook/AllSharedBookScreen';
import CreateSharedBookScreen from '../screens/market/sharedBook/CreateSharedBookScreen';
import EditSharedBookScreen from '../screens/market/sharedBook/EditSharedBookScreen';
import PromotionScreen from '../screens/market/promotion/PromotionScreen';
import CreatePromotionScreen from '../screens/market/promotion/CreatePromotionScreen';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Welcome'
        screenOptions={({ route }) => ({
          header: ({ scene }) => {
            const { name } = route;
            // Show custom header for "SignUp" screen
            // if (name === 'MyBookShelf') {
            //   return <CustomHeader title={name} />;
            // }

            // Hide title for "Login" screen
            if (name === 'Login' || 'SignUp') {
              return <CustomHeader title="" />;
            }

            // Default behavior for other screens
            return <CustomHeader title={name} />;
          },
          headerShown: true,
        })}
      >
        <Stack.Screen
          name="Welcome"
          options={{ headerShown: false }}
          component={WelcomeScreen}
        />
        <Stack.Screen
          name="Login"
          options={{ headerShown: true }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="SignUp"
          options={{ title: 'Sign Up' }}
          component={SignUpScreen}
        />
        <Stack.Screen
          name="MyProfile"
          options={{ headerShown: true }}
          component={MyProfileScreen}
        />
        <Stack.Screen
          name="EditProfile"
          options={{ headerShown: true }}
          component={EditProfileScreen}
        />
        <Stack.Screen
          name="Chat" // Specify the name for ChatScreen
          options={{ headerShown: true }}
          component={ChatScreen} // Use the ChatScreen component
        />
        <Stack.Screen
          name="AllChat"
          options={{ headerShown: true }}
          component={AllChatScreen}
        />
        <Stack.Screen
          name="MyNotification"
          options={{ headerShown: true }}
          component={MyNotificationScreen}
        />
        <Stack.Screen
          name="CreateMyBook"
          options={{ headerShown: true }}
          component={CreateMyBookScreen}
        />
        <Stack.Screen
          name="MyBookShelf"
          options={{ headerShown: true }}
          component={MyBookShelfScreen}
        />
        <Stack.Screen
          name="CreateCommunity"
          options={{ headerShown: true }}
          component={CreateCommunityScreen}
        />
        <Stack.Screen
          name="MyCommunity"
          options={{ headerShown: true }}
          component={MyCommunityScreen}
        />
        <Stack.Screen
          name="Community"
          options={{ headerShown: true }}
          component={CommunityScreen}
        />
        <Stack.Screen
          name="EditCommunity"
          options={{ headerShown: true }}
          component={EditCommunityScreen}
        />
        <Stack.Screen
          name="AllCommunity"
          options={{ headerShown: true }}
          component={AllCommunityScreen}
        />
        <Stack.Screen
          name="CreateCalendar"
          options={{ headerShown: true }}
          component={CreateCalendarScreen}
        />
        <Stack.Screen
          name="CalendarCommunity"
          options={{ headerShown: true }}
          component={CalendarCommunityScreen}
        />
        <Stack.Screen
          name="EditCalendar"
          options={{ headerShown: true }}
          component={EditCalendarScreen}
        />
        <Stack.Screen
          name="AllSharedBook"
          options={{ headerShown: true }}
          component={AllSharedBookScreen}
        />
        <Stack.Screen
          name="CreateSharedBook"
          options={{ headerShown: true }}
          component={CreateSharedBookScreen}
        />
        <Stack.Screen
          name="EditSharedBook"
          options={{ headerShown: true }}
          component={EditSharedBookScreen}
        />
        <Stack.Screen
          name="Promotion"
          options={{ headerShown: true }}
          component={PromotionScreen}
        />
        <Stack.Screen
          name="CreatePromotion"
          options={{ headerShown: true }}
          component={CreatePromotionScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
