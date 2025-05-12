import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetUsersQuery } from '../../users/usersApiSlice';
import useTitle from '../../../hooks/useTitle';
import { useGetCategoriesQuery } from '../../categories/categoriesApiSlice';
import { useCreateCategoryArray } from '../../../hooks/createCategoryArray';
import EditPostForm from './EditPostForm';
import { PulseLoader } from 'react-spinners';
import { useGetPostsQuery } from '../postsApiSlice';
import { IPostType } from '../../../types/IPostType';

const EditPost = () => {
  useTitle('Edit Post Page');
  const { id } = useParams();

  const { post, isSuccessPost } = useGetPostsQuery(`postsList`, {
    selectFromResult: ({ data, isSuccess }) => ({
      post: id ? data?.posts.find((post) => post.id === id) : ({} as IPostType),
      isSuccessPost: isSuccess,
    }),
  });
  const { users } = useGetUsersQuery(`usersList`, {
    selectFromResult: ({ data }) => ({
      users: data?.users,
    }),
  });

  const { catsData, isSuccessArray } = useGetCategoriesQuery('categoriesList', {
    selectFromResult: ({ data, isSuccess }) => ({
      catsData: data,
      isSuccessArray: isSuccess,
    }),
  });

  const catsArray = useCreateCategoryArray(catsData ? catsData.categories : []);

  const content =
    isSuccessArray && users && isSuccessPost ? (
      <EditPostForm catsData={catsData} post={post} users={users} catsArray={catsArray} />
    ) : (
      <PulseLoader color={'#000'} />
    );

  return content;
};

export default EditPost;
