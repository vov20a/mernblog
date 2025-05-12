import React, { useEffect, useRef, useState } from 'react';
import { useGetAllPostsQuery, useDeletePostMutation } from '../postsApiSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import DashPost from './DashPost';
import { EntityId } from '@reduxjs/toolkit';
import Pagination from 'react-js-pagination';
import { useDebounce } from '../../../hooks/debounce';
import useTitle from '../../../hooks/useTitle';
import qs from 'qs';
import SearchForm from '../../../components/public/SearchForm';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';

const SearchByCategoryId = () => {
  useTitle('Search Product');

  const navigate = useNavigate();
  const { state } = useLocation();

  const isMounted = useRef(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [number, setNumber] = useState<number>(1);
  const [query, setQuery] = useState<string>('');
  const [search, setSearch] = useState<string>(state ? state.debounced : '');
  const [categoryId, setCategoryId] = useState<string>(state ? state.id : '');

  const { data, isSuccess, isLoading, isError, error } = useGetAllPostsQuery(query);
  // console.log(data);

  const setCurrentPageNo = (e: React.SetStateAction<number>) => {
    setCurrentPage(e);
  };
  const debounced = useDebounce(search, 500);

  useEffect(() => {
    if (isMounted.current) {
      const params: { page: string; keyword: string; category: string } = {
        page: String(currentPage),
        keyword: search,
        category: categoryId,
      };
      const queryStr = qs.stringify(params, {
        arrayFormat: 'comma',
      });
      if (debounced?.length > 2) {
        setQuery(`page=${currentPage}&keyword=${debounced}&category=${categoryId}`);
      }
      setNumber(currentPage);
      if (+params.page > 1) {
        navigate(`/dash/categories/search/?${queryStr}`);
      } else {
        navigate(`/dash/categories/search/?keyword=${debounced}&category=${categoryId}`);
      }
    } else if (window.location.search) {
      const params: { page: string; keyword: string; category: string } = qs.parse(
        window.location.search.substring(1),
      ) as { page: string; keyword: string; category: string };
      setSearch(params.keyword);
      setCategoryId(params.category);
      setCurrentPage(params.page ? +params.page : 1);
    }
    isMounted.current = true;
  }, [currentPage, navigate, debounced, search, state, categoryId]);

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

  if (isSuccess) {
    const resultPerPage = data?.resultPerPage;
    // const postsCount = data?.postsCount;
    const filteredPostsCount = data?.filteredPostsCount;

    const ids = data?.ids;

    const tableContent = ids?.map((postId: EntityId, index: number) => (
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
                <h1>Search Posts By:' {search}'</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/dash">Home</Link>
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

  return <>{content}</>;
};

export default SearchByCategoryId;
