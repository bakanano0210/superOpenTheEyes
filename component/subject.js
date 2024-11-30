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
import {useMainContext} from './mainContext';

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
  const {token, emulUrl} = useMainContext();
  useEffect(() => {
    if (visible) {
      setSubjectTitle(isEdit ? initialTitle : '');
    }
  }, [visible, isEdit, initialTitle]);

  const onChangeTitle = title => {
    setSubjectTitle(title);
  };
  const handleSave = async () => {
    if (subjectTitle.trim() === '') {
      Alert.alert('입력 오류', '과목명을 입력하세요.', [{text: '확인'}]);
      return;
    }
    const isDuplicate = subjectCardInfoList.some(
      item => item.title === subjectTitle,
    );
    if (isDuplicate) {
      Alert.alert('중복 오류', '이미 존재하는 과목명입니다.', [{text: '확인'}]);
      return;
    }
    try {
      if (isEdit) {
        const existingSubject = subjectCardInfoList.find(
          item => item.id === editingKey,
        );
        // 서버에 과목 수정 요청
        const response = await fetch(`${emulUrl}/subjects/${editingKey}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: subjectTitle,
            time: existingSubject.time,
          }),
        });
        if (response.ok) {
          const updatedSubject = await response.json();
          setSubjectCardInfoList(prev =>
            prev.map(item =>
              item.id === editingKey
                ? {...item, title: updatedSubject.title}
                : item,
            ),
          );
        } else {
          console.error('Failed to update subject: ', await response.text());
        }
      } else {
        // 서버에 과목 추가 요청
        const response = await fetch(`${emulUrl}/subjects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({title: subjectTitle, time: 0}),
        });
        if (response.ok) {
          const newSubject = await response.json();
          setSubjectCardInfoList(prev => [...prev, newSubject]);
        } else {
          console.error('Failed to add subject: ', await response.text());
        }
      }
    } catch (error) {
      console.error('Error saving subject: ', error);
    }
    exit();
  };
  const exit = () => {
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
            <TouchableOpacity style={styles.modalButton} onPress={exit}>
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

export const SubjectCard = ({title, time, onPressIcon, onPressCard}) => {
  return (
    <TouchableOpacity onPress={onPressCard}>
      <View style={styles.card}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardText}>{title}</Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.cardTime}>{time}</Text>
          <TouchableOpacity
            style={styles.cardIconLeftMargin}
            onPress={onPressIcon}>
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export const timeToSeconds = time => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};
export const addTime = (currentTime, elapsedSeconds) => {
  // 배열 요소 숫자 변환 map(Number)
  const totalSeconds = timeToSeconds(currentTime) + elapsedSeconds;
  return formatTime(totalSeconds);
};
export const formatTime = studySeconds => {
  const hours = Math.floor(studySeconds / 3600);
  const minutes = Math.floor((studySeconds % 3600) / 60);
  const seconds = studySeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
export const calculateTotalTime = ({subjectCardInfoList}) => {
  const totalSeconds = subjectCardInfoList.reduce((acc, item) => {
    const [hours, minutes, seconds] = item.time.split(':').map(Number);
    return acc + hours * 3600 + minutes * 60 + seconds;
  }, 0);
  return formatTime(totalSeconds);
};
// HH:mm:ss 형식의 시간을 초 단위로 변환
export const convertTimeToSeconds = timeString => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#00aaff',
    padding: width * 0.05,
    marginVertical: width * 0.01,
    width: width * 0.9,
    borderRadius: 8,
  },
  cardTitleContainer: {
    flex: 1, // title이 차지할 공간 확보
    marginRight: 10, // time과 간격 추가
  },
  cardText: {
    fontSize: width * 0.06,
    color: '#fff',
  },
  cardTime: {
    fontSize: width * 0.06,
    color: '#fff',
    flexShrink: 1, // 줄어들 수 있도록 설정
    flexWrap: 'wrap', // 줄 바꿈 허용
    maxWidth: '70%', // title의 최대 너비 설정
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // 남은 공간 확보
    justifyContent: 'flex-end', // 오른쪽 정렬
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
