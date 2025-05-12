import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ActiveMenuContext, MenuContextType } from '../../context';
import { useBaseCategory } from '../../hooks/useBaseCategory';
import { IPostType } from '../../types/IPostType';

interface LikeProps {
  like: {
    id: string;
    title: string;
    imageUrl: string;
    user: string;
    category: string;
    createdAt: Date;
    maxCount: number;
  };
  number: number;
  currentPost?: IPostType;
  refetch: () => void;
}

const PostsMaxLikesItem = ({ like, number, currentPost, refetch }: LikeProps) => {
  const [count, setCount] = useState<number | undefined>(currentPost?.likes.count);

  useEffect(() => {
    setCount(currentPost?.likes.count);
    if (count !== undefined && currentPost?.likes.count && currentPost?.likes.count > count) {
      refetch();
    }
  }, [currentPost?.likes, count, refetch]);

  const { setActiveMenuId } = useContext(ActiveMenuContext) as MenuContextType;

  const { breadcrumbs: baseCategory } = useBaseCategory(like?.category);

  const onSaveMenuItemClick = () => {
    localStorage.setItem('activeMenu', baseCategory[0]._id);
    setActiveMenuId(baseCategory[0]._id);
  };
  return (
    <div
      className="portfolio-item recent"
      style={{ position: 'absolute', left: '0px', top: `${100 * number}px` }}
    >
      <img src={like.imageUrl} alt="img" />
      <div
        className={`${
          currentPost && like.id === currentPost._id ? 'portfolio-text__disabled ' : ''
        }    portfolio-text`}
      >
        <h5 onClick={() => onSaveMenuItemClick()}>
          <Link
            to={`/post/${baseCategory[0].title.toLowerCase()}/${like.id}`}
            state={{ refetch: true }}
            className={`${currentPost && like.id === currentPost._id ? 'disabled-link' : ''}`}
          >
            {like.title}. Likes: {like.maxCount}
          </Link>
        </h5>
        <p>
          By {like.user} <span>|</span>{' '}
          {new Date(like.createdAt).toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
};

export default PostsMaxLikesItem;
