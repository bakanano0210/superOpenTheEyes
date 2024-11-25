import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
const NotificationDetailScreen = ({route}) => {
  const {item} = route.params;

  return (
    <View style={styles.detailContainer}>
      <Text style={styles.detailTitle}>{item.title}</Text>
      <Text style={styles.detailUser}>
        {item.type === 'User' ? 'User' : 'System'}
      </Text>
      <Text style={styles.detailDate}>Date</Text>
      <Text style={styles.detailMessage}>{item.message}</Text>
      {item.type === 'User' && (
        <TouchableOpacity style={styles.replyButton}>
          <Text style={styles.replyButtonText}>답장하기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  detailContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailUser: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  detailDate: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  detailMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default NotificationDetailScreen;
