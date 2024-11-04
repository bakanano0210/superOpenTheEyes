import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useMainContext} from '../../component/mainContext';
import {CustomButton} from '../../component/custom';

const QuizPostScreen = ({route}) => {
  const {quizzes, setQuizzes} = useMainContext();
  const navigation = useNavigation();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSave = () => {
    if (!question || !answer) {
      Alert.alert('입력 오류', '문제와 정답을 모두 입력해주세요.');
      return;
    }
    const newPost = {
      id: Date.now().toString(), //나중에 userID 와 결합
      quizInfo: {
        question,
        answer,
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        user: 'User1', // 나중에 userID로 변경
        likes: 0,
        dislikes: 0,
        userLiked: false,
        userDisliked: false,
      },
    };
    setQuizzes(prev => [newPost, ...prev]);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.contentContainer}>
        <TextInput
          style={styles.contentInput}
          placeholder="문제"
          multiline={true}
          value={question}
          onChangeText={setQuestion}
        />
      </View>

      <View style={styles.header}>
        <TextInput
          style={styles.answerInput}
          placeholder="정답"
          value={answer}
          onChangeText={setAnswer}
        />
      </View>
      <CustomButton onPress={handleSave} text={'글쓰기'} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#00a7eb',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  answerInput: {
    fontSize: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 20,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    minHeight: 150,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  imageButton: {
    marginRight: 10,
    width: 40, // 아이콘 크기만큼 너비 설정
    alignSelf: 'flex-end', // 오른쪽 정렬
  },
  submitButton: {
    backgroundColor: '#014099',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuizPostScreen;
