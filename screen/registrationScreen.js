import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
} from 'react-native';
import {CustomButton, CustomLoginInput} from '../component/custom';
import {commonStyles} from '../public/styles';

const {width, height} = Dimensions.get('window');

const RegistrationScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  // 이메일로 인증번호 전송 요청
  const handleSendVerificationCode = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Alert.alert('오류', '올바르지 않은 이메일 형식입니다.');
      return;
    }
    try {
      const response = await fetch(
        'http://10.0.2.2:8082/users/send-verification-code',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email}),
        },
      );

      if (response.ok) {
        setIsCodeSent(true);
        Alert.alert('인증번호 전송', '인증번호가 이메일로 발송되었습니다.');
      } else {
        console.log(response.text());
        Alert.alert('오류', '이메일 전송에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    }
  };

  // 회원가입 및 인증번호 확인
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!verificationCode) {
      Alert.alert('오류', '인증번호를 입력하세요.');
      return;
    }
    try {
      const response = await fetch(
        `http://10.0.2.2:8082/users/verify-code-register?verificationCode=${verificationCode}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: username,
            userPassword: password,
            userEmail: email,
            confirmPassword,
            verificationCode,
          }),
        },
      );
      if (response.ok) {
        Alert.alert('회원가입 성공!');
        navigation.navigate('Login');
      } else {
        const errorText = await response.text(); // 서버에서 보낸 오류 메시지 추출
        console.log(response);
        Alert.alert('회원가입 실패', errorText); // 오류 메시지를 사용자에게 표시
      }
    } catch (error) {
      Alert.alert('에러 발생', error.message);
    }
  };
  return (
    <View style={styles.loginContainer}>
      <View style={styles.upContainer}>
        <Text style={commonStyles.title}>Welcome To</Text>
        <Text style={commonStyles.subtitle}>슈퍼눈떠봐</Text>
      </View>
      <View style={styles.downContainer}>
        <CustomLoginInput
          text="이메일을 입력하세요."
          condition={false}
          func={setEmail}
          value={email}
        />
        <View
          style={{marginTop: height * -0.015, marginBottom: height * 0.015}}>
          <CustomButton
            text="인증번호 전송"
            onPress={handleSendVerificationCode}
          />
        </View>

        {isCodeSent && (
          <CustomLoginInput
            text="인증번호를 입력하세요"
            condition={false}
            func={setVerificationCode}
            value={verificationCode}
          />
        )}
        <CustomLoginInput
          text="비밀번호를 입력하세요."
          condition={true}
          func={setPassword}
          value={password}
        />
        <CustomLoginInput
          text="비밀번호 확인"
          condition={true}
          func={setConfirmPassword}
          value={confirmPassword}
        />
        <CustomLoginInput
          text="닉네임 입력"
          condition={false}
          func={setUsername}
          value={username}
        />
        {isCodeSent ? (
          <View>
            <CustomButton text="회원가입" onPress={handleRegister} />
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.loginButtonStyle}>
              <Text style={styles.loginText}>로그인하기</Text>
            </TouchableOpacity>
          </View>
        ) : null}
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
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
