// 프로젝트에서 전체적으로 공유할 변수 목록

import React, {createContext, useState, useContext} from 'react';

const MainContext = createContext();

export const MainProvider = ({children}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <MainContext.Provider value={{menuVisible, setMenuVisible}}>
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  return useContext(MainContext);
};
