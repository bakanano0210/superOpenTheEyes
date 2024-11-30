import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useMainContext} from '../../component/mainContext';

const HelpRequestTap = ({navigation}) => {
  const {helpRequests, emulUrl} = useMainContext();
  // {
  //   id: '2',
  //   title: '어디가 틀린건가요ㅠㅠㅠㅠ',
  //   description: '몇 시간을 때려박아도 모르겠어요ㅠㅠㅠ',
  //   date: '2024.10.25 12:31:32',
  //   user: 'User2',
  //   userId: '2',
  //   comments: 1,
  //   uri: [],
  // },
  const [searchText, setSearchText] = useState('');
  const [filteredHelpRequests, setFilteredHelpRequests] =
    useState(helpRequests);
  console.log(filteredHelpRequests);
  useEffect(() => {
    const filtered = helpRequests
      .filter(post =>
        post.title.toLowerCase().includes(searchText.toLowerCase()),
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredHelpRequests(filtered);
  }, [helpRequests, searchText]);

  // 서버에서 게시물 정보를 가져오는 함수

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('HelpRequestView', {post: item})}>
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <View>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postDescription} numberOfLines={1}>
              {item.description}
            </Text>
          </View>
          <View style={styles.commentIconContainer}>
            <Ionicons name="chatbubble-outline" size={32} color="#00a7eb" />
            <Text style={styles.commentCount}>{item.comments}</Text>
          </View>
        </View>
        <View style={styles.postFooter}>
          <Text style={styles.postDate}>{item.date}</Text>
          <Text style={styles.postUser}>{item.userName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="게시글 제목 검색..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <Ionicons name="search" size={24} color="black" />
      </View>
      <FlatList
        data={filteredHelpRequests}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
  },
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postTitle: {
    fontWeight: 'bold',
  },
  postDescription: {
    color: '#333',
  },
  commentIconContainer: {
    position: 'relative',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentCount: {
    position: 'absolute',
    textAlign: 'center',
    color: '#00a7eb',
    borderRadius: 12,
    width: 18,
    height: 18,
    lineHeight: 18,
    fontSize: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  postDate: {
    color: '#888',
  },
  postUser: {
    color: '#888',
  },
});

export default HelpRequestTap;
