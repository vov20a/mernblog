import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetPostsByParamQuery } from '../features/posts/postsApiSlice';
import useTitle from '../hooks/useTitle';
import qs from 'qs';
import { useDebounce } from '../hooks/debounce';
import { useCreateAndRemoveToast } from '../hooks/useCreateAndRemoveToast';
import { PulseLoader } from 'react-spinners';
import Pagination from 'react-js-pagination';
import PostCard from '../features/posts/PostCard';
import { EntityId } from '@reduxjs/toolkit';
import Sidebar from '../components/public/Sidebar';
import SearchForm from '../components/public/SearchForm';

const PostsByTag = () => {
  const { tag: tagParam } = useParams();

  const navigate = useNavigate();

  const [tag, setTag] = useState('');
  const isMounted = useRef(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [query, setQuery] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const param = ' TID';

  const { data, isLoading, isSuccess, isError, error } = useGetPostsByParamQuery({
    param: (tag ?? '') + param,
    query,
  });

  const setCurrentPageNo = (e: React.SetStateAction<number>) => {
    setCurrentPage(e);
  };

  useEffect(() => {
    if (tagParam) setTag(tagParam ?? '');
  }, [tagParam, isSuccess, currentPage]);

  useTitle(`Posts by: #${tag}`);

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
        navigate(`/tag/${tagParam}/?${queryStr}`);
      } else {
        navigate(`/tag/${tagParam}`);
      }
    } else if (window.location.search) {
      const params: { page: string } = qs.parse(window.location.search.substring(1)) as {
        page: string;
      };
      setCurrentPage(params.page ? +params.page : 1);
    }
    isMounted.current = true;
  }, [currentPage, navigate, tagParam]);

  const debounced = useDebounce(search, 500);
  useEffect(() => {
    if (debounced.length > 2) {
      navigate('/search', { state: debounced });
    }
  }, [debounced, navigate]);

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

  if (isLoading) content = <PulseLoader color={'#000'} />;

  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;

  let postsCount = 0;

  if (isSuccess) {
    const resultPerPage = data?.resultPerPage ?? 0;
    postsCount = data?.postsCount ?? 0;

    const ids = data.ids;

    const postContent = ids?.map((postId: EntityId) => (
      <PostCard key={postId} post={data?.entities[postId]} md={6} />
    ));

    if (postsCount > 0) {
      content = (
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
    }
  }

  return (
    <section className="single-blog-area">
      <div className="container">
        <div className="row mt-3 breadcrumbs-search">
          <div className="col-md-8 title-breadcrumbs">
            <div />
          </div>
          <div className="col-md-4 category-posts  justify-content-end">
            <SearchForm search={search} setSearch={setSearch} />
          </div>
        </div>

        <div className="row  posts-align">
          <div className="col-md-8 blog-post-area posts-center">
            <div className="row  posts-align" style={{ marginBottom: 20 }}>
              {postsCount > 0 ? (
                <>
                  <h1>Posts By tag : #{tag}</h1>
                  {content}
                </>
              ) : (
                <h1>There are not posts by tag : {tag}</h1>
              )}
            </div>
          </div>
          <Sidebar />
        </div>
      </div>
    </section>
  );
};

export default PostsByTag;
