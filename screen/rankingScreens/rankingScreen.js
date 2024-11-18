import {
  View,
  Text,
  useWindowDimensions,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {TabView} from 'react-native-tab-view';
import {customRenderTabBar} from '../../component/header';
import {formatTime} from '../../component/subject';
import {useMainContext} from '../../component/mainContext';

const {width} = Dimensions.get('window');
const formatDate = () => {
  const today = new Date();
  return today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const DailyRankingTap = ({currentUser}) => {
  const {rankedDaily} = useMainContext();
  // 데이터 정렬 및 랭킹 추가
  const renderItem = ({item}) => (
    <View style={styles.rankItem}>
      <Text style={styles.rankText}>{item.rank}</Text>
      <Image
        source={require('../../assets/exampleImg.png')}
        resizeMode="contain"
        style={styles.profileImage}
      />
      <View style={styles.infoContainer}>
        <View style={[styles.nameAndTimeContainer, {paddingBottom: 20}]}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.groupText}>{item.studyGroup}</Text>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{formatDate()}</Text>
      <Text style={styles.timerText}>{currentUser.studyTime}</Text>

      <FlatList
        data={rankedDaily}
        renderItem={renderItem}
        keyExtractor={item => item.rank.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};
const GroupRankingTap = ({currentUser}) => {
  const {rankedGroup} = useMainContext();
  // 그룹별로 데이터를 분류하고 시간 총합 계산
  const renderItem = ({item}) => (
    <View style={styles.rankItem}>
      <Text style={styles.rankText}>{item.rank}</Text>
      <Image
        source={require('../../assets/exampleImg.png')}
        resizeMode="contain"
        style={styles.profileImage}
      />
      <View style={styles.infoContainer}>
        <View style={styles.nameAndTimeContainer}>
          <Text style={styles.nameText}>{item.studyGroup}</Text>
          <Text style={styles.timeText}>{formatTime(item.totalTime)}</Text>
        </View>
        <Text style={styles.groupText}>
          {item.members}/{item.limit}
        </Text>
        <Text style={styles.groupText}>{item.leaderName}</Text>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{formatDate()}</Text>
      <Text style={styles.timerText}>{currentUser.studyTime}</Text>

      <FlatList
        data={rankedGroup}
        renderItem={renderItem}
        keyExtractor={item => item.rank.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};
const RankingInGroupTap = ({currentUser}) => {
  const {rankedInGroup} = useMainContext();

  const renderItem = ({item}) => (
    <View style={styles.rankItem}>
      <Text style={styles.rankText}>{item.rank}</Text>
      <Image
        source={require('../../assets/exampleImg.png')}
        resizeMode="contain"
        style={styles.profileImage}
      />
      <View style={styles.infoContainer}>
        <View style={[styles.nameAndTimeContainer, {paddingBottom: 20}]}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.groupText}>{item.studyGroup}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{formatDate()}</Text>
      <Text style={styles.timerText}>{currentUser.studyTime}</Text>

      <FlatList
        data={rankedInGroup}
        renderItem={renderItem}
        keyExtractor={item => item.key.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};
const RankingScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: '일일 랭킹'},
    {key: 'second', title: '그룹 랭킹'},
    {key: 'third', title: '그룹 내 랭킹'},
  ]);
  const {user} = useMainContext();
  const renderScene = ({route}) => {
    switch (route.key) {
      case 'first':
        return <DailyRankingTap currentUser={user} />;

      case 'second':
        return <GroupRankingTap currentUser={user} />;
      case 'third':
        return <RankingInGroupTap currentUser={user} />;
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
        renderTabBar={customRenderTabBar}
        style={{flex: 1}}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  dateText: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#0056b3',
    textAlign: 'center',
    marginTop: 20,
  },
  timerText: {
    fontSize: width * 0.15,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: width * 0.1,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rankText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDD',
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  nameAndTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%', // 전체 가로 너비 확보
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  groupText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
});
export default RankingScreen;
