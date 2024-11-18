import React from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {commonStyles} from '../public/styles';
import {useNavigation} from '@react-navigation/native';

import {useMainContext} from './mainContext';

export const CustomButton = ({onPress, text}) => {
  return (
    <TouchableOpacity style={commonStyles.button} onPress={onPress}>
      <Text style={commonStyles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};
export const CustomLoginInput = ({text, condition, func, value}) => {
  return (
    <TextInput
      style={commonStyles.input}
      placeholder={text}
      placeholderTextColor="#999"
      secureTextEntry={condition}
      onChangeText={func}
      value={value}
    />
  );
};
export const CustomMenuButton = ({title, onPress}) => (
  <TouchableOpacity style={commonStyles.menuButton} onPress={onPress}>
    <Text style={commonStyles.menuText}>{title}</Text>
  </TouchableOpacity>
);

export const CustomMenu = () => {
  const {menuVisible, setMenuVisible} = useMainContext();
  const navigation = useNavigation();
  const handleNavigate = (routeName, initialIndex = 0) => {
    setMenuVisible(false);
    if (routeName === 'Community') {
      navigation.navigate(routeName, {
        screen: 'CommunityHome',
        params: {initialIndex},
      });
    } else {
      navigation.navigate(routeName, {initialIndex});
    }
  };
  if (!menuVisible) {
    return null;
  }
  return (
    <View style={commonStyles.menuContainer}>
      <CustomMenuButton
        title="Home"
        onPress={() => handleNavigate('HomeStack')}
      />
      <CustomMenuButton
        title="허용앱"
        onPress={() => handleNavigate('허용앱')}
      />
      <CustomMenuButton
        title="스터디 그룹"
        onPress={() => handleNavigate('Community', 0)}
      />
      <CustomMenuButton
        title="도움 요청"
        onPress={() => handleNavigate('Community', 1)}
      />
      <CustomMenuButton
        title="퀴즈"
        onPress={() => handleNavigate('Community', 2)}
      />
    </View>
  );
};
export const handleNavigate = ({navigation}, destination) => {
  navigation.navigate(destination); // 원하는 화면으로 이동
};
