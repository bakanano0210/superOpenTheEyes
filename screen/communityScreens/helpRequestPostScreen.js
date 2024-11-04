import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useMainContext} from '../../component/mainContext';
import {CustomButton} from '../../component/custom';

const HelpRequestPostScreen = ({route}) => {
  const {setHelpRequests} = useMainContext();
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title || !description) {
      Alert.alert('입력 오류', '제목과 내용을 모두 입력해주세요.');
      return;
    }
    const newPost = {
      id: Date.now().toString(), //나중에 userID 와 결합
      helpRequestInfo: {
        title,
        description,
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        user: 'User1', // 나중에 userID로 변경
        comments: 0,
      },
    };
    setHelpRequests(prev => [newPost, ...prev]);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.titleInput}
          placeholder="제목"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.contentContainer}>
        <TextInput
          style={styles.contentInput}
          placeholder="내용"
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>
      <View style={styles.imageButton}>
        <TouchableOpacity>
          <Ionicons name="image" size={32} color="#014099" />
        </TouchableOpacity>
      </View>
      <CustomButton onPress={handleSave} text="글쓰기" />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#00a7eb',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  titleInput: {
    fontSize: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 20,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    minHeight: 150,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  imageButton: {
    marginRight: 10,
    width: 40, // 아이콘 크기만큼 너비 설정
    alignSelf: 'flex-end', // 오른쪽 정렬
  },
  submitButton: {
    backgroundColor: '#014099',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HelpRequestPostScreen;
