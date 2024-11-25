import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';

const MessageWriteScreen = () => {
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('');
  const [content, setContent] = useState('');

  const handleSend = () => {
    console.log('제목:', title);
    console.log('수신자:', recipient);
    console.log('내용:', content);
    // 전송 로직 추가
    alert('메시지가 전송되었습니다.');
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
