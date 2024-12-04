// screen/homeScreens/homeScreen.js
import React, {useState, useEffect, useCallback, useRef} from 'react';
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
  formatTime,
} from '../../component/subject';
import {useMainContext} from '../../component/mainContext';

const {width} = Dimensions.get('window');

const HomeScreen = ({route, navigation}) => {
  const {user, setUser, token, emulUrl} = useMainContext();
  const [subjectCardInfoList, setSubjectCardInfoList] = useState([]); // 사용자 과목 리스트
  const [mode, setMode] = useState(null); // 과목 수정 및 추가 모드 결정
  const [modalOptionVisible, setModalOptionVisible] = useState(false); // 수정 및 추가 모달 렌더링 유무
  const [editingKey, setEditingKey] = useState(null); // 수정할 과목의 key 정보
  const [selectedItem, setSelectedItem] = useState(null); // 선택 과목 정보
  const [totalTime, setTotalTime] = useState(0);
  const lastUpdatedParams = useRef(null);
  console.log(token);
  const handleDelete = id => {
    Alert.alert('삭제', '해당 과목을 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await fetch(`${emulUrl}/subjects/${id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (response.ok) {
              // 서버의 최신 총 공부 시간 FETCH
              const timeResponse = await fetch(
                `${emulUrl}/users/${user.id}/study-time`,
                {
                  headers: {Authorization: `Bearer ${token}`},
                },
              );
              if (timeResponse.ok) {
                const updatedTotalTime = await timeResponse.json();
                setTotalTime(updatedTotalTime);
                setUser(prev => ({...prev, studyTime: updatedTotalTime}));
              }
              // 로컬 상태 업데이트
              setSubjectCardInfoList(prev =>
                prev.filter(item => item.id !== id),
              );
              setSelectedItem(null);
              setModalOptionVisible(false);
            } else {
              console.error(
                'Failed to delete subject: ',
                await response.text(),
              );
            }
          } catch (error) {
            console.error('Error delete subject: ', error);
          }
        },
      },
    ]);
  };
  // 서버에 반영하는 함수
  const handleUpdateSubjectTime = useCallback(
    async (subjectId, elapsedTime) => {
      try {
        const response = await fetch(`${emulUrl}/study/update-time`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({subjectId, elapsedSeconds: elapsedTime}),
        });
        if (response.ok) {
          const {user: updatedUser, updatedSubject} = await response.json();
          // 로컬 상태 업데이트
          setUser(updatedUser);
          setSubjectCardInfoList(prev =>
            prev.map(item =>
              item.id === updatedSubject.id
                ? {...item, time: updatedSubject.time}
                : item,
            ),
          );
          // 총 공부 시간 업데이트
          setTotalTime(updatedUser.studyTime);
          console.log(`Subject ${subjectId} 업데이트성공.`);
        } else {
          console.error(
            `subject ${subjectId} 업데이트 실패: `,
            await response.text(),
          );
        }
      } catch (error) {
        console.error(`subject ${subjectId} 업데이트 오류: `, error);
      }
    },
    [],
  );

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${emulUrl}/subjects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const subjects = await response.json();
          setSubjectCardInfoList(subjects); // 서버에서 불러온 데이터를 상태로 설정
        } else {
          console.error('subjects fetch 실패: ', await response.text());
        }
      } catch (error) {
        console.error('subjects fetch 오류: ', error);
      }
    };

    fetchSubjects();
  }, [token]);

  // StudyScreen에서 반환된 elapsedTime 처리
  useEffect(() => {
    if (route.params?.elapsedTime && route.params?.id) {
      const {elapsedTime, id} = route.params;
      // 중복 처리 방지
      if (
        lastUpdatedParams.current?.id === id &&
        lastUpdatedParams.current?.elapsedTime === elapsedTime
      ) {
        return;
      }
      lastUpdatedParams.current = {id, elapsedTime};

      // 과목 시간 업데이트
      handleUpdateSubjectTime(id, elapsedTime);
    }
  }, [route.params]);

  // 일일 총 공부 시간 fetch
  useEffect(() => {
    const fetchUserStudyTime = async () => {
      try {
        const response = await fetch(`${emulUrl}/users/${user.id}/study-time`, {
          headers: {Authorization: `Bearer ${token}`},
        });
        if (response.ok) {
          const userStudyTime = await response.json();
          setTotalTime(userStudyTime); // 서버에서 받은 총 공부 시간 설정
        } else {
          console.error(' study time fetch 실패:', await response.text());
        }
      } catch (error) {
        console.error('study time fetch 오류:', error);
      }
    };

    fetchUserStudyTime();
  }, [user, token]);

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
          setEditingKey(selectedItem.id);
        }}
        onDelete={() => handleDelete(selectedItem.id)}
      />
      <Text style={styles.timer}>{formatTime(totalTime)}</Text>
      {subjectCardInfoList.length === 0 ? null : (
        <ScrollView>
          {subjectCardInfoList.map(item => (
            <View key={item.id}>
              <SubjectCard
                title={item.title}
                time={formatTime(item.time)}
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
