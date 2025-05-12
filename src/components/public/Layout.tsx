import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HomeBanner from './HomeBanner';

const Layout = () => {
  const { pathname } = useLocation();

  const [loginPath, setLoginPath] = React.useState(false);
  const [registerPath, setRegisterPath] = React.useState(false);
  const [chatPath, setChatPath] = React.useState(false);
  const [adminPath, setAdminPath] = React.useState(false);
  const [authorPath, setAuthorPath] = React.useState(false);
  const [homePath, setHomePath] = React.useState(false);

  React.useEffect(() => {
    if (
      pathname.includes('/login') ||
      pathname.includes('/register') ||
      pathname.includes('/forgot') ||
      pathname.includes('/create') ||
      pathname.includes('chat')
    ) {
      setLoginPath(true);
      setRegisterPath(true);
      setChatPath(true);
      setHomePath(false);
      setAdminPath(false);
      setAuthorPath(false);
    } else if (pathname.includes('/dash')) {
      setLoginPath(false);
      setRegisterPath(false);
      setChatPath(false);
      setHomePath(false);
      setAuthorPath(false);
      setAdminPath(true);
    } else if (pathname.includes('/author')) {
      setLoginPath(false);
      setRegisterPath(false);
      setChatPath(false);
      setHomePath(false);
      setAuthorPath(true);
      setAdminPath(false);
    } else if (pathname === '/') {
      setLoginPath(false);
      setRegisterPath(false);
      setChatPath(false);
      setHomePath(true);
      setAdminPath(false);
      setAuthorPath(false);
    } else {
      setLoginPath(false);
      setRegisterPath(false);
      setChatPath(false);
      setHomePath(false);
      setAuthorPath(false);
      setAdminPath(false);
    }
  }, [pathname]);

  const isPublicLayout: boolean = !loginPath || !registerPath || !chatPath || homePath;
  const isHomeLayout: boolean = homePath;
  // const isRegisterLayout: boolean = registerPath;
  const isDashLayout: boolean = adminPath;
  const isAuthorLayout: boolean = authorPath;

  let publicHeader = <></>;
  let publicFooter = <></>;
  let loginHeader = <></>;
  let loginFooter = <></>;
  let registerHeader = <></>;
  let registerFooter = <></>;
  let chatHeader = <></>;
  let chatFooter = <></>;

  if (isPublicLayout) {
    publicHeader = (
      <>
        <Header />
        {isHomeLayout && <HomeBanner />}
      </>
    );
    publicFooter = <Footer />;
  } else {
    publicHeader = <></>;
    publicFooter = <></>;
    loginHeader = <></>;
    loginFooter = <></>;
    registerHeader = <></>;
    registerFooter = <></>;
    chatHeader = <></>;
    chatFooter = <></>;
  }
  const HeadersContent = (
    <>
      {publicHeader}
      {loginHeader}
      {registerHeader}
      {chatHeader}
    </>
  );
  const FootersContent = (
    <>
      {publicFooter}
      {loginFooter}
      {registerFooter}
      {chatFooter}
    </>
  );
  return (
    <div className="wrapper">
      {!isDashLayout && !isAuthorLayout ? (
        <>
          {HeadersContent}
          <Outlet />
          {FootersContent}
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default Layout;
