import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useMainContext} from '../../component/mainContext';
const {width} = Dimensions.get('window');

const NotificationScreen = ({navigation}) => {
  const [notifications, setNotifications] = useState([]);
  const {serverUrl, user, token} = useMainContext();
  console.log(token);
  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `${serverUrl}/notifications?userId=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('알림 데이터를 가져오는데 실패했습니다.');
      }

      const data = await response.json();
      const sortedData = data.sort(
        (a, b) => new Date(b.receivedAt) - new Date(a.receivedAt),
      );
      setNotifications(sortedData); // 알림 상태 업데이트
    } catch (error) {
      console.error('Error fetching notifications: ', error);
    }
  };

  const handleNotificationPress = async item => {
    try {
      // 서버에 읽음 상태 업데이트 요청
      const response = await fetch(`${serverUrl}/notifications/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({isRead: true}),
      });
      if (!response.ok) {
        throw new Error('알림 상태 업데이트 실패');
      }
      // 클라이언트에서 읽음 상태 업데이트
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === item.id
            ? {...notification, isRead: true}
            : notification,
        ),
      );
      navigation.navigate('NotificationDetail', {
        item: {...item, isRead: true},
      });
    } catch (error) {
      console.error('Error updating notification: ', error);
    }
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
        <View style={styles.iconWithTextContainer}>
          <View style={[styles.iconContainer]}>
            <Ionicons
              name={
                item.senderName === 'System' ? 'desktop-sharp' : 'person-sharp'
              }
              size={24}
              color="black"
            />
          </View>
          <Text
            style={[styles.sender, {color: item.isRead ? '#888' : 'black'}]}>
            {item.senderName}
          </Text>
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

  useEffect(() => {
    fetchNotifications();
  }, []);
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0f7e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5, // 아이콘과 텍스트 사이의 간격
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
  sender: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  iconWithTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
});

export default NotificationScreen;
