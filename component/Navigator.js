import React, {useCallback} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screen/homeScreens/homeScreen';
import CommunityHomeScreen from '../screen/communityScreens/communityHomeScreen';
import RankingScreen from '../screen/rankingScreens/rankingScreen';
import StudyScreen from '../screen/studyScreen';
import AddAllowedAppScreen from '../screen/addAllowedAppScreen';
import ProfileScreen from '../screen/profileScreen';
import NotificationScreen from '../screen/notificationScreens/notificationScreen';
import {
  HomeLeftHeader,
  HomeRightHeader,
  StudyingRightHeader,
} from '../component/Header';
import {CustomMenu} from '../component/Custom';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const icons = {
  HomeStack: 'home',
  Community: 'people-sharp',
  Ranking: 'podium',
};
const TabBarIcon = ({name, color, size}) => {
  return <Ionicons name={name} size={size} color={color} />;
};
const getScreenOptions = route => ({
  headerShown: false,
  tabBarShowLabel: false,
  tabBarStyle: {
    borderTopColor: '#000',
    borderTopWidth: 1,
  },
  tabBarItemStyle: {
    borderColor: '#000',
    borderLeftWidth: 1,
  },
  tabBarActiveTintColor: '#014099', // 활성화된 탭 색상
  tabBarInactiveTintColor: '#858585', // 비활성화된 탭 색상
  tabBarIcon: ({focused, color, size = 24}) => (
    <TabBarIcon name={icons[route.name]} color={color} size={size} />
  ),
});
export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({route}) => getScreenOptions(route)}>
      <Tab.Screen name="HomeStack" component={HomeScreen} />
      <Tab.Screen name="Community" component={CommunityHomeScreen} />
      <Tab.Screen name="Ranking" component={RankingScreen} />
    </Tab.Navigator>
  );
};

export const MainStackNavigator = ({menuVisible, setMenuVisible}) => {
  const headerLeft = useCallback(
    () => <HomeLeftHeader onPress={() => setMenuVisible(!menuVisible)} />,
    [menuVisible, setMenuVisible],
  );
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: '#fdf7ff'},
          headerTintColor: '#000',
          headerTitleStyle: {fontWeight: 'bold'},
        }}>
        <Stack.Screen
          name="Tab"
          component={BottomTabNavigator}
          options={() => ({
            title: '슈퍼눈떠봐',
            headerRight: HomeRightHeader,
            headerLeft: headerLeft,
          })}
        />
        <Stack.Screen
          name="Study"
          component={StudyScreen}
          options={{
            title: '학습 중',
            headerRight: StudyingRightHeader,
          }}
        />
        <Stack.Screen name="허용앱" component={AddAllowedAppScreen} />
        <Stack.Screen name="프로필" component={ProfileScreen} />
        {/* 나중에 프로필에 로그아웃 아이콘 추가할 것*/}
        <Stack.Screen name="알림" component={NotificationScreen} />
      </Stack.Navigator>
      <CustomMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={null}
      />
    </>
  );
};
