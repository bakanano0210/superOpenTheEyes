import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {formatTime} from '../../component/subject';
import Sound from 'react-native-sound';
import {useMainContext} from '../../component/mainContext';

const {width, height} = Dimensions.get('window');

const StudyScreen = ({route, navigation}) => {
  const {subject} = route.params;
  const {serverUrl, token} = useMainContext();

  const [hasPermission, setHasPermission] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [focused, setFocused] = useState(false);
  const [unfocusedTime, setUnfocusedTime] = useState(0); // 집중하지 않은 시간
  const [isAlertActive, setIsAlertActive] = useState(false); // 알림 표시 상태
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [userAnswer, setUserAnswer] = useState(''); // 사용자가 입력한 정답
  const [quiz, setQuiz] = useState(null); // 퀴즈 데이터

  const intervalRef = useRef(null); // 타이머 취소용
  const unfocusedRef = useRef(unfocusedTime); // 최신 unfocusedTime 값 관리
  const alertRef = useRef(isAlertActive); // 최신 isAlertActive 값 관리

  const device = useCameraDevice('front');
  const alarmRef = useRef(null); // 알람 소리 관리

  // 알람 재생
  const playAlarm = () => {
    if (!alarmRef.current) {
      alarmRef.current = new Sound('alarm', Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.error('Sound load error:', error);
        } else {
          alarmRef.current.setNumberOfLoops(-1); // 무한 반복
          alarmRef.current.play();
        }
      });
    } else {
      alarmRef.current.setNumberOfLoops(-1); // 무한 반복
      alarmRef.current.play();
    }
  };

  // 알람 중지 및 퀴즈 가져오기
  const stopAlarmAndFetchQuiz = async () => {
    if (alarmRef.current) {
      alarmRef.current.stop(() => {
        alarmRef.current = null;
      });
    }

    fetchQuiz();
    setQuizModalVisible(true);
    setIsAlertActive(false);
  };

  // 퀴즈 데이터 가져오기
  const fetchQuiz = async () => {
    try {
      const response = await fetch(`${serverUrl}/quizzes/top`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedQuiz = await response.json();
      setQuiz(fetchedQuiz);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  // 집중 상태 확인
  useEffect(() => {
    const focusCheckInterval = setInterval(() => {
      const simulatedFocusState = 0.4 > 0.5; // 테스트용 랜덤 값
      setFocused(simulatedFocusState);

      if (!alertRef.current) {
        if (!simulatedFocusState) {
          setUnfocusedTime(prev => {
            unfocusedRef.current = prev + 1;
            return prev + 1;
          });
        } else {
          setUnfocusedTime(0);
          unfocusedRef.current = 0;
        }
      }
    }, 1000);

    return () => clearInterval(focusCheckInterval);
  }, [isAlertActive]);

  // 집중하지 않은 상태 경고
  useEffect(() => {
    if (unfocusedRef.current >= 5 && !alertRef.current) {
      setIsAlertActive(true);
      alertRef.current = true;
      playAlarm();
      Alert.alert(
        '주의!',
        '집중하지 않은 상태가 15초간 지속되었습니다. 계속 학습을 유지해주세요.',
        [
          {
            text: '확인',
            onPress: () => stopAlarmAndFetchQuiz(),
          },
        ],
      );
    }
  }, [unfocusedTime]);

  // 타이머 관리
  useEffect(() => {
    if (!alertRef.current && hasPermission && device) {
      startElapsedTimeTimer();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [hasPermission, device, isAlertActive]);

  const startElapsedTimeTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  };

  // 카메라 권한 요청
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (!granted) {
          const request = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
          );
          setHasPermission(request === PermissionsAndroid.RESULTS.GRANTED);
        } else {
          setHasPermission(true);
        }
      } catch (err) {
        console.warn(err);
      }
    };
    requestCameraPermission();
  }, []);

  // 학습 중지
  const handlePause = () => {
    clearInterval(intervalRef.current);
    console.log(`Paused study. Elapsed time: ${elapsedTime}`);
    navigation.navigate('HomeScreen', {elapsedTime, id: subject.id});
  };

  // 퀴즈 제출
  const handleQuizSubmit = () => {
    if (userAnswer.toLowerCase() === quiz.answer.toLowerCase()) {
      Alert.alert('정답!', '정답입니다. 계속 학습을 진행하세요.');
      setQuizModalVisible(false);
      setUserAnswer('');
      setIsAlertActive(false); // 집중 타이머 재개
      setFocused(true); // 집중 상태 재개
      setUnfocusedTime(0); // 집중하지 않은 시간 초기화
      unfocusedRef.current = 0; // 최신 상태도 초기화
      alertRef.current = false; // 알림 상태 초기화
      startElapsedTimeTimer(); // 타이머 재개
    } else {
      Alert.alert('오답!', '정답이 아닙니다. 다시 시도해보세요.');
    }
  };

  // 퀴즈 포기
  const handleQuizGiveUp = () => {
    Alert.alert('포기', `정답은 "${quiz.answer}"입니다.`);
    setQuizModalVisible(false);
    setUserAnswer('');
    setIsAlertActive(false); // 집중 타이머 재개
    setFocused(true); // 집중 상태 재개
    setUnfocusedTime(0); // 집중하지 않은 시간 초기화
    unfocusedRef.current = 0; // 최신 상태도 초기화
    alertRef.current = false; // 알림 상태 초기화
    startElapsedTimeTimer(); // 타이머 재개
  };

  // 장치가 없거나 권한이 없을 때 로딩 표시
  if (!device || !hasPermission) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  // 카메라 화면 렌더링
  return (
    <View style={studyingStyles.studyingContainer}>
      <SafeAreaView style={studyingStyles.cameraPlaceholder}>
        <Camera
          device={device}
          photo={false}
          video={true}
          audio={false}
          isActive={hasPermission}
          style={studyingStyles.cameraStyle}
          width={studyingStyles.cameraWidth}
          height={studyingStyles.cameraHeight}
        />
      </SafeAreaView>
      <View style={{alignItems: 'center'}}>
        <Text style={studyingStyles.subjectName}>{subject.title}</Text>
        <Text style={studyingStyles.timer}>{formatTime(elapsedTime)}</Text>
        <TouchableOpacity onPress={handlePause}>
          <Ionicons
            name="pause-circle-outline"
            size={studyingStyles.iconSize}
            color="#014099"
          />
        </TouchableOpacity>
      </View>
      {/* <View style={studyingStyles.buttonContainer}>
        <TouchableOpacity
          style={studyingStyles.studyGroupButton}
          onPress={handleStudyGroupNavigation}>
          <Text style={studyingStyles.studyGroupButtonText}>스터디 그룹</Text>
        </TouchableOpacity>
      </View> */}
      {/* 퀴즈 Modal */}
      <Modal
        visible={quizModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setQuizModalVisible(false)}>
        <View style={studyingStyles.modalContainer}>
          <View style={studyingStyles.modalContent}>
            {quiz && (
              <>
                <Text style={studyingStyles.quizQuestion}>{quiz.question}</Text>
                <TextInput
                  style={studyingStyles.quizInput}
                  placeholder="정답을 입력하세요"
                  value={userAnswer}
                  onChangeText={setUserAnswer}
                />
                <View style={studyingStyles.buttonContainer}>
                  <TouchableOpacity
                    style={studyingStyles.submitButton}
                    onPress={handleQuizSubmit}>
                    <Text style={studyingStyles.buttonText}>제출</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={studyingStyles.giveUpButton}
                    onPress={handleQuizGiveUp}>
                    <Text style={studyingStyles.buttonText}>포기</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
const studyingStyles = StyleSheet.create({
  studyingContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cameraStyle: {
    flex: 1,
  },
  cameraWidth: width,
  cameraHeight: height,
  cameraPlaceholder: {
    width: width,
    height: width * 0.9,
    backgroundColor: '#000',
    marginBottom: 20,
    alignSelf: 'center',
  },
  subjectName: {
    fontSize: width * 0.06,
    color: '#000',
  },
  timer: {
    fontSize: width * 0.15,
    fontWeight: 'bold',
    color: '#014099',
    marginBottom: 10,
  },
  iconSize: width * 0.3,
  studyGroupButton: {
    backgroundColor: '#014099',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  studyGroupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  quizQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  quizInput: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#014099',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  giveUpButton: {
    backgroundColor: '#ff3333',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  // 집중 화면 스타일
});

export default StudyScreen;
