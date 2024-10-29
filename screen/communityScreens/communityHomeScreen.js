// screen/CommunityScreens/communityHomeScreen
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useRoute} from '@react-navigation/native';
import {commonStyles, CommunityStyles} from '../../public/styles';
import {CustomButton} from '../../component/custom';

const {width, height} = Dimensions.get('window');
const tempUserId = 'user123';

const StudyGroupTap = () => {
  const [studyGroups, setStudyGroups] = useState([
    {
      id: '1',
      studyGroupInfo: {
        leaderId: '1',
        name: '감자머리 신짱구',
        members: '38/50',
        leaderName: '그룹장',
        url: '',
      },
    },
    {
      id: '2',
      studyGroupInfo: {
        leaderId: 'user123',
        name: '우당탕탕 코린이들',
        members: '3/3',
        leaderName: 'HDH',
        url: '',
      },
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const handleDelete = id => {
    Alert.alert('삭제 확인', '이 항목을 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        onPress: () => {
          const updatedData = studyGroups.filter(item => item.id !== id);
          setStudyGroups(updatedData);
        },
        style: 'destructive',
      },
    ]);
  };

  const handleSaveGroup = () => {
    if (isEditMode) {
      const updatedGroups = studyGroups.map(group =>
        group.id === selectedGroup.id
          ? {...selectedGroup, ...group.studyGroupInfo}
          : group,
      );
      setStudyGroups(updatedGroups);
    } else {
    }
  };
  const renderItem = ({item}) => (
    <View style={CommunityStyles.groupContainer}>
      <View style={CommunityStyles.iconPlaceholder}>
        <Image
          source={require('../../assets/exampleImg.png')}
          resizeMode="contain"
          style={{width: 48, height: 48}}
        />
      </View>
      <View style={CommunityStyles.groupInfo}>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <Text style={CommunityStyles.groupName}>
            {item.studyGroupInfo.name}
          </Text>
          {item.studyGroupInfo.leaderId === tempUserId && (
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 15,
          }}>
          <View>
            <Text style={CommunityStyles.groupDetails}>
              {item.studyGroupInfo.members}
            </Text>
            <Text style={CommunityStyles.groupDetails}>
              {item.studyGroupInfo.leaderName}
            </Text>
          </View>
          {item.studyGroupInfo.leaderId === tempUserId && (
            <TouchableOpacity onPress={() => console.log('edit clicked!!')}>
              <Ionicons name="pencil" size={24} color="black" />
            </TouchableOpacity>
          )}
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
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 8,
          marginBottom: 8,
          alignItems: 'center',
        }}>
        <TextInput
          style={CommunityStyles.searchInput}
          placeholder="스터디 그룹명 입력..."
        />
        <TouchableOpacity
          onPress={() => {
            console.log('search clicked!!');
          }}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={studyGroups}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const HelpRequestTap = () => {
  const [helpRequests, setHelpRequests] = useState([
    {
      id: '1',
      title: '도움 요청',
      description: '왜 오류가 나는지 모르겠습니다...',
      date: '2024.09.28 15:55:34',
      user: 'User1',
      comments: 0,
    },
    {
      id: '2',
      title: '어디가 틀린건가요ㅠㅠㅠㅠ',
      description: '몇 시간을 때려박아도 모르겠어요ㅠㅠㅠ',
      date: '2024.09.28 12:31:32',
      user: 'User2',
      comments: 2,
    },
    {
      id: '3',
      title: '아.. 진짜 탈모 올 것 같습니다...',
      description: '신경써서 한숨도 못잤습니다.',
      date: '2024.09.28 05:25:01',
      user: 'User3',
      comments: 10,
    },
  ]);

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
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View>
          <Text style={{fontWeight: 'bold'}}>{item.title}</Text>
          <Text>{item.description}</Text>
        </View>
        <View
          style={{
            position: 'relative',
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons name="chatbubble-outline" size={32} color="#00a7eb" />
          <Text
            style={{
              position: 'absolute',
              textAlign: 'center',
              color: '#00a7eb',
              borderRadius: 12,
              width: 18,
              height: 18,
              lineHeight: 18,
              fontSize: 12,
            }}>
            {item.comments}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 5,
        }}>
        <Text style={{color: '#888'}}>{item.date}</Text>
        <Text style={{color: '#888'}}>{item.user}</Text>
      </View>
    </View>
  );

  return (
    <View style={{flex: 1, padding: 5}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 8,
          marginBottom: 8,
          alignItems: 'center',
        }}>
        <TextInput style={{flex: 1}} placeholder="게시글 제목 검색..." />
        <TouchableOpacity onPress={() => console.log('search clicked!!')}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={helpRequests}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};
const QuizTap = () => {
  const [quizzes, setQuizzes] = useState([
    {
      id: '1',
      question: '화장실에서 금방 나온 사람은?',
      answer: '일본사람',
      user: 'User1',
      likes: 30,
      dislikes: 12,
    },
    {
      id: '2',
      question: '제주 앞바다의 반댓말은?',
      answer: '제주 엄마다',
      user: 'User2',
      likes: 10,
      dislikes: 25,
    },
    {
      id: '3',
      question: '남자는 힘이다. 그러면 여자는?',
      answer: '헐',
      user: 'User3',
      likes: 0,
      dislikes: 16,
    },
  ]);

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
      <View style={{alignItems: 'flex-end'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons name="thumbs-up-outline" size={16} color="red" />
          <Text style={{marginLeft: 5, marginRight: 10}}>{item.likes}</Text>
          <Ionicons name="thumbs-down-outline" size={16} color="blue" />
          <Text style={{marginLeft: 5}}>{item.dislikes}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{flex: 1, padding: 5}}>
      <FlatList
        data={quizzes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const renderScene = SceneMap({
  first: StudyGroupTap,
  second: HelpRequestTap,
  third: QuizTap,
});

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
      activeColor={'black'}
      inactiveColor={'black'}
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
  const route = useRoute();
  const {initialIndex = 0} = route.params || {};
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(initialIndex);
  const [modalVisible, setModalVisible] = useState(false);
  console.log(index);
  useEffect(() => {
    console.log(initialIndex);
    setIndex(initialIndex);
  }, [initialIndex]);
  const [routes] = useState([
    {key: 'first', title: '스터디그룹'},
    {key: 'second', title: '도움 요청'},
    {key: 'third', title: '퀴즈'},
  ]);

  return (
    <View style={{flex: 1, paddingHorizontal: 10}}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={renderTabBar}
        style={{flex: 10}}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView style={{flex: 1}}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={CommunityStyles.modalContainer}>
              <View style={CommunityStyles.modalContent}>
                <View style={{flexDirection: 'row'}}>
                  <View style={CommunityStyles.iconPlaceholder}>
                    <TouchableOpacity
                      onPress={() => console.log('image touched!!')}>
                      <Ionicons name="image" size={24} color="#014099" />
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 1}}>
                    <TextInput
                      style={CommunityStyles.modalInput}
                      placeholder="스터디 그룹명을 입력하세요"
                    />
                    <TextInput
                      style={CommunityStyles.modalInput}
                      placeholder="제한인원"
                    />
                  </View>
                </View>
                <TextInput
                  style={[CommunityStyles.modalInput, {height: '50%'}]}
                  placeholder="스터디 그룹에 대한 소개문을 입력하세요."
                  textAlignVertical="top"
                  multiline={true}
                />
                <CustomButton
                  onPress={() => setModalVisible(false)}
                  text="수정"
                />
                <CustomButton
                  onPress={() => setModalVisible(false)}
                  text="취소"
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          style={commonStyles.addButton}
          onPress={() => setModalVisible(true)}>
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
