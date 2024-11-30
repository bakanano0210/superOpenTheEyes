import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {useMainContext} from '../../component/mainContext';
const ChatListScreen = ({navigation}) => {
  const [chatRooms, setChatRooms] = useState([]);
  const {token, user, emulUrl} = useMainContext();

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await fetch(`${emulUrl}/chat-rooms/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('채팅방 데이터를 가져올 수 없습니다.');
        }
        const data = await response.json();
        setChatRooms(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchChatRooms();
  }, []);
  const handleChatRoomPress = chatRoom => {
    navigation.navigate('ChatRoom', {chatRoom});
  };

  const renderChatRoom = ({item}) => (
    <TouchableOpacity onPress={() => handleChatRoomPress(item)}>
      <View style={styles.chatCard}>
        <Text style={styles.chatTitle}>{item.title}</Text>
        <Text style={styles.chatMessage}>{item.lastMessage}</Text>
        <Text style={styles.chatTimestamp}>{item.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        keyExtractor={item => item.id}
        renderItem={renderChatRoom}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chatCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  chatMessage: {
    fontSize: 14,
    color: '#555',
  },
  chatTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'right',
  },
});
export default ChatListScreen;
