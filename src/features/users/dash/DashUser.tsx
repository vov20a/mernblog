import { Link } from 'react-router-dom';
import { memo, useState } from 'react';
import { IUser } from '../../../types/IUserType';
import { Button } from 'react-bootstrap';
import DashModal from '../../../components/dash/DashModal';
import { useGetPostsQuery } from '../../posts/postsApiSlice';

type UserProps = {
  user: IUser | undefined;
  number: number;
  page?: number;
  currentUserId: string;
  onDeleteUserClicked?: ((id: string) => Promise<void>) | undefined;
};

const DashUser = ({ user, number, page, currentUserId, onDeleteUserClicked }: UserProps) => {
  const [isShow, setShow] = useState(false);

  const { postsUser } = useGetPostsQuery('postsList', {
    selectFromResult: ({ data }) => ({
      postsUser: data?.posts.filter((post) => post.user._id === user?.id),
    }),
  });

  let status = '';
  status = user?.roles !== undefined && user?.roles.includes('Author') ? 'Author' : 'User';
  status = user?.roles !== undefined && user?.roles.includes('Admin') ? 'Admin' : status;

  const onDeleteUser = () => {
    setShow(true);
  };

  if (user) {
    return (
      <>
        <tr>
          <td>{number}</td>
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td>{postsUser ? postsUser?.length : 0}</td>
          <td>
            {status}
            {/* <span className="tag tag-danger">Denied</span> */}
          </td>
          <td>
            <img src={user.avatar?.url} alt="user" width={30} />
          </td>

          <td>
            {new Date(user.createdAt).toLocaleString('ru-RU', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              // hour: 'numeric',
              // minute: 'numeric',
            })}
          </td>
          <td>
            {new Date(user.updatedAt).toLocaleString('ru-RU', {
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
              to={`/dash/users/user/${user.id}`}
              style={{ color: 'white' }}
              //для запроса требуется currentPage
              state={{ page: page }}
            >
              <i className="fas fa-folder"></i>
              View
            </Link>
            {user.id !== currentUserId && (
              <Link
                className="btn btn-info btn-sm"
                to={`/dash/users/edit/${user.id}`}
                state={{ page: page }}
                style={{ color: 'white' }}
              >
                <i className="fas fa-pencil-alt"></i>
                Edit
              </Link>
            )}
            {user.id !== currentUserId && (
              <Button
                onClick={onDeleteUser}
                className="btn btn-danger btn-sm"
                style={{ color: 'white' }}
              >
                <i className="fas fa-trash"></i>
                Delete
              </Button>
            )}
          </td>
        </tr>
        {onDeleteUserClicked !== undefined && (
          <DashModal
            isShow={isShow}
            setShow={(show) => setShow(show)}
            data={user.username}
            id={user.id}
            onDeleteClicked={(id) => onDeleteUserClicked(id)}
          />
        )}
      </>
    );
  } else return null;
};
const memoizedUser = memo(DashUser);
export default memoizedUser;
