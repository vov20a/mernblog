import React from 'react';
import { useParams } from 'react-router-dom';
import useTitle from '../../../hooks/useTitle';
import { useGetCategoriesQuery } from '../../../features/categories/categoriesApiSlice';
import { useCreateCategoryArray } from '../../../hooks/createCategoryArray';
import EditPostFormAuthor from './EditPostFormAuthor';
import { PulseLoader } from 'react-spinners';
import { useGetPostsQuery } from '../../../features/posts/postsApiSlice';
import { IPostType } from '../../../types/IPostType';

const EditPostAuthor = () => {
  useTitle('Edit Post Author');
  const { id } = useParams();

  const { post, isSuccessPost } = useGetPostsQuery(`postsList`, {
    selectFromResult: ({ data, isSuccess }) => ({
      post: id ? data?.posts.find((post) => post.id === id) : ({} as IPostType),
      isSuccessPost: isSuccess,
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
    isSuccessArray && isSuccessPost ? (
      <EditPostFormAuthor catsData={catsData} post={post} catsArray={catsArray} />
    ) : (
      <PulseLoader color={'#000'} />
    );

  return content;
};

export default EditPostAuthor;
