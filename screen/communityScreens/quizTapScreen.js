import React from 'react';
import {View, Text, FlatList, TouchableOpacity, Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useMainContext} from '../../component/mainContext';

const {width, height} = Dimensions.get('window');
const QuizTap = () => {
  const {quizzes, setQuizzes} = useMainContext();

  const handleLike = id => {
    setQuizzes(prevQuizzes =>
      prevQuizzes.map(quiz =>
        quiz.id === id
          ? {
              ...quiz,
              likes: quiz.userLiked ? quiz.likes - 1 : quiz.likes + 1,
              userLiked: !quiz.userLiked,
            }
          : quiz,
      ),
    );
  };
  const handleDislike = id => {
    console.log(quizzes);
    setQuizzes(prevQuizzes =>
      prevQuizzes.map(quiz =>
        quiz.id === id
          ? {
              ...quiz,
              dislikes: quiz.userDisliked
                ? quiz.dislikes - 1
                : quiz.dislikes + 1,
              userDisliked: !quiz.userDisliked,
            }
          : quiz,
      ),
    );
  };
  const sortByDate = () => {
    setQuizzes(prevQuizzes =>
      [...prevQuizzes].sort((a, b) => new Date(b.date) - new Date(a.date)),
    );
  };
  const sortByLikesDislikes = () => {
    setQuizzes(prevQuizzes =>
      [...prevQuizzes].sort(
        (a, b) => b.likes - b.dislikes - (a.likes - a.dislikes),
      ),
    );
  };

  const renderItem = ({item}) => (
    <View
      style={{
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 8,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{fontWeight: 'bold'}}>{item.question}</Text>
        <Text style={{color: '#888'}}>{item.user}</Text>
      </View>
      <Text>{item.answer}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{color: '#888'}}>{item.date}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => handleLike(item.id)}>
            <Ionicons
              name="thumbs-up-outline"
              size={16}
              color={item.userLiked ? 'red' : 'gray'}
            />
          </TouchableOpacity>
          <Text style={{marginLeft: 5, marginRight: 10}}>{item.likes}</Text>
          <TouchableOpacity onPress={() => handleDislike(item.id)}>
            <Ionicons
              name="thumbs-down-outline"
              size={16}
              color={item.userDisliked ? 'blue' : 'gray'}
            />
          </TouchableOpacity>
          <Text style={{marginLeft: 5}}>{item.dislikes}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{flex: 1, padding: 5}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#00a7eb',
            borderRadius: 5,
            marginTop: height * 0.015,
            padding: width * 0.03,
            width: '50%',
            marginRight: 10,
          }}
          onPress={sortByDate}>
          <Text
            style={{
              color: '#fff',
              fontSize: height * 0.02,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            최신
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#00a7eb',
            borderRadius: 5,
            marginTop: height * 0.015,
            padding: width * 0.03,
            width: '50%',
          }}
          onPress={sortByLikesDislikes}>
          <Text
            style={{
              color: '#fff',
              fontSize: height * 0.02,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            점수
          </Text>
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
export default QuizTap;
