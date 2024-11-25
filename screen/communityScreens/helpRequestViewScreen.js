import {useRoute} from '@react-navigation/native';
import React, {useLayoutEffect, useState, useEffect} from 'react';
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
  const {setHelpRequests, user, token, realUrl} = useMainContext();
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

  const handleMentorRequest = () => {
    Alert.alert('멘토 요청', `${post.user}님에게 멘토 요청을 보내시겠습니까?`, [
      {text: '취소', style: 'cancel'},
      {
        text: '확인',
        onPress: () => {
          // 알림 전송 로직 추가 (예: API 호출)
          Alert.alert('멘토 요청 완료', '멘토 요청 알림이 전송되었습니다.');
        },
      },
    ]);
  };

  const renderComment = ({item}) => {
    const isCommentAuthor = item.userId === user.id;
    return (
      <View style={styles.commentContainer}>
        <View>
          <Text style={styles.commentUser}>{item.userName}</Text>
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
      <View style={styles.postHeader}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <TouchableOpacity
          style={styles.mentorRequestButton}
          onPress={handleMentorRequest}>
          <Text style={styles.mentorRequestText}>멘토 요청</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.postUser}>{post.userName}</Text>
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
  const handleDelete = async () => {
    Alert.alert('삭제 확인', '이 항목을 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        onPress: async () => {
          try {
            const response = await fetch(
              `${realUrl}/help-requests/${post.id}`,
              {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`, // 인증 토큰 추가
                },
              },
            );
            if (!response.ok) {
              throw new Error('게시물 삭제에 실패했습니다.');
            }

            setHelpRequests(prev => prev.filter(item => item.id !== post.id));
            setMenuVisible(false);
            navigation.goBack();
          } catch (error) {
            Alert.alert('오류', error.message);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  /* 댓글 관리 함수 */
  const handleAddOrEditComment = async () => {
    if (newComment.trim()) {
      try {
        if (editingCommentId) {
          const response = await fetch(
            `${realUrl}/comments/${editingCommentId}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                content: newComment,
                date: new Date().toISOString().slice(0, 19).replace('T', ' '),
              }),
            },
          );

          if (!response.ok) {
            throw new Error('댓글 수정 실패');
          }

          const updatedComment = await response.json();
          setComments(prev =>
            prev.map(comment =>
              comment.id === updatedComment.id ? updatedComment : comment,
            ),
          );
          setEditingCommentId(null);
        } else {
          const response = await fetch(`${realUrl}/comments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              postId: post.id,
              userId: user.id,
              userName: user.name,
              content: newComment,
              date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            }),
          });

          if (!response.ok) {
            throw new Error('댓글 추가 실패');
          }

          const newCommentObj = await response.json();
          setComments(prev => [...prev, newCommentObj]);

          // 서버로 post의 comments 증가 요청
          await fetch(
            `${realUrl}/help-requests/${post.id}/increment-comments`,
            {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

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
      } catch (error) {
        Alert.alert('오류', error.message);
      }
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
        onPress: async () => {
          try {
            const response = await fetch(`${realUrl}/comments/${comment.id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`, // 인증 토큰 추가
              },
            });

            if (!response.ok) {
              throw new Error('댓글 삭제에 실패했습니다.');
            }

            setComments(prev => prev.filter(item => item.id !== comment.id)); // 상태 업데이트

            // 서버로 post의 comments 감소 요청
            await fetch(
              `${realUrl}/help-requests/${post.id}/decrement-comments`,
              {
                method: 'PATCH',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            setHelpRequests(prevHelpRequests =>
              prevHelpRequests.map(item =>
                item.id === post.id
                  ? {
                      ...item,
                      comments: item.comments - 1,
                    }
                  : item,
              ),
            );
          } catch (error) {
            Alert.alert('오류', error.message);
          }
        },
        style: 'destructive',
      },
    ]);
  };
  const fetchComments = async () => {
    try {
      const response = await fetch(`${realUrl}/comments?postId=${post.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('댓글 데이터를 가져오는 데 실패했습니다.');
      }

      const data = await response.json();
      setComments(prev => [
        ...prev.filter(comment => comment.postId !== post.id), // 기존 댓글 제거
        ...data,
      ]);
    } catch (error) {
      Alert.alert('오류', error.message);
    }
  };
  useEffect(() => {
    fetchComments();
  }, []);

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
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  mentorRequestButton: {
    backgroundColor: '#34a853',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  mentorRequestText: {
    color: 'white',
    fontSize: 14,
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
