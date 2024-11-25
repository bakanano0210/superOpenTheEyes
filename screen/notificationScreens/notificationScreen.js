import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const {width} = Dimensions.get('window');

const initialNotifications = [
  {
    id: '1',
    userName: 'User',
    title: '쪽지 예시 제목',
    message: '쪽지 예시에 대한 글입니다.',
    isRead: false, // 확인 여부
  },
  {
    id: '2',
    userName: '',
    title: '멘토 멘티 관련',
    message: 'User님과의 멘토 관계가 성립되었습니다.',
    isRead: false,
  },
  {
    id: '3',
    userName: '',
    title: '멘토 요청',
    message: 'User님으로부터 멘토 요청이 왔습니다.',
    isRead: false,
  },
  {
    id: '4',
    userName: '',
    title: '회원가입',
    message: '회원가입이 완료되었습니다.',
    isRead: false,
  },
];

const NotificationScreen = ({navigation}) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleNotificationPress = item => {
    // 확인 여부 업데이트
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === item.id
          ? {...notification, isRead: true}
          : notification,
      ),
    );
    navigation.navigate('NotificationDetail', {item});
  };
  const handleWritePress = () => {
    navigation.navigate('MessageWrite');
  };
  const handleChatPress = () => {
    navigation.navigate('ChatList');
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)}>
      <View
        style={[
          styles.card,
          {backgroundColor: item.isRead ? '#e0e0e0' : '#fff'}, // 확인 여부에 따라 배경색 변경
        ]}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={item.userName === '' ? 'desktop-sharp' : 'person-sharp'}
            size={24}
            color="black"
          />
        </View>
        <View style={{flex: 1}}>
          <Text style={[styles.title, {color: item.isRead ? '#555' : 'black'}]}>
            {item.title}
          </Text>
          <Text style={styles.message}>{item.message}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.writeButton} onPress={handleWritePress}>
          <Text style={styles.writeButtonText}>쪽지 쓰기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  listContainer: {
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0f7e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: '#555',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  chatButton: {
    backgroundColor: '#e0f7e9',
    padding: 10,
    borderRadius: 30,
  },
  writeButton: {
    backgroundColor: '#34a853',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  writeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default NotificationScreen;
