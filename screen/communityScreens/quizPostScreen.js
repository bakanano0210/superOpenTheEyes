import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useMainContext} from '../../component/mainContext';
import {CustomButton} from '../../component/custom';

const QuizPostScreen = ({route}) => {
  const {setQuizzes, token, user, realUrl} = useMainContext();
  const navigation = useNavigation();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSave = async () => {
    if (!question || !answer) {
      Alert.alert('입력 오류', '문제와 정답을 모두 입력해주세요.');
      return;
    }

    const newQuiz = {
      question,
      answer,
      date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      userId: user.id,
      userName: user.userName,
      likes: [],
      dislikes: [],
      userLiked: false,
      userDisliked: false,
    };
    try {
      const response = await fetch(`${realUrl}/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newQuiz),
      });

      if (!response.ok) {
        throw new Error('퀴즈 등록에 실패했습니다.');
      }

      const savedQuiz = await response.json();
      setQuizzes(prev => [savedQuiz, ...prev]); // 반환된 퀴즈를 상태에 추가
      navigation.goBack(); // 이전 화면으로 이동
    } catch (error) {
      Alert.alert('오류', error.message);
    }
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
