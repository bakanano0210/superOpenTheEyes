import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {headerStyle} from '../public/styles';
import {useNavigation} from '@react-navigation/native';

export const HomeLeftHeader = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons name="menu" size={24} color="#000" />
    </TouchableOpacity>
  );
};

export const HomeRightHeader = () => {
  const navigation = useNavigation();
  return (
    <>
      <TouchableOpacity
        style={headerStyle.homeRightHeaderStyle}
        onPress={() => {
          console.log('Notifications pressed!');
          navigation.navigate('알림');
        }}>
        <Ionicons name="notifications" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          console.log('Profile pressed!');
          navigation.navigate('프로필');
        }}>
        <Ionicons name="person-circle-outline" size={24} color="#000" />
      </TouchableOpacity>
    </>
  );
};
export const StudyingRightHeader = () => {
  return (
    <TouchableOpacity
      style={headerStyle.studyingRightHeaderStyle}
      onPress={() => console.log('허용 앱 pressed!')}>
      <Ionicons name="checkmark-circle-outline" size={24} color="#000" />
      <Text>허용앱</Text>
    </TouchableOpacity>
  );
};
