// screen/CommunityScreens/communityHomeScreen
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TabView, TabBar} from 'react-native-tab-view';
import {useRoute, useNavigation} from '@react-navigation/native';
import {commonStyles} from '../../public/styles';
import StudyGroupTap from './studyGroupTapScreen';
import HelpRequestTap from './helpRequestTapScreen';
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
              quizInfo: {
                ...quiz.quizInfo,
                likes: quiz.quizInfo.userLiked
                  ? quiz.quizInfo.likes - 1
                  : quiz.quizInfo.likes + 1,
                userLiked: !quiz.quizInfo.userLiked,
              },
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
              quizInfo: {
                ...quiz.quizInfo,
                dislikes: quiz.quizInfo.userDisliked
                  ? quiz.quizInfo.dislikes + 1
                  : quiz.quizInfo.dislikes - 1,
                userDisliked: !quiz.quizInfo.userDisliked,
              },
            }
          : quiz,
      ),
    );
  };
  const sortByDate = () => {
    setQuizzes(prevQuizzes =>
      [...prevQuizzes].sort(
        (a, b) => new Date(b.quizInfo.date) - new Date(a.quizInfo.date),
      ),
    );
  };
  const sortByLikesDislikes = () => {
    setQuizzes(prevQuizzes =>
      [...prevQuizzes].sort(
        (a, b) =>
          b.quizInfo.likes -
          b.quizInfo.dislikes -
          (a.quizInfo.likes - a.quizInfo.dislikes),
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
        <Text style={{fontWeight: 'bold'}}>{item.quizInfo.question}</Text>
        <Text style={{color: '#888'}}>{item.quizInfo.user}</Text>
      </View>
      <Text>{item.quizInfo.answer}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{color: '#888'}}>{item.quizInfo.date}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => handleLike(item.id)}>
            <Ionicons
              name="thumbs-up-outline"
              size={16}
              color={item.quizInfo.userLiked ? 'red' : 'gray'}
            />
          </TouchableOpacity>
          <Text style={{marginLeft: 5, marginRight: 10}}>
            {item.quizInfo.likes}
          </Text>
          <TouchableOpacity onPress={() => handleDislike(item.id)}>
            <Ionicons
              name="thumbs-down-outline"
              size={16}
              color={item.quizInfo.userDisliked ? 'blue' : 'gray'}
            />
          </TouchableOpacity>
          <Text style={{marginLeft: 5}}>{item.quizInfo.dislikes}</Text>
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

const renderTabBar = props => {
  const {key, ...rest} = props;
  return (
    <TabBar
      {...rest}
      style={{backgroundColor: '#fdf7ff'}}
      indicatorStyle={{
        backgroundColor: '#2196F3',
        height: 2,
      }}
      activeColor={'#2196F3'} // 활성화된 탭 색상
      inactiveColor={'#666'} // 비활성화된 탭 색상
      renderLabel={({route, focused, color}) => {
        const weight = focused ? {fontWeight: 'bold'} : {};
        return (
          <Text
            style={{
              color,
              ...weight,
            }}>
            {route.title}
          </Text>
        );
      }}
    />
  );
};
const CommunityHomeScreen = () => {
  const communityRoute = useRoute();
  const navigation = useNavigation();
  const {initialIndex = 0} = communityRoute.params || {};
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(initialIndex);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  useEffect(() => {
    console.log(initialIndex);
    setIndex(initialIndex);
  }, [initialIndex]);

  const [routes] = useState([
    {key: 'first', title: '스터디그룹'},
    {key: 'second', title: '도움 요청'},
    {key: 'third', title: '퀴즈'},
  ]);
  const handleAddButtonPress = () => {
    if (index === 0) {
      setModalVisible(true);
    } else if (index === 1) {
      navigation.navigate('HelpRequestPost');
    } else if (index === 2) {
      navigation.navigate('QuizPost');
    }
  };
  const renderScene = ({route}) => {
    switch (route.key) {
      case 'first':
        return (
          <StudyGroupTap
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            navigation={navigation}
          />
        );
      case 'second':
        return <HelpRequestTap navigation={navigation} />;
      case 'third':
        return <QuizTap />;
      default:
        return null;
    }
  };
  return (
    <View style={{flex: 1, paddingHorizontal: 10}}>
      <TabView
        key={index}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={renderTabBar}
        style={{flex: 10}}
      />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          style={commonStyles.addButton}
          onPress={handleAddButtonPress}>
          <Ionicons
            name="add-circle-outline"
            size={commonStyles.addButtonIcon}
            color="#014099"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default CommunityHomeScreen;
