import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useRoute} from '@react-navigation/native';
const studyGroups = [
  {id: '1', name: '감자머리 신짱구', members: '38/50', leader: '그룹장'},
  {id: '2', name: '우당탕탕 코린이들', members: '3/3', leader: 'HDH'},
];

const tempStudyGroups = [
  {
    key: 1,
    studyGroupInfo: {
      title: '감자머리 신짱구',
      members: 38,
      limit: 50,
      leader: '그룹장',
    },
  },
]

const renderItem = ({item}) => (
  <View style={styles.groupContainer}>
    <View style={styles.iconPlaceholder}>
      {/* 그룹 아이콘 */}
    </View>
    <View style={styles.groupInfo}>
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.groupDetails}>
        {item.members} {item.leader}
      </Text>
    </View>
  </View>
);

const StudyGroupTap = () => 
{
  const [addMode, setAddMode] = useState(false);  
  <View style={{flex: 1, backgroundColor: '#ff4081'}}>
    <TextInput style={styles.searchInput} placeholder="스터디 그룹명 입력..." />
    <StudyGroupModal 
    />
    <FlatList
      data={studyGroups}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  </View>
}

const HelpRequestTap = () => (
  <View style={{flex: 1, backgroundColor: '#673ab7'}} />
);
const QuizTap = () => (<View style={{flex: 1, backgroundColor: '#000'}} />);

const renderScene = SceneMap({
  first: StudyGroupTap,
  second: HelpRequestTap,
  third: QuizTap,
});
// const renderTabBar = props => (
//   <TabBar
//     {...props}
//     indicatorStyle={{ backgroundColor: 'white' }}
//     style={{ backgroundColor: 'pink' }}
//   />
// );
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
            style={[
              styles.label,
              {
                color,
                ...weight,
              },
            ]}>
            {route.title}
          </Text>
        );
      }}
    />
  );
};
const StudyGroupModal = ({
  visible,
  onClose,
  isEditMode = false,
  initialStudyGroupTitle = '',
  initialPeopleNumber = 1,
  studyGroupCardInfoList,
  setStudyGroupCardInfoList,
  editingKey = null,
}) => {
  const [studyGroupTitle, setStudyGroupTitle] = useState('');
  const [peopleNumber, setPeopleNumber] = useState(1);

  useEffect(() => {
    setPostTitle(initialStudyGroupTitle);
  }, [initialStudyGroupTitle]);

  useEffect(() => {
    setPeopleNumber(initialPeopleNumber);
  }, [initialPeopleNumber]);

  const onChangeTitle = title => {
    console.log(title);
    setStudyGroupTitle(title);
  };
  
  const onChangeNumber = number => {
    console.log(number);
    setPeopleNumber(number);
  }

  const handleSave = () => {
    if (studyGroupTitle === '') {
      Alert.alert('입력 오류', '입력되지 않는 요소가 있습니다.', [
        {text: '확인'},
      ]);
      return;
    }

    if (isEditMode) {
      const updatedList = studyGroupCardInfoList.map(item =>
        item.key === editingKey
          ? {...item, studyGroupInfo: {...item.studyGroupInfo, title: studyGroupTitle}}
          : item,
      );
      setStudyGroupCardInfoList(updatedList);
    } else {
      const currentTime = Date.now().toString();
      const key = `${studyGroupTitle}_${currentTime}`;
      const newStudyGroupInfo = {
        key: key,
        studyGroupInfo: {
          title: studyGroupTitle,
          members: peopleNumber,
          leader: '그룹장' // 생성 사용자의 닉네임을 읽어올 예정
        },
      };
      console.log(newStudyGroupInfo);
      setStudyGroupCardInfoList([...studyGroupCardInfoList, newStudyGroupInfo]);
    }
    setStudyGroupTitle('');
    setPeopleNumber(1);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={homeStyles.modalOverlay}>
        <View style={[homeStyles.modalContent]}>
          <Text style={homeStyles.modalTitle}>과목 명</Text>
          <TextInput
            style={homeStyles.modalInput}
            placeholder="과목을 입력하세요"
            value={subjectTitle}
            onChangeText={onChangeTitle}
          />
          <TouchableOpacity
            style={homeStyles.submitButton}
            onPress={handleSave}>
            <Text style={homeStyles.buttonText}>
              {isEditMode ? '수정' : '등록'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const CommunityHomeScreen = () => {
  const route = useRoute();
  const {initialIndex = 0} = route.params || {};
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(initialIndex);
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
    <View style={{flex: 1}}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={renderTabBar}
      />
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle" size={48} color="blue" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tab: {
    fontSize: 16,
    color: 'black',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
  },
  iconPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#eee',
    borderRadius: 25,
    marginRight: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupDetails: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});

export default CommunityHomeScreen;
