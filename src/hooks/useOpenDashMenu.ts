import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useOpenDashMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [openSingleMenu, setOpenSingleMenu] = useState<boolean>(false);

  const [openMenuUsers, setOpenMenuUsers] = useState<boolean>(false);
  const [activeMenuUsers1, setActiveMenuUsers1] = useState<boolean>(false);
  const [activeMenuUsers2, setActiveMenuUsers2] = useState<boolean>(false);

  const [openMenuPosts, setOpenMenuPosts] = useState<boolean>(false);
  const [activeMenuPosts1, setActiveMenuPosts1] = useState<boolean>(false);
  const [activeMenuPosts2, setActiveMenuPosts2] = useState<boolean>(false);

  const [openMenuCategories, setOpenMenuCategories] = useState<boolean>(false);
  const [activeMenuCategories1, setActiveMenuCategories1] = useState<boolean>(false);
  const [activeMenuCategories2, setActiveMenuCategories2] = useState<boolean>(false);

  const [openMenuComments, setOpenMenuComments] = useState<boolean>(false);
  const [activeMenuComments1, setActiveMenuComments1] = useState<boolean>(false);
  const [activeMenuComments2, setActiveMenuComments2] = useState<boolean>(false);

  const [openMenuVideos, setOpenMenuVideos] = useState<boolean>(false);
  const [activeMenuVideos1, setActiveMenuVideos1] = useState<boolean>(false);
  const [activeMenuVideos2, setActiveMenuVideos2] = useState<boolean>(false);

  const onClickOpenMenuUsers = (): void => {
    setOpenMenuUsers((prev) => !prev);
    setOpenSingleMenu(false);
    setActiveMenuUsers1(false);
    setActiveMenuUsers2(false);
    setActiveMenuPosts1(false);
    setActiveMenuPosts2(false);
    setActiveMenuCategories1(false);
    setActiveMenuCategories2(false);
    setActiveMenuComments1(false);
    setActiveMenuComments2(false);
    setActiveMenuVideos1(false);
    setActiveMenuVideos2(false);
    navigate('/dash/users');
  };

  const onClickOpenMenuPosts = (): void => {
    setOpenMenuPosts((prev) => !prev);
    setOpenSingleMenu(false);
    setActiveMenuPosts1(false);
    setActiveMenuPosts2(false);
    setActiveMenuUsers1(false);
    setActiveMenuUsers2(false);
    setActiveMenuCategories1(false);
    setActiveMenuCategories2(false);
    setActiveMenuComments1(false);
    setActiveMenuComments2(false);
    setActiveMenuVideos1(false);
    setActiveMenuVideos2(false);
    navigate('/dash/posts');
  };
  const onClickOpenMenuCategories = (): void => {
    setOpenMenuCategories((prev) => !prev);
    setOpenSingleMenu(false);
    setActiveMenuPosts1(false);
    setActiveMenuPosts2(false);
    setActiveMenuUsers1(false);
    setActiveMenuUsers2(false);
    setActiveMenuCategories1(false);
    setActiveMenuCategories2(false);
    setActiveMenuComments1(false);
    setActiveMenuComments2(false);
    setActiveMenuVideos1(false);
    setActiveMenuVideos2(false);
    navigate('/dash/categories');
  };
  const onClickOpenMenuComments = (): void => {
    setOpenMenuComments((prev) => !prev);
    setOpenSingleMenu(false);
    setActiveMenuPosts1(false);
    setActiveMenuPosts2(false);
    setActiveMenuUsers1(false);
    setActiveMenuUsers2(false);
    setActiveMenuCategories1(false);
    setActiveMenuCategories2(false);
    setActiveMenuComments1(false);
    setActiveMenuComments2(false);
    setActiveMenuVideos1(false);
    setActiveMenuVideos2(false);
    navigate('/dash/comments');
  };

  const onClickOpenMenuVideos = (): void => {
    setOpenMenuVideos((prev) => !prev);
    setOpenSingleMenu(false);
    setActiveMenuPosts1(false);
    setActiveMenuPosts2(false);
    setActiveMenuUsers1(false);
    setActiveMenuUsers2(false);
    setActiveMenuCategories1(false);
    setActiveMenuCategories2(false);
    setActiveMenuComments1(false);
    setActiveMenuComments2(false);
    setActiveMenuVideos1(false);
    setActiveMenuVideos2(false);
    navigate('/dash/videos');
  };

  const onClickUsersItem = (e: React.MouseEvent<HTMLLIElement>, num: number): void => {
    e.stopPropagation();
    if (num === 1) {
      setOpenMenuPosts(false);
      setOpenMenuCategories(false);
      setActiveMenuUsers1((prev) => !prev);
      setActiveMenuUsers2(false);
      setActiveMenuPosts2(false);
      setActiveMenuPosts1(false);
      setActiveMenuCategories1(false);
      setActiveMenuCategories2(false);
      setActiveMenuComments1(false);
      setActiveMenuComments2(false);
      setActiveMenuVideos1(false);
      setActiveMenuVideos2(false);
    }
    if (num === 2) {
      setOpenMenuPosts(false);
      setOpenMenuCategories(false);
      setActiveMenuUsers2((prev) => !prev);
      setActiveMenuUsers1(false);
      setActiveMenuPosts2(false);
      setActiveMenuPosts1(false);
      setActiveMenuCategories1(false);
      setActiveMenuCategories2(false);
      setActiveMenuComments1(false);
      setActiveMenuComments2(false);
      setActiveMenuVideos1(false);
      setActiveMenuVideos2(false);
    }
  };
  const onClickPostsItem = (e: React.MouseEvent<HTMLLIElement>, num: number): void => {
    e.stopPropagation();
    if (num === 1) {
      setOpenMenuUsers(false);
      setOpenMenuCategories(false);
      setActiveMenuPosts1((prev) => !prev);
      setActiveMenuPosts2(false);
      setActiveMenuUsers1(false);
      setActiveMenuUsers2(false);
      setActiveMenuCategories1(false);
      setActiveMenuCategories2(false);
      setActiveMenuComments1(false);
      setActiveMenuComments2(false);
      setActiveMenuVideos1(false);
      setActiveMenuVideos2(false);
    }
    if (num === 2) {
      setOpenMenuUsers(false);
      setOpenMenuCategories(false);
      setActiveMenuPosts2((prev) => !prev);
      setActiveMenuPosts1(false);
      setActiveMenuUsers1(false);
      setActiveMenuUsers2(false);
      setActiveMenuCategories1(false);
      setActiveMenuCategories2(false);
      setActiveMenuComments1(false);
      setActiveMenuComments2(false);
      setActiveMenuVideos1(false);
      setActiveMenuVideos2(false);
    }
  };

  const onClickCategoriesItem = (e: React.MouseEvent<HTMLLIElement>, num: number): void => {
    e.stopPropagation();
    if (num === 1) {
      setOpenMenuUsers(false);
      setOpenMenuPosts(false);
      setActiveMenuCategories1((prev) => !prev);
      setActiveMenuPosts1(false);
      setActiveMenuPosts2(false);
      setActiveMenuUsers1(false);
      setActiveMenuUsers2(false);
      setActiveMenuCategories2(false);
      setActiveMenuComments1(false);
      setActiveMenuComments2(false);
      setActiveMenuVideos1(false);
      setActiveMenuVideos2(false);
    }
    if (num === 2) {
      setOpenMenuUsers(false);
      setOpenMenuPosts(false);
      setActiveMenuCategories2((prev) => !prev);
      setActiveMenuPosts1(false);
      setActiveMenuPosts2(false);
      setActiveMenuUsers1(false);
      setActiveMenuUsers2(false);
      setActiveMenuCategories1(false);
      setActiveMenuComments1(false);
      setActiveMenuComments2(false);
      setActiveMenuVideos1(false);
      setActiveMenuVideos2(false);
    }
  };

  const onClickCommentsItem = (e: React.MouseEvent<HTMLLIElement>, num: number): void => {
    e.stopPropagation();
    if (num === 1) {
      setOpenMenuUsers(false);
      setOpenMenuPosts(false);
      setActiveMenuComments1((prev) => !prev);
      setActiveMenuPosts1(false);
      setActiveMenuPosts2(false);
      setActiveMenuUsers1(false);
      setActiveMenuUsers2(false);
      setActiveMenuCategories2(false);
      setActiveMenuCategories1(false);
      setActiveMenuComments2(false);
      setActiveMenuVideos1(false);
      setActiveMenuVideos2(false);
    }
    if (num === 2) {
      setOpenMenuUsers(false);
      setOpenMenuPosts(false);
      setActiveMenuComments2((prev) => !prev);
      setActiveMenuPosts1(false);
      setActiveMenuPosts2(false);
      setActiveMenuUsers1(false);
      setActiveMenuUsers2(false);
      setActiveMenuCategories1(false);
      setActiveMenuCategories2(false);
      setActiveMenuComments1(false);
      setActiveMenuVideos1(false);
      setActiveMenuVideos2(false);
    }
  };

  const onClickVideosItem = (e: React.MouseEvent<HTMLLIElement>, num: number): void => {
    e.stopPropagation();
    if (num === 1) {
      setOpenMenuUsers(false);
      setOpenMenuPosts(false);
      setActiveMenuPosts1(false);
      setActiveMenuPosts2(false);
      setActiveMenuUsers1(false);
      setActiveMenuUsers2(false);
      setActiveMenuCategories2(false);
      setActiveMenuCategories1(false);
      setActiveMenuComments2(false);
      setActiveMenuComments1(false);
      setActiveMenuVideos1((prev) => !prev);
      setActiveMenuVideos2(false);
    }
    if (num === 2) {
      setOpenMenuUsers(false);
      setOpenMenuPosts(false);
      setActiveMenuPosts1(false);
      setActiveMenuPosts2(false);
      setActiveMenuUsers1(false);
      setActiveMenuUsers2(false);
      setActiveMenuCategories1(false);
      setActiveMenuCategories2(false);
      setActiveMenuComments1(false);
      setActiveMenuComments2(false);
      setActiveMenuVideos1(false);
      setActiveMenuVideos2((prev) => !prev);
    }
  };

  const onClickOpenSingleMenu = () => {
    setOpenSingleMenu((prev) => !prev);
    setOpenMenuUsers(false);
    setOpenMenuPosts(false);
    setOpenMenuCategories(false);
    setOpenMenuComments(false);
    setOpenMenuVideos(false);
  };

  useEffect(() => {
    switch (location.pathname) {
      case '/dash':
        setOpenMenuUsers(false);
        setOpenMenuPosts(false);
        setOpenMenuCategories(false);
        setOpenMenuComments(false);
        setOpenMenuVideos(false);
        setOpenSingleMenu(true);
        break;
      case '/dash/users':
        setOpenMenuUsers(true);
        setActiveMenuUsers1(true);
        setActiveMenuUsers2(false);
        setOpenMenuCategories(false);
        setOpenMenuPosts(false);
        setOpenMenuComments(false);
        setOpenMenuVideos(false);
        setOpenSingleMenu(false);
        break;
      case '/dash/posts':
        setOpenMenuPosts(true);
        setActiveMenuPosts1(true);
        setActiveMenuPosts2(false);
        setOpenMenuCategories(false);
        setOpenMenuUsers(false);
        setOpenMenuComments(false);
        setOpenMenuVideos(false);
        setOpenSingleMenu(false);
        break;
      case '/dash/categories':
        setOpenMenuCategories(true);
        setActiveMenuCategories1(true);
        setActiveMenuCategories2(false);
        setOpenMenuPosts(false);
        setOpenMenuUsers(false);
        setOpenMenuComments(false);
        setOpenMenuVideos(false);
        setOpenSingleMenu(false);
        break;
      case '/dash/comments':
        setOpenMenuComments(true);
        setActiveMenuComments1(true);
        setActiveMenuComments2(false);
        setOpenMenuPosts(false);
        setOpenMenuUsers(false);
        setOpenMenuCategories(false);
        setOpenMenuVideos(false);
        setOpenSingleMenu(false);
        break;
      case '/dash/videos':
        setOpenMenuVideos(true);
        setActiveMenuVideos1(true);
        setActiveMenuVideos2(false);
        setOpenMenuPosts(false);
        setOpenMenuUsers(false);
        setOpenMenuCategories(false);
        setOpenMenuComments(false);
        setOpenSingleMenu(false);
        break;
      case '/dash/users/search':
      case '/dash/posts/search':
      case '/dash/categories/search':
      case '/dash/comments/search':
      case '/dash/videos/search':
        setOpenMenuUsers(false);
        setOpenMenuCategories(false);
        setOpenMenuPosts(false);
        setOpenMenuComments(false);
        setOpenMenuVideos(false);
        setOpenSingleMenu(false);
        break;
    }
  }, [
    location,
    setOpenSingleMenu,
    setOpenMenuUsers,
    setActiveMenuUsers1,
    setOpenMenuPosts,
    setActiveMenuPosts1,
    setOpenMenuCategories,
    setActiveMenuCategories1,
    setOpenMenuComments,
    setActiveMenuComments1,
    setOpenMenuVideos,
    setActiveMenuVideos1,
  ]);

  return {
    openSingleMenu,
    onClickOpenSingleMenu,
    openMenuUsers,
    activeMenuUsers1,
    activeMenuUsers2,
    openMenuPosts,
    activeMenuPosts1,
    activeMenuPosts2,
    openMenuCategories,
    activeMenuCategories1,
    activeMenuCategories2,
    openMenuComments,
    activeMenuComments1,
    activeMenuComments2,
    openMenuVideos,
    activeMenuVideos1,
    activeMenuVideos2,
    onClickOpenMenuUsers,
    onClickOpenMenuPosts,
    onClickOpenMenuCategories,
    onClickOpenMenuComments,
    onClickOpenMenuVideos,
    onClickUsersItem,
    onClickPostsItem,
    onClickCategoriesItem,
    onClickCommentsItem,
    onClickVideosItem,
  };
};
