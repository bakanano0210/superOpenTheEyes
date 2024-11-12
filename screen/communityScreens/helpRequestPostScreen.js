import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useRoute} from '@react-navigation/native';
import {useMainContext} from '../../component/mainContext';
import {CustomButton} from '../../component/custom';
import {launchImageLibrary} from 'react-native-image-picker';

const HelpRequestPostScreen = ({navigation}) => {
  const {setHelpRequests, user, helpRequests} = useMainContext();
  const route = useRoute();
  const {post} = route.params || {};
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [imageUris, setImageUris] = useState(post?.uri || []);
  useEffect(() => {
    setTitle(post?.title || '');
    setDescription(post?.description || '');
  }, [post]);

  const handleChoosePhotos = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0, // 0으로 하면 여러 개 사진 선택
      },
      response => {
        if (response.didCancel) {
          console.log('사용자 취소');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets) {
          const uris = response.assets.map(asset => asset.uri);
          setImageUris(prevUris => [...prevUris, ...uris]);
        }
      },
    );
  };
  const handleSave = () => {
    if (!title || !description) {
      Alert.alert('입력 오류', '제목과 내용을 모두 입력해주세요.');
      return;
    }
    if (post?.id) {
      const updatedPost = {
        ...post,
        title,
        description,
        uri: imageUris,
      };
      setHelpRequests(prev =>
        prev.map(item => (item.id === post.id ? updatedPost : item)),
      );
      navigation.navigate('HelpRequestView', {post: updatedPost});
    } else {
      const newPost = {
        id: Date.now().toString(), //나중에 userID 와 결합
        title,
        description,
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        user: user.name, // 나중에 userID로 변경
        userId: user.id,
        comments: 0,
        uri: imageUris,
      };
      setHelpRequests(prev => [newPost, ...prev]);
      navigation.goBack();
    }
  };
  console.log(helpRequests);
  const handleDeleteImage = uri => {
    setImageUris(prevUris => prevUris.filter(item => item !== uri)); // 선택한 이미지 URI 삭제
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
          <TouchableOpacity onPress={handleChoosePhotos}>
            <Ionicons name="image" size={32} color="#014099" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal style={styles.imagePreviewContainer}>
          {imageUris.map((uri, index) => (
            <View key={index} style={styles.imagePreviewWrapper}>
              <Image key={index} source={{uri}} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteImage(uri)}>
                <Ionicons name="close-circle" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      <CustomButton onPress={handleSave} text="글쓰기" />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  scrollViewContent: {
    padding: 20,
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
  imagePreviewContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
  },
  imagePreviewWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  previewImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: 'white',
    borderRadius: 12,
  },
});

export default HelpRequestPostScreen;
