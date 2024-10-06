// screen/homeScreen.js
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {homeStyles} from '../public/styles';

const SubjectCard = ({navigation, title, time}) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Study')}>
      <View style={homeStyles.card}>
        <Text style={homeStyles.cardText}>{title}</Text>
        <View style={homeStyles.cardRight}>
          <Text style={homeStyles.cardTime}>{time}</Text>
          <TouchableOpacity style={homeStyles.cardIconLeftMargin}>
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = ({navigation}) => {
  return (
    <View style={homeStyles.homeContainer}>
      <Text style={homeStyles.timer}>01:59:32</Text>
      <SubjectCard title="캡스톤 2" time="01:59:32" navigation={navigation} />
      <SubjectCard
        title="react native"
        time="00:00:00"
        navigation={navigation}
      />
      <TouchableOpacity style={homeStyles.addButton}>
        <Ionicons
          name="add-circle-outline"
          size={homeStyles.addButtonIcon}
          color="#014099"
        />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
