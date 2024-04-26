import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router';
import { AUTH_PATH, LOCAL_PATH, QNA_DETAIL_PATH, QNA_PATH, QNA_UPDATE_PATH, QNA_WRITE_PATH, RATIO_PATH, SERVICE_PATH } from './constant';

function App() {
  return (
    <Routes>
      <Route path={AUTH_PATH} element={<></>}></Route>

      <Route path={SERVICE_PATH} element={<></>}>
        <Route path={LOCAL_PATH} element={<></>}/>
        <Route path={RATIO_PATH} element={<></>}/>

        <Route path={QNA_PATH} element={<></>}>
          {/* 공통요소 표현을 위해 */}
          <Route index element={<></>}/>
          {/* 위부터 순서대로 읽기 때문에 패턴만 있는 경우를 아래 쪽으로 */}
          <Route path={QNA_WRITE_PATH} element={<></>}/>
          <Route path={QNA_DETAIL_PATH} element={<></>}/>
          <Route path={QNA_UPDATE_PATH} element={<></>}/>
        </Route>

      </Route>
      <Route path='*' element={<></>}/>
    
    </Routes>
  );
}

export default App;
