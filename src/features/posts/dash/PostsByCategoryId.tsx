import React, { useEffect, useRef, useState } from 'react';
import { useDeletePostMutation, useGetAllPostsQuery } from '../../../features/posts/postsApiSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import DashPost from '../../../features/posts/dash/DashPost';
import { EntityId } from '@reduxjs/toolkit';
import Pagination from 'react-js-pagination';
import { useDebounce } from '../../../hooks/debounce';
import useTitle from '../../../hooks/useTitle';
import qs from 'qs';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';
import SearchForm from '../../../components/public/SearchForm';

const PostsByCategoryId = () => {
  useTitle('Posts By Category');

  const { id } = useParams();

  const navigate = useNavigate();

  const isMounted = useRef(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [number, setNumber] = useState<number>(1);
  const [query, setQuery] = useState<string>('postsList');
  const [search, setSearch] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>(id ?? '');

  const { data, isSuccess, isLoading, isError, error } = useGetAllPostsQuery(query);

  const setCurrentPageNo = (e: React.SetStateAction<number>) => {
    setCurrentPage(e);
  };

  useCreateAndRemoveToast(isError, error?.data?.message || error?.status, 'error');

  useEffect(() => {
    if (isMounted.current) {
      const params: { page: string; category: string } = {
        page: String(currentPage),
        category: categoryId,
      };
      const queryStr = qs.stringify(params, {
        arrayFormat: 'comma',
      });
      setQuery(`page=${currentPage}&category=${categoryId}`);
      setNumber(currentPage);
      if (+params.page > 1) {
        navigate(`/dash/categories/cat/${categoryId}?${queryStr}`);
      } else {
        navigate(`/dash/categories/cat/${categoryId}`);
      }
    } else if (window.location.search) {
      const params: { page: string; category: string } = qs.parse(
        window.location.search.substring(1),
      ) as {
        page: string;
        category: string;
      };
      setCategoryId(params.category);
      setCurrentPage(params.page ? +params.page : 1);
    }
    setCategoryId(id ?? '');
    isMounted.current = true;
  }, [currentPage, navigate, categoryId, id]);

  const debounced = useDebounce(search, 1000);
  useEffect(() => {
    if (debounced.length > 2) {
      setQuery(`page=${currentPage}&keyword=${debounced}&category=${categoryId}`);
      setSearch('');
      navigate(`/dash/categories/search`, { state: { debounced, id: categoryId } });
    }
  }, [debounced, currentPage, categoryId, navigate]);

  const [
    deletePost,
    {
      data: dataPost,
      isLoading: isDelPostLoading,
      isSuccess: isDelPostSuccess,
      isError: isDelPostError,
      error: delPosterror,
    },
  ] = useDeletePostMutation();

  const onDeletePostClicked = async (id: string) => {
    await deletePost({ id });
  };
  //после удаления post -идем на home
  useEffect(() => {
    if (isDelPostSuccess) {
      navigate('/dash', {
        state: { successDelPost: isDelPostSuccess, messageDelPost: dataPost?.message },
      });
    }
  }, [navigate, isDelPostSuccess, dataPost]);

  useCreateAndRemoveToast(isDelPostError, delPosterror?.data?.message, 'error');

  let content = <></>;
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }
  if (isLoading || isDelPostLoading) content = <PulseLoader color={'#000'} />;

  let filteredPostsCount = 0;

  if (isSuccess) {
    const categoryTitle: string | undefined = data.posts.find((post) => post.category._id === id)
      ?.category.title;

    const resultPerPage = data?.resultPerPage;
    filteredPostsCount = data?.filteredPostsCount;

    const ids = data?.ids;

    const tableContent = ids?.map((postId: EntityId, index) => (
      <DashPost
        key={postId}
        post={data.entities[postId]}
        number={index + (number * resultPerPage - (resultPerPage - 1))}
        onDeletePostClicked={(id) => onDeletePostClicked(id)}
      />
    ));

    content = (
      <>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Posts List of {categoryTitle} category</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/dash">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">{categoryTitle}</li>
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
                        <th>Image</th>
                        <th>CreatedAt</th>
                        <th>UpdatedAt</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontWeight: 400 }}>{tableContent}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {resultPerPage < filteredPostsCount ? (
            <div className="col-4 paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={filteredPostsCount}
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
  }

  if (!filteredPostsCount) {
    content = <h1>There are not posts</h1>;
  }
  return <>{content}</>;
};

export default PostsByCategoryId;
