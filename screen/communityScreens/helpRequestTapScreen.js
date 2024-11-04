// screen/CommunityScreens/HelpRequestTap
import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useMainContext} from '../../component/mainContext';

const {width, height} = Dimensions.get('window');

const HelpRequestTap = ({navigation}) => {
  const {helpRequests, setHelpRequests} = useMainContext();
  // 나중에 그림 url 추가할 것
  const handleDelete = id => {
    Alert.alert('삭제 확인', '이 항목을 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        onPress: () =>
          setHelpRequests(prev => prev.filter(item => item.id !== id)),
        style: 'destructive',
      },
    ]);
  };

  const handleEditPost = post => {
    navigation.navigate('HelpRequestPost', {
      post,
      onSave: updatedPost => {
        setHelpRequests(prev =>
          prev.map(item => (item.id === updatedPost.id ? updatedPost : item)),
        );
      },
    });
  };
  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('HelpRequestView', {post: item})}>
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
            <Text style={{fontWeight: 'bold'}}>
              {item.helpRequestInfo.title}
            </Text>
            <Text>{item.helpRequestInfo.description}</Text>
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
              {item.helpRequestInfo.comments}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5,
          }}>
          <Text style={{color: '#888'}}>{item.helpRequestInfo.date}</Text>
          <Text style={{color: '#888'}}>{item.helpRequestInfo.user}</Text>
        </View>
      </View>
    </TouchableOpacity>
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

export default HelpRequestTap;
