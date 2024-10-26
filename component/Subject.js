import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {commonStyles} from '../public/styles';

const {width, height} = Dimensions.get('window');

export const SubjectModal = ({
  visible,
  onClose,
  isEdit = false,
  initialTitle = '',
  subjectCardInfoList,
  setSubjectCardInfoList,
  editingKey = null,
}) => {
  const [subjectTitle, setSubjectTitle] = useState('');
  useEffect(() => {
    setSubjectTitle(initialTitle);
  }, [initialTitle]);
  const onChangeTitle = title => {
    console.log(title);
    setSubjectTitle(title);
  };
  const handleSave = () => {
    if (subjectTitle === '') {
      Alert.alert('입력 오류', '입력되지 않는 요소가 있습니다.', [
        {text: '확인'},
      ]);
      return;
    }
    if (isEdit) {
      const updatedList = subjectCardInfoList.map(item =>
        item.key === editingKey
          ? {...item, subjectInfo: {...item.subjectInfo, title: subjectTitle}}
          : item,
      );
      setSubjectCardInfoList(updatedList);
    } else {
      const currentTime = Date.now().toString();
      const key = `${subjectTitle}_${currentTime}`;
      const newSubjectInfo = {
        key: key,
        subjectInfo: {
          title: subjectTitle,
          time: '00:00:00',
        },
      };
      console.log(newSubjectInfo);
      setSubjectCardInfoList([...subjectCardInfoList, newSubjectInfo]);
    }
    setSubjectTitle('');
    onClose();
  };
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent]}>
          <Text style={styles.modalTitle}>과목 명</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="과목을 입력하세요"
            value={subjectTitle}
            onChangeText={onChangeTitle}
          />
          <View style={styles.modalButtonRow}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={commonStyles.buttonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
              <Text style={commonStyles.buttonText}>
                {isEdit ? '수정' : '등록'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const SubjectOptionModal = ({visible, onClose, onEdit, onDelete}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent]}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.modalOptionCloseIcon}>
            <Ionicons name="close" size={30} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onEdit} style={styles.modalOptionButton}>
            <Text style={[styles.modalOptionTitle]}>과목수정</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.modalOptionButton}>
            <Text style={styles.modalOptionTitle}>과목삭제</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export const SubjectCard = ({navigation, title, time, onPress}) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Study')}>
      <View style={styles.card}>
        <Text style={styles.cardText}>{title}</Text>
        <View style={styles.cardRight}>
          <Text style={styles.cardTime}>{time}</Text>
          <TouchableOpacity
            style={styles.cardIconLeftMargin}
            onPress={() => onPress(true)}>
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#00aaff',
    padding: width * 0.05,
    marginVertical: width * 0.05,
    width: width * 0.9,
    borderRadius: 8,
  },
  cardText: {
    fontSize: width * 0.06,
    color: '#fff',
  },
  cardTime: {
    fontSize: width * 0.06,
    color: '#fff',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconLeftMargin: {
    marginLeft: width * 0.05,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
  },
  addButtonIcon: width * 0.15,

  //modal 추가
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
  },
  modalContent: {
    width: '80%', // 원하는 너비
    padding: width * 0.06,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5, // 그림자 효과
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOptionCloseIcon: {
    alignSelf: 'flex-end',
    marginBottom: width * 0.05,
  },
  modalTitle: {
    fontSize: height * 0.03,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalOptionTitle: {
    fontSize: height * 0.03,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: width * 0.03,
    marginBottom: width * 0.05,
    fontSize: height * 0.03,
    fontWeight: 'bold',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
    padding: width * 0.02,
    backgroundColor: '#00aaff',
    borderRadius: 5,
    marginRight: 5,
  },
  modalOptionButton: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#00aaff',
  },
});
