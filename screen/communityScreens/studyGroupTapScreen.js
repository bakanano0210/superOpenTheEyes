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
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../component/custom';
import {useMainContext} from '../../component/mainContext';

const {width, height} = Dimensions.get('window');
const tempUserId = 'user123';

const StudyGroupTap = ({
  modalVisible,
  setModalVisible,
  isEditMode,
  setIsEditMode,
  navigation,
}) => {
  const {studyGroups, setStudyGroups} = useMainContext();
  const [selectedGroup, setSelectedGroup] = useState({
    id: '',
    studyGroupInfo: {
      leaderId: '',
      name: '',
      members: '',
      leaderName: '',
    },
  });

  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupLimit, setNewGroupLimit] = useState(1);
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const leaderName = '로그인아이디';

  const handleDelete = id => {
    Alert.alert('삭제 확인', '이 항목을 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        onPress: () => {
          const updatedData = studyGroups.filter(item => item.id !== id);
          setStudyGroups(updatedData);
          setSelectedGroup(null);
        },
        style: 'destructive',
      },
    ]);
  };

  const handleSaveGroup = () => {
    if (isEditMode) {
      const updatedGroups = studyGroups.map(group =>
        group.id === selectedGroup.id
          ? {
              ...selectedGroup,
              studyGroupInfo: {
                ...group.studyGroupInfo,
                name: newGroupName,
                description: newGroupDescription,
                limit: newGroupLimit,
              },
            }
          : group,
      );
      console.log(updatedGroups);
      setStudyGroups(updatedGroups);
    } else {
      const currentTime = Date.now().toString();
      const newGroupId = `${leaderName}-${currentTime}`;
      const newGroup = {
        id: newGroupId,
        studyGroupInfo: {
          leaderId: tempUserId,
          name: newGroupName,
          members: 1,
          leaderName: leaderName,
          description: newGroupDescription,
          limit: newGroupLimit,
        },
      };
      setStudyGroups([newGroup, ...studyGroups]);
    }
    handleCancle();
  };

  const handleCancle = () => {
    setNewGroupName('');
    setNewGroupLimit(1);
    setNewGroupDescription();
    setModalVisible(false);
    setIsEditMode(false);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('StudyGroupDetail', {item: item})}>
      <View style={styles.groupContainer}>
        <View style={styles.iconPlaceholder}>
          <Image
            source={require('../../assets/exampleImg.png')}
            resizeMode="contain"
            style={styles.groupIcon}
          />
        </View>
        <View style={styles.groupInfo}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupName}>{item.studyGroupInfo.name}</Text>
            {item.studyGroupInfo.leaderId === tempUserId && (
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.groupDetailsContainer}>
            <View>
              <Text style={styles.groupDetails}>
                {item.studyGroupInfo.members}/{item.studyGroupInfo.limit}
              </Text>
              <Text style={styles.groupDetails}>
                {item.studyGroupInfo.leaderName}
              </Text>
            </View>
            {item.studyGroupInfo.leaderId === tempUserId && (
              <TouchableOpacity
                onPress={() => {
                  setIsEditMode(true);
                  setModalVisible(true);
                  setSelectedGroup(item);
                  setNewGroupName(item.studyGroupInfo.name);
                  setNewGroupLimit(item.studyGroupInfo.limit);
                  setNewGroupDescription(item.studyGroupInfo.description);
                }}>
                <Ionicons name="pencil" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  console.log('newlImit');
  console.log(newGroupLimit);
  return (
    <View style={styles.communityContainer}>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView style={styles.modalBackground} behavior="padding">
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <View style={styles.iconPlaceholder}>
                    <TouchableOpacity
                      onPress={() => console.log('image touched!!')}>
                      <Ionicons name="image" size={24} color="#014099" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="스터디 그룹명 입력"
                      value={newGroupName}
                      onChangeText={setNewGroupName}
                    />
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
        />
        <TouchableOpacity onPress={() => console.log('search clicked!!')}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={studyGroups}
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
    width: '100%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
  },
  iconPlaceholder: {
    width: 72,
    height: 72,
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
    paddingLeft: 10,
    marginBottom: 10,
    fontSize: 16,
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
