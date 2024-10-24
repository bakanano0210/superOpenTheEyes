import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const headerStyle = StyleSheet.create({
  homeRightHeaderStyle: {
    marginRight: 5,
  },
  studyingRightHeaderStyle: {
    backgroundColor: '#e8def8',
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  //헤더 스타일 정의
});
export const commonStyles = StyleSheet.create({
  title: {
    fontSize: height * 0.03,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: height * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.03,
    color: '#000000',
  },
  input: {
    width: width * 0.9,
    height: height * 0.06,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: height * 0.015,
    paddingHorizontal: width * 0.04,
  },
  button: {
    width: width * 0.9,
    height: height * 0.06,
    backgroundColor: '#00a7eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: height * 0.015,
  },
  buttonText: {
    color: '#fff',
    fontSize: height * 0.02,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
  },
  addButtonIcon: width * 0.15,
  menuContainer: {
    flex: 1,
    position: 'absolute',
    top: 50, // HomeLeftHeader 아래에 위치하도록 조정
    left: 10, // 필요에 따라 조정
    width: width * 0.3,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  menuButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // 공통 스타일 정의
});

export const loginStyles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: width * 0.05,
  },
  upContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  downContainer: {
    flex: 1,
  },
  downContainerContentStyle: {
    flexGrow: 1,
  },
  forgotPassword: {
    color: '#000000',
  },
  checkboxSize: width * 0.05,
  label: {
    marginLeft: width * 0.02,
    color: '#000000',
    lineHeight: width * 0.06,
  },
  checkboxIconStyle: {
    alignSelf: 'center',
  },
  checkboxStyle: {
    alignItems: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.9,
    marginBottom: height * 0.025,
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  buttonView: {
    flex: 3,
    justifyContent: 'center',
  },
  loginButtonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  loginText: {
    color: '#000000',
    fontSize: height * 0.015,
  },
  // 로그인 화면 특화 스타일
});

export const homeStyles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  timer: {
    fontSize: width * 0.15,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#00aaff',
    padding: width * 0.05,
    marginVertical: 10,
    width: width * 0.9,
    borderRadius: 8,
  },
  cardText: {
    fontSize: width * 0.06,
    color: '#fff',
  },
  cardTime: {
    fontSize: width * 0.06,
    color: '#fff',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconLeftMargin: {
    marginLeft: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
  },
  addButtonIcon: width * 0.15,

  //modal 추가
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
  },
  modalContent: {
    width: '80%', // 원하는 너비
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5, // 그림자 효과
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOptionContent: {
    width: '70%', // 원하는 너비
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5, // 그림자 효과
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalOptionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#00aaff',
    borderRadius: 5,
    marginRight: 5,
  },
  submitButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#00aaff',
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // 홈 화면 특화 스타일
});

export const studyingStyles = StyleSheet.create({
  studyingContainer: {
    flex: 1,
    alignItems: 'center',
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
