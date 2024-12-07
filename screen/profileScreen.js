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
import {formatTime} from '../component/subject';

const {width} = Dimensions.get('window');
const ProfileScreen = ({navigation}) => {
  const {
    user,
    setUser,
    rankedDaily,
    rankedInGroup,
    studyGroups,
    token,
    serverUrl,
  } = useMainContext();
  const userDailyRank =
    rankedDaily?.find(item => item.userName === user.userName) || null;
  const userGroupRank =
    rankedInGroup?.find(item => item.userName === user.userName) || null;
  const handleChoosePhoto = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      async response => {
        if (response.didCancel) {
          console.log('사용자 취소');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const selectedUri = response.assets[0].uri;
          const formData = new FormData();
          formData.append('file', {
            uri: selectedUri,
            type: 'image/jpeg', // MIME type
            name: 'profile.jpg',
          });
          try {
            const uploadResponse = await fetch(
              `${serverUrl}/users/upload-profile-image`,
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: formData,
              },
            );

            if (uploadResponse.ok) {
              const {profileImageUri} = await uploadResponse.json();
              // selectedUri이 변경될 때마다 user의  profileImageUri을 업데이트 후 users에 반영
              const updatedUser = {
                ...user,
                profileImageUri,
              };
              setUser(updatedUser);
              console.log(
                'Profile image uploaded successfully:',
                profileImageUri,
              );
            } else {
              console.error(
                'Failed to upload profile image:',
                await uploadResponse.text(),
              );
            }
          } catch (error) {
            console.error('Error uploading profile image:', error);
          }
        }
      },
    );
  };
  const [continuousDays, setContinuousDays] = useState(0);
  console.log(rankedDaily);
  useEffect(() => {
    const fetchContinuousAttendanceDays = async () => {
      try {
        const response = await fetch(
          `${serverUrl}/study/continuous-attendance`,
          {
            headers: {Authorization: `Bearer ${token}`}, // 인증 헤더 추가
          },
        );
        if (response.ok) {
          const days = await response.json();
          setContinuousDays(days); // 연속 출석 일수 설정
        } else {
          console.error(
            'Failed to fetch continuous attendance days:',
            response.status,
          );
        }
      } catch (error) {
        console.error('Error fetching continuous attendance days:', error);
      }
    };
    fetchContinuousAttendanceDays();
  }, [token]);
  const [studyGroudName, setStudyGroupName] = useState('');
  console.log(user);
  useEffect(() => {
    if (studyGroups.length > 0) {
      const matchingGroup = studyGroups.find(
        group => group.id === user.studyGroupId, // 첫 번째 항목만 처리
      );
      if (matchingGroup) {
        setStudyGroupName(matchingGroup.name);
      }
    }
  }, [user, studyGroups]); // data와 studyGroups가 변경될 때만 실행
  console.log(`${serverUrl}${user.profileImageUri}`);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileView} onPress={handleChoosePhoto}>
        <Image
          source={
            user.profileImageUri
              ? {uri: user.profileImageUri}
              : require('../assets/exampleImg.png')
          }
          resizeMode="contain"
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <Text style={styles.greetingText}>{user.userName}님 안녕하세요!</Text>
      <Text style={styles.timerText}>{formatTime(user.studyTime)}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          스터디 그룹 내 순위: {userGroupRank?.rank || 0}위
        </Text>
        <Text style={styles.infoText}>
          금일 학습 시간 랭킹: {userDailyRank?.rank || 0}위
        </Text>
        <Text style={styles.infoText}>
          연속 출석 일수: {continuousDays}일째
        </Text>
        <Text style={styles.infoText}>
          참여하고 있는 스터디:{' '}
          {user.studyGroupId ? studyGroudName : ' 스터디 없음'}
        </Text>
        <Text style={styles.infoText}>
          도움 준 게시글 수: {user.helpGivenCount}
        </Text>
        <Text style={styles.infoText}>
          도움 받은 게시글 수: {user.helpReceivedCount}
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
