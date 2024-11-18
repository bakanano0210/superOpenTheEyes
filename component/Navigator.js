import React from 'react';
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
import HelpRequestViewScreen from '../screen/communityScreens/helpRequestViewScreen';
import {
  EmptyLeftHeader,
  HomeLeftHeader,
  HomeRightHeader,
  ProfileRightHeader,
  StudyingRightHeader,
} from './header';
import {CustomMenu} from './custom';
import {useMainContext} from './mainContext';
import StudyGroupDetailScreen from '../screen/communityScreens/studyGroupDetailScreen';
import HelpRequestPostScreen from '../screen/communityScreens/helpRequestPostScreen';
import QuizPostScreen from '../screen/communityScreens/quizPostScreen';

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
const defaultScreenOptions = {
  headerShown: true,
  headerTitleAlign: 'center',
  headerStyle: {backgroundColor: '#fdf7ff'},
  headerTintColor: '#000',
  headerTitleStyle: {fontWeight: 'bold'},
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
  tabBarIcon: ({color, size = 24}) => (
    <TabBarIcon name={icons[route.name]} color={color} size={size} />
  ),
});

export const BottomTabNavigator = () => {
  const {setMenuVisible} = useMainContext();
  const tabEvent = () => setMenuVisible(false);
  return (
    <Tab.Navigator screenOptions={({route}) => getScreenOptions(route)}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        listeners={{tabPress: tabEvent}}
      />
      <Tab.Screen
        name="Community"
        component={CommunityStackNavigator}
        listeners={{tabPress: tabEvent}}
      />
      <Tab.Screen
        name="Ranking"
        component={RankingStackNavigator}
        listeners={{tabPress: tabEvent}}
      />
    </Tab.Navigator>
  );
};

export const MainStackNavigator = () => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: '#fdf7ff'},
          headerTintColor: '#000',
          headerTitleStyle: {fontWeight: 'bold'},
        }}>
        <Stack.Screen
          name="Tab"
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Study"
          component={StudyScreen}
          options={{
            title: '학습 중',
            headerRight: StudyingRightHeader,
            headerLeft: EmptyLeftHeader,
          }}
        />
        <Stack.Screen name="허용앱" component={AddAllowedAppScreen} />
        <Stack.Screen
          name="프로필"
          component={ProfileScreen}
          options={{headerRight: ProfileRightHeader}}
        />
        <Stack.Screen name="알림" component={NotificationScreen} />
      </Stack.Navigator>
      <CustomMenu />
    </>
  );
};

const CommunityStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="CommunityHome"
        component={CommunityHomeScreen}
        options={{
          title: '커뮤니티',
          headerLeft: HomeLeftHeader,
          headerRight: HomeRightHeader,
        }}
      />
      <Stack.Screen
        name="StudyGroupDetail"
        component={StudyGroupDetailScreen}
        options={{
          headerRight: HomeRightHeader,
        }}
      />
      <Stack.Screen
        name="HelpRequestView"
        component={HelpRequestViewScreen}
        options={{title: '게시글'}}
      />
      <Stack.Screen
        name="HelpRequestPost"
        component={HelpRequestPostScreen}
        options={{title: '게시글'}}
      />
      <Stack.Screen
        name="QuizPost"
        component={QuizPostScreen}
        options={{title: '퀴즈'}}
      />
    </Stack.Navigator>
  );
};

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: '슈퍼눈떠봐',
          headerLeft: HomeLeftHeader,
          headerRight: HomeRightHeader,
        }}
      />
    </Stack.Navigator>
  );
};
const RankingStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="RankingScreen"
        component={RankingScreen}
        options={{
          title: '랭킹',
          headerLeft: HomeLeftHeader,
          headerRight: HomeRightHeader,
        }}
      />
    </Stack.Navigator>
  );
};
