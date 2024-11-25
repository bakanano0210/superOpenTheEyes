import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const ChatRoomScreen = ({route}) => {
  const {chatRoom} = route.params;
  const messages = [
    {
      id: '1',
      sender: 'User',
      content:
        '물어본 내용에 대해서 설명을 해주는 내용. 더 알고 싶은 게 있다면 언제든지 질문해도 좋다는 내용.',
      timestamp: '19:44',
    },
    {
      id: '2',
      sender: '나',
      content: '아 알겠습니다. 그런 뜻이었군요.',
      timestamp: '20:00',
    },
  ];

  const renderMessage = ({item}) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === '나' ? styles.myMessage : styles.otherMessage,
      ]}>
      <Text
        style={
          item.sender === '나' ? styles.myMessageSender : styles.messageSender
        }>
        {item.sender}
      </Text>
      <Text
        style={
          item.sender === '나' ? styles.myMessageContent : styles.messageContent
        }>
        {item.content}
      </Text>
      <Text
        style={
          item.sender === '나'
            ? styles.myMessageTimestamp
            : styles.messageTimestamp
        }>
        {item.timestamp}
      </Text>
    </View>
  );

  return (
    <View style={styles.chatRoomContainer}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatRoomList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="메시지를 입력하세요..."
        />
        <TouchableOpacity style={styles.sendIconButton}>
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
