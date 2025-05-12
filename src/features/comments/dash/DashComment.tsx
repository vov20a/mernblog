import React, { memo } from 'react';
import { IComment } from '../../../types/IComment';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

type CommentProps = {
  comment: IComment | undefined;
  number: number;
  page?: number;
  comments: IComment[];
  onDeleteCommentClicked?: (id: string) => Promise<void>;
};

const DashComment = ({ comment, number, page, onDeleteCommentClicked }: CommentProps) => {
  const onDeleteComment = (id: string) => {
    if (onDeleteCommentClicked) onDeleteCommentClicked(id);
  };
  return (
    <>
      <tr>
        <td>{number}</td>
        <td>{comment?.text.slice(0, 20)}</td>
        <td
          style={comment?.post !== null ? { color: 'inherit' } : { color: 'red', fontWeight: 700 }}
        >
          {comment?.post !== null ? comment?.post.title : 'Delete it'}
        </td>
        <td>{comment?.user.username}</td>
        <td>{comment?.parentComment ?? 'base'}</td>
        <td>{comment?.likes.count}</td>
        <td>
          {new Date(comment ? comment.createdAt : '').toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </td>
        <td>
          {new Date(comment ? comment.updatedAt : '').toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </td>

        <td className="project-actions">
          {comment?.post !== null ? (
            <Link
              className="btn btn-primary btn-sm"
              to={`/dash/comments/view/${comment?.id}`}
              style={{ color: 'white' }}
              state={{ page: page, commentId: comment?.id }}
            >
              <i className="fas fa-folder"></i>
              View
            </Link>
          ) : (
            <Button
              onClick={() => onDeleteComment(comment.id)}
              className="btn btn-danger btn-sm"
              style={{ color: 'white' }}
            >
              <i className="fas fa-trash"></i>
              Delete
            </Button>
          )}
        </td>
      </tr>
    </>
  );
};
const memoizedComment = memo(DashComment);
export default memoizedComment;
