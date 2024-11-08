import {useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useMainContext} from '../../component/mainContext';

const HelpRequestViewScreen = ({navigation}) => {
  const {helpRequests, setHelpRequests} = useMainContext();
  const route = useRoute();
  const {post} = route.params;
  const {comments, setComments} = useMainContext();
  const [newComment, setNewComment] = useState('');

  const filteredComments = comments.filter(
    comment => comment.postId === post.id,
  );

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: Date.now().toString(), // 고유 ID 생성
        postId: post.id,
        user: 'CurrentUser', // 현재 로그인된 User로 변경 예정
        content: newComment,
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };

      // 새로운 댓글 추가 및 상태 업데이트
      setComments([...comments, newCommentObj]);
      setNewComment(''); // 입력 필드 초기화
      Keyboard.dismiss();

      setHelpRequests(prevHelpRequests => {
        const updatedHelpRequests = prevHelpRequests.map(item =>
          item.id === post.id
            ? {
                ...item,
                comments: item.comments + 1,
              }
            : item,
        );
        console.log('Updated Help Requests: ', updatedHelpRequests);
        return updatedHelpRequests; // 반드시 map 결과를 반환해야 합니다
      });
    }
    console.log(helpRequests);
  };

  const renderComment = ({item}) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentUser}>{item.user}</Text>
      <Text style={styles.commentContent}>{item.content}</Text>
      <Text style={styles.commentDate}>{item.date}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* 게시글 정보 */}
      <View style={styles.postContainer}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postUser}>{post.user}</Text>
        <Text style={styles.postDate}>{post.date}</Text>
        <Text style={styles.postContent}>{post.description}</Text>
        <Image
          source={require('../../assets/exampleImg.png')}
          style={styles.postImage}
        />
      </View>

      {/* 댓글 목록 */}
      <FlatList
        data={filteredComments}
        renderItem={renderComment}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.commentList}
      />
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={handleAddComment} style={styles.addButton}>
          <Ionicons name="send" size={24} color="#014099" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  postContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postUser: {
    fontSize: 14,
    color: 'gray',
  },
  postDate: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 10,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  commentList: {
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  commentContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  commentUser: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentContent: {
    fontSize: 14,
    marginVertical: 5,
  },
  commentDate: {
    fontSize: 12,
    color: 'gray',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: 'white',
  },
  commentInput: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
  },
  addButton: {
    marginLeft: 10,
  },
});

export default HelpRequestViewScreen;
