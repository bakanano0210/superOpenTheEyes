import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {useMainContext} from '../../component/mainContext';
import {useRoute} from '@react-navigation/native';
import {formatDate} from '../../component/custom';

const MessageWriteScreen = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('');
  const [content, setContent] = useState('');
  const {emulUrl, token, user} = useMainContext();
  const route = useRoute();

  useEffect(() => {
    if (route.params?.receiverName) {
      setRecipient(route.params.receiverName); // 전달받은 값 설정
    }
  }, [route.param]);

  const handleSend = async () => {
    if (!title || !recipient || !content) {
      Alert.alert('모든 필드를 입력하세요.');
      return;
    }

    try {
      const response = await fetch(`${emulUrl}/notifications/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderName: user.userName,
          title: title,
          receiverName: recipient,
          content: content,
          senderId: user.id, // 로그인한 사용자 ID
          receivedAt: formatDate(),
        }),
      });

      if (response.ok) {
        Alert.alert('쪽지가 성공적으로 전송되었습니다.');
        setTitle('');
        setRecipient('');
        setContent('');
        navigation.goBack();
      } else {
        const errorText = await response.text();
        Alert.alert(`쪽지 전송 실패: ${errorText}`);
      }
    } catch (error) {
      console.error('Error sending message: ', error);
      Alert.alert('쪽지 전송 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.messageContainer}>
      <Text style={styles.label}>제목</Text>
      <TextInput
        style={styles.input}
        placeholder="제목을 입력하세요."
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>수신자</Text>
      <TextInput
        style={styles.input}
        placeholder="수신자 아이디를 입력하세요."
        placeholderTextColor="#aaa"
        value={recipient}
        onChangeText={setRecipient}
      />

      <Text style={styles.label}>내용</Text>
      <TextInput
        style={styles.textArea}
        placeholder="내용을 입력하세요..."
        placeholderTextColor="#aaa"
        multiline
        value={content}
        onChangeText={setContent}
      />

      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendButtonText}>전송하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingVertical: 5,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: '#34a853',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MessageWriteScreen;
