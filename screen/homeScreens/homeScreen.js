// screen/homeScreens/homeScreen.js
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {commonStyles, homeStyles} from '../../public/styles';
import {
  SubjectModal,
  SubjectOptionModal,
  SubjectCard,
} from '../../component/Subject';

const HomeScreen = ({navigation}) => {
  const [subjectCardInfoList, setSubjectCardInfoList] = useState([]);
  const [mode, setMode] = useState(null);
  const [modalOptionVisible, setModalOptionVisible] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDelete = key => {
    Alert.alert('삭제', '해당 과목을 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          const updatedList = subjectCardInfoList.filter(
            item => item.key !== key,
          );
          setSubjectCardInfoList(updatedList);
          setSelectedItem(null);
          setModalOptionVisible(false);
        },
      },
    ]);
  };
  useEffect(() => {
    setSubjectCardInfoList([
      {
        key: 1,
        subjectInfo: {
          title: '캡스톤 2',
          time: '01:59:32',
        },
      },
    ]);
  }, []);

  return (
    <View style={homeStyles.homeContainer}>
      <SubjectModal
        visible={mode !== null}
        onClose={() => {
          setMode(null);
          setModalOptionVisible(false);
        }}
        isEditMode={mode === 'edit'}
        initialTitle={selectedItem?.subjectInfo?.title || ''}
        subjectCardInfoList={subjectCardInfoList}
        setSubjectCardInfoList={setSubjectCardInfoList}
        editingKey={editingKey}
      />
      <SubjectOptionModal
        visible={modalOptionVisible}
        onClose={() => setModalOptionVisible(false)}
        onEdit={() => {
          setMode('edit');
          setEditingKey(selectedItem.key);
        }}
        onDelete={() => handleDelete(selectedItem.key)}
      />
      <Text style={homeStyles.timer}>01:59:32</Text>

      {subjectCardInfoList.length === 0 ? null : (
        <ScrollView>
          {subjectCardInfoList.map(item => (
            <View key={item.key}>
              <SubjectCard
                title={item.subjectInfo.title}
                time={item.subjectInfo.time}
                navigation={navigation}
                onPress={() => {
                  setSelectedItem(item);
                  setModalOptionVisible(true);
                }}
              />
            </View>
          ))}
        </ScrollView>
      )}
      <TouchableOpacity
        style={commonStyles.addButton}
        onPress={() => setMode('add')}>
        <Ionicons
          name="add-circle-outline"
          size={commonStyles.addButtonIcon}
          color="#014099"
        />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
