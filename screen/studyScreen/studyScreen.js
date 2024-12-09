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
import {
  useCameraDevice,
  useFrameProcessor,
  // VisionCameraProxy,
  // Frame,
  runAsync,
  // runAtTargetFps,
  Camera,
} from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';
import {useMainContext} from '../../component/mainContext';
import {formatTime} from '../../component/subject';
import {useSharedValue} from 'react-native-worklets-core';
import {useFaceDetector} from 'react-native-vision-camera-face-detector';
import {useHeaderHeight} from '@react-navigation/elements';

const {width, height} = Dimensions.get('window');
// const plugin = VisionCameraProxy.initFrameProcessorPlugin('processImage');

// function processImage(frame) {
//   'worklet';
//   if (plugin == null) {
//     throw new Error('Failed to load Frame Processor Plugin!');
//   }
//   try {
//     console.log('되나?');
//     const result = plugin.call(frame);
//     console.log('Plugin result:', result);

//     if (
//       Array.isArray(result) &&
//       result.every(item => item.x != null && item.y != null)
//     ) {
//       return result;
//     } else {
//       console.warn('Invalid detection data:', result);
//       return [];
//     }
//   } catch (error) {
//     console.error('Error in plugin.call:', error.message, error.stack);
//     return [];
//   }
// }

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
  const [detectedFaces, setDetectedFaces] = useState([]);
  const [closedEyesTime, setClosedEyesTime] = useState(0);

  const intervalRef = useRef(null); // 타이머 취소용
  const unfocusedRef = useRef(unfocusedTime); // 최신 unfocusedTime 값 관리
  const alertRef = useRef(isAlertActive); // 최신 isAlertActive 값 관리
  const closedEyesRef = useRef(closedEyesTime);

  const device = useCameraDevice('front');
  const alarmRef = useRef(null); // 알람 소리 관리
  const detectedFacesShared = useSharedValue([]);

  const faceDetectionOptions = useRef({
    performanceMode: 'accurate', // 정확도를 우선
    landmarkMode: 'all', // 얼굴 랜드마크 활성화
    contourMode: 'none', // 컨투어 비활성화
    classificationMode: 'all', // 눈 상태 및 표정 분류 활성화
    minFaceSize: 0.15, // 최소 얼굴 크기 설정
    trackingEnabled: true, // 얼굴 추적 활성화
    autoScale: false, // 스크린 좌표 자동 변환 비활성화
  }).current;
  const {detectFaces} = useFaceDetector(faceDetectionOptions);
  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      runAsync(frame, () => {
        'worklet';
        const faces = detectFaces(frame);
        detectedFacesShared.value = faces;
      });
    },
    [detectFaces],
  );
  const headerHeight = useHeaderHeight();
  useEffect(() => {
    console.log('Header Height:', headerHeight);
  }, [headerHeight]);
  const areEyesClosed = (leftEyeOpenProbability, rightEyeOpenProbability) => {
    return leftEyeOpenProbability < 0.3 && rightEyeOpenProbability < 0.3;
  };

  // const frameProcessor = useFrameProcessor(frame => {
  //   'worklet';
  //   try {
  //     // 프레임 처리 작업을 비동기로 실행
  //     runAsync(frame, () => {
  //       'worklet';
  //       runAtTargetFps(
  //         1,
  //         () => {
  //           'worklet';
  //           const result = processImage(frame); // 네이티브 플러그인 호출
  //           console.log('Eye detected:', result); // 결과 로그 출력
  //           if (result.length > 0) {
  //             detectedFacesShared.value = result;
  //           }
  //         },
  //         [],
  //       );
  //     });
  //   } catch (error) {
  //     console.error('FrameProcessor Error: ', error);
  //   }
  // }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      if (detectedFaces.length > 0) {
        const allEyesClosed = detectedFaces.every(face =>
          areEyesClosed(
            face.leftEyeOpenProbability,
            face.rightEyeOpenProbability,
          ),
        );

        if (allEyesClosed) {
          setClosedEyesTime(prev => {
            closedEyesRef.current = prev + 1;
            return prev + 1;
          });
        } else {
          setClosedEyesTime(0);
          closedEyesRef.current = 0;
        }
      } else {
        setClosedEyesTime(0);
        closedEyesRef.current = 0;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [detectedFaces]);

  useEffect(() => {
    const syncDetectedFaces = () => {
      const sharedValue = detectedFacesShared.value || [];
      if (sharedValue.length > 0) {
        setDetectedFaces(sharedValue); // 새로운 얼굴 데이터가 있을 때만 업데이트
      }
    };
    const interval = setInterval(syncDetectedFaces, 100); // 100ms 간격으로 상태 동기화
    return () => clearInterval(interval); // 언마운트 시 인터벌 해제
  }, []);
  useEffect(() => {
    console.log('Updated detectedFaces:', detectedFaces);
  }, [detectedFaces]);
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
    if (unfocusedRef.current >= 15 && !alertRef.current) {
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
  // 얼굴 데이터 변환 함수
  const cameraWidth = width;
  const cameraHeight = width * 0.9;
  const [cameraLayout, setCameraLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // 카메라의 실제 렌더링 위치와 크기 측정
  const handleCameraLayout = event => {
    const {x, y, width, height} = event.nativeEvent.layout;
    console.log('Camera Layout:', {x, y, width, height});
    setCameraLayout({x, y, width, height});
  };

  // 얼굴 데이터 변환 함수
  const scaleBounds = (bounds, frameWidth, frameHeight) => {
    const scaleX = cameraLayout.width / frameWidth;
    const scaleY = cameraLayout.height / frameHeight;

    return {
      x: bounds.x * scaleX,
      y: bounds.y * scaleY - headerHeight,
      width: bounds.width * scaleX,
      height: bounds.height * scaleY,
    };
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
          frameProcessor={frameProcessor}
          onLayout={handleCameraLayout} // 실제 크기 측정
        />
        {detectedFaces.map((face, index) => {
          const {
            bounds,
            landmarks,
            leftEyeOpenProbability,
            rightEyeOpenProbability,
          } = face;

          // 좌표 변환 함수 적용
          const adjustedBounds = scaleBounds(bounds, 640, 480); // 프레임 크기에 맞게 변환
          const adjustedLeftEye = scaleBounds(
            {
              x: 640 - landmarks.LEFT_EYE.x,
              y: landmarks.LEFT_EYE.y,
              width: 20,
              height: 20,
            },
            640,
            480,
          );
          const adjustedRightEye = scaleBounds(
            {
              x: 640 - landmarks.RIGHT_EYE.x,
              y: landmarks.RIGHT_EYE.y,
              width: 20,
              height: 20,
            },
            640,
            480,
          );

          // 눈 상태 색상
          const leftEyeColor = leftEyeOpenProbability > 0.5 ? 'green' : 'red';
          const rightEyeColor = rightEyeOpenProbability > 0.5 ? 'green' : 'red';

          return (
            <React.Fragment key={index}>
              {/* 얼굴 바운딩 박스 */}
              <View
                style={[
                  studyingStyles.faceBox,
                  {
                    left: adjustedBounds.x + 25,
                    top: adjustedBounds.y,
                    width: adjustedBounds.width,
                    height: adjustedBounds.height,
                  },
                ]}
              />
              {/* 왼쪽 눈 상태 */}
              <View
                style={[
                  studyingStyles.eyeBox,
                  {
                    left: adjustedLeftEye.x - 60, // 눈 중심 좌표 보정
                    top: adjustedLeftEye.y - 10,
                    backgroundColor: leftEyeColor,
                  },
                ]}
              />
              {/* 오른쪽 눈 상태 */}
              <View
                style={[
                  studyingStyles.eyeBox,
                  {
                    left: adjustedRightEye.x - 60, // 눈 중심 좌표 보정
                    top: adjustedRightEye.y - 10,
                    backgroundColor: rightEyeColor,
                  },
                ]}
              />
            </React.Fragment>
          );
        })}
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
  faceBox: {
    position: 'absolute',
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 4,
  },
  eyeBox: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  // 집중 화면 스타일
});

export default StudyScreen;
