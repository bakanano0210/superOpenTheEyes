import {useRoute} from '@react-navigation/native';
import React, {useLayoutEffect, useState} from 'react';
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
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useMainContext} from '../../component/mainContext';
import {CommunityOwnerRightHeader} from '../../component/header';

const {width, height} = Dimensions.get('window');

const HelpRequestViewScreen = ({navigation}) => {
  const {setHelpRequests, user} = useMainContext();
  const route = useRoute();
  const {post} = route.params;
  const {comments, setComments} = useMainContext();
  const [newComment, setNewComment] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);

  const isAuthor = user.id === post.userId;
  useLayoutEffect(() => {
    if (isAuthor) {
      navigation.setOptions({
        headerRight: () => CommunityOwnerRightHeader({setMenuVisible}),
      });
    }
  }, [navigation, isAuthor]);

  const filteredComments = comments.filter(
    comment => comment.postId === post.id,
  );

  const renderComment = ({item}) => {
    const isCommentAuthor = item.userId === user.id;
    return (
      <View style={styles.commentContainer}>
        <View>
          <Text style={styles.commentUser}>{item.user}</Text>
          <Text style={styles.commentContent}>{item.content}</Text>
          <Text style={styles.commentDate}>{item.date}</Text>
        </View>

        {isCommentAuthor ? (
          <View style={styles.commentActions}>
            <TouchableOpacity onPress={() => handleCommentDelete(item)}>
              <Ionicons name="close" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleEditComment(item)}>
              <Ionicons name="pencil" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  const renderPostHeader = () => (
    <View style={styles.postContainer}>
      <Text style={styles.postTitle}>{post.title}</Text>
      <Text style={styles.postUser}>{post.user}</Text>
      <Text style={styles.postDate}>{post.date}</Text>
      <Text style={styles.postContent}>{post.description}</Text>
      {post.uri.map((uri, index) => (
        <Image key={index} source={{uri}} style={styles.postImage} />
      ))}

      {/* "댓글" 헤더 추가 */}
      <View style={styles.commentsHeaderContainer} />
    </View>
  );

  /* 게시글 관리 함수 */
  const handleEdit = () => {
    setMenuVisible(false);
    navigation.navigate('HelpRequestPost', {post});
  };
  const handleDelete = () => {
    Alert.alert('삭제 확인', '이 항목을 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        onPress: () => {
          setHelpRequests(prev => prev.filter(item => item.id !== post.id));
          setMenuVisible(false);
          navigation.goBack();
        },
        style: 'destructive',
      },
    ]);
  };

  /* 댓글 관리 함수 */
  const handleAddOrEditComment = () => {
    if (newComment.trim()) {
      if (editingCommentId) {
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === editingCommentId
              ? {
                  ...comment,
                  content: newComment,
                  date: new Date().toISOString().slice(0, 19).replace('T', ' '),
                }
              : comment,
          ),
        );
        setEditingCommentId(null);
      } else {
        const newCommentObj = {
          id: Date.now().toString(), // 고유 ID 생성
          postId: post.id,
          userId: user.id,
          user: user.name, // 현재 로그인된 User로 변경 예정
          content: newComment,
          date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };

        // 새로운 댓글 추가 및 상태 업데이트
        setComments([...comments, newCommentObj]);
        setHelpRequests(prevHelpRequests =>
          prevHelpRequests.map(item =>
            item.id === post.id
              ? {
                  ...item,
                  comments: item.comments + 1,
                }
              : item,
          ),
        );
      }
      setNewComment(''); // 입력 필드 초기화
      Keyboard.dismiss();
    }
  };
  const handleEditComment = comment => {
    setEditingCommentId(comment.id);
    setNewComment(comment.content);
  };
  const handleCommentDelete = comment => {
    Alert.alert('삭제 확인', '이 항목을 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        onPress: () => {
          setComments(prev => prev.filter(item => item.id !== comment.id));
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <FlatList
        data={filteredComments}
        renderItem={renderComment}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderPostHeader}
        contentContainerStyle={styles.commentList}
      />
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity
          onPress={handleAddOrEditComment}
          style={styles.addButton}>
          <Ionicons name="send" size={24} color="#014099" />
        </TouchableOpacity>
      </View>
      {menuVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={menuVisible}
          onRequestClose={() => setMenuVisible(false)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setMenuVisible(false)}>
            <View style={[styles.menuContainer]}>
              <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
                <Text>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                <Text>삭제</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  postContainer: {
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
    width: '80%',
    height: width * 0.8,
    resizeMode: 'contain',
    marginVertical: 10,
    alignSelf: 'center',
  },
  commentList: {
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  commentContainer: {
    paddingVertical: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentsHeaderContainer: {
    marginTop: height * 0.03,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: 'white',
  },
  commentsHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 16,
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
  commentActions: {
    marginVertical: 5,
    justifyContent: 'space-between',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    flex: 1,
    position: 'absolute',
    top: 30, // HomeLeftHeader 아래에 위치하도록 조정
    right: 24,
    width: width * 0.3,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  deleteCommentButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
  },
});

export default HelpRequestViewScreen;
