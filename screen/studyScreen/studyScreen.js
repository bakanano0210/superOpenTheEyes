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
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {formatTime} from '../../component/subject';

const {width, height} = Dimensions.get('window');

const StudyScreen = ({route, navigation}) => {
  const {subject} = route.params;
  const [hasPermission, setHasPermission] = useState(false);
  const device = useCameraDevice('front');
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null); // 타이머 취소용

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

  useEffect(() => {
    if (hasPermission && device) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [hasPermission, device]);
  const handlePause = () => {
    clearInterval(intervalRef.current);
    console.log(`Paused study. Elapsed time: ${elapsedTime}`);
    navigation.navigate('HomeScreen', {elapsedTime, id: subject.id});
  };
  const handleStudyGroupNavigation = () => {
    navigation.navigate('GroupStudying'); // 스터디 그룹 화면으로 이동
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
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
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
  // 집중 화면 스타일
});

export default StudyScreen;
