import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {CustomButton, CustomLoginInput} from '../component/custom';
import {commonStyles} from '../public/styles';

const {width, height} = Dimensions.get('window');

const RegistrationScreen = ({navigation}) => {
  return (
    <View style={styles.loginContainer}>
      <View style={styles.upContainer}>
        <Text style={commonStyles.title}>Welcome To</Text>
        <Text style={commonStyles.subtitle}>슈퍼눈떠봐</Text>
      </View>
      <View style={styles.downContainer}>
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
          style={styles.loginButtonStyle}>
          <Text style={styles.loginText}>로그인하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: width * 0.05,
  },
  upContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  downContainer: {
    flex: 1,
  },
  loginButtonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  loginText: {
    color: '#000000',
    fontSize: height * 0.015,
  },
});
export default RegistrationScreen;
