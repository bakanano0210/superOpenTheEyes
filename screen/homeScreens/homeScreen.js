// screen/homeScreens/homeScreen.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {commonStyles} from '../../public/styles';
import {
  SubjectModal,
  SubjectOptionModal,
  SubjectCard,
  addTime,
  calculateTotalTime,
} from '../../component/subject';
import {useMainContext} from '../../component/mainContext';

const {width} = Dimensions.get('window');

const HomeScreen = ({route, navigation}) => {
  const {user, setUser} = useMainContext();
  const [subjectCardInfoList, setSubjectCardInfoList] = useState([]); // 사용자 과목 리스트
  const [mode, setMode] = useState(null); // 과목 수정 및 추가 모드 결정
  const [modalOptionVisible, setModalOptionVisible] = useState(false); // 수정 및 추가 모달 렌더링 유무
  const [editingKey, setEditingKey] = useState(null); // 수정할 과목의 key 정보
  const [selectedItem, setSelectedItem] = useState(null); // 선택 과목 정보
  const [totalTime, setTotalTime] = useState('00:00:00');

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
    const updatedSubjectTime = (key, elapsedTime) => {
      setSubjectCardInfoList(prev =>
        prev.map(item =>
          item.key === key
            ? {
                ...item,
                time: addTime(item.time, elapsedTime),
              }
            : item,
        ),
      );
    };
    if (route.params?.elapsedTime && route.params?.key) {
      const {elapsedTime, key} = route.params;
      updatedSubjectTime(key, elapsedTime);
    }
  }, [route.params]);

  useEffect(() => {
    setSubjectCardInfoList([
      {
        key: 1,
        title: '캡스톤 2',
        time: '01:59:32',
      },
    ]);
  }, []);
  useEffect(() => {
    const newTotalTime = calculateTotalTime({subjectCardInfoList});
    setTotalTime(newTotalTime);
    // totalTime이 변경될 때마다 user의 studyTime을 업데이트
    setUser(prevUser => ({
      ...prevUser,
      studyTime: newTotalTime,
    }));
  }, [subjectCardInfoList, setUser]);
  console.log(user);
  return (
    <View style={styles.homeContainer}>
      <SubjectModal
        visible={mode !== null}
        onClose={() => {
          setMode(null);
          setModalOptionVisible(false);
        }}
        isEdit={mode === 'edit'}
        initialTitle={selectedItem?.title || ''}
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
      <Text style={styles.timer}>{totalTime}</Text>
      {subjectCardInfoList.length === 0 ? null : (
        <ScrollView>
          {subjectCardInfoList.map(item => (
            <View key={item.key}>
              <SubjectCard
                title={item.title}
                time={item.time}
                onPressIcon={() => {
                  setSelectedItem(item);
                  setModalOptionVisible(true);
                }}
                onPressCard={() => {
                  navigation.navigate('Study', {
                    subject: item,
                  });
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

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: width * 0.1,
  },
  timer: {
    fontSize: width * 0.15,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: width * 0.1,
  },
  // 홈 화면 특화 스타일
});

export default HomeScreen;
