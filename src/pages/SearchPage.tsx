import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/public/Sidebar';
import useTitle from '../hooks/useTitle';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetAllPostsQuery } from '../features/posts/postsApiSlice';
import { useDebounce } from '../hooks/debounce';
import qs from 'qs';
import { PulseLoader } from 'react-spinners';
import { useCreateAndRemoveToast } from '../hooks/useCreateAndRemoveToast';
import { EntityId } from '@reduxjs/toolkit';
import PostCard from '../features/posts/PostCard';
import Pagination from 'react-js-pagination';
import SearchForm from '../components/public/SearchForm';

const SearchPage = () => {
  useTitle('Search Posts');

  const navigate = useNavigate();
  const { state } = useLocation();

  const isMounted = useRef(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [query, setQuery] = useState<string>(`keyword=${state}`);
  const [search, setSearch] = useState<string>(state);

  const { data, isSuccess, isLoading, isError, error } = useGetAllPostsQuery(query);

  const setCurrentPageNo = (e: React.SetStateAction<number>) => {
    setCurrentPage(e);
  };

  const debounced = useDebounce(search, 500);

  useEffect(() => {
    if (isMounted.current) {
      const params: { page: string; keyword: string } = {
        page: String(currentPage),
        keyword: search,
      };
      const queryStr = qs.stringify(params, {
        arrayFormat: 'comma',
      });
      if (debounced?.length > 2) {
        setQuery(`page=${currentPage}&keyword=${debounced}`);
      }
      if (+params.page > 1) {
        navigate(`/search/?${queryStr}`);
      } else {
        navigate(`/search/?keyword=${debounced}`);
      }
    } else if (window.location.search) {
      const params: { page: string; keyword: string } = qs.parse(
        window.location.search.substring(1),
      ) as { page: string; keyword: string };
      setSearch(params.keyword);
      setCurrentPage(params.page ? +params.page : 1);
    }
    isMounted.current = true;
  }, [currentPage, navigate, debounced, search]);

  useCreateAndRemoveToast(
    isError,
    error?.data?.message !== 'PageError' ? error?.data?.message || 'Server Error' : undefined,
    'error',
  );

  useEffect(() => {
    if (error?.data?.message === 'PageError') {
      setCurrentPage(1);
    }
  }, [error]);

  let content = <></>;
  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;

  if (isLoading) content = <PulseLoader color={'#000'} />;

  if (isSuccess) {
    const resultPerPage = data?.resultPerPage ?? 0;
    const filteredPostsCount = data?.filteredPostsCount;

    const ids = data.ids;

    const postContent = ids?.map((postId: EntityId) => (
      <PostCard key={postId} post={data?.entities[postId]} md={6} />
    ));
    content = (
      <section className="single-blog-area">
        <div className="container">
          <div className="row  mt-3 breadcrumbs-search">
            <div className="col-md-8 title-breadcrumbs"></div>
            <div className="col-md-4 category-posts  justify-content-end">
              <SearchForm search={search} setSearch={setSearch} />
            </div>
          </div>

          <div className="row  posts-align">
            <div className="col-md-8 blog-post-area posts-center">
              <div className="row  posts-align" style={{ marginBottom: 20 }}>
                <h3 style={{ width: '100%' }}>Serach posts by: {search}</h3>
                {filteredPostsCount ? postContent : <h1>There are not posts</h1>}
              </div>
              <div className="pagination">
                {resultPerPage < filteredPostsCount ? (
                  <div className="col-12 paginationBox">
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
            </div>
            <Sidebar />
          </div>
        </div>
      </section>
    );
  }
  return <>{content}</>;
};

export default SearchPage;
