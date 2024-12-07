import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useMainContext} from '../../component/mainContext';

const {width, height} = Dimensions.get('window');

const QuizTap = () => {
  const {quizzes, setQuizzes, user, token, serverUrl, fetchQuizzes} =
    useMainContext();
  const [isUpdating, setIsUpdating] = useState(false);
  console.log(quizzes);
  useEffect(() => {
    fetchQuizzes();
  }, []);
  const handleLike = quizId => {
    if (isUpdating) {
      // 서버 업데이트 중엔 차단
      return;
    }
    setIsUpdating(true);
    // 좋아요 요청 (isLike: true)
    const quiz = quizzes.find(q => q.id === quizId);
    const userLiked = quiz.likes.some(like => like === user.id);

    // 서버 업데이트 요청
    updateQuizLikesOnServer(quizId, true).finally(() => setIsUpdating(false));

    setQuizzes(prevQuizzes =>
      prevQuizzes.map(q => {
        if (q.id === quizId) {
          return {
            ...q,
            likes: userLiked
              ? q.likes.filter(like => like !== user.id) // 좋아요 취소
              : [...q.likes, user.id], // 좋아요 추가
            dislikes: q.dislikes.filter(dislike => dislike !== user.id), // 싫어요 제거
          };
        }
        return q;
      }),
    );
  };

  const handleDislike = quizId => {
    if (isUpdating) {
      // 서버 업데이트 중엔 차단
      return;
    }
    setIsUpdating(true);

    const quiz = quizzes.find(q => q.id === quizId);
    const userDisliked = quiz.dislikes.some(dislike => dislike === user.id);

    // 서버 업데이트 요청
    updateQuizLikesOnServer(quizId, false).finally(() => setIsUpdating(false));

    setQuizzes(prevQuizzes =>
      prevQuizzes.map(q => {
        if (q.id === quizId) {
          return {
            ...q,
            dislikes: userDisliked
              ? q.dislikes.filter(dislike => dislike !== user.id) // 싫어요 취소
              : [...q.dislikes, user.id], // 싫어요 추가
            likes: q.likes.filter(like => like !== user.id), // 좋아요 제거
          };
        }
        return q;
      }),
    );
  };
  const updateQuizLikesOnServer = async (quizId, isLike) => {
    try {
      const response = await fetch(`${serverUrl}/quizzes/${quizId}/react`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id, // 현재 사용자 ID 전송
          isLike: isLike, // 좋아요 여부
        }),
      });
      if (!response.ok) {
        throw new Error('서버와의 동기화에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '서버와 동기화하는 데 실패했습니다.');
    }
  };

  const sortByDate = () => {
    setQuizzes(prevQuizzes =>
      [...prevQuizzes].sort((a, b) => new Date(b.date) - new Date(a.date)),
    );
  };

  const sortByLikesDislikes = () => {
    setQuizzes(prevQuizzes =>
      [...prevQuizzes].sort(
        (a, b) =>
          b.likes.length -
          b.dislikes.length -
          (a.likes.length - a.dislikes.length),
      ),
    );
  };

  const renderItem = ({item}) => {
    // 현재 사용자가 좋아요 또는 싫어요를 눌렀는지 확인
    const userLiked = item.likes.some(like => like === user.id);
    const userDisliked = item.dislikes.some(dislike => dislike === user.id);

    return (
      <View style={styles.quizItem}>
        <View style={styles.quizHeader}>
          <Text style={styles.questionText}>{item.question}</Text>
          <Text style={styles.userText}>{item.user}</Text>
        </View>
        <Text style={styles.answerText}>{item.answer}</Text>
        <View style={styles.quizFooter}>
          <Text style={styles.dateText}>{item.date}</Text>
          <View style={styles.reactions}>
            <TouchableOpacity onPress={() => handleLike(item.id)}>
              <Ionicons
                name="thumbs-up-outline"
                size={16}
                color={userLiked ? 'red' : 'gray'}
              />
            </TouchableOpacity>
            <Text style={styles.reactionCount}>{item.likes.length}</Text>
            <TouchableOpacity onPress={() => handleDislike(item.id)}>
              <Ionicons
                name="thumbs-down-outline"
                size={16}
                color={userDisliked ? 'blue' : 'gray'}
              />
            </TouchableOpacity>
            <Text style={styles.reactionCount}>{item.dislikes.length}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.sortButton} onPress={sortByDate}>
          <Text style={styles.buttonText}>최신</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={sortByLikesDislikes}>
          <Text style={styles.buttonText}>점수</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={quizzes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sortButton: {
    backgroundColor: '#00a7eb',
    borderRadius: 5,
    marginTop: height * 0.015,
    padding: width * 0.03,
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    fontSize: height * 0.02,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quizItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questionText: {
    fontWeight: 'bold',
  },
  userText: {
    color: '#888',
  },
  answerText: {
    marginVertical: 5,
  },
  quizFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    color: '#888',
  },
  reactions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reactionCount: {
    marginLeft: 5,
    marginRight: 10,
  },
});

export default QuizTap;
