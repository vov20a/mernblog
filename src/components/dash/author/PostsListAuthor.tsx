import React, { useEffect, useRef, useState } from 'react';
import {
  useDeletePostMutation,
  useGetPostsByParamQuery,
} from '../../../features/posts/postsApiSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import DashPost from '../../../features/posts/dash/DashPost';
import { EntityId } from '@reduxjs/toolkit';
import Pagination from 'react-js-pagination';
import { useDebounce } from '../../../hooks/debounce';
import useTitle from '../../../hooks/useTitle';
import qs from 'qs';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';
import useAuth from '../../../hooks/useAuth';
import SearchForm from '../../public/SearchForm';

const PostsListAuthor = () => {
  const { id: userId, username } = useAuth();

  useTitle(`Author Page by : ${username}`);

  const navigate = useNavigate();

  const isMounted = useRef(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [number, setNumber] = useState<number>(1);
  const [query, setQuery] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  // const { data, isSuccess, isLoading, isError, error } = useGetAllPostsQuery(query);

  const param = ' UID';

  const { data, isSuccess, isLoading, isError, error } = useGetPostsByParamQuery({
    param: userId + param,
    query,
  });

  const [
    deletePost,
    {
      data: dataPost,
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeletePostMutation();

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
      setNumber(currentPage);
      if (+params.page > 1) {
        navigate(`/author/posts/?${queryStr}`);
      } else {
        navigate(`/author/posts`);
      }
    } else if (window.location.search) {
      const params: { page: string } = qs.parse(window.location.search.substring(1)) as {
        page: string;
      };
      setCurrentPage(params.page ? +params.page : 1);
    }
    isMounted.current = true;
  }, [currentPage, navigate]);

  const debounced = useDebounce(search, 500);
  useEffect(() => {
    if (debounced.length > 2) {
      navigate('/author/posts/search', { state: debounced });
    }
  }, [debounced, navigate]);

  const onDeletePostClicked = async (id: string) => {
    await deletePost({ id });
  };

  //после удаления post -идем на home
  useEffect(() => {
    if (isDelSuccess) {
      navigate('/author', {
        state: { successDelPost: isDelSuccess, messageDelPost: dataPost?.message },
      });
    }
  }, [navigate, isDelSuccess, dataPost]);

  useCreateAndRemoveToast(isError, error?.data?.message || error?.status, 'error');

  useCreateAndRemoveToast(isDelError, delerror?.data?.message, 'error');

  const location = useLocation();
  //from EditPost
  useCreateAndRemoveToast(
    location.state?.successEditPost,
    location.state?.messageEditPost ?? 'Post updated',
    'success',
  );

  let content = <></>;
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }
  if (isLoading || isDelLoading) content = <PulseLoader color={'#000'} />;

  let postsCount = 0;

  if (isSuccess) {
    const resultPerPage = data?.resultPerPage;
    postsCount = data?.postsCount;

    const ids = data?.ids;

    const tableContent = ids?.map((postId: EntityId, index) => (
      <DashPost
        key={postId}
        post={data.entities[postId]}
        page={currentPage}
        number={index + (number * resultPerPage - (resultPerPage - 1))}
        onDeletePostClicked={(id) => onDeletePostClicked(id)}
      />
    ));
    if (postsCount) {
      content = (
        <>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Posts List</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <Link to="/author">Home</Link>
                    </li>
                    <li className="breadcrumb-item active">postsList</li>
                  </ol>
                </div>
              </div>
              <div className=" row mb-2 ">
                <div className="col-sm-12 form-search">
                  <SearchForm search={search} setSearch={setSearch} />
                </div>
              </div>
            </div>
          </section>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body table-responsive p-0">
                    <table className="table table-hover text-nowrap">
                      <thead>
                        <tr>
                          <th>№</th>
                          <th>Title</th>
                          <th>Text</th>
                          <th>Author</th>
                          <th>Category</th>
                          <th>Tags</th>
                          <th>Views</th>
                          <th>Likes</th>
                          <th>Image</th>
                          <th>CreatedAt</th>
                          <th>UpdatedAt</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody style={{ fontWeight: 500 }}>{tableContent}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
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
        </>
      );
    } else {
      content = <h1>There are not posts</h1>;
    }
  }
  return <>{content}</>;
};

export default PostsListAuthor;
