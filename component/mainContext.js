// 프로젝트에서 전체적으로 공유할 변수 목록

import React, {createContext, useState, useContext} from 'react';

const MainContext = createContext();

export const MainProvider = ({children}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [studyGroups, setStudyGroups] = useState([
    {
      id: '1',
      leaderId: '1',
      name: '감자머리 신짱구',
      members: 2,
      leaderName: '그룹장',
      description: '임시',
      limit: 5,
    },
    {
      id: '2',
      leaderId: 'user123',
      name: '우당탕탕 코린이들',
      members: 3,
      leaderName: 'HDH',
      description: '캡스톤 2 강의 준비를 위한 스터디 그룹입니다.',
      limit: 3,
    },
  ]);
  const [helpRequests, setHelpRequests] = useState([
    {
      id: '1',
      title: '도움 요청',
      description: '왜 오류가 나는지 모르겠습니다...',
      date: '2024.10.28 15:55:34',
      user: 'User1',
      comments: 2,
    },
    {
      id: '2',
      title: '어디가 틀린건가요ㅠㅠㅠㅠ',
      description: '몇 시간을 때려박아도 모르겠어요ㅠㅠㅠ',
      date: '2024.10.25 12:31:32',
      user: 'User2',
      comments: 1,
    },
    {
      id: '3',
      title: '아.. 진짜 탈모 올 것 같습니다...',
      description: '신경써서 한숨도 못잤습니다.',
      date: '2024.10.24 05:25:01',
      user: 'User3',
      comments: 10,
    },
  ]);
  const [comments, setComments] = useState([
    {
      id: '1',
      postId: '1',
      user: 'User 9',
      content: '이래해서 이러하고 저래해서 이렇게 해야해요 !',
      date: '2024.09.28.15:55:34',
    },
    {
      id: '2',
      postId: '1',
      user: 'User 2',
      content: '머함?',
      date: '2024.09.28.16:12:10',
    },
    {
      id: '3',
      postId: '2',
      user: 'User 2',
      content: '엌ㅋㅋㅋㅋㅋ?',
      date: '2024.09.28.16:12:10',
    },
  ]);
  const [quizzes, setQuizzes] = useState([
    {
      id: '1',
      question: '화장실에서 금방 나온 사람은?',
      answer: '일본사람',
      user: 'User1',
      likes: 30,
      dislikes: 12,
      userLiked: false,
      userDisliked: false,
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
      likes: 10,
      dislikes: 25,
      userLiked: false,
      userDisliked: false,
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
      likes: 0,
      dislikes: 16,
      userLiked: false,
      userDisliked: false,
      date: new Date('2024-11-02T08:00:00')
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '),
    },
  ]);
  const [user, setUser] = useState({
    id: '1',
    name: 'user1',
    profileImageUrl: '',
    studyGroupId: '2',
    studyTime: '00:00:00',
  });
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
      }}>
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  return useContext(MainContext);
};
