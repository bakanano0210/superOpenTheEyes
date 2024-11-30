import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import {formatTime} from '../../component/subject';
import {useMainContext} from '../../component/mainContext';
const {width} = Dimensions.get('window');

const calculateMemberTotalTime = ({members}) => {
  const totalSeconds = members.reduce((acc, item) => {
    return acc + item.studyTime;
  }, 0);
  return formatTime(totalSeconds);
};
const ItemSeparator = () => <View style={styles.itemSeparator} />;

const StudyGroupDetailScreen = ({navigation}) => {
  // 멤버 정보 렌더링 함수
  const route = useRoute();
  const {info} = route.params;
  const [totalTime, setTotalTime] = useState(0);
  const {
    user,
    setUser,
    studyGroups,
    setStudyGroups,
    token,
    emulUrl,
    rankedGroup,
  } = useMainContext();
  const [members, setMembers] = useState([]);
  const [groupInfo, setGroupInfo] = useState(info);
  const GroupRank =
    rankedGroup?.find(item => item.studyGroupId === user.studyGroupId) || null;
  useEffect(() => {
    navigation.setOptions({
      title: info.name,
    });
  }, [navigation, info]);
  // 그룹 멤버 가져오기
  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const response = await fetch(
          `${emulUrl}/study-groups/${info.id}/members`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setMembers(data); // 멤버 데이터 업데이트
        } else {
          console.error('Failed to fetch members:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchGroupMembers();
  }, [info.id, token]);

  // 멤버 데이터 변경 시 총 스터디 시간 업데이트
  useEffect(() => {
    setTotalTime(calculateMemberTotalTime({members}));
  }, [members]);

  // 스터디 그룹 정보 업데이트
  useEffect(() => {
    const updatedGroup = studyGroups.find(group => group.id === info.id);
    if (updatedGroup) {
      setGroupInfo(updatedGroup); // 업데이트된 데이터를 groupInfo에 반영
    }
  }, [studyGroups, info.id]);

  const renderMember = ({item}) => (
    <View style={styles.memberContainer}>
      <Image
        source={
          item.profileImageUri
            ? {uri: `${emulUrl}${item.profileImageUri}`}
            : require('../../assets/exampleImg.png')
        }
        resizeMode="contain"
        style={styles.groupIcon}
      />
      <Text style={styles.memberName}>{item.userName}</Text>
      <Text style={styles.memberTime}>{formatTime(item.studyTime)}</Text>
    </View>
  );
  // 그룹 탈퇴 처리
  const handleLeaveGroup = async () => {
    try {
      const response = await fetch(`${emulUrl}/study-groups/${info.id}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const message = await response.text();
        if (message.includes('Group deleted')) {
          // 그룹 삭제 처리
          setStudyGroups(prevGroups =>
            prevGroups.filter(group => group.id !== info.id),
          );
        } else {
          // 그룹 탈퇴 처리
          setStudyGroups(prevGroups =>
            prevGroups.map(group =>
              group.id === info.id
                ? {...group, membersCount: group.membersCount - 1}
                : group,
            ),
          );
        }
        setUser(prevUser => ({...prevUser, studyGroupId: null}));
        Alert.alert('탈퇴 완료', message);
        navigation.goBack();
      } else {
        console.error('Failed to leave group:', await response.text());
      }
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };
  // 그룹 가입 처리
  const handleJoinGroup = async () => {
    if (groupInfo.membersCount >= groupInfo.limit) {
      Alert.alert('가입 불가', '그룹 인원이 가득 찼습니다.');
      return;
    }
    if (user.studyGroupId !== null) {
      Alert.alert('가입 불가', '이미 가입한 그룹이 있습니다.');
      return;
    }

    try {
      const response = await fetch(`${emulUrl}/study-groups/${info.id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedUser = await response.json();
        console.log('updatedUser');
        console.log(updatedUser);
        setUser(updatedUser); // 사용자 정보 업데이트
        setStudyGroups(prevGroups =>
          prevGroups.map(group =>
            group.id === info.id
              ? {...group, membersCount: group.membersCount + 1}
              : group,
          ),
        );
        setMembers(prevMembers => [...prevMembers, user]);
        Alert.alert('가입 완료', '스터디 그룹에 가입했습니다.');
        navigation.goBack();
      } else {
        console.error('Failed to join group:', await response.text());
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };
  // 조건에 따른 버튼 렌더링
  const renderActionButton = () => {
    if (groupInfo.leaderName === user.userName) {
      return null; // 리더인 경우 버튼 없음
    } else if (user.studyGroupId === groupInfo.id) {
      return (
        <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveGroup}>
          <Text style={styles.leaveButtonText}>탈퇴</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.leaveButton} onPress={handleJoinGroup}>
          <Text style={styles.leaveButtonText}>가입</Text>
        </TouchableOpacity>
      );
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.groupInfo}>
          <Text style={styles.groupDescription}>{groupInfo.description}</Text>
          <Text style={styles.groupDetail}>
            총인원 : {groupInfo.membersCount}/{groupInfo.limit}
          </Text>
          <Text style={styles.groupDetail}>
            스터디 그룹 랭킹 {GroupRank?.rank || 0}위
          </Text>
        </View>
        <Text style={styles.timer}>{totalTime}</Text>
        {/* 멤버 리스트 */}
        <FlatList
          data={members}
          renderItem={renderMember}
          keyExtractor={member => member.id}
          numColumns={4}
          contentContainerStyle={styles.memberList}
          showsVerticalScrollIndicator={true}
          ItemSeparatorComponent={ItemSeparator}
        />
      </View>

      {/* 탈퇴 버튼 */}
      <View style={styles.leaveButtonContainer}>{renderActionButton()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  groupInfo: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  groupDescription: {
    fontSize: 16,
    marginBottom: 15,
    paddingBottom: 5,
    lineHeight: 20, // 줄 간격 설정
  },
  groupDetail: {
    fontSize: 14,
    color: '#666',
  },
  groupIcon: {
    width: 60,
    height: 60,
  },
  memberList: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  memberContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: width * 0.18,
  },
  memberName: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  memberTime: {
    marginTop: 2,
    fontSize: 12,
    color: '#666',
  },
  leaveButtonContainer: {
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  leaveButton: {
    marginHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#00a7eb',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timer: {
    fontSize: width * 0.15,
    fontWeight: 'bold',
    color: '#0056b3',
    marginVertical: width * 0.1,
    textAlign: 'center',
  },
  itemSeparator: {
    height: 10, // 행 간의 간격
  },
});

export default StudyGroupDetailScreen;
