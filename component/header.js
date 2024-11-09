import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {TabBar} from 'react-native-tab-view';
import {useMainContext} from './mainContext';

const {width} = Dimensions.get('window');

export const HomeLeftHeader = () => {
  const {menuVisible, setMenuVisible} = useMainContext();

  return (
    <TouchableOpacity
      onPress={() => {
        setMenuVisible(!menuVisible);
        console.log(menuVisible);
        console.log('leftHeader Click!!');
      }}>
      <Ionicons name="menu" size={24} color="#000" />
    </TouchableOpacity>
  );
};
export const EmptyLeftHeader = () => {
  return <View />;
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
export const ProfileRightHeader = () => {
  console.log('ProfileRightHeader Called');
  return (
    <TouchableOpacity onPress={() => console.log('로그아웃 pressed!')}>
      <Ionicons
        name="log-out-outline"
        size={24}
        color="#000"
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};
export const CommunityOwnerRightHeader = ({setMenuVisible}) => {
  return (
    <TouchableOpacity onPress={() => setMenuVisible(true)}>
      <Ionicons name="ellipsis-vertical" size={24} color="#000" />
    </TouchableOpacity>
  );
};
export const customRenderTabBar = props => {
  const {key, ...rest} = props;
  return (
    <TabBar
      {...rest}
      style={{backgroundColor: '#fdf7ff'}}
      indicatorStyle={{
        backgroundColor: '#2196F3',
        height: 2,
      }}
      activeColor={'#2196F3'} // 활성화된 탭 색상
      inactiveColor={'#666'} // 비활성화된 탭 색상
      renderLabel={({route, focused, color}) => {
        const weight = focused ? {fontWeight: 'bold'} : {};
        return (
          <Text
            style={{
              color,
              ...weight,
            }}>
            {route.title}
          </Text>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  homeRightHeaderStyle: {
    marginRight: width * 0.025,
  },
  studyingRightHeaderStyle: {
    backgroundColor: '#e8def8',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  icon: {
    textShadowColor: '#000', // 그림자 색상
    textShadowOffset: {width: 1, height: 1}, // 그림자 위치
    textShadowRadius: 1, // 그림자 강도
  },
  //헤더 스타일 정의
});
