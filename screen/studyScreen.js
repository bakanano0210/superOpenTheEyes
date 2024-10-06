import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  Linking,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {studyingStyles} from '../public/styles';

const StudyScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const device = useCameraDevice('front');
  useEffect(() => {
    const checkPermission = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      console.log(cameraPermission);
      if (cameraPermission === 'granted') {
        setHasPermission(true);
      } else if (cameraPermission === 'not-determined') {
        const newPermission = await Camera.requestCameraPermission();
        if (newPermission === 'granted') {
          setHasPermission(true);
        } else {
          await Linking.openSettings();
        }
      } else if (cameraPermission === 'denied') {
        await Linking.openSettings();
      }
    };
    checkPermission();
  }, []);

  // 장치가 없거나 권한이 없을 때 로딩 표시
  if (!device || !hasPermission) {
    console.log(hasPermission);
    console.log(device);
    return <ActivityIndicator size="large" color="#0000ff" />;
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
      <Text style={studyingStyles.subjectName}>react native</Text>
      <Text style={studyingStyles.timer}>00:00:00</Text>
      <TouchableOpacity onPress={() => console.log('Profile pressed!')}>
        <Ionicons
          name="pause-circle-outline"
          size={studyingStyles.iconSize}
          color="#014099"
        />
      </TouchableOpacity>
    </View>
  );
};

export default StudyScreen;
