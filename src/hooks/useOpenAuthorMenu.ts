import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useOpenDashMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [openSingleMenu, setOpenSingleMenu] = useState<boolean>(false);

  const [openMenuPosts, setOpenMenuPosts] = useState<boolean>(false);
  const [activeMenuPosts1, setActiveMenuPosts1] = useState<boolean>(false);
  const [activeMenuPosts2, setActiveMenuPosts2] = useState<boolean>(false);

  const onClickOpenMenuPosts = (): void => {
    setOpenMenuPosts((prev) => !prev);
    setOpenSingleMenu(false);
    setActiveMenuPosts1(false);
    setActiveMenuPosts2(false);
    navigate('/author/posts');
  };

  const onClickPostsItem = (e: React.MouseEvent<HTMLLIElement>, num: number): void => {
    e.stopPropagation();
    if (num === 1) {
      setActiveMenuPosts1((prev) => !prev);
      setActiveMenuPosts2(false);
    }
    if (num === 2) {
      setActiveMenuPosts2((prev) => !prev);
      setActiveMenuPosts1(false);
    }
  };

  const onClickOpenSingleMenu = () => {
    setOpenSingleMenu((prev) => !prev);
    setOpenMenuPosts(false);
  };

  useEffect(() => {
    switch (location.pathname) {
      case '/author':
        setOpenMenuPosts(false);
        setOpenSingleMenu(true);
        break;
      case '/author/posts':
        setOpenMenuPosts(true);
        setActiveMenuPosts1(true);
        setActiveMenuPosts2(false);
        setOpenSingleMenu(false);
        break;
      case '/author/posts/search':
        setOpenMenuPosts(false);
        setOpenSingleMenu(false);
        break;
    }
  }, [location, setOpenSingleMenu, setOpenMenuPosts, setActiveMenuPosts1]);

  return {
    openSingleMenu,
    onClickOpenSingleMenu,
    openMenuPosts,
    activeMenuPosts1,
    activeMenuPosts2,
    onClickOpenMenuPosts,
    onClickPostsItem,
  };
};
