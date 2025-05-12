import React from 'react';
import { IPostType } from '../../../types/IPostType';
import SidebarPostsItem from './SidebarPostsItem';

interface IPopularProps {
  posts: IPostType[] | undefined;
  isSuccess: boolean;
  currentPost: IPostType | undefined;
  // setRefetch: (val: boolean) => void;
}

const SidebarPostsList = ({ posts, isSuccess, currentPost }: IPopularProps) => {
  let content;
  if (isSuccess) {
    content = posts?.map((post, index: number) => (
      <SidebarPostsItem key={post.id} post={post} number={index} currentPost={currentPost} />
    ));
  } else {
    content = (
      <h3 style={{ position: 'absolute', left: '0px', top: `${20}px` }}>Not Found Posts</h3>
    );
  }
  return <>{content}</>;
};

export default SidebarPostsList;
