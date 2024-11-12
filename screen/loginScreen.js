import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {commonStyles} from '../public/styles';
import {
  CustomButton,
  CustomLoginInput,
  handleNavigate,
} from '../component/custom';

const {width, height} = Dimensions.get('window');

const LoginScreen = ({navigation}) => {
  return (
    <View style={styles.loginContainer}>
      <View style={styles.upContainer}>
        <Text style={commonStyles.title}>Welcome To</Text>
        <Text style={commonStyles.subtitle}>슈퍼눈떠봐</Text>
      </View>
      <ScrollView
        style={styles.downContainer}
        contentContainerStyle={styles.downContainerContentStyle}>
        <CustomLoginInput text="이메일을 입력하세요" condition={false} />
        <CustomLoginInput text="비밀번호를 입력하세요" condition={true} />
        <View style={[styles.optionsContainer]}>
          <BouncyCheckbox
            size={styles.checkboxSize}
            fillColor="#00a7eb"
            value={false}
            textComponent={<Text style={styles.label}>로그인 유지</Text>}
            iconStyle={styles.checkboxIconStyle}
            style={styles.checkboxStyle} // 부모 View에서 수평 중앙 정렬
          />
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonView}>
          <CustomButton
            onPress={() => handleNavigate({navigation}, 'MainApp')}
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
