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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {formatTime} from '../../component/subject';
const {width} = Dimensions.get('window');

const calculateTotalTime = ({members}) => {
  const totalSeconds = members.reduce((acc, item) => {
    const [hours, minutes, seconds] = item.studyTime.split(':').map(Number);
    return acc + hours * 3600 + minutes * 60 + seconds;
  }, 0);
  return formatTime(totalSeconds);
};
const StudyGroupDetailScreen = ({navigation}) => {
  // 멤버 정보 렌더링 함수
  const [totalTime, setTotalTime] = useState('00:00:00');
  const [members, setMembers] = useState([
    // 임시 멤버. user 테이블을 이용해서 초기화할 예정
    {id: '1', name: 'HDH', studyTime: '04:35:21'},
    {id: '2', name: 'PSU', studyTime: '03:22:15'},
    {id: '3', name: 'ESH', studyTime: '02:05:04'},
  ]);
  const renderMember = ({item}) => (
    <View style={styles.memberContainer}>
      <Ionicons name="person-circle-outline" size={40} color="black" />
      <Text style={styles.memberName}>{item.name}</Text>
      <Text style={styles.memberTime}>{item.studyTime}</Text>
    </View>
  );
  const route = useRoute();
  const {item} = route.params;
  useEffect(() => {
    navigation.setOptions({
      title: item.studyGroupInfo.name,
    });
  }, [navigation, item]);
  useEffect(() => {
    setTotalTime(calculateTotalTime({members}));
  }, [members]);
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.groupInfo}>
          <Text style={styles.groupDescription}>
            {item.studyGroupInfo.description}
          </Text>
          <Text style={styles.groupDetail}>
            총인원 : {item.studyGroupInfo.members}/{item.studyGroupInfo.limit}
          </Text>
          <Text style={styles.groupDetail}>스터디 그룹 랭킹 2위</Text>
        </View>
        <Text style={styles.timer}>{totalTime}</Text>
        {/* 멤버 리스트 */}
        <View style={styles.memberListContainer}>
          <FlatList
            data={members}
            renderItem={renderMember}
            keyExtractor={member => member.id}
            horizontal
            contentContainerStyle={styles.memberList}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>

      {/* 탈퇴 버튼 */}
      <View style={styles.leaveButtonContainer}>
        <TouchableOpacity style={styles.leaveButton}>
          <Text style={styles.leaveButtonText}>탈퇴</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#f2e6ff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
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
  memberListContainer: {
    paddingVertical: 10,
  },
  memberList: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  memberContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
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
});

export default StudyGroupDetailScreen;
