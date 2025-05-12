import React, { useEffect, useRef, useState } from 'react';
import { Row } from 'react-bootstrap';
import { useCreateAndRemoveToast } from '../../hooks/useCreateAndRemoveToast';
import { useDebounce } from '../../hooks/debounce';
import { useGetAllPostsQuery } from './postsApiSlice';
import { useNavigate } from 'react-router-dom';
import { Dictionary, EntityId } from '@reduxjs/toolkit';
import PostCard from './PostCard';
import { IPostType } from '../../types/IPostType';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { PulseLoader } from 'react-spinners';
import SearchForm from '../../components/public/SearchForm';

const PostsList = () => {
  const navigate = useNavigate();

  // const isMounted = useRef(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [postIds, setPostIds] = useState<EntityId[]>([]);
  const [postEntities, setPostEntities] = useState<Dictionary<IPostType>>({});

  const lastElementRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>();

  const { data, isLoading, isError, error } = useGetAllPostsQuery(`page=${currentPage}&mode=home`);

  const limit = 4;
  useEffect(() => {
    if (data) {
      setPostIds((postIds) => [...postIds, ...data?.ids]);
      setPostEntities((postEntities) => {
        return { ...postEntities, ...data?.entities };
      });
      setPageCount(Math.ceil((data.postsCount - 1) / limit));
    }
  }, [data]);

  const debounced = useDebounce(search, 500);
  useEffect(() => {
    if (debounced.length > 2) {
      navigate('/search', { state: debounced });
    }
  }, [debounced, navigate]);

  useEffect(() => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    var callback = function (entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
      setTimeout(() => {
        if (entries[0].isIntersecting && currentPage < pageCount) {
          setCurrentPage(currentPage + 1);
        }
      }, 2000);
    };

    observer.current = new IntersectionObserver(callback);
    if (lastElementRef.current) observer.current.observe(lastElementRef.current);
  }, [isLoading, data, currentPage, pageCount]);
  // console.log(currentPage);
  // console.log(pageCount);
  useCreateAndRemoveToast(isError, error?.data?.message || error?.status, 'error');

  let content = <></>;

  let loading = <></>;

  if (currentPage < pageCount) loading = <PulseLoader color={'#000'} />;

  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;

  let postsCount = 0;

  // if (isSuccess) {

  postsCount = data?.postsCount ?? 0;

  const ids = postIds;

  const postContent = ids?.map((id: EntityId) => (
    <CSSTransition key={id} timeout={500} classNames="post-transition">
      <PostCard post={postEntities[id]} md={4} lg={3} />
    </CSSTransition>
  ));

  if (postsCount) {
    content = (
      <>
        <Row className=" justify-content-end">
          <div className="col-md-4 category-posts  justify-content-end">
            <SearchForm search={search} setSearch={setSearch} />
          </div>
        </Row>
        <Row>
          <TransitionGroup className="wrap-transition">{postContent}</TransitionGroup>
        </Row>
        <div
          ref={lastElementRef}
          style={{ backgroundColor: 'transparent', width: '100%', height: 5 }}
        />
      </>
    );
  } else {
    content = <h1 style={{ marginTop: 100 }}>There are not posts</h1>;
  }

  return (
    <>
      {content}
      <div className="posts-loader">{loading}</div>
    </>
  );
};

export default PostsList;
