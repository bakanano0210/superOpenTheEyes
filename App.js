import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from './screen/homeScreens/homeScreen';
import StudyScreen from './screen/studyScreen';
import LoginScreen from './screen/loginScreen';
import RegistrationScreen from './screen/registrationScreen';
import CommunityHomeScreen from './screen/communityScreens/communityHomeScreen';
import RankingScreen from './screen/rankingScreens/rankingScreen';
import AddAllowedAppScreen from './screen/addAllowedAppScreen';
import ProfileScreen from './screen/profileScreen';

import {
  HomeLeftHeader,
  HomeRightHeader,
  StudyingRightHeader,
} from './component/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';


const {width} = Dimensions.get('window');

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MenuButton = ({title, onPress}) => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress}>
    <Text style={styles.menuText}>{title}</Text>
  </TouchableOpacity>
);
const CustomMenu = ({visible, onClose}) => {
  const navigation = useNavigation();
  const handleNavigate = (routeName, initialIndex = 0) => {
    onClose();
    navigation.navigate(routeName, {initialIndex});
  };
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.menuContainer}>
      <MenuButton title="Home" onPress={() => handleNavigate('Home')} />
      <MenuButton title="허용앱" onPress={() => handleNavigate('허용앱')} />
      <MenuButton
        title="스터디 그룹"
        onPress={() => handleNavigate('Community', 0)}
      />
      <MenuButton
        title="도움 요청"
        onPress={() => handleNavigate('Community', 1)}
      />
      <MenuButton title="퀴즈" onPress={() => handleNavigate('Community', 2)} />
    </View>
  );
};

const BottomTabNavigator = ({menuVisible, setMenuVisible}) => {
  //const navigation = useNavigation();
  // 메뉴가 안사라지는 문제
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('tabPress', () => {
  //     console.log(menuVisible);
  //     setMenuVisible(false);
  //   });
  //   return unsubscribe;
  // }, []);
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
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
        tabBarIcon: ({color, size}) => {
          const icons = {
            Home: 'home',
            Community: 'people-sharp',
            Ranking: 'podium',
          };
          return (
            <Ionicons name={icons[route.name]} size={size} color={color} />
          );
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Community" component={CommunityHomeScreen} />
      <Tab.Screen name="Ranking" component={RankingScreen} />
    </Tab.Navigator>
  );
};

const MainStackNavigator = ({menuVisible, setMenuVisible}) => {
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
          options={() => ({
            title: '슈퍼눈떠봐',
            headerRight: HomeRightHeader,
            headerLeft: () => (
              <HomeLeftHeader onPress={() => setMenuVisible(!menuVisible)} />
            ),
          })}>
          {() => (
            <BottomTabNavigator
              menuVisible={menuVisible}
              setMenuVisible={setMenuVisible}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Study"
          component={StudyScreen}
          options={{
            title: '학습 중',
            headerRight: StudyingRightHeader,
          }}
        />
        <Stack.Screen name="허용앱" component={AddAllowedAppScreen} />
      </Stack.Navigator>
      <CustomMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={null}
      />
    </>
  );
};
const App = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="MainApp">
          {() => (
            <MainStackNavigator
              menuVisible={menuVisible}
              setMenuVisible={setMenuVisible}
            />
          )}
        </Stack.Screen>
        <Stack.Screen 
          name="Profile"
          component={ProfileScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    position: 'absolute',
    top: 50, // HomeLeftHeader 아래에 위치하도록 조정
    left: 10, // 필요에 따라 조정
    width: width * 0.3,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  menuButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default App;
