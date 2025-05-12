import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import {
  IPopularUsers,
  useGetPopularUsersQuery,
  useGetPostsQuery,
} from '../../features/posts/postsApiSlice';
import { IPostType } from '../../types/IPostType';
import SidebarPostsList from './sidebarComponents/SidebarPostsList';
import UserPostsList from './sidebarComponents/UserPostsList';
import { IUser } from '../../types/IUserType';
import TagsAndMaxLikes from './TagsAndMaxLikes';
import SidebarForm from './SidebarForm';

interface SidebarProps {
  currentPost?: IPostType | undefined;
  currentUser?: IUser | undefined;
}

const Sidebar = ({ currentPost, currentUser }: SidebarProps) => {
  const [eventKey, setEventKey] = useState<string | null>('1');
  const [recentPosts, setRecentPosts] = useState<IPostType[] | undefined>([]);
  const [popularPosts, setPopularPosts] = useState<IPostType[] | undefined>([]);
  const [popularUsers, setPopularUsers] = useState<IPopularUsers[] | undefined>([]);

  const handleSelect = (eventKey: string | null) => {
    setEventKey(eventKey);
  };

  const {
    data: popularData,
    isSuccess: isPopularPostsSuccess,
    refetch: refetchPopular,
  } = useGetPostsQuery('?sort=views&order=-1&limit=3');

  const popularContent = (
    <SidebarPostsList
      posts={popularPosts}
      isSuccess={isPopularPostsSuccess}
      currentPost={currentPost}
      // setRefetch={setRefetchPop}
    />
  );

  const {
    data: recentData,
    isSuccess: isRecentPostsSuccess,
    refetch: refetchRecent,
  } = useGetPostsQuery('?sort=createdAt&order=-1&limit=3');

  const recentContent = (
    <SidebarPostsList
      posts={recentPosts}
      isSuccess={isRecentPostsSuccess}
      currentPost={currentPost}
      // setRefetch={setRefetchRec}
    />
  );

  const { data: usersData, isSuccess: isUsersPostsSuccess } = useGetPopularUsersQuery();

  const usersContent = (
    <UserPostsList users={popularUsers} isSuccess={isUsersPostsSuccess} currentUser={currentUser} />
  );

  useEffect(() => {
    setRecentPosts(recentData?.posts);
    setPopularPosts(popularData?.posts);
    setPopularUsers(usersData);
  }, [recentData, popularData, usersData]);

  useEffect(() => {
    if (currentPost !== undefined) {
      refetchPopular();
      refetchRecent();
    }
  }, [refetchPopular, refetchRecent, currentPost]);
  // console.log(popularUsers);
  return (
    <div className="col-md-4 align-sidebar">
      <div className="sidebar-tab">
        <Nav activeKey="1" onSelect={handleSelect} className="button-group filters-button-group">
          <Nav.Item>
            <Nav.Link eventKey="1" title="Recent posts">
              <button className={`button ${eventKey === '1' ? ' is-checked' : ''}`}>Recent</button>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="2" title="Popular posts" className="button">
              <button className={`button ${eventKey === '2' ? ' is-checked' : ''}`}>popular</button>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="3" title="Popular users" className="button">
              <button className={`button ${eventKey === '3' ? ' is-checked' : ''}`}>Users</button>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
      <div className="grid grid-content">
        {eventKey === '1' && recentContent}
        {eventKey === '2' && popularContent}
        {eventKey === '3' && usersContent}
      </div>
      <TagsAndMaxLikes currentPost={currentPost} />
      <div className="newsletter" style={{ marginBottom: 20 }}>
        <h2 className="sidebar-title">Контакт с администратором</h2>
        <SidebarForm />
      </div>
    </div>
  );
};

export default Sidebar;
