import React from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {commonStyles} from '../public/styles';
import {useNavigation} from '@react-navigation/native';

export const CustomButton = ({navigation, destination, text}) => {
  return (
    <TouchableOpacity
      style={commonStyles.button}
      onPress={() => navigation.navigate(destination)}>
      <Text style={commonStyles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};
export const CustomLoginInput = ({text, condition}) => {
  return (
    <TextInput
      style={commonStyles.input}
      placeholder={text}
      placeholderTextColor="#999"
      secureTextEntry={condition}
    />
  );
};
export const CustomMenuButton = ({title, onPress}) => (
  <TouchableOpacity style={commonStyles.menuButton} onPress={onPress}>
    <Text style={commonStyles.menuText}>{title}</Text>
  </TouchableOpacity>
);
export const CustomMenu = ({visible, onClose}) => {
  const navigation = useNavigation();
  const handleNavigate = (routeName, initialIndex = 0) => {
    onClose();
    navigation.navigate(routeName, {initialIndex});
  };
  if (!visible) {
    return null;
  }

  return (
    <View style={commonStyles.menuContainer}>
      <CustomMenuButton title="Home" onPress={() => handleNavigate('Home')} />
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
