import React, { useContext } from 'react';
import { IPopularUsers } from '../../../features/posts/postsApiSlice';
import { Link } from 'react-router-dom';
import { ActiveMenuContext, MenuContextType } from '../../../context';
import { IUser } from '../../../types/IUserType';

interface IUserProps {
  data: IPopularUsers;
  number: number;
  currentUser?: IUser | undefined;
}

const UserPostItem = ({ data, number, currentUser }: IUserProps) => {
  const { setActiveMenuId } = useContext(ActiveMenuContext) as MenuContextType;

  const onSaveMenuItemClick = () => {
    localStorage.setItem('activeMenu', '');
    setActiveMenuId('');
  };
  // console.log(currentUser);
  return (
    <div
      className="portfolio-item recent"
      style={{ position: 'absolute', left: '0px', top: `${100 * number}px` }}
    >
      <img
        src={data?.users[0].avatar?.url}
        alt="img"
        style={{ borderRadius: '50%', maxWidth: 72 }}
      />
      <div
        className={`${
          currentUser && data.users[0]._id === currentUser.id ? 'portfolio-text__disabled ' : ''
        }  portfolio-text`}
      >
        <h5 onClick={onSaveMenuItemClick}>
          <Link
            to={`/user/${data.users[0]._id}`}
            state={{ refetch: true }}
            className={`${
              currentUser && data.users[0]._id === currentUser.id ? 'disabled-link' : ''
            }`}
          >
            {data.users[0].username} created {data.postsCount} posts.
          </Link>
        </h5>
        <p>
          {data.users[0].username} <span> since </span>{' '}
          {new Date(data.users[0].createdAt).toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
};

export default UserPostItem;
