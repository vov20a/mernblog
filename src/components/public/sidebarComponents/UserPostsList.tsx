import React from 'react';
import { IPopularUsers } from '../../../features/posts/postsApiSlice';
import UserPostItem from './UserPostItem';
import { IUser } from '../../../types/IUserType';

interface IUsersProps {
  users: IPopularUsers[] | undefined;
  isSuccess: boolean;
  currentUser?: IUser | undefined;
}

const UserPostsList = ({ users, isSuccess, currentUser }: IUsersProps) => {
  let content;
  if (isSuccess) {
    content = users?.map((data, index) => (
      <UserPostItem key={data.id} data={data} number={index} currentUser={currentUser} />
    ));
  } else {
    content = (
      <h3 style={{ position: 'absolute', left: '0px', top: `${20}px` }}>Not Found Users</h3>
    );
  }
  return <>{content}</>;
};

export default UserPostsList;
