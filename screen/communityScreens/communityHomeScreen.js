// screen/CommunityScreens/communityHomeScreen
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, useWindowDimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TabView} from 'react-native-tab-view';
import {useRoute, useNavigation} from '@react-navigation/native';
import {commonStyles} from '../../public/styles';
import StudyGroupTap from './studyGroupTapScreen';
import HelpRequestTap from './helpRequestTapScreen';
import QuizTap from './quizTapScreen';
import {customRenderTabBar} from '../../component/header';

const CommunityHomeScreen = () => {
  const communityRoute = useRoute();
  const navigation = useNavigation();
  const {initialIndex = 0} = communityRoute.params || {};
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(initialIndex);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);
  const [routes] = useState([
    {key: 'first', title: '스터디그룹'},
    {key: 'second', title: '도움 요청'},
    {key: 'third', title: '퀴즈'},
  ]);
  const handleAddButtonPress = () => {
    if (index === 0) {
      setModalVisible(true);
    } else if (index === 1) {
      navigation.navigate('HelpRequestPost');
    } else if (index === 2) {
      navigation.navigate('QuizPost');
    }
  };
  const renderScene = ({route}) => {
    switch (route.key) {
      case 'first':
        return (
          <StudyGroupTap
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            navigation={navigation}
          />
        );
      case 'second':
        return <HelpRequestTap navigation={navigation} />;
      case 'third':
        return <QuizTap />;
      default:
        return null;
    }
  };
  return (
    <View style={{flex: 1, paddingHorizontal: 10}}>
      <TabView
        key={index}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={customRenderTabBar}
        style={{flex: 10}}
      />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          style={commonStyles.addButton}
          onPress={handleAddButtonPress}>
          <Ionicons
            name="add-circle-outline"
            size={commonStyles.addButtonIcon}
            color="#014099"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default CommunityHomeScreen;
