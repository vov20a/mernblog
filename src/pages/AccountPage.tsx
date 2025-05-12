import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetUsersQuery } from '../features/users/usersApiSlice';
import { useLazyGetPostsByParamQuery } from '../features/posts/postsApiSlice';
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
import useAuth from '../hooks/useAuth';
import SearchForm from '../components/public/SearchForm';

const AccountPage = () => {
  const { id: userId, username, email, roles, status, avatarUrl } = useAuth();

  const navigate = useNavigate();

  const isMounted = useRef(false);
  const [user, setUser] = useState<IUser>({} as IUser);
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

  useTitle(`Account of  ${username}`);

  const param = ' UID';

  const [getPosts, { data: postsData, isLoading: isPostsLoading, isSuccess: isPostsSuccess }] =
    useLazyGetPostsByParamQuery();

  useEffect(() => {
    if (status !== 'User') {
      getPosts({
        param: userId + param,
        query,
      });
    }
  }, [status, getPosts, query, userId]);

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
        navigate(`/account/?${queryStr}`);
      } else {
        navigate(`/account`);
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

  useCreateAndRemoveToast(isError, error?.data?.message || error?.status, 'error');

  let userContent = <></>;

  if (isLoading || isPostsLoading) userContent = <PulseLoader color={'#000'} />;

  if (isError) userContent = <p className="errmsg">{error?.data?.message}</p>;

  if (isSuccess)
    userContent = (
      <section className="content">
        <div className="card-body p-0">
          <div className="row">
            <div className="col-12">
              <div className="card bg-light">
                <h3 className="card-header text-muted border-bottom-0">{status} блога</h3>
                <div className="card-body pt-0">
                  <div className="row   posts-align">
                    <div className="col-7">
                      <h2 className="lead">
                        <b>{username}</b>
                      </h2>
                      <Link
                        to="/password"
                        className=" btn btn-primary mb-2  mr-2 text-white password-avatar"
                      >
                        New Password
                      </Link>
                      <Link
                        to="/avatar"
                        className=" btn btn-primary mb-2 text-white password-avatar"
                      >
                        New Avatar
                      </Link>
                      <ul className="ml-4 mb-0 fa-ul text-muted">
                        <li className="small">
                          <span className="fa-li">
                            <i className="fa fa-envelope"></i>
                          </span>
                          {email}
                        </li>
                        <li className="small">
                          <span className="fa-li">
                            <i className="fa fa-registered"></i>
                          </span>
                          {roles.map((role) => (
                            <span key={role}> {role},</span>
                          ))}
                        </li>
                        <li className="small">
                          <span className="fa-li">
                            <i className="fa fa-address-book"></i>
                          </span>
                          Авторизован с
                          <>
                            {' '}
                            {new Date(user ? user.createdAt : '').toLocaleString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </>
                        </li>
                        {status !== 'User' && postsData ? (
                          <li className="small">
                            <span className="fa-li">
                              <i className="fa fa-book"></i>
                            </span>
                            Создал :<> {postsData?.postsCount} </> поста(ов).
                          </li>
                        ) : (
                          <></>
                        )}
                      </ul>
                    </div>
                    <div className="col-5 text-center">
                      <img src={avatarUrl} alt="" className="img-circle img-fluid" />
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

  if (status === 'User') {
    postsContent = <h3>User can not create posts!</h3>;
  } else {
    if (isPostsSuccess && postsData) {
      const resultPerPage = postsData?.resultPerPage ?? 0;
      postsCount = postsData?.postsCount ?? 0;

      const ids = postsData.ids;

      const postContent = ids?.map((postId: EntityId) => (
        <PostCard key={postId} post={postsData?.entities[postId]} md={6} />
      ));

      if (postsCount > 0) {
        postsContent = (
          <div className="row   posts-align">
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
  }

  return (
    <section className="single-blog-area">
      <div className="container">
        <div className="row mt-3  breadcrumbs-search">
          <div className="col-md-8 title-breadcrumbs"></div>
          <div className="col-md-4 category-posts  justify-content-end">
            <SearchForm search={search} setSearch={setSearch} />
          </div>
        </div>
        <div className="row  posts-align">
          <div className="col-md-8  blog-post-area posts-center">
            <div className="row  posts-align" style={{ marginBottom: 20 }}>
              {userContent}
              <h1>Posts of {username}</h1>
              {postsContent}
            </div>
          </div>
          <Sidebar currentUser={user} />
        </div>
      </div>
    </section>
  );
};

export default AccountPage;
