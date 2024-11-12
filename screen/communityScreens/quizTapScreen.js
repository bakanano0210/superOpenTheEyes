import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useMainContext} from '../../component/mainContext';

const {width, height} = Dimensions.get('window');

const QuizTap = () => {
  const {quizzes, setQuizzes, user} = useMainContext();

  const handleLike = id => {
    setQuizzes(prevQuizzes =>
      prevQuizzes.map(quiz => {
        if (quiz.id === id) {
          const hasLiked = quiz.likes.includes(user.id);
          const updatedLikes = hasLiked
            ? quiz.likes.filter(uid => uid !== user.id) // 좋아요 취소
            : [...quiz.likes, user.id]; // 좋아요 추가
          return {...quiz, likes: updatedLikes};
        }
        return quiz;
      }),
    );
  };

  const handleDislike = id => {
    setQuizzes(prevQuizzes =>
      prevQuizzes.map(quiz => {
        if (quiz.id === id) {
          const hasDisliked = quiz.dislikes.includes(user.id);
          const updatedDislikes = hasDisliked
            ? quiz.dislikes.filter(uid => uid !== user.id) // 싫어요 취소
            : [...quiz.dislikes, user.id]; // 싫어요 추가
          return {...quiz, dislikes: updatedDislikes};
        }
        return quiz;
      }),
    );
  };

  const sortByDate = () => {
    setQuizzes(prevQuizzes =>
      [...prevQuizzes].sort((a, b) => {
        console.log(b.date);
        console.log(a.date);
        return new Date(b.date) - new Date(a.date);
      }),
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
    const userLiked = item.likes.includes(user.id);
    const userDisliked = item.dislikes.includes(user.id);
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