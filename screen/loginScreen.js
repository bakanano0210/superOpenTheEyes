import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {commonStyles} from '../public/styles';
import {
  CustomButton,
  CustomLoginInput,
  handleNavigate,
} from '../component/custom';
import {useMainContext} from '../component/mainContext';

const {width, height} = Dimensions.get('window');

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const {
    user,
    setUser,
    token,
    setToken,
    fetchStudyGroups,
    fetchHelpRequests,
    fetchQuizzes,
    fetchRankingData,
    serverUrl,
    fetchNotifications,
  } = useMainContext();
  const fetchingFunction = async () => {
    await fetchStudyGroups();
    await fetchHelpRequests();
    await fetchQuizzes();
    await fetchRankingData();
  };
  // 로그인 화면에 올 때마다 이메일과 비밀번호 초기화
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEmail('');
      setLoginPassword('');
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    if (user?.id && token) {
      fetchingFunction();
      fetchNotifications(user.id);
    }
  }, [user, token]);

  const checkLoginStatus = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const remember = await AsyncStorage.getItem('rememberMe'); // "로그인 유지" 상태 확인
      if (token && remember === 'true') {
        const response = await fetch(`${serverUrl}/users/validate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setToken(token);
          const user = await response.json();
          setUser(user);

          handleNavigate({navigation}, 'MainApp');
        } else {
          console.log(response);
          const errorText = await response.text();
          console.error('검증 실패:', response.status, errorText);
        }
      } else {
        console.log('토큰 소멸 or "rememberMe" : false');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [navigation]);
  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const login = async (userEmail, password) => {
    console.log('loginTocuhed!');
    try {
      const response = await fetch(`${serverUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: userEmail,
          userPassword: password,
        }),
      });

      if (response.ok) {
        const {token, user} = await response.json();
        await AsyncStorage.setItem('token', token);
        setToken(token);
        if (rememberMe) {
          // "로그인 유지" 체크 시 별도 플래그 저장
          await AsyncStorage.setItem('rememberMe', 'true');
        } else {
          await AsyncStorage.removeItem('rememberMe');
        }
        setUser(user);
        console.log(user);
        console.log('Login successful!');
        handleNavigate({navigation}, 'MainApp');
      } else {
        const errorText = await response.text();
        console.error('Login 실패:', errorText);
      }
    } catch (error) {
      console.error('Login 실패:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#00a7eb" />
      </View>
    );
  }
  return (
    <View style={styles.loginContainer}>
      <View style={styles.upContainer}>
        <Text style={commonStyles.title}>Welcome To</Text>
        <Text style={commonStyles.subtitle}>슈퍼눈떠봐</Text>
      </View>
      <ScrollView
        style={styles.downContainer}
        contentContainerStyle={styles.downContainerContentStyle}>
        <CustomLoginInput
          text="이메일을 입력하세요"
          condition={false}
          func={setEmail}
          value={email}
        />
        <CustomLoginInput
          text="비밀번호를 입력하세요"
          condition={true}
          func={setLoginPassword}
          value={loginPassword}
        />
        <View style={[styles.optionsContainer]}>
          <BouncyCheckbox
            size={styles.checkboxSize}
            fillColor="#00a7eb"
            value={rememberMe}
            textComponent={<Text style={styles.label}>로그인 유지</Text>}
            iconStyle={styles.checkboxIconStyle}
            style={styles.checkboxStyle} // 부모 View에서 수평 중앙 정렬
            onPress={setRememberMe}
          />
          <TouchableOpacity
            onPress={() => handleNavigate({navigation}, 'ForgotPassword')}>
            <Text style={styles.forgotPassword}>비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonView}>
          <CustomButton
            onPress={() => login(email, loginPassword)}
            text="로그인"
          />
          <CustomButton
            onPress={() => handleNavigate({navigation}, 'Registration')}
            text="회원가입"
          />
        </View>
      </ScrollView>
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
  downContainerContentStyle: {
    flexGrow: 1,
  },
  forgotPassword: {
    color: '#000',
  },
  checkboxSize: width * 0.05,
  label: {
    marginLeft: width * 0.02,
    color: '#000',
    lineHeight: width * 0.06,
  },
  checkboxIconStyle: {
    alignSelf: 'center',
  },
  checkboxStyle: {
    alignItems: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.9,
    marginBottom: height * 0.025,
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  buttonView: {alignItems: 'center'},
  loginButtonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  loginText: {
    color: '#000',
    fontSize: height * 0.015,
  },
});
export default LoginScreen;
