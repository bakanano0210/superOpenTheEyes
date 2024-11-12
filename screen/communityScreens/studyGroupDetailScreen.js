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
    const [hours, minutes, seconds] = item.studyTime.split(':').map(Number);
    return acc + hours * 3600 + minutes * 60 + seconds;
  }, 0);
  return formatTime(totalSeconds);
};
const ItemSeparator = () => <View style={styles.itemSeparator} />;
const StudyGroupDetailScreen = ({navigation}) => {
  // 멤버 정보 렌더링 함수
  const route = useRoute();
  const {info} = route.params;
  const [totalTime, setTotalTime] = useState('00:00:00');
  const {user, users, setUsers, studyGroups, setStudyGroups} = useMainContext();
  const [members, setMembers] = useState([
    // 임시 멤버. user 테이블을 이용해서 초기화할 예정
    // {id: '1', name: 'HDH', studyTime: '04:35:21'},
    // {id: '2', name: 'PSU', studyTime: '03:22:15'},
    // {id: '3', name: 'ESH', studyTime: '02:05:04'},
  ]);
  const [groupInfo, setGroupInfo] = useState(info);
  useEffect(() => {
    const filteredMembers = users
      .filter(u => u.studyGroupId === info.id)
      .sort((a, b) => {
        const [aHours, aMinutes, aSeconds] = a.studyTime.split(':').map(Number);
        const [bHours, bMinutes, bSeconds] = b.studyTime.split(':').map(Number);
        const aTotalSeconds = aHours * 3600 + aMinutes * 60 + aSeconds;
        const bTotalSeconds = bHours * 3600 + bMinutes * 60 + bSeconds;
        return bTotalSeconds - aTotalSeconds; // 내림차순 정렬
      });
    setMembers(filteredMembers);
  }, [users, info]);

  useEffect(() => {
    navigation.setOptions({
      title: info.name,
    });
  }, [navigation, info]);
  useEffect(() => {
    setTotalTime(calculateMemberTotalTime({members}));
  }, [members]);
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
          item.profileImageUri === ''
            ? require('../../assets/exampleImg.png')
            : {uri: item.profileImageUri}
        }
        resizeMode="contain"
        style={styles.groupIcon}
      />
      <Text style={styles.memberName}>{item.name}</Text>
      <Text style={styles.memberTime}>{item.studyTime}</Text>
    </View>
  );
  const handleLeaveGroup = () => {
    const updatedUser = {...user, studyGroupId: 0};
    setUsers(prevUsers =>
      prevUsers.map(u => (u.id === updatedUser.id ? updatedUser : u)),
    );
    setStudyGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === info.id ? {...group, members: group.members - 1} : group,
      ),
    );
  };
  const handleJoinGroup = () => {
    if (groupInfo.members + 1 <= groupInfo.limit) {
      const updatedUser = {...user, studyGroupId: info.id};
      setUsers(prevUsers =>
        prevUsers.map(u => (u.id === updatedUser.id ? updatedUser : u)),
      );

      setStudyGroups(prevGroups =>
        prevGroups.map(group =>
          group.id === info.id ? {...group, members: group.members + 1} : group,
        ),
      );
    } else {
      Alert.alert('가입 불가', '인원이 가득차서 가입할 수 없습니다.');
      return; // 그룹 가입 중지
    }
  };
  // 조건에 따른 버튼 렌더링
  const renderActionButton = () => {
    if (groupInfo.leaderId === user.id) {
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
            총인원 : {groupInfo.members}/{groupInfo.limit}
          </Text>
          <Text style={styles.groupDetail}>스터디 그룹 랭킹 2위</Text>
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
