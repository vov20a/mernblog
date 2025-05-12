import React from 'react';
import useTitle from '../../../hooks/useTitle';
import { useGetPostsQuery } from '../../posts/postsApiSlice';
import { useGetUsersQuery } from '../../users/usersApiSlice';
import { PulseLoader } from 'react-spinners';
import NewCommentForm from './NewCommentForm';
import { EntityState } from '@reduxjs/toolkit';
import { IPostType } from '../../../types/IPostType';
import { IUser } from '../../../types/IUserType';
import { useGetCommentsQuery } from '../commentsApiSlice';
import { IComment } from '../../../types/IComment';

const NewComment = () => {
  useTitle('New Comment Page');

  const { data: postsData, isSuccess: isPostsSuccess } = useGetPostsQuery('postsList');
  const { data: usersData, isSuccess: isUsersSuccess } = useGetUsersQuery('usersList');
  const { data: commentsData, isSuccess: isCommentsSuccess } = useGetCommentsQuery('commentsList');

  // console.log(postsData, usersData);
  let posts = {} as EntityState<IPostType>;
  if (isPostsSuccess) {
    posts.ids = postsData.ids;
    posts.entities = postsData.entities;
  }
  let users = {} as EntityState<IUser>;
  if (isUsersSuccess) {
    users.ids = usersData.ids;
    users.entities = usersData.entities;
  }
  let comments = {} as EntityState<IComment>;
  if (isCommentsSuccess) {
    comments.ids = commentsData.ids;
    comments.entities = commentsData.entities;
  }

  const content =
    isPostsSuccess && isUsersSuccess && isCommentsSuccess ? (
      <NewCommentForm posts={posts} users={users} comments={comments} />
    ) : (
      <PulseLoader color={'#000'} />
    );

  return content;
};

export default NewComment;
