import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {commonStyles} from '../public/styles';
import {CustomLoginInput} from '../component/custom';

const {width, height} = Dimensions.get('window');
const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    // 이메일 형식 검증
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Alert.alert('오류', '올바르지 않은 이메일 형식입니다.');
      return;
    }

    try {
      // 서버에 비밀번호 재설정 요청
      const response = await fetch(
        'http://your-api-url/users/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email}),
        },
      );

      if (response.ok) {
        Alert.alert('성공', '비밀번호 재설정 링크가 이메일로 전송되었습니다.');
      } else {
        const errorText = await response.text();
        Alert.alert('오류', errorText);
      }
    } catch (error) {
      Alert.alert('오류', '비밀번호 재설정 요청 실패');
    }
  };

  return (
    <View style={styles.loginContainer}>
      <View style={styles.downContainer}>
        {/* <CustomLoginInput
          text="이메일을 입력하세요."
          condition={false}
          func={setEmail}
        />
        <CustomLoginInput
          text="비밀번호를 입력하세요."
          condition={true}
          func={setPassword}
        />
        <CustomLoginInput
          text="비밀번호 확인"
          condition={true}
          func={setConfirmPassword}
        />
        <CustomLoginInput
          text="닉네임 입력"
          condition={false}
          func={setUsername}
        />
        <View>
          <CustomButton
            navigation={navigation}
            destination="Home"
            text="비밀번호 찾기"
            onPress={handleForgotPassword}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.loginButtonStyle}>
          <Text style={styles.loginText}>로그인하기</Text>
        </TouchableOpacity> */}
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
    flex: 2,
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
export default ForgotPasswordScreen;
