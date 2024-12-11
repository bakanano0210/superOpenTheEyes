import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from 'react-native';
import {
  useCameraDevice,
  useFrameProcessor,
  VisionCameraProxy,
  Camera,
  runAtTargetFps,
} from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';
import {useMainContext} from '../../component/mainContext';
import {formatTime} from '../../component/subject';
import {useSharedValue} from 'react-native-worklets-core';
import {useResizePlugin} from 'vision-camera-resize-plugin';

const {width, height} = Dimensions.get('window');
const plugin = VisionCameraProxy.initFrameProcessorPlugin('processImage');

function processImage(frame, {resized}) {
  'worklet';
  if (plugin == null) {
    throw new Error('Failed to load Frame Processor Plugin!');
  }
  try {
    const result = plugin.call(frame, {resized});
    console.log('Plugin result:', result);

    if (result) {
      return result;
    } else {
      console.warn('Invalid detection data:', result);
      return [];
    }
  } catch (error) {
    console.error('Error in plugin.call:', error.message, error.stack);
    return [];
  }
}

const StudyScreen = ({route, navigation}) => {
  const {subject} = route.params;
  const {serverUrl, token} = useMainContext();

  const [hasPermission, setHasPermission] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [unfocusedTime, setUnfocusedTime] = useState(0); // 집중하지 않은 시간
  const [isAlertActive, setIsAlertActive] = useState(false); // 알림 표시 상태
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [userAnswer, setUserAnswer] = useState(''); // 사용자가 입력한 정답
  const [quiz, setQuiz] = useState(null); // 퀴즈 데이터

  //const [closedEyesTime, setClosedEyesTime] = useState(0);

  const intervalRef = useRef(null); // 타이머 취소용
  const unfocusedRef = useRef(unfocusedTime); // 최신 unfocusedTime 값 관리
  const alertRef = useRef(isAlertActive); // 최신 isAlertActive 값 관리
  // closedEyesRef = useRef(closedEyesTime);
  const detectedDrownessRef = useRef(0);
  const [detectedDrowness, setDetectedDrowness] = useState(0);

  const device = useCameraDevice('front');
  const alarmRef = useRef(null); // 알람 소리 관리
  const detectedDrownessShared = useSharedValue([]);

  const {resize} = useResizePlugin();
  //   if (objectDetection.state === 'loading') {
  //     console.log('Loading model...');
  //   } else if (objectDetection.state === 'error') {
  //     console.error('Error loading model:', objectDetection.error);
  //   } else if (objectDetection.state === 'loaded') {
  //     console.log('Model loaded successfully');
  //   }
  // }, [objectDetection.state]);

  // const frameProcessor = useFrameProcessor(
  //   frame => {
  //     'worklet';
  //     const localModel = objectDetection.model; // 모델 객체 재생성
  //     if (localModel === null) return;

  //     const testInput1 = new Float32Array(320 * 240 * 3).fill(0.5);
  //     const testInput2 = new Float32Array(320 * 240 * 3).fill(0.7);

  //     const output1 = localModel.runSync([testInput1]);
  //     const output2 = localModel.runSync([testInput2]);

  //     console.log('Output1:', output1);
  //     console.log('Output2:', output2);
  //     if (model === null) {
  //       return;
  //     }

  //     // Start processing time
  //     const startTime = Date.now();

  //     // Resize the frame data
  //     // const resized = resize(frame, {
  //     //   scale: {width: 320, height: 240},
  //     //   pixelFormat: 'rgb',
  //     //   dataType: 'uint8',
  //     // });

  //     // console.log('First 10 Resized Elements:', resized.slice(0, 10)); // Resized frame data 확인

  //     const resized = resize(frame, {
  //       scale: {width: 320, height: 240},
  //       pixelFormat: 'rgb',
  //       dataType: 'float32',
  //     });
  //     console.log('Resized Sample Data:', resized.slice(0, 10));
  //     console.log(model);
  //     const testInput1 = new Float32Array(640 * 480 * 3).fill(0.5);
  //     const testInput2 = new Float32Array(640 * 480 * 3).fill(0.7);
  //     console.log('Test Output 1:', model.runSync([testInput1]));
  //     console.log('Test Output 2:', model.runSync([testInput2]));
  //     // const outputs = model.runSync([resized]);
  //     //console.log('Model Outputs:', outputs);
  //     // detectedDrownessShared.value = outputs;

  //     // End processing time
  //     const endTime = Date.now();
  //     console.log(`Frame Processing Time: ${endTime - startTime} ms`);
  //   },
  //   [objectDetection.model],
  // );
  // useEffect(() => {
  //   if (model) {
  //     const testInput1 = new Float32Array(320 * 240 * 3).fill(0.5);
  //     const testInput2 = new Float32Array(320 * 240 * 3).fill(0.7);

  //     const output1 = model.runSync([testInput1]);
  //     const output2 = model.runSync([testInput2]);

  //     console.log('Output1 in JS:', output1);
  //     console.log('Output2 in JS:', output2);
  //   }
  // }, [model]);
  useEffect(() => {
    // Shared Value 변화 감지 및 JavaScript 상태 업데이트
    const interval = setInterval(() => {
      const currentOutputs = detectedDrownessShared.value;
      console.log('Current Shared Value:', currentOutputs); // 로그 추가
      // 안전하게 null 체크와 데이터 형식 확인
      if (
        currentOutputs &&
        typeof currentOutputs === 'object' &&
        '0' in currentOutputs
      ) {
        const newDrowness = currentOutputs['0'];
        console.log('New Drowness:', newDrowness); // 새 값 로그
        // 상태가 변경된 경우에만 업데이트
        if (newDrowness !== detectedDrownessRef.current) {
          setDetectedDrowness(newDrowness);
          detectedDrownessRef.current = newDrowness;
        }
      }
    }, 1000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);
  // detectedDrowness 값이 변경될 때 로그 출력

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    try {
      const resized = resize(frame, {
        scale: {width: 26, height: 34},
        pixelFormat: 'rgb',
        dataType: 'float32',
      });
      const resizedArray = Array.from(resized);

      runAtTargetFps(
        1,
        () => {
          'worklet';
          const result = processImage(frame, {resized: resizedArray}); // 네이티브 플러그인 호출
          console.log('Eye detected:', result); // 결과 로그 출력
          detectedDrownessShared.value = result;
        },
        [],
      );
    } catch (error) {
      console.error('FrameProcessor Error: ', error);
    }
  }, []);

  //   const interval = setInterval(() => {
  //     if (detectedFaces.length > 0) {
  //       const allEyesClosed = detectedFaces.every(face =>
  //         areEyesClosed(
  //           face.leftEyeOpenProbability,
  //           face.rightEyeOpenProbability,
  //         ),
  //       );

  //       if (allEyesClosed) {
  //         setClosedEyesTime(prev => {
  //           closedEyesRef.current = prev + 1;
  //           return prev + 1;
  //         });
  //       } else {
  //         setClosedEyesTime(0);
  //         closedEyesRef.current = 0;
  //       }
  //     } else {
  //       setClosedEyesTime(0);
  //       closedEyesRef.current = 0;
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [detectedFaces]);

  // useEffect(() => {
  //   const syncDetectedFaces = () => {
  //     const sharedValue = detectedDrownessShared.value || [];
  //     if (sharedValue !== detectedDrowness) {
  //       setDetectedDrowness(sharedValue); // 새로운 얼굴 데이터가 있을 때만 업데이트
  //     }
  //   };
  //   const interval = setInterval(syncDetectedFaces, 100); // 100ms 간격으로 상태 동기화
  //   return () => clearInterval(interval); // 언마운트 시 인터벌 해제
  // }, []);
  // useEffect(() => {
  //   console.log('Updated detectedFaces:', detectedFaces);
  // }, [detectedFaces]);
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
      const simulatedFocusState = detectedDrownessRef.current >= 0.4; // 테스트용 랜덤 값
      // console.log(detectedDrowness);
      if (!alertRef.current) {
        if (simulatedFocusState) {
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
        const permission = await Camera.requestCameraPermission();
        setHasPermission(permission === 'granted');
      } catch (err) {
        console.warn('Camera permission error:', err);
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
          frameProcessor={frameProcessor}
        />
      </SafeAreaView>
      {/* 집중/졸음 상태 표시 */}
      <View style={studyingStyles.statusOverlay}>
        <Text
          style={[
            studyingStyles.statusText,
            detectedDrowness < 0.5
              ? studyingStyles.focusedText
              : studyingStyles.drowsyText,
          ]}>
          {detectedDrowness < 0.5 ? '집중 상태' : '졸음 상태'}
        </Text>
      </View>
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
      {/* 퀴즈 Modal */}
      <Modal
        visible={quizModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setQuizModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={studyingStyles.modalContainer}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={studyingStyles.modalContent}>
              {quiz && (
                <>
                  <Text style={studyingStyles.quizQuestion}>
                    {quiz.question}
                  </Text>
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
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
    marginBottom: 10,
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
  statusText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    textShadowColor: '#000', // 그림자 색상
    textShadowOffset: {width: 1, height: 1}, // 그림자 오프셋
    textShadowRadius: 1, // 그림자 반경
    textAlign: 'center',
    marginBottom: 10,
  },
  focusedText: {
    color: 'green', // 초록색
  },
  drowsyText: {
    color: 'red', // 붉은색
  },
  // 집중 화면 스타일
});

export default StudyScreen;
