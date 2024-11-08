import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

const ProfileScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileView}>
        <Image
          source={require('../assets/exampleImg.png')}
          resizeMode="contain"
          style={styles.profileImage}
        />
      </View>

      <Text style={styles.greetingText}>ESH님 안녕하세요!</Text>
      <Text style={styles.timerText}>02:05:04</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>스터디 그룹 내 순위 : 3위</Text>
        <Text style={styles.infoText}>금일 학습 시간 랭킹 : 11위</Text>
        <Text style={styles.infoText}>연속 공부 일수 : 2일째</Text>
        <Text style={styles.infoText}>
          참여하고 있는 스터디 : 우당탕탕 코린이들
        </Text>
        <Text style={styles.infoText}>도움 준 게시글 수 : 0</Text>
        <Text style={styles.infoText}>도움 받은 게시글 수 : 0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  profileView: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 200,
    height: 200,
  },
  greetingText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  timerText: {
    fontSize: width * 0.15,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: width * 0.1,
  },
  infoContainer: {},
  infoText: {
    fontSize: width * 0.05,
    color: '#333',
    marginBottom: 5,
  },
});

export default ProfileScreen;
