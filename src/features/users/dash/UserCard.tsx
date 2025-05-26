import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { IUser } from '../../../types/IUserType';
import { useDeleteUserMutation, useGetUsersQuery } from '../usersApiSlice';
import { Button } from 'react-bootstrap';
import DashModal from '../../../components/dash/DashModal';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';
import useTitle from '../../../hooks/useTitle';
import useAuth from '../../../hooks/useAuth';
import PostsForUserCard from './PostsForUserCard';

const UserCard = () => {
  useTitle('Profile Card');

  const { id: currentUserId } = useAuth();

  const [postsCount, setPostsCount] = useState<number>(0);

  const navigate = useNavigate();

  const { id } = useParams();

  const { user } = useGetUsersQuery(`usersList`, {
    selectFromResult: ({ data }) => ({
      user: id ? data?.entities[id] : ({} as IUser),
    }),
  });

  const [
    deleteUser,
    {
      data,
      isLoading: isDelUserLoading,
      isSuccess: isDelUserSuccess,
      isError: isDelUserError,
      error: delUserError,
    },
  ] = useDeleteUserMutation();

  //после удаления user -идем на home
  useEffect(() => {
    if (isDelUserSuccess) {
      navigate('/dash', { state: { successDel: isDelUserSuccess, messageDel: data?.message } });
    }
  }, [navigate, isDelUserSuccess, user, data?.message]);

  //modal props
  const [isShow, setShow] = useState(false);

  const onDeleteUser = () => {
    setShow(true);
  };

  const onDeleteUserClicked = async (id: string) => {
    await deleteUser({ id });
  };

  useCreateAndRemoveToast(isDelUserError, delUserError?.data?.message, 'error');

  let content = <></>;

  if (isDelUserLoading) content = <PulseLoader color={'#000'} />;
  else if (user !== undefined) {
    content = (
      <>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Profile of {user?.username}</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/dash">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">{user?.email}</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="content">
          <div className="card card-solid">
            <div className="card-body pb-0">
              <div className="row d-flex align-items-stretch">
                <div className="col-12 col-sm-6 col-md-4 d-flex align-items-stretch">
                  <div className="card bg-light">
                    <div className="card-header text-muted border-bottom-0">Digital Strategist</div>
                    <div className="card-body pt-0">
                      <div className="row">
                        <div className="col-8">
                          <h2 className="lead">
                            <b>{user?.username}</b>
                          </h2>
                          <p className="text-muted text-sm">
                            <b>Roles: </b>
                            {user?.roles !== undefined &&
                              user?.roles.map((role) => <span key={role}> {role},</span>)}
                          </p>
                          <ul className="ml-4 mb-0 fa-ul text-muted">
                            <li className="small">
                              <span className="fa-li">
                                <i className="fas fa-lg fa-building"></i>
                              </span>
                              Email Address: {user?.email}
                            </li>
                            <li className="small">
                              <span className="fa-li">
                                <i className="fas fa-lg fa-phone"></i>
                              </span>
                              Phone:+ 800 - 12 12 23 52
                            </li>
                            <li className="small">
                              <span className="fa-li">
                                <i className="fa fa-clipboard"></i>
                              </span>
                              Posts Count: {postsCount}
                            </li>
                            <li className="small">
                              <span className="fa-li">
                                <i className="fas fa-lg fa-calendar"></i>
                              </span>
                              Since from:
                              <>
                                {' '}
                                {new Date(user.createdAt).toLocaleString('ru-RU', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </>
                            </li>
                          </ul>
                        </div>
                        <div className="col-4 text-center">
                          <img src={user?.avatar?.url} alt="" className="img-circle img-fluid" />
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="text-right">
                        {user.id !== currentUserId && (
                          <Link
                            className="btn btn-info btn-sm"
                            to={`/dash/users/edit/${user.id}`}
                            // state={{ page: location.state.page }}
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <nav aria-label="Contacts Page Navigation"></nav>
            </div>
          </div>
        </section>
        <PostsForUserCard userId={id} setPostsCount={setPostsCount} />
        <DashModal
          isShow={isShow}
          setShow={(show) => setShow(show)}
          data={user.username}
          onDeleteClicked={(id) => onDeleteUserClicked(id)}
          id={user.id}
        />
      </>
    );
  } else {
    content = <PulseLoader color={'#000'} />;
  }

  return <>{content}</>;
};

export default UserCard;
