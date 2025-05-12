import React, { useEffect, useState, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IPostType } from '../../../types/IPostType';
import DashModal from '../../../components/dash/DashModal';
import { Button } from 'react-bootstrap';

type PostProps = {
  post: IPostType | undefined;
  number: number;
  page?: number;
  onDeletePostClicked: (id: string) => Promise<void>;
};

const DashPost = ({ post, number, page, onDeletePostClicked }: PostProps) => {
  const location = useLocation();
  const [isShow, setShow] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const [mode, setMode] = useState<'dash' | 'author'>('dash');

  useEffect(() => {
    if (location.pathname.includes('author')) setMode('author');
  }, [location]);

  const onDeletePost = () => {
    setShow(true);
  };
  useEffect(() => {
    if (isDelete && post) {
      onDeletePostClicked(post.id as string);
      setDelete(false);
    }
  }, [isDelete, post, onDeletePostClicked]);

  if (post) {
    return (
      <tr>
        <td>{number}</td>
        <td>{post?.title}</td>
        <td>{post.text.slice(0, 30)}</td>
        <td>{post.user.username}</td>
        <td>{post.category?.title}</td>
        <td>
          {post.tags.map((tag) => (
            <span key={Math.random()}>{tag},</span>
          ))}
        </td>
        <td>{post.views}</td>
        <td>{post.likes.count}</td>
        <td>
          <img src={post.imageUrl?.url} alt="img" width={30} />
        </td>

        <td>
          {new Date(post.createdAt).toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            // hour: 'numeric',
            // minute: 'numeric',
          })}
        </td>
        <td>
          {new Date(post.updatedAt).toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            // hour: 'numeric',
            // minute: 'numeric',
          })}
        </td>

        <td className="project-actions">
          <Link
            className="btn btn-primary btn-sm"
            to={`/${mode}/posts/post/${post.id}`}
            style={{ color: 'white' }}
            //для запроса требуется currentPage
            state={{ page: page }}
          >
            <i className="fas fa-folder"></i>
            View
          </Link>
          <Link
            className="btn btn-info btn-sm"
            to={`/${mode}/posts/edit/${post.id}`}
            style={{ color: 'white' }}
            //для запроса требуется currentPage
            state={{ page: page }}
          >
            <i className="fas fa-pencil-alt"></i>
            Edit
          </Link>
          <Button
            onClick={onDeletePost}
            className="btn btn-danger btn-sm"
            style={{ color: 'white' }}
          >
            <i className="fas fa-trash"></i>
            Delete
          </Button>
        </td>
        <DashModal
          isShow={isShow}
          setShow={(show) => setShow(show)}
          data={post.title}
          onDeleteClicked={onDeletePostClicked}
          id={post?.id ?? ''}
        />
      </tr>
    );
  } else return null;
};

export default memo(DashPost);
// export default DashPost;
