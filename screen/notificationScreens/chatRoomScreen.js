import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useMainContext} from '../../component/mainContext';
import {formatDate} from '../../component/custom';
import {ChatRoomRightHeader} from '../../component/header';
const ChatRoomScreen = ({route, navigation}) => {
  const {chatRoom} = route.params;
  const [newMessage, setNewMessage] = useState('');
  const {token, user, serverUrl, messages, setMessages} = useMainContext();
  const flatListRef = useRef(null);
  const onMentoringEnd = async () => {
    try {
      const response = await fetch(
        `${serverUrl}/mentor-relationships/${chatRoom.mentorRelationshipId}/end`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            receivedAt: formatDate(),
          }),
        },
      );
      Alert.alert('멘토링 종료', '멘토링이 성공적으로 종료되었습니다.');
      navigation.navigate('NotificationScreen');
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '멘토링 종료 중 문제가 발생했습니다.');
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => ChatRoomRightHeader({onMentoringEnd}),
    });
  }, [navigation]);
  console.log(chatRoom);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${serverUrl}/messages/chat-room/${chatRoom.id}?userId=${user.id}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
        if (!response.ok) {
          throw new Error('메시지를 가져올 수 없습니다.');
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, [chatRoom.id]);

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      return;
    } // 빈 메시지 전송 방지

    const isSenderMentor = chatRoom.mentorId === user.id;
    const recipientId = isSenderMentor ? chatRoom.menteeId : chatRoom.mentorId;

    const tempMessage = {
      id: Date.now(), // 임시 ID 생성
      senderId: user.id,
      senderName: user.name || '나', // 사용자 이름 또는 '나'로 설정
      recipientId,
      content: newMessage,
      timestamp: formatDate(),
      isTemporary: true, // 임시 메시지 여부 표시
    };

    // 메시지를 임시로 상태에 추가
    setMessages(prevMessages => [...prevMessages, tempMessage]);
    setNewMessage(''); // 입력 필드 초기화
    Keyboard.dismiss();
    flatListRef.current?.scrollToEnd({animated: true});
    try {
      const response = await fetch(`${serverUrl}/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatRoomId: chatRoom.id,
          senderId: user.id,
          recipientId,
          content: newMessage,
          timestamp: formatDate(),
        }),
      });
      if (!response.ok) throw new Error('메시지 전송 실패');
      const sentMessage = await response.json();
      // 임시 메시지를 서버 응답 메시지로 대체
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.isTemporary && msg.id === tempMessage.id
            ? {...sentMessage, isTemporary: false}
            : msg,
        ),
      );

      setNewMessage('');
      flatListRef.current?.scrollToEnd({animated: true}); // 마지막 메시지로 스크롤
    } catch (error) {
      console.error(error);

      // 전송 실패 시, 임시 메시지를 제거
      setMessages(prevMessages =>
        prevMessages.filter(msg => msg.id !== tempMessage.id),
      );
    }
  };
  const renderMessage = ({item}) => {
    console.log('item');
    const isMyMessage = item.isTemporary || item.senderId === user.id;
    console.log(item);
    console.log(user);
    console.log(isMyMessage);
    return (
      <View
        style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessage : styles.otherMessage,
        ]}>
        <Text
          style={isMyMessage ? styles.myMessageSender : styles.messageSender}>
          {isMyMessage ? '나' : item.senderName}
        </Text>
        <Text
          style={isMyMessage ? styles.myMessageContent : styles.messageContent}>
          {item.content}
        </Text>
        <Text
          style={
            isMyMessage ? styles.myMessageTimestamp : styles.messageTimestamp
          }>
          {item.timestamp}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.chatRoomContainer}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatRoomList}
        extraData={messages}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({animated: false})
        }
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="메시지를 입력하세요..."
          value={newMessage}
          onChangeText={setNewMessage}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({animated: true})
          } // 데이터 변경 시 스크롤
        />
        <TouchableOpacity style={styles.sendIconButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#34a853" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  chatRoomContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  chatRoomList: {
    paddingBottom: 60,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#34a853',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  messageSender: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageContent: {
    fontSize: 16,
  },
  messageTimestamp: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
  },
  myMessageSender: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  myMessageContent: {
    fontSize: 16,
    color: 'white',
  },
  myMessageTimestamp: {
    fontSize: 12,
    color: 'white',
    textAlign: 'right',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    width: '100%',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  sendIconButton: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 20,
  },
});

export default ChatRoomScreen;
