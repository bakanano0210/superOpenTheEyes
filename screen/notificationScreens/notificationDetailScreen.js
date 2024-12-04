import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useMainContext} from '../../component/mainContext';
import {formatDate} from '../../component/custom';

const NotificationDetailScreen = ({route}) => {
  const {item} = route.params;
  const navigation = useNavigation();
  const {serverUrl, token} = useMainContext();
  console.log(item);
  const [isAccepting, setIsAccepting] = useState(false);
  const isAccepted = item.isAccepted ?? false; // 기본값

  const handleReply = () => {
    navigation.navigate('MessageWrite', {
      receiverName: item.senderName, // 발신자 이름 전달
    });
  };
  // "수락하기" 버튼 동작
  const handleAcceptMentorRequest = async () => {
    setIsAccepting(true);
    try {
      const response = await fetch(`${serverUrl}/mentor-relationships/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mentorId: item.senderId,
          menteeId: item.receiverId,
          createdAt: formatDate(),
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      await handleAccept();
      Alert.alert('멘토 관계 수락', '멘토 요청이 수락되었습니다.');
      navigation.goBack(); // 이전 화면으로 이동
    } catch (error) {
      console.error('Error accepting mentor request: ', error);
      Alert.alert('오류', '멘토 요청 수락에 실패했습니다.');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleAccept = async () => {
    try {
      const response = await fetch(
        `${serverUrl}/notifications/${item.id}/accept`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('멘토 요청 수락에 실패했습니다.');
      }

      Alert.alert('멘토 요청 수락 완료', '멘토 요청이 수락되었습니다.');
      navigation.goBack(); // 혹은 상태 업데이트
    } catch (error) {
      console.error('Error accepting mentor request: ', error);
      Alert.alert('오류', '멘토 요청 수락에 실패했습니다.');
    }
  };
  return (
    <View style={styles.detailContainer}>
      <Text style={styles.detailTitle}>{item.title}</Text>
      <Text style={styles.detailUser}>{item.senderName}</Text>
      <Text style={styles.detailDate}>{item.receivedAt.split('.')[0]}</Text>
      <Text style={styles.detailMessage}>{item.message}</Text>
      {item.type === 'MESSAGE' && (
        <TouchableOpacity style={styles.replyButton} onPress={handleReply}>
          <Text style={styles.replyButtonText}>답장하기</Text>
        </TouchableOpacity>
      )}
      {item.type === 'MENTOR_REQUEST' && !isAccepted && (
        <TouchableOpacity
          style={styles.replyButton}
          onPress={handleAcceptMentorRequest}
          disabled={isAccepting}>
          <Text style={styles.replyButtonText}>
            {isAccepting ? '처리 중...' : '수락하기'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  detailContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailUser: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  detailDate: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  detailMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  replyButton: {
    marginHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#34a853',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyButtonText: {color: 'white', fontWeight: 'bold', fontSize: 16},
});

export default NotificationDetailScreen;
