// 프로젝트에서 전체적으로 공유할 변수 목록

import React, {createContext, useState, useContext, useEffect} from 'react';
import {timeToSeconds} from './subject';
const MainContext = createContext();

export const MainProvider = ({children}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [studyGroups, setStudyGroups] = useState([
    {
      id: '2',
      leaderId: '2',
      name: '감자머리 신짱구',
      members: 23,
      leaderName: '그룹장',
      description: '임시',
      limit: 50,
      imageUri: '',
    },
    {
      id: '1',
      leaderId: '3',
      name: '우당탕탕 코린이들',
      members: 3,
      leaderName: 'HDH',
      description: '캡스톤 2 강의 준비를 위한 스터디 그룹입니다.',
      limit: 3,
      imageUri: '',
    },
  ]);
  const [helpRequests, setHelpRequests] = useState([
    {
      id: '1',
      title: '도움 요청',
      description: '왜 오류가 나는지 모르겠습니다...',
      date: '2024.10.28 15:55:34',
      userId: '1',
      user: 'User1',
      comments: 2,
      uri: [],
    },
    {
      id: '2',
      title: '어디가 틀린건가요ㅠㅠㅠㅠ',
      description: '몇 시간을 때려박아도 모르겠어요ㅠㅠㅠ',
      date: '2024.10.25 12:31:32',
      user: 'User2',
      userId: '2',
      comments: 1,
      uri: [],
    },
    {
      id: '3',
      title: '아.. 진짜 탈모 올 것 같습니다...',
      description: '신경쓰여서 한숨도 못잤습니다.',
      date: '2024.10.24 05:25:01',
      user: 'User3',
      userId: '2',
      comments: 10,
      uri: [],
    },
  ]);
  const [comments, setComments] = useState([
    {
      id: '1',
      postId: '1',
      user: 'User 9',
      userId: '9',
      content: '이래해서 이러하고 저래해서 이렇게 해야해요 !',
      date: '2024.09.28.15:55:34',
    },
    {
      id: '2',
      postId: '1',
      user: 'User 2',
      userId: '2',
      content: '잘 모르겠어요.',
      date: '2024.09.28.16:12:10',
    },
    {
      id: '3',
      postId: '2',
      user: 'User 2',
      userId: '2',
      content: '흠..',
      date: '2024.09.28.16:12:10',
    },
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
    {
      id: '1',
      question: '화장실에서 금방 나온 사람은?',
      answer: '일본사람',
      user: 'User1',
      likes: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      dislikes: ['11', '12', '13', '14', '15', '16'],
      date: new Date('2024-11-03T10:00:00')
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '),
    },
    {
      id: '2',
      question: '제주 앞바다의 반댓말은?',
      answer: '제주 엄마다',
      user: 'User2',
      likes: ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
      dislikes: ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
      date: new Date('2024-11-04T12:00:00')
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '),
    },
    {
      id: '3',
      question: '남자는 힘이다. 그러면 여자는?',
      answer: '헐',
      user: 'User3',
      likes: [],
      dislikes: ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
      date: new Date('2024-11-02T08:00:00')
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '),
    },
  ]);

  // users 목록에서 로그인한 사용자 정보 찾기

  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'ESH',
      studyGroupId: '1',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '2',
      name: 'HDH',
      studyGroupId: '1',
      studyTime: '04:35:21',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '3',
      name: 'PSU',
      studyGroupId: '1',
      studyTime: '03:22:15',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '4',
      name: 'user1',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '5',
      name: 'user2',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '6',
      name: 'ESH',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '7',
      name: 'HDH',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '8',
      name: 'PSU',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '9',
      name: 'ESH',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '10',
      name: 'HDH',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '11',
      name: 'PSU',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '12',
      name: 'ESH',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '13',
      name: 'HDH',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '14',
      name: 'PSU',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '15',
      name: 'ESH',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '16',
      name: 'HDH',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '17',
      name: 'PSU',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '18',
      name: 'ESH',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '19',
      name: 'HDH',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '20',
      name: 'PSU',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '21',
      name: 'ESH',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '22',
      name: 'HDH',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '23',
      name: 'PSU',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '24',
      name: 'ESH',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '25',
      name: 'HDH',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
    {
      id: '26',
      name: 'PSU',
      studyGroupId: '2',
      studyTime: '00:00:00',
      profileImageUri: '',
      helpGivenCount: 0,
      helpReceivedCount: 0,
    },
  ]);
  const [user, setUser] = useState(null);
  const loggedInUserId = '1';

  useEffect(() => {
    const loggedInUser = users.find(u => u.id === loggedInUserId);
    setUser(loggedInUser);
  }, [users]);
  const [rankingData, setRankignData] = useState([
    // user, studyGroup Join
    {
      key: 1,
      name: 'PSU',
      time: '03:22:15',
      studyGroupId: '1',
      studyGroup: '우당탕탕 코린이들',
      leaderName: 'HDH',
      members: 3,
      limit: 3,
      imageUri: '',
      profileImageUri: '',
    },
    {
      key: 2,
      name: 'ESH',
      time: '01:59:32',
      studyGroupId: '1',
      studyGroup: '우당탕탕 코린이들',
      leaderName: 'HDH',
      members: 3,
      limit: 3,
      imageUri: '',
      profileImageUri: '',
    },
    {
      key: 3,
      name: '그룹장',
      time: '01:59:43',
      studyGroupId: '2',
      studyGroup: '감자머리 신짱구',
      leaderName: '그룹장',
      members: 2,
      limit: 5,
      imageUri: '',
      profileImageUri: '',
    },
    {
      key: 4,
      name: 'HDH',
      time: '04:35:21',
      studyGroupId: '1',
      studyGroup: '우당탕탕 코린이들',
      leaderName: 'HDH',
      members: 3,
      limit: 3,
      imageUri: '',
      profileImageUri: '',
    },
    {
      key: 5,
      name: 'User2',
      time: '01:22:59',
      studyGroupId: '2',
      studyGroup: '감자머리 신짱구',
      leaderName: '그룹장',
      members: 2,
      limit: 5,
      imageUri: '',
      profileImageUri: '',
    },
  ]);
  const [rankedDaily, setRankedDaily] = useState([]);
  const [rankedGroup, setRankedGroup] = useState([]);
  const [rankedInGroup, setRankedInGroup] = useState([]);
  useEffect(() => {
    // 일일 랭킹 계산
    const dailyRanking = rankingData
      .map(item => ({
        ...item,
        timeInSeconds: timeToSeconds(item.time),
      }))
      .sort((a, b) => b.timeInSeconds - a.timeInSeconds)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
    setRankedDaily(dailyRanking);

    // 그룹 랭킹 계산
    const groupRanking = rankingData
      .reduce((acc, item) => {
        const group = acc.find(g => g.studyGroup === item.studyGroup);
        const totalSeconds = timeToSeconds(item.time);
        if (group) {
          group.totalTime += totalSeconds;
        } else {
          acc.push({
            studyGroup: item.studyGroup,
            totalTime: totalSeconds,
            members: item.members,
            limit: item.limit,
            leaderName: item.leaderName,
          });
        }
        return acc;
      }, [])
      .sort((a, b) => b.totalTime - a.totalTime)
      .map((item, index) => ({...item, rank: index + 1}));
    setRankedGroup(groupRanking);

    // 그룹 내 랭킹 계산
    if (user) {
      const inGroupRanking = rankingData
        .filter(item => item.studyGroupId === user.studyGroupId)
        .map(item => ({
          ...item,
          timeInSeconds: timeToSeconds(item.time),
        }))
        .sort((a, b) => b.timeInSeconds - a.timeInSeconds)
        .map((item, index) => ({
          ...item,
          rank: index + 1,
        }));
      setRankedInGroup(inGroupRanking);
    }
  }, [user, rankingData]);
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
        users,
        setUsers,
        rankedDaily,
        rankedGroup,
        rankedInGroup,
      }}>
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  return useContext(MainContext);
};
