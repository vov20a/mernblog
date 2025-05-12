import React, { useContext, useEffect, useState } from 'react';
import { IPostType } from '../../../types/IPostType';
import { Link } from 'react-router-dom';
import { ActiveMenuContext, MenuContextType } from '../../../context';
import { useBaseCategory } from '../../../hooks/useBaseCategory';

interface IPostProps {
  post: IPostType;
  number: number;
  currentPost: IPostType | undefined;
  // setRefetch: (val: boolean) => void;
}

const SidebarPostsItem = ({ post, number, currentPost }: IPostProps) => {
  const [views, setViews] = useState<number>(post.views);

  const { setActiveMenuId } = useContext(ActiveMenuContext) as MenuContextType;

  const { breadcrumbs: baseCategory } = useBaseCategory(post ? post.category._id : '');

  const onSaveMenuItemClick = () => {
    localStorage.setItem('activeMenu', baseCategory[0]._id);
    setActiveMenuId(baseCategory[0]._id);
  };

  useEffect(() => {
    if (currentPost && post.id === currentPost.id) {
      setViews(currentPost.views);
    } else {
      setViews(post.views);
    }
  }, [setViews, currentPost, post]);

  return (
    <div
      className="portfolio-item recent"
      style={{ position: 'absolute', left: '0px', top: `${100 * number}px` }}
    >
      <img src={post.imageUrl.url} alt="img" />
      <div
        className={`${
          currentPost && post.id === currentPost.id ? 'portfolio-text__disabled ' : ''
        }  portfolio-text`}
      >
        <h5 onClick={() => onSaveMenuItemClick()}>
          <Link
            to={`/post/${baseCategory[0].title.toLowerCase()}/${post.id}`}
            state={{ refetch: true }}
            className={`${currentPost && post.id === currentPost.id ? 'disabled-link' : ''}`}
          >
            {post.title}. Views: {views}
          </Link>
        </h5>
        <p>
          By {post.user.username} <span>|</span>{' '}
          {new Date(post.createdAt).toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
};

export default SidebarPostsItem;
