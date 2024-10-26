import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useMainContext} from './mainContext';

const {width} = Dimensions.get('window');

export const HomeLeftHeader = () => {
  const {menuVisible, setMenuVisible} = useMainContext();
  return (
    <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
      <Ionicons name="menu" size={24} color="#000" />
    </TouchableOpacity>
  );
};

export const HomeRightHeader = () => {
  const {setMenuVisible} = useMainContext();
  const navigation = useNavigation();
  return (
    <>
      <TouchableOpacity
        style={styles.homeRightHeaderStyle}
        onPress={() => {
          console.log('Notifications pressed!');
          setMenuVisible(false);
          navigation.navigate('알림');
        }}>
        <Ionicons name="notifications" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          console.log('Profile pressed!');
          setMenuVisible(false);
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
      style={styles.studyingRightHeaderStyle}
      onPress={() => console.log('허용 앱 pressed!')}>
      <Ionicons name="checkmark-circle-outline" size={24} color="#000" />
      <Text>허용앱</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  homeRightHeaderStyle: {
    marginRight: width * 0.025,
  },
  studyingRightHeaderStyle: {
    backgroundColor: '#e8def8',
    marginRight: width * 0.025,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.05,
    borderRadius: 5,
  },
  //헤더 스타일 정의
});
