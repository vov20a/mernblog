import React, { useContext } from 'react';
import { IPostType } from '../../types/IPostType';
import { Link } from 'react-router-dom';
import HTMLStringToJSX from '../../components/dash/HTMLStringToJSX';
import { Col } from 'react-bootstrap';
import { ActiveMenuContext, MenuContextType } from '../../context';
import { useBaseCategory } from '../../hooks/useBaseCategory';

type PostProps = {
  post: IPostType | undefined;
  md: number;
  lg?: number;
};

const re = RegExp(/<[^>]*>/g);

const PostCard = ({ post, md, lg = 4 }: PostProps) => {
  const { setActiveMenuId } = useContext(ActiveMenuContext) as MenuContextType;

  const { breadcrumbs: baseCategory } = useBaseCategory(post ? post.category._id : '');

  const onSaveMenuItemClick = () => {
    localStorage.setItem('activeMenu', baseCategory[0]._id);
    setActiveMenuId(baseCategory[0]._id);
  };

  if (post) {
    return (
      <Col md={md} lg={lg} sm={6}>
        <div className="single-post">
          <img src={post.imageUrl.url} alt="img" style={{ height: '161px' }} />
          <h5 onClick={onSaveMenuItemClick}>
            <Link
              to={`/post/${baseCategory[0]?.title.toLowerCase()}/${post.id}`}
              state={{ refetch: true }}
            >
              {post.title}
            </Link>
          </h5>
          <h4>
            <span>
              Posted By: <span className="author-name">{post?.user.username}</span>
            </span>
          </h4>
          <HTMLStringToJSX str={post?.text.replace(re, '').slice(0, 20)} />
          <h4>
            <span>
              {new Date(post.createdAt).toLocaleString('ru-RU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            {/* <span>
              Views: <span>{post?.views}</span>
            </span> */}
          </h4>
        </div>
      </Col>
    );
  }

  return <div></div>;
};

export default PostCard;
