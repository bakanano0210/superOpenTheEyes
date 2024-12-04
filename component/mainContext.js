// 프로젝트에서 전체적으로 공유할 변수 목록

import React, {createContext, useState, useContext} from 'react';
import {Alert} from 'react-native';
const MainContext = createContext();

export const MainProvider = ({children}) => {
  const serverUrl = 'https://supereyeopen-1.onrender.com';
  const [menuVisible, setMenuVisible] = useState(false);
  const [studyGroups, setStudyGroups] = useState([
    // {
    //   id: '2',
    //   leaderId: '2',
    //   name: '감자머리 신짱구',
    //   members: 23,
    //   leaderName: '그룹장',
    //   description: '임시',
    //   limit: 50,
    //   imageUri: '',
    // },
    // {
    //   id: '1',
    //   leaderId: '3',
    //   name: '우당탕탕 코린이들',
    //   members: 3,
    //   leaderName: 'HDH',
    //   description: '캡스톤 2 강의 준비를 위한 스터디 그룹입니다.',
    //   limit: 3,
    //   imageUri: '',
    // },
  ]);
  const fetchStudyGroups = async () => {
    if (!token) {
      return;
    }
    try {
      const response = await fetch(`${serverUrl}/study-groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const groups = await response.json();
        setStudyGroups(groups);
      } else {
        console.error('Failed to fetch study groups:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching study groups:', error);
    }
  };
  const fetchHelpRequests = async () => {
    if (!token) {
      return;
    }
    try {
      const response = await fetch(`${serverUrl}/help-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); // 서버 URL로 수정
      if (!response.ok) {
        throw new Error('게시물 데이터를 가져오는 데 실패했습니다.');
      }
      const data = await response.json();
      setHelpRequests(data); // 서버에서 가져온 데이터를 상태에 저장
    } catch (error) {
      Alert.alert('오류', error.message);
    }
  };
  const [helpRequests, setHelpRequests] = useState([
    // {
    //   id: '1',
    //   title: '도움 요청',
    //   description: '왜 오류가 나는지 모르겠습니다...',
    //   date: '2024.10.28 15:55:34',
    //   userId: '1',
    //   user: 'User1',
    //   comments: 2,
    //   uri: [],
    // },
    // {
    //   id: '2',
    //   title: '어디가 틀린건가요ㅠㅠㅠㅠ',
    //   description: '몇 시간을 때려박아도 모르겠어요ㅠㅠㅠ',
    //   date: '2024.10.25 12:31:32',
    //   user: 'User2',
    //   userId: '2',
    //   comments: 1,
    //   uri: [],
    // },
    // {
    //   id: '3',
    //   title: '아.. 진짜 탈모 올 것 같습니다...',
    //   description: '신경쓰여서 한숨도 못잤습니다.',
    //   date: '2024.10.24 05:25:01',
    //   user: 'User3',
    //   userId: '2',
    //   comments: 10,
    //   uri: [],
    // },
  ]);
  const [comments, setComments] = useState([
    // {
    //   id: '1',
    //   postId: '1',
    //   user: 'User 9',
    //   userId: '9',
    //   content: '이래해서 이러하고 저래해서 이렇게 해야해요 !',
    //   date: '2024.09.28.15:55:34',
    // },
    // {
    //   id: '2',
    //   postId: '1',
    //   user: 'User 2',
    //   userId: '2',
    //   content: '잘 모르겠어요.',
    //   date: '2024.09.28.16:12:10',
    // },
    // {
    //   id: '3',
    //   postId: '2',
    //   user: 'User 2',
    //   userId: '2',
    //   content: '흠..',
    //   date: '2024.09.28.16:12:10',
    // },
  ]);
  // { quizz와 quizzReaction Join
  //   id: '1',
  //   question: '질문 1',
  //   answer: '답변 1',
  //   user: 'User1',
  //   date: '2024-10-01',
  //   likes: ['user1', 'user2'], // 좋아요를 누른 사용자 ID 배열
  //   dislikes: ['user3'], // 싫어요를 누른 사용자 ID 배열
  // },
  const [quizzes, setQuizzes] = useState([
    // {
    //   id: '1',
    //   question: '화장실에서 금방 나온 사람은?',
    //   answer: '일본사람',
    //   user: 'User1',
    //   likes: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    //   dislikes: ['11', '12', '13', '14', '15', '16'],
    //   date: new Date('2024-11-03T10:00:00')
    //     .toISOString()
    //     .slice(0, 19)
    //     .replace('T', ' '),
    // },
    // {
    //   id: '2',
    //   question: '제주 앞바다의 반댓말은?',
    //   answer: '제주 엄마다',
    //   user: 'User2',
    //   likes: ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    //   dislikes: ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    //   date: new Date('2024-11-04T12:00:00')
    //     .toISOString()
    //     .slice(0, 19)
    //     .replace('T', ' '),
    // },
    // {
    //   id: '3',
    //   question: '남자는 힘이다. 그러면 여자는?',
    //   answer: '헐',
    //   user: 'User3',
    //   likes: [],
    //   dislikes: ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    //   date: new Date('2024-11-02T08:00:00')
    //     .toISOString()
    //     .slice(0, 19)
    //     .replace('T', ' '),
    // },
  ]);
  const fetchQuizzes = async () => {
    if (!token) {
      return;
    }
    try {
      const response = await fetch(`${serverUrl}/quizzes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('퀴즈 데이터를 가져오는 데 실패했습니다.');
      }

      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      Alert.alert('오류', error.message);
    }
  };
  // users 목록에서 로그인한 사용자 정보 찾기

  const [user, setUser] = useState(null);
  const [rankedDaily, setRankedDaily] = useState([]);
  const [rankedGroup, setRankedGroup] = useState([]);
  const [rankedInGroup, setRankedInGroup] = useState([]);
  const fetchRankingData = async () => {
    if (!token) {
      return;
    }
    try {
      // Fetch daily ranking
      const dailyResponse = await fetch(`${serverUrl}/rankings/daily`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      const dailyData = await dailyResponse.json();
      setRankedDaily(dailyData);

      // Fetch group ranking
      const groupResponse = await fetch(`${serverUrl}/rankings/groups`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      const groupData = await groupResponse.json();
      setRankedGroup(groupData);

      // Fetch in-group ranking
      if (user?.studyGroupId) {
        const inGroupResponse = await fetch(
          `${serverUrl}/rankings/group/${user.studyGroupId}`,
          {headers: {Authorization: `Bearer ${token}`}},
        );
        const inGroupData = await inGroupResponse.json();
        setRankedInGroup(inGroupData);
      }
    } catch (error) {
      console.error('랭킹 데이터를 불러오는 데 실패했습니다:', error);
    }
  };
  const [notifications, setNotifications] = useState([]);
  const fetchNotifications = async userId => {
    try {
      if (!userId) {
        throw new Error('사용자 ID가 유효하지 않습니다.');
      }
      const response = await fetch(
        `${serverUrl}/notifications?userId=${userId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`서버 응답 오류: ${response.status} - ${errorText}`);
      }

      const notifications = await response.json();
      console.log('알림 데이터:', notifications);
      setNotifications(notifications);
    } catch (error) {
      console.error('Error fetching notifications', error);
    }
  };
  const [messages, setMessages] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [token, setToken] = useState(null);
  return (
    <MainContext.Provider
      value={{
        menuVisible,
        setMenuVisible,
        helpRequests,
        setHelpRequests,
        comments,
        setComments,
        quizzes,
        setQuizzes,
        studyGroups,
        setStudyGroups,
        user,
        setUser,
        rankedDaily,
        rankedGroup,
        rankedInGroup,
        token,
        setToken,
        fetchStudyGroups,
        fetchHelpRequests,
        fetchQuizzes,
        fetchRankingData,
        serverUrl,
        realUrl,
        notifications,
        setNotifications,
        fetchNotifications,
        messages,
        setMessages,
        chatRooms,
        setChatRooms,
      }}>
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  return useContext(MainContext);
};
