import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useMainContext} from '../component/mainContext';

const {width} = Dimensions.get('window');

const ProfileScreen = ({navigation}) => {
  const {user, setUsers} = useMainContext();
  const handleChoosePhoto = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
          console.log('사용자 취소');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const selectedUri = response.assets[0].uri;
          // selectedUri이 변경될 때마다 user의  profileImageUri을 업데이트 후 users에 반영
          const updatedUser = {
            ...user,
            profileImageUri: selectedUri,
          };
          setUsers(prevUsers =>
            prevUsers.map(u => (u.id === updatedUser.id ? updatedUser : u)),
          );
        }
      },
    );
  };
  console.log(user);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileView} onPress={handleChoosePhoto}>
        <Image
          source={
            user.profileImageUri === ''
              ? require('../assets/exampleImg.png')
              : {uri: user.profileImageUri}
          }
          resizeMode="contain"
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <Text style={styles.greetingText}>ESH님 안녕하세요!</Text>
      <Text style={styles.timerText}>{user.studyTime}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>스터디 그룹 내 순위 : 3위</Text>
        <Text style={styles.infoText}>금일 학습 시간 랭킹 : 11위</Text>
        <Text style={styles.infoText}>연속 출석 일수 : 2일째</Text>
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
