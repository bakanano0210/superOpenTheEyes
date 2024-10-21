import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {loginStyles, commonStyles} from '../public/styles';
import {CustomButton, CustomLoginInput} from '../component/Custom';

const LoginScreen = ({navigation}) => {
  return (
    <View style={loginStyles.loginContainer}>
      <View style={loginStyles.upContainer}>
        <Text style={commonStyles.title}>Welcome To</Text>
        <Text style={commonStyles.subtitle}>슈퍼눈떠봐</Text>
      </View>
      <ScrollView
        style={loginStyles.downContainer}
        contentContainerStyle={loginStyles.downContainerContentStyle}>
        <CustomLoginInput text="이메일을 입력하세요" condition={false} />
        <CustomLoginInput text="비밀번호를 입력하세요" condition={true} />
        <View style={[loginStyles.optionsContainer]}>
          <BouncyCheckbox
            size={loginStyles.checkboxSize}
            fillColor="#00a7eb"
            value={false}
            textComponent={<Text style={loginStyles.label}>로그인 유지</Text>}
            iconStyle={loginStyles.checkboxIconStyle}
            style={loginStyles.checkboxStyle} // 부모 View에서 수평 중앙 정렬
          />
          <TouchableOpacity>
            <Text style={loginStyles.forgotPassword}>비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>
        <View style={loginStyles.buttonView}>
          <CustomButton
            navigation={navigation}
            destination="MainApp"
            text="로그인"
          />
          <CustomButton
            navigation={navigation}
            destination="Registration"
            text="회원가입"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;
