import React, { useEffect, useRef, useState } from 'react';
import useTitle from '../../../hooks/useTitle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDeleteCommentMutation, useGetAllCommentsQuery } from '../commentsApiSlice';
import qs from 'qs';
import { useDebounce } from '../../../hooks/debounce';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';
import { PulseLoader } from 'react-spinners';
import { EntityId } from '@reduxjs/toolkit';
import DashComment from './DashComment';
import Pagination from 'react-js-pagination';
import SearchForm from '../../../components/public/SearchForm';

const CommentsList = () => {
  useTitle('Comments List');

  const navigate = useNavigate();

  const isMounted = useRef(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [number, setNumber] = useState<number>(1);
  const [query, setQuery] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const { data, isSuccess, isLoading, isError, error } = useGetAllCommentsQuery(query);

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
        navigate(`/dash/comments/?${queryStr}`);
      } else {
        navigate(`/dash/comments`);
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
      navigate('/dash/comments/search', { state: debounced });
    }
  }, [debounced, navigate]);

  const [
    deleteComment,
    { data: comment, isSuccess: isDelsuccess, isError: isDelerror, error: delerror },
  ] = useDeleteCommentMutation();

  const onDeleteCommentClicked = async (id: string) => {
    await deleteComment({ id });
  };
  //после удаления comment -идем на home
  useEffect(() => {
    if (isDelsuccess) {
      navigate('/dash', {
        state: { successDelComment: isDelsuccess, messageDelComment: comment?.message },
      });
    }
  }, [navigate, isDelsuccess, comment]);

  useCreateAndRemoveToast(isDelerror, delerror?.data?.message, 'error');

  let content = <></>;

  useCreateAndRemoveToast(isError, error?.data?.message || 'Server Error', 'error');

  if (isLoading) content = <PulseLoader color={'#000'} />;

  const location = useLocation();
  //from addNewComment
  useCreateAndRemoveToast(
    location.state?.successNewComment,
    location.state?.messageNewComment ?? 'Comment created',
    'success',
  );
  //from EditComment
  useCreateAndRemoveToast(
    location.state?.successEditComment,
    location.state?.messageEditComment ?? 'Comment updated',
    'success',
  );

  let commentsCount = 0;
  if (isSuccess) {
    const resultPerPage = data?.resultPerPage;
    commentsCount = data?.commentsCount;

    const ids = data?.ids;

    const tableContent =
      ids?.length > 0 &&
      ids.map((commentId: EntityId, index) => (
        <DashComment
          key={commentId}
          comment={data.entities[commentId]}
          number={index + (number * resultPerPage - (resultPerPage - 1))}
          page={currentPage}
          comments={data.comments}
          onDeleteCommentClicked={onDeleteCommentClicked}
        />
      ));
    if (commentsCount) {
      content = (
        <>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Comments List</h1>
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
                          <th>User</th>
                          <th>Parent Comment</th>
                          <th>Likes</th>
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
              {resultPerPage < commentsCount ? (
                <div className="col-12 paginationBox">
                  <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resultPerPage}
                    totalItemsCount={commentsCount}
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
        </>
      );
    } else {
      content = <h1>There are not comments</h1>;
    }
  }
  return <>{content}</>;
};

export default CommentsList;
