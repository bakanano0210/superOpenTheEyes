import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

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
    backgroundColor: '#00a7eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: height * 0.015,
    padding: width * 0.03,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: height * 0.02,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: width * 0.1,
  },
  addButtonIcon: width * 0.15,
  menuContainer: {
    flex: 1,
    position: 'absolute',
    top: 50, // HomeLeftHeader 아래에 위치하도록 조정
    left: 10,
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

export const CommunityStyles = StyleSheet.create({
  communityContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tab: {
    fontSize: 16,
    color: 'black',
  },
  searchInput: {
    flex: 1,
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  iconPlaceholder: {
    width: 72,
    height: 72,
    backgroundColor: '#fff',
    borderRadius: 25,
    marginRight: 16,
    alignItems: 'center',
    borderWidth: 1,
    justifyContent: 'center',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupDetails: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    height: '60%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalInput: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: width * 0.01,
    paddingHorizontal: width * 0.02,
    marginBottom: width * 0.01,
    fontSize: height * 0.015,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#014099',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
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
