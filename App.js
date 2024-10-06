import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screen/homeScreen';
import StudyScreen from './screen/studyScreen';
import LoginScreen from './screen/loginScreen';
import RegistrationScreen from './screen/registrationScreen';
import {TouchableOpacity, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {headerStyle} from './public/styles';

const Stack = createNativeStackNavigator();
const HomeLeftHeader = () => {
  return (
    <TouchableOpacity>
      <Ionicons name="menu" size={24} color="#000" />
    </TouchableOpacity>
  );
};
const HomeRightHeader = () => {
  return (
    <>
      <TouchableOpacity
        style={headerStyle.homeRightHeaderStyle}
        onPress={() => console.log('Notifications pressed!')}>
        <Ionicons name="notifications" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log('Profile pressed!')}>
        <Ionicons name="person-circle-outline" size={24} color="#000" />
      </TouchableOpacity>
    </>
  );
};
const StudyingRightHeader = () => {
  return (
    <TouchableOpacity
      style={headerStyle.studyingRightHeaderStyle}
      onPress={() => console.log('허용 앱 pressed!')}>
      <Ionicons name="checkmark-circle-outline" size={24} color="#000" />
      <Text>허용앱</Text>
    </TouchableOpacity>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fdf7ff',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: '슈퍼눈떠봐',
            headerBackVisible: false,
            headerLeft: HomeLeftHeader,
            headerRight: HomeRightHeader,
          }}
        />
        <Stack.Screen
          name="Study"
          component={StudyScreen}
          options={{
            title: '학습 중',
            headerRight: StudyingRightHeader,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
