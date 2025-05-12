import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DashSidebar from './DashSidebar';
import DashFooter from './DashFooter';
import DashHeader from './DashHeader';
import useAuth from '../../hooks/useAuth';
import DashSidebarAuthor from './author/DashSidebarAuthor';

const DashLayout = () => {
  // const dispath = useAppDispatch();
  const { status } = useAuth();
  // const { id: loginId } = useLogin();
  // const { status: authStatus, id: authId } = useAuth();

  // useEffect(() => {
  //   console.log(loginId);
  //   console.log(authId);
  //   if (loginId !== authId) {
  //     dispath(logOut());
  //   }
  // }, [loginId, authId, dispath]);

  const [windowLess768, setWindowLess768] = React.useState(false);
  const [closeBar, setCloseBar] = useState(false);

  const onClickCloseSidebar = (closeState: boolean) => {
    setCloseBar(closeState);
  };

  useEffect(() => {
    if (window.outerWidth < 768) {
      setCloseBar(true);
      setWindowLess768(true);
    }
  }, []);

  return (
    <>
      <DashHeader onClickCloseSidebar={onClickCloseSidebar} closeBar={closeBar} />
      {status === 'Admin' && (
        <DashSidebar closeBar={closeBar} windowLess768={windowLess768} setCloseBar={setCloseBar} />
      )}
      {status === 'Author' && (
        <DashSidebarAuthor
          closeBar={closeBar}
          windowLess768={windowLess768}
          setCloseBar={setCloseBar}
        />
      )}

      <div className="content-wrapper" style={closeBar ? { marginLeft: 0 } : {}}>
        <Outlet />
      </div>

      <DashFooter />
    </>
  );
};

export default DashLayout;
