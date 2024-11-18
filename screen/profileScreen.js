import React, {useState, useEffect} from 'react';
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
const calculateContinuousStudying = studyTimes => {
  if (!studyTimes || studyTimes.length === 0) {
    return 0;
  }
  // 날짜 순으로 정렬
  const sortedDates = studyTimes
    .map(entry => new Date(entry.date))
    .sort((a, b) => b - a); // 내림차순 정렬
  let continuousStudying = 1;
  const today = new Date();
  const oneDay = 1000 * 60 * 60 * 24;
  // 오늘 포함 여부 확인
  if (
    today.toDateString() !== sortedDates[0].toDateString() &&
    today - sortedDates[0] > oneDay
  ) {
    return 0; // 오늘 출석이 없으면 연속 출석 없음
  }

  // 연속 출석일 계산
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const current = sortedDates[i];
    const previous = sortedDates[i + 1];

    // 날짜 차이가 하루인 경우 연속 출석
    if ((current - previous) / oneDay === 1) {
      continuousStudying++;
    } else {
      break; // 연속성이 끊기면 중단
    }
  }
  return continuousStudying;
};
const ProfileScreen = ({navigation}) => {
  const {user, setUsers, rankedDaily, rankedInGroup, studyGroups} =
    useMainContext();
  const studyGroup = studyGroups.find(group => group.id === user.studyGroupId);
  const userDailyRank =
    rankedDaily?.find(item => item.name === user.name) || null;
  const userGroupRank =
    rankedInGroup?.find(item => item.name === user.name) || null;
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
  const [userStudyTimes, setUserStudyTimes] = useState([]);
  const [continuousStudying, setContinuousStudying] = useState(0);

  useEffect(() => {
    // 예제 데이터 로드 (실제 데이터는 DB에서 가져오도록 구현)
    const studyData = [
      {userId: 1, date: '2024-11-10', studyTime: 3600},
      {userId: 1, date: '2024-11-13', studyTime: 4200},
      {userId: 1, date: '2024-11-14', studyTime: 3000}, // 11월 12일 X
      {userId: 1, date: '2024-11-15', studyTime: 5400},
    ];
    setUserStudyTimes(studyData);

    // 연속 출석 계산
    const continuousStudyingCount = calculateContinuousStudying(studyData);
    setContinuousStudying(continuousStudyingCount);
  }, []);

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

      <Text style={styles.greetingText}>{user.name}님 안녕하세요!</Text>
      <Text style={styles.timerText}>{user.studyTime}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          스터디 그룹 내 순위 : {userGroupRank?.rank || 0}위
        </Text>
        <Text style={styles.infoText}>
          금일 학습 시간 랭킹 : {userDailyRank?.rank || 0}위
        </Text>
        <Text style={styles.infoText}>
          연속 출석 일수 : {continuousStudying}일째
        </Text>
        <Text style={styles.infoText}>
          참여하고 있는 스터디 : {studyGroup ? studyGroup.name : '스터디 없음'}
        </Text>
        <Text style={styles.infoText}>
          도움 준 게시글 수 : {user.helpGivenCount}
        </Text>
        <Text style={styles.infoText}>
          도움 받은 게시글 수 : {user.helpReceivedCount}
        </Text>
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
