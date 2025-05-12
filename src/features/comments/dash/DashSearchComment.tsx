import React, { useEffect, useRef, useState } from 'react';
import { useGetAllCommentsQuery } from '../commentsApiSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import DashComment from './DashComment';
import { EntityId } from '@reduxjs/toolkit';
import Pagination from 'react-js-pagination';
import { useDebounce } from '../../../hooks/debounce';
import useTitle from '../../../hooks/useTitle';
import qs from 'qs';
import SearchForm from '../../../components/public/SearchForm';

const DashSearchComment = () => {
  useTitle('Search Comment');

  const navigate = useNavigate();
  const { state } = useLocation();

  const isMounted = useRef(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [number, setNumber] = useState<number>(1);
  const [query, setQuery] = useState<string>(`keyword=${state}`);
  const [search, setSearch] = useState<string>(state);

  const { data, isSuccess, isLoading, isError, error } = useGetAllCommentsQuery(query);

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
      setNumber(currentPage);
      if (+params.page > 1) {
        navigate(`/dash/comments/search/?${queryStr}`);
      } else {
        navigate(`/dash/comments/search/?keyword=${debounced}`);
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

  useEffect(() => {
    if (error?.data?.message === 'PageError') {
      setCurrentPage(1);
    }
  }, [error]);

  let content = <></>;
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }
  if (isLoading) content = <PulseLoader color={'#000'} />;

  if (isSuccess) {
    const resultPerPage = data?.resultPerPage;
    // const postsCount = data?.postsCount;
    const filteredCommentsCount = data?.filteredCommentsCount;

    const ids = data?.ids;

    const tableContent = ids?.map((commentId: EntityId, index: number) => (
      <DashComment
        key={commentId}
        comment={data.entities[commentId]}
        number={index + (number * resultPerPage - (resultPerPage - 1))}
        comments={data.comments}
      />
    ));
    if (data.filteredCommentsCount) {
      content = (
        <>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Comments Search by : {search}</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <Link to="/dash">Home</Link>
                    </li>
                    <li className="breadcrumb-item active">commentsList</li>
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
                          <th>Text</th>
                          <th>Post</th>
                          <th>Author</th>
                          <th>Parent Comm</th>
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
            <div className="row">
              <div className="col-4 paginationBox">
                {resultPerPage < filteredCommentsCount ? (
                  <div className="col-4 paginationBox">
                    <Pagination
                      activePage={currentPage}
                      itemsCountPerPage={resultPerPage}
                      totalItemsCount={filteredCommentsCount}
                      onChange={setCurrentPageNo}
                      nextPageText="Next"
                      prevPageText="Prev"
                      firstPageText="1st"
                      lastPageText="Last"
                      itemClass="page-item"
                      linkClass="page-link"
                      activeClass="pageItemActive"
                      activeLinkClass="pageLinkActive"
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </>
      );
    } else {
      content = <h1>There are not comments by: {search}</h1>;
    }
  }

  return <>{content}</>;
};

export default DashSearchComment;
