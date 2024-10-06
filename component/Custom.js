import React from 'react';
import {Text, TextInput, TouchableOpacity} from 'react-native';
import {commonStyles} from '../public/styles';

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
