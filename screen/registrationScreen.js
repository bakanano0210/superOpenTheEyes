import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {CustomButton, CustomLoginInput} from '../component/custom';
import {loginStyles, commonStyles} from '../public/styles';

const RegistrationScreen = ({navigation}) => {
  return (
    <View style={loginStyles.loginContainer}>
      <View style={loginStyles.upContainer}>
        <Text style={commonStyles.title}>Welcome To</Text>
        <Text style={commonStyles.subtitle}>슈퍼눈떠봐</Text>
      </View>
      <View style={loginStyles.downContainer}>
        <CustomLoginInput text="이메일을 입력하세요." condition={false} />
        <CustomLoginInput text="비밀번호를 입력하세요." condition={true} />
        <CustomLoginInput text="비밀번호 확인" condition={true} />
        <CustomButton
          navigation={navigation}
          destination="Home"
          text="회원가입"
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={loginStyles.loginButtonStyle}>
          <Text style={loginStyles.loginText}>로그인하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegistrationScreen;
