import React from 'react';
import TagsElement from './TagsElement';
import PostsMaxLikes from './PostsMaxLikes';
import { useGetTagsQuery } from '../../features/posts/postsApiSlice';
import { IPostType } from '../../types/IPostType';

interface TagsLikesProps {
  currentPost?: IPostType;
}

const TagsAndMaxLikes = ({ currentPost }: TagsLikesProps) => {
  const { data, isSuccess, isLoading, isError, error, refetch } = useGetTagsQuery('postsList');
  return (
    <>
      <PostsMaxLikes
        likes={data?.likes}
        isSuccess={isSuccess}
        isLoading={isLoading}
        isError={isError}
        error={error}
        currentPost={currentPost}
        refetch={refetch}
      />
      <TagsElement
        tags={data?.tags}
        isSuccess={isSuccess}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </>
  );
};

export default TagsAndMaxLikes;
