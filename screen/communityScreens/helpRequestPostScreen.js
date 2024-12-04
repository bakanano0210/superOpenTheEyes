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
import {CustomButton, formatDate} from '../../component/custom';
import {launchImageLibrary} from 'react-native-image-picker';

const HelpRequestPostScreen = ({navigation}) => {
  const {setHelpRequests, user, token, serverUrl} = useMainContext();
  const route = useRoute();
  const {currentPost} = route.params || {};
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [uploadedImageUris, setUploadedImageUris] = useState(
    Array.isArray(currentPost?.uri) ? currentPost.uri : [],
  );
  const [localImageUris, setLocalImageUris] = useState([]);
  console.log('localImageUris');
  console.log(localImageUris);
  console.log('uploadedImageUris');
  console.log(uploadedImageUris);
  useEffect(() => {
    setTitle(currentPost?.title || '');
    setDescription(currentPost?.description || '');
  }, [currentPost]);

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
          setLocalImageUris(prevUris =>
            Array.isArray(prevUris) ? [...prevUris, ...uris] : uris,
          );
        }
      },
    );
  };
  const handleSave = async () => {
    if (!title || !description) {
      Alert.alert('입력 오류', '제목과 내용을 모두 입력해주세요.');
      return;
    }
    try {
      if (currentPost?.id) {
        // **수정 로직**
        await handleUpdatePost();
      } else {
        // **추가 로직**
        await handleCreatePost();
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('오류', error.message);
    }
  };

  const handleCreatePost = async () => {
    // 게시물 생성
    const newPostPayload = {
      title,
      description,
      userId: user.id,
      date: formatDate(),
      comments: 0,
      uri: [],
    };

    const createResponse = await fetch(
      `${serverUrl}/help-requests?userId=${user.id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPostPayload),
      },
    );

    if (!createResponse.ok) {
      throw new Error('게시물 저장 실패');
    }

    const savedPost = await createResponse.json();

    // 이미지 업로드
    if (localImageUris.length > 0) {
      const uploadedUris = await Promise.all(
        localImageUris.map(uri => uploadImage(uri)),
      );
      savedPost.uri = uploadedUris; // 업로드된 이미지 URI 설정
    }

    setHelpRequests(prev => [savedPost, ...prev]);
  };

  const handleUpdatePost = async () => {
    // 새로 추가된 이미지 업로드
    const newlyUploadedUris = await Promise.all(
      localImageUris.map(uri => uploadImage(uri)),
    );

    const updatedUris = [
      ...(Array.isArray(uploadedImageUris) ? uploadedImageUris : []),
      ...newlyUploadedUris,
    ];

    // 삭제된 이미지 처리
    const removedUris = currentPost.uri.filter(
      uri => !uploadedImageUris.includes(uri),
    );
    if (removedUris.length > 0) {
      await fetch(
        `${serverUrl}/help-requests/${currentPost.id}/delete-images`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({uris: removedUris}),
        },
      );
    }

    // 게시물 업데이트
    const updatedPostPayload = {
      title,
      description,
      uri: updatedUris,
    };
    console.log('updatedPostPayload');
    console.log(updatedPostPayload);

    const updateResponse = await fetch(
      `${serverUrl}/help-requests/${currentPost.id}?userId=${user.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPostPayload),
      },
    );

    if (!updateResponse.ok) {
      throw new Error('게시물 수정 실패');
    }

    const updatedPost = await updateResponse.json();

    // 상태 업데이트
    setHelpRequests(prev =>
      prev.map(item => (item.id === currentPost.id ? updatedPost : item)),
    );
  };

  const handleDeleteImage = uri => {
    if (Array.isArray(uploadedImageUris) && uploadedImageUris.includes(uri)) {
      setUploadedImageUris(prevUris =>
        Array.isArray(prevUris) ? prevUris.filter(item => item !== uri) : [],
      ); // 기존 이미지 삭제
    } else {
      setLocalImageUris(prevUris =>
        Array.isArray(prevUris) ? prevUris.filter(item => item !== uri) : [],
      ); // 새 이미지 삭제
    }
  };

  const uploadImage = async uri => {
    console.log(uri);
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    try {
      const response = await fetch(
        `${serverUrl}/help-requests/${currentPost.id}/upload-image`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error('이미지 업로드 실패');
      }

      const {imageUri} = await response.json();
      return imageUri;
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '이미지 업로드에 실패했습니다.');
      throw error;
    }
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
          {[...uploadedImageUris, ...localImageUris].map((uri, index) => (
            <View key={index} style={styles.imagePreviewWrapper}>
              <Image
                key={index}
                source={{
                  uri: uri.startsWith('file://')
                    ? `${uri}`
                    : `${serverUrl}${uri}`,
                }}
                style={styles.previewImage}
              />
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
