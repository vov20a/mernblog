import React, { useState } from 'react';
import { IComment } from '../../types/IComment';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import DashModal from './DashModal';

interface CommentProps {
  commentsTree: IComment[];
  commentActiveId?: string;
  page?: number;
  onDeleteCommentClicked?: ((id: string) => Promise<void>) | undefined;
}

const DashCommentForCardPost = ({
  commentsTree,
  commentActiveId,
  page,
  onDeleteCommentClicked,
}: CommentProps) => {
  const [isShow, setShow] = useState(false);

  const [commentIdDelete, setCommentIdDelete] = useState('');

  const onDeleteComment = (id: string) => {
    setCommentIdDelete(id);
    setShow(true);
  };

  const parts: React.ReactNode[] = [];
  for (const item of commentsTree) {
    if (item.children.length > 0) {
      parts.push(
        <div
          key={item?._id}
          className={commentActiveId === item?._id ? 'card-comment active' : 'card-comment'}
        >
          <img className="img-circle img-sm" src={item?.user.avatar?.url} alt="User" />

          <div className="comment-text">
            <span className="username">
              {item?.user.username}
              <span className="text-muted float-right">
                {' '}
                {new Date(item?.createdAt ?? '').toLocaleString('ru-RU', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </span>
            <div className="comment-block">
              {item?.text}
              <div>
                <Link
                  className="btn btn-info btn-sm"
                  to={`/dash/comments/edit/${item?._id}`}
                  state={{ page: page }}
                  style={{ color: 'white' }}
                >
                  <i className="fas fa-pencil-alt"></i>
                  Edit
                </Link>
              </div>
            </div>
          </div>
        </div>,
      );
    } else {
      parts.push(
        <div
          key={item?._id}
          className={commentActiveId === item?._id ? 'card-comment active' : 'card-comment'}
        >
          <img className="img-circle img-sm" src={item?.user.avatar?.url} alt="User" />

          <div className="comment-text">
            <span className="username">
              {item?.user.username}
              <span className="text-muted float-right">
                {' '}
                {new Date(item?.createdAt ?? '').toLocaleString('ru-RU', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </span>
            <div className="comment-block">
              {item?.text}
              <div>
                <Link
                  className="btn btn-info btn-sm"
                  to={`/dash/comments/edit/${item?._id}`}
                  state={{ page: page }}
                  style={{ color: 'white' }}
                >
                  <i className="fas fa-pencil-alt"></i>
                  Edit
                </Link>
                <Button
                  onClick={() => onDeleteComment(item._id)}
                  className="btn btn-danger btn-sm"
                  style={{ color: 'white' }}
                >
                  <i className="fas fa-trash"></i>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>,
      );
    }

    if (item.children.length > 0) {
      for (const child of item.children) {
        if (child.children.length > 0) {
          parts.push(
            <div
              key={child?._id}
              className={commentActiveId === child?._id ? 'card-comment active' : 'card-comment'}
              style={{ margin: 0, marginLeft: '50px' }}
            >
              <img className="img-circle img-sm" src={child?.user.avatar?.url} alt="User" />

              <div className="comment-text">
                <span className="username">
                  {child?.user.username}
                  <span className="text-muted float-right">
                    {' '}
                    {new Date(child?.createdAt ?? '').toLocaleString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </span>
                <div className="comment-block">
                  ______{child?.text}
                  <div>
                    <Link
                      className="btn btn-info btn-sm"
                      to={`/dash/comments/edit/${child?._id}`}
                      state={{ page: page }}
                      style={{ color: 'white' }}
                    >
                      <i className="fas fa-pencil-alt"></i>
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>,
          );
        } else {
          parts.push(
            <div
              key={child?._id}
              className={commentActiveId === child?._id ? 'card-comment active' : 'card-comment'}
              style={{ margin: 0, marginLeft: '50px' }}
            >
              <img className="img-circle img-sm" src={child?.user.avatar?.url} alt="User" />

              <div className="comment-text">
                <span className="username">
                  {child?.user.username}
                  <span className="text-muted float-right">
                    {' '}
                    {new Date(child?.createdAt ?? '').toLocaleString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </span>
                <div className="comment-block">
                  ______{child?.text}
                  <div>
                    <Link
                      className="btn btn-info btn-sm"
                      to={`/dash/comments/edit/${child?._id}`}
                      state={{ page: page }}
                      style={{ color: 'white' }}
                    >
                      <i className="fas fa-pencil-alt"></i>
                      Edit
                    </Link>
                    <Button
                      onClick={() => onDeleteComment(child._id)}
                      className="btn btn-danger btn-sm"
                      style={{ color: 'white' }}
                    >
                      <i className="fas fa-trash"></i>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>,
          );
        }

        if (child.children.length > 0) {
          for (const cat of child.children) {
            parts.push(
              <div
                key={cat?._id}
                className={commentActiveId === cat?._id ? 'card-comment active' : 'card-comment'}
                style={{ margin: 0, marginLeft: '100px' }}
              >
                <img className="img-circle img-sm" src={cat?.user.avatar?.url} alt="User" />

                <div className="comment-text">
                  <span className="username">
                    {cat?.user.username}
                    <span className="text-muted float-right">
                      {' '}
                      {new Date(cat?.createdAt ?? '').toLocaleString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </span>

                  <div className="comment-block">
                    _________{cat?.text}
                    <div>
                      <Link
                        className="btn btn-info btn-sm"
                        to={`/dash/comments/edit/${cat?._id}`}
                        state={{ page: page }}
                        style={{ color: 'white' }}
                      >
                        <i className="fas fa-pencil-alt"></i>
                        Edit
                      </Link>
                      <Button
                        onClick={() => onDeleteComment(cat._id)}
                        className="btn btn-danger btn-sm"
                        style={{ color: 'white' }}
                      >
                        <i className="fas fa-trash"></i>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>,
            );
          }
        }
      }
    }
  }

  return (
    <>
      {parts}
      {onDeleteCommentClicked !== undefined && (
        <DashModal
          isShow={isShow}
          setShow={(show) => setShow(show)}
          data={commentIdDelete}
          id={commentIdDelete}
          onDeleteClicked={(id) => onDeleteCommentClicked(id)}
        />
      )}
      ;
    </>
  );
};

export default DashCommentForCardPost;
