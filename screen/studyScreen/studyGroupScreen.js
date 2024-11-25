import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
const {width} = Dimensions.get('window');

const StudyGroupScreen = () => {
  const groupMembers = [
    {id: 'HDH', name: 'HDH', studyTime: '04:35:21', isStudying: false},
    {id: 'PSU', name: 'PSU', studyTime: '03:22:15', isStudying: true},
    {id: 'ESH', name: 'ESH', studyTime: '02:05:04', isStudying: true},
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.groupName}>우당탕탕 코린이들</Text>
      <Text style={styles.memberCount}>2/3</Text>
      <View style={styles.memberListContainer}>
        {groupMembers.map(member => (
          <View key={member.id} style={styles.memberItem}>
            <View
              style={[
                styles.memberAvatar,
                {borderColor: member.isStudying ? 'green' : 'black'},
              ]}>
              <Image
                source={require('../../assets/exampleImg.png')} // 기본 프로필 이미지 경로
                style={styles.memberImage}
              />
            </View>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text
              style={[
                styles.memberTime,
                {color: member.isStudying ? 'green' : 'black'},
              ]}>
              {member.studyTime}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  groupName: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  memberCount: {
    fontSize: width * 0.05,
    marginBottom: 15,
    color: '#000',
  },
  memberListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
  },
  memberItem: {
    alignItems: 'center',
  },
  memberAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  memberImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  memberName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  memberTime: {
    fontSize: 12,
  },
});

export default StudyGroupScreen;
