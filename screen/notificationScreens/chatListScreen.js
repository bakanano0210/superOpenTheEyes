import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {useMainContext} from '../../component/mainContext';
import {useIsFocused} from '@react-navigation/native';
const ChatListScreen = ({navigation}) => {
  const {token, user, emulUrl, chatRooms, setChatRooms} = useMainContext();
  const isFocused = useIsFocused(); // 현재 화면이 focus되었는지 확인

  // 화면이 활성화될 때마다 데이터 새로고침
  useEffect(() => {
    if (isFocused) {
      fetchChatRooms();
    }
  }, [isFocused]);
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
  const handleChatRoomPress = chatRoom => {
    navigation.navigate('ChatRoom', {chatRoom});
  };
  const renderChatRoom = ({item}) => (
    <TouchableOpacity onPress={() => handleChatRoomPress(item)}>
      {console.log(item)}
      <View style={styles.chatCard}>
        <Text style={styles.chatTitle}>{item.title}</Text>
        <Text style={styles.chatMessage}>{item.lastMessage}</Text>
        <View style={styles.chatFooter}>
          {/* 타임스탬프 */}
          <Text style={styles.chatTimestamp}>{item.lastMessageTimestamp}</Text>

          {/* 읽지 않은 메시지 수 */}
          {item.unreadMessages > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unreadMessages}</Text>
            </View>
          )}
        </View>
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
    padding: 20,
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
  chatFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  chatTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'right',
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
export default ChatListScreen;
