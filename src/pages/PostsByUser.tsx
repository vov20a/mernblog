import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetUsersQuery } from '../features/users/usersApiSlice';
import { useGetPostsByParamQuery } from '../features/posts/postsApiSlice';
import Sidebar from '../components/public/Sidebar';
import useTitle from '../hooks/useTitle';
import qs from 'qs';
import { useDebounce } from '../hooks/debounce';
import { useCreateAndRemoveToast } from '../hooks/useCreateAndRemoveToast';
import { PulseLoader } from 'react-spinners';
import PostCard from '../features/posts/PostCard';
import { EntityId } from '@reduxjs/toolkit';
import Pagination from 'react-js-pagination';
import { IUser } from '../types/IUserType';
import SearchForm from '../components/public/SearchForm';

//нужен []roles при старте
const initialUser: IUser = {
  _id: '',
  id: '',
  avatar: { public_id: '', url: '' },
  email: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  username: '',
  roles: ['User'],
};

const PostsByUser = () => {
  const { id: userId } = useParams();

  const navigate = useNavigate();

  const [user, setUser] = useState<IUser>(initialUser);
  const isMounted = useRef(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [query, setQuery] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const { userData, isLoading, isSuccess, isError, error } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data, isLoading, isSuccess, isError, error }) => ({
      userData: data?.entities[userId ?? ''],
      isLoading,
      isSuccess,
      isError,
      error,
    }),
  });

  useEffect(() => {
    if (isSuccess) setUser(userData ?? ({} as IUser));
  }, [userData, isSuccess, currentPage]);

  useTitle(`Posts By: ${user?.username}`);

  const param = ' UID';

  const {
    data: postsData,
    isLoading: isPostsLoading,
    isSuccess: isPostsSuccess,
    isError: isPostsError,
    error: postsError,
  } = useGetPostsByParamQuery({
    param: (userId ?? '') + param,
    query,
  });

  const setCurrentPageNo = (e: React.SetStateAction<number>) => {
    setCurrentPage(e);
  };

  useEffect(() => {
    if (isMounted.current) {
      const params: { page: string } = {
        page: String(currentPage),
      };
      const queryStr = qs.stringify(params, {
        arrayFormat: 'comma',
      });
      setQuery(`page=${currentPage}`);
      if (+params.page > 1) {
        navigate(`/user/${userId}/?${queryStr}`);
      } else {
        navigate(`/user/${userId}`);
      }
    } else if (window.location.search) {
      const params: { page: string } = qs.parse(window.location.search.substring(1)) as {
        page: string;
      };
      setCurrentPage(params.page ? +params.page : 1);
    }
    isMounted.current = true;
  }, [currentPage, navigate, userId]);

  const debounced = useDebounce(search, 500);
  useEffect(() => {
    if (debounced.length > 2) {
      navigate('/search', { state: debounced });
    }
  }, [debounced, navigate]);

  useEffect(() => {
    if (isPostsError && postsError?.data?.message === 'PageError') {
      setCurrentPage(1);
    }
  }, [postsError, isPostsError]);

  useCreateAndRemoveToast(isError, error?.data?.message || error?.status, 'error');

  let userContent = <></>;

  if (isLoading || isPostsLoading) userContent = <PulseLoader color={'#000'} />;

  if (isError) userContent = <p className="errmsg">{error?.data?.message}</p>;

  if (isSuccess)
    userContent = (
      <section className="content" style={{ width: '100%' }}>
        <div className="card-body p-0">
          <div className="row">
            <div className="col-12">
              <div className="card bg-light">
                <h3 className="card-header text-muted border-bottom-0">Пользователь блога</h3>
                <div className="card-body pt-0">
                  <div className="row">
                    <div className="col-7">
                      <h2 className="lead">
                        <b>{user?.username}</b>
                      </h2>
                      <ul className="ml-4 mb-0 fa-ul text-muted">
                        <li className="small">
                          <span className="fa-li">
                            <i className="fa fa-registered"></i>
                          </span>
                          {user?.roles !== undefined ? (
                            user?.roles.map((role) => <span key={role}> {role},</span>)
                          ) : (
                            <></>
                          )}
                        </li>
                        <li className="small">
                          <span className="fa-li">
                            <i className="fa fa-address-book"></i>
                          </span>
                          Since:
                          <>
                            {' '}
                            {new Date(user ? user.createdAt : '').toLocaleString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </>
                        </li>
                        <li className="small">
                          <span className="fa-li">
                            <i className="fa fa-book"></i>
                          </span>
                          Создал :<> {postsData?.postsCount} </> поста(ов).
                        </li>
                      </ul>
                    </div>
                    <div className="col-5 text-center">
                      <img src={user?.avatar?.url} alt="" className="img-circle img-fluid" />
                    </div>
                  </div>
                </div>
                <div className="card-footer"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );

  let postsCount = 0;
  let postsContent = <></>;

  if (isPostsSuccess) {
    const resultPerPage = postsData?.resultPerPage ?? 0;
    postsCount = postsData?.postsCount ?? 0;

    const ids = postsData.ids;

    const postContent = ids?.map((postId: EntityId) => (
      <PostCard key={postId} post={postsData?.entities[postId]} md={6} />
    ));

    if (postsCount > 0) {
      postsContent = (
        <div className="row  posts-align">
          {postContent}
          <div className="pagination">
            {resultPerPage < postsCount ? (
              <div className="col-12 paginationBox">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={postsCount}
                  onChange={setCurrentPageNo}
                  nextPageText="Next"
                  prevPageText="Prev"
                  firstPageText="1st"
                  lastPageText="Last"
                  itemClass="page-item"
                  linkClass="page-link"
                  activeClass="pageItemActive"
                  activeLinkClass="pageLinkActive"
                />{' '}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      );
    } else {
      postsContent = <h3>No posts created this author yet!</h3>;
    }
  }
  // console.log(user);
  return (
    <section className="single-blog-area">
      <div className="container">
        <div className="row mt-3 breadcrumbs-search">
          <div className="col-md-8 title-breadcrumbs"></div>
          <div className="col-md-4 category-posts  justify-content-end">
            <SearchForm search={search} setSearch={setSearch} />
          </div>
        </div>
        <div className="row  posts-align">
          <div className="col-md-8 blog-post-area ">
            <div className="blog-post-area posts-center">{userContent}</div>
            <h1>Posts By User : {user?.username}</h1>
            <div className="blog-post-area ">{postsContent}</div>
          </div>
          <Sidebar currentUser={user} />
        </div>
      </div>
    </section>
  );
};

export default PostsByUser;
