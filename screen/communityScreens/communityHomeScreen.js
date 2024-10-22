// screen/CommunityScreens/communityHomeScreen
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useRoute} from '@react-navigation/native';
import {commonStyles} from '../../public/styles';
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
];

const renderItem = ({item}) => (
  <View style={styles.groupContainer}>
    <View style={styles.iconPlaceholder}>{/* 그룹 아이콘 */}</View>
    <View style={styles.groupInfo}>
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.groupDetails}>
        {item.members} {item.leader}
      </Text>
    </View>
  </View>
);

const StudyGroupTap = () => {
  return (
    <View style={{flex: 1, backgroundColor: '#ff4081'}}>
      <TextInput
        style={styles.searchInput}
        placeholder="스터디 그룹명 입력..."
      />
      <FlatList
        data={studyGroups}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const HelpRequestTap = () => (
  <View style={{flex: 1, backgroundColor: '#673ab7'}} />
);
const QuizTap = () => <View style={{flex: 1, backgroundColor: '#000'}} />;

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
    <View style={{flex: 1, paddingHorizontal: 10}}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={renderTabBar}
        style={{flex: 10}}
      />

      <TouchableOpacity
        style={{alignSelf: 'center', position: 'absolute', bottom: 30}}>
        <Ionicons
          name="add-circle"
          size={commonStyles.addButtonIcon}
          color="#014099"
        />
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
});

export default CommunityHomeScreen;
