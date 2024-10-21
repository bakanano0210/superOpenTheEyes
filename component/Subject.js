import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {homeStyles} from '../public/styles';

export const SubjectModal = ({
    visible,
    onClose,
    isEditMode = false,
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
  
      if (isEditMode) {
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
        <View style={homeStyles.modalOverlay}>
          <View style={[homeStyles.modalContent]}>
            <Text style={homeStyles.modalTitle}>과목 명</Text>
            <TextInput
              style={homeStyles.modalInput}
              placeholder="과목을 입력하세요"
              value={subjectTitle}
              onChangeText={onChangeTitle}
            />
            <View style={homeStyles.modalButtonRow}>
              <TouchableOpacity style={homeStyles.cancelButton} onPress={onClose}>
                <Text style={homeStyles.buttonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={homeStyles.submitButton}
                onPress={handleSave}>
                <Text style={homeStyles.buttonText}>
                  {isEditMode ? '수정' : '등록'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  export  const SubjectOptionModal = ({visible, onClose, onEdit, onDelete}) => {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={homeStyles.modalOverlay}>
          <View style={[homeStyles.modalOptionContent]}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                alignSelf: 'flex-end',
                marginBottom: 20,
              }}>
              <Ionicons name="close" size={30} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onEdit}
              style={{
                padding: 10,
                marginBottom: 10,
                borderRadius: 5,
                backgroundColor: '#00aaff',
              }}>
              <Text style={[homeStyles.modalOptionTitle]}>과목수정</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDelete}
              style={{padding: 10, borderRadius: 5, backgroundColor: '#00aaff'}}>
              <Text style={homeStyles.modalOptionTitle}>과목삭제</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  
  export const SubjectCard = ({navigation, title, time, onPress}) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Study')}>
        <View style={homeStyles.card}>
          <Text style={homeStyles.cardText}>{title}</Text>
          <View style={homeStyles.cardRight}>
            <Text style={homeStyles.cardTime}>{time}</Text>
            <TouchableOpacity
              style={homeStyles.cardIconLeftMargin}
              onPress={() => onPress(true)}>
              <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };