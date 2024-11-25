import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../component/custom';
import {useMainContext} from '../../component/mainContext';
import {launchImageLibrary} from 'react-native-image-picker';

const StudyGroupTap = ({
  modalVisible,
  setModalVisible,
  isEditMode,
  setIsEditMode,
  navigation,
}) => {
  const {token, realUrl} = useMainContext();
  const [selectedGroup, setSelectedGroup] = useState({
    id: '',
    leaderId: '',
    name: '',
    members: '',
    leaderName: '',
  });
  const {studyGroups, setStudyGroups} = useMainContext();
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupLimit, setNewGroupLimit] = useState(1);
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filteredGroups, setFilteredGroups] = useState(studyGroups);
  const {user, setUser} = useMainContext();

  const handleChoosePhoto = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      async response => {
        if (response.didCancel) {
          console.log('사용자 취소');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const selectedUri = response.assets[0].uri;
          setImageUri(selectedUri);
        }
      },
    );
  };
  const uploadGroupImage = async (groupId, selectedUri) => {
    const formData = new FormData();
    formData.append('file', {
      uri: selectedUri,
      type: 'image/jpeg',
      name: 'groupImage.jpg',
    });

    try {
      const uploadResponse = await fetch(
        `${realUrl}/study-groups/${groupId}/upload-group-image`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (uploadResponse.ok) {
        const {imageUri} = await uploadResponse.json();

        // 그룹 이미지 업데이트
        setStudyGroups(prevGroups =>
          prevGroups.map(group =>
            group.id === groupId ? {...group, imageUri} : group,
          ),
        );

        console.log('Group image uploaded successfully:', imageUri);
      } else {
        console.error(
          'Failed to upload group image:',
          await uploadResponse.text(),
        );
      }
    } catch (error) {
      console.error('Error uploading group image:', error);
    }
  };

  const handleDelete = id => {
    Alert.alert('삭제 확인', '이 항목을 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        onPress: async () => {
          try {
            const response = await fetch(`${realUrl}/study-groups/${id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.ok) {
              // 서버에서 성공적으로 삭제된 경우 로컬 상태 업데이트
              setStudyGroups(prevGroups =>
                prevGroups.filter(group => group.id !== id),
              );

              // 사용자 상태에서 studyGroupId 초기화
              setUser(prevUser => ({
                ...prevUser,
                studyGroupId: null, // studyGroupId를 null로 초기화
              }));

              Alert.alert('삭제 완료', '그룹이 삭제되었습니다.');
            } else {
              console.error('Failed to delete group:', await response.text());
              Alert.alert('삭제 실패', '그룹 삭제에 실패했습니다.');
            }
          } catch (error) {
            console.error('Error deleting group:', error);
            Alert.alert('삭제 오류', '서버와의 통신 중 오류가 발생했습니다.');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleSaveGroup = async () => {
    if (isEditMode) {
      // 수정 모드
      const updatedGroup = {
        ...selectedGroup,
        name: newGroupName,
        description: newGroupDescription,
        limit: newGroupLimit,
      };
      try {
        const response = await fetch(
          `${realUrl}/study-groups/${selectedGroup.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedGroup),
          },
        );

        if (response.ok) {
          const updatedGroupResponse = await response.json();
          // 로컬 상태 업데이트
          setStudyGroups(prev =>
            prev.map(group =>
              group.id === updatedGroupResponse.id
                ? updatedGroupResponse
                : group,
            ),
          );
          // 이미지 업로드
          if (imageUri) {
            await uploadGroupImage(updatedGroupResponse.id, imageUri);
          }

          // 사용자 정보 업데이트
          if (updatedGroupResponse.leaderId === user.id) {
            setUser(prevUser => ({
              ...prevUser,
              studyGroupId: updatedGroupResponse.id,
            }));
          }
          Alert.alert('수정 완료', '그룹 정보가 수정되었습니다.');
        } else {
          console.error('Failed to update group:', await response.text());
          Alert.alert('수정 실패', '그룹 정보 수정에 실패했습니다.');
        }
      } catch (error) {
        console.error('Error updating group:', error);
        Alert.alert('수정 오류', '그룹 정보 수정 중 오류가 발생했습니다.');
      }
    } else {
      // 생성 모드
      // user의 studyGroupId가 0이 아니면 이미 가입한 그룹이 있는 것으로 간주
      if (user.studyGroupId !== null) {
        Alert.alert('생성 불가', '이미 가입된 스터디 그룹이 있습니다.');
        return; // 그룹 생성 프로세스 중지
      }
      const group = {
        name: newGroupName,
        description: newGroupDescription,
        limit: newGroupLimit,
      };
      try {
        const response = await fetch(`${realUrl}/study-groups`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(group),
        });

        if (response.ok) {
          const newGroup = await response.json();
          // 로컬 상태에 새로운 그룹 추가
          setStudyGroups(prev => [newGroup, ...prev]);
          // 이미지 업로드
          if (imageUri) {
            await uploadGroupImage(newGroup.id, imageUri);
          }
          // 사용자 정보 업데이트 (생성 후 그룹 리더가 되므로 그룹 정보 설정)
          setUser(prevUser => ({
            ...prevUser,
            studyGroupId: newGroup.id,
            studyGroupName: newGroup.name,
          }));
          Alert.alert('생성 완료', '새로운 그룹이 생성되었습니다.');
        } else {
          console.error('Failed to create group:', await response.text());
          Alert.alert('생성 실패', '그룹 생성에 실패했습니다.');
        }
      } catch (error) {
        console.error('Error creating group:', error);
        Alert.alert('생성 오류', '그룹 생성 중 오류가 발생했습니다.');
      }
    }
    handleCancle();
  };

  const handleCancle = () => {
    setNewGroupName('');
    setNewGroupLimit(1);
    setNewGroupDescription();
    setModalVisible(false);
    setIsEditMode(false);
    setImageUri('');
  };

  useEffect(() => {
    const filtered = studyGroups.filter(group =>
      group.name.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredGroups(filtered);
  }, [studyGroups, searchText]);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('StudyGroupDetail', {info: item})}>
        <View style={styles.groupContainer}>
          <View style={styles.iconPlaceholder}>
            <Image
              source={
                item.imageUri
                  ? {uri: `${realUrl}${item.imageUri}`}
                  : require('../../assets/exampleImg.png')
              }
              resizeMode="contain"
              style={styles.groupIcon}
            />
          </View>
          <View style={styles.groupInfo}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupName}>{item.name}</Text>
              {item.leaderId === user.id && (
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.groupDetailsContainer}>
              <View>
                <Text style={styles.groupDetails}>
                  {item.membersCount}/{item.limit}
                </Text>
                <Text style={styles.groupDetails}>{item.leaderName}</Text>
              </View>
              {item.leaderId === user.id && (
                <TouchableOpacity
                  onPress={() => {
                    setIsEditMode(true);
                    setModalVisible(true);
                    setSelectedGroup(item);
                    setNewGroupName(item.name);
                    setNewGroupLimit(item.limit);
                    setNewGroupDescription(item.description);
                    setImageUri(item.imageUri);
                  }}>
                  <Ionicons name="pencil" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.communityContainer}>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView style={styles.modalBackground} behavior="height">
          <View style={styles.modalContainer}>
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              keyboardShouldPersistTaps="handled">
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <View style={styles.iconPlaceholder}>
                    <TouchableOpacity onPress={handleChoosePhoto}>
                      {imageUri === '' ? (
                        <Ionicons name="image" size={48} color="#014099" />
                      ) : (
                        <Image
                          source={{uri: imageUri}}
                          resizeMode="contain"
                          style={{width: 56, height: 56}}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>그룹명</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="스터디 그룹명"
                      value={newGroupName}
                      onChangeText={setNewGroupName}
                    />
                    <Text style={styles.label}>제한인원</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="제한인원"
                      value={newGroupLimit.toString()}
                      onChangeText={text => setNewGroupLimit(Number(text))}
                    />
                  </View>
                </View>
                <TextInput
                  style={[styles.modalInput, styles.textArea]}
                  placeholder="스터디 그룹에 대한 소개문을 입력하세요."
                  textAlignVertical="top"
                  multiline
                  value={newGroupDescription}
                  onChangeText={setNewGroupDescription}
                />
                <CustomButton
                  onPress={handleSaveGroup}
                  text={isEditMode ? '수정' : '등록'}
                />
                <CustomButton onPress={handleCancle} text="취소" />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="스터디 그룹명 입력..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <Ionicons name="search" size={24} color="black" />
      </View>

      <FlatList
        data={filteredGroups}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  communityContainer: {
    flex: 1,
    padding: 5,
    backgroundColor: '#f5f5f5',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    width: '90%',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  keyboardView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
  },
  label: {fontSize: 14, color: '#444', marginBottom: 5},
  iconPlaceholder: {
    width: 64,
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 16,
    alignSelf: 'center',
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  groupIcon: {
    width: 48,
    height: 48,
  },
  groupInfo: {
    flex: 1,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  groupDetails: {
    fontSize: 14,
    color: '#666',
  },
  modalInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    height: 45,
  },
  textArea: {
    height: '30%',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
  },
});

export default StudyGroupTap;
