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
import {formatTime} from '../component/Subject';
const {width, height} = Dimensions.get('window');
const StudyScreen = ({route, navigation}) => {
  const {key, subjectInfo} = route.params;
  const [hasPermission, setHasPermission] = useState(false);
  const device = useCameraDevice('front');
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null); // 타이머 취소용

  useEffect(() => {}, []);
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: '카메라 권한 요청',
            message: '카메라를 사용하려면 권한이 필요합니다.',
            buttonNeutral: 'Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn(err);
      }
    };
    requestCameraPermission();
  }, []);
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);
  const handlePause = () => {
    clearInterval(intervalRef.current);
    navigation.navigate('HomeScreen', {elapsedTime, key});
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
        <Text style={studyingStyles.subjectName}>{subjectInfo.title}</Text>
        <Text style={studyingStyles.timer}>{formatTime(elapsedTime)}</Text>
        <TouchableOpacity onPress={handlePause}>
          <Ionicons
            name="pause-circle-outline"
            size={studyingStyles.iconSize}
            color="#014099"
          />
        </TouchableOpacity>
      </View>
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
  cameraWidth: width * 0.9,
  cameraHeight: height * 0.9,
  cameraPlaceholder: {
    width: width * 0.9,
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
  // 집중 화면 스타일
});

export default StudyScreen;
