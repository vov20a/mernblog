import React, { useEffect, useRef, useState } from 'react';
import { useDeleteUserMutation, useGetAllUsersQuery } from '../usersApiSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import DashUser from './DashUser';
import { EntityId } from '@reduxjs/toolkit';
import Pagination from 'react-js-pagination';
import { useDebounce } from '../../../hooks/debounce';
import useTitle from '../../../hooks/useTitle';
import qs from 'qs';
import SearchForm from '../../../components/public/SearchForm';
import useAuth from '../../../hooks/useAuth';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';

const DashSearch = () => {
  useTitle('Search Users');

  const navigate = useNavigate();

  const { id: currentUserId } = useAuth();

  const { state } = useLocation();

  const isMounted = useRef(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [number, setNumber] = useState<number>(1);
  const [query, setQuery] = useState<string>(`keyword=${state}`);
  const [search, setSearch] = useState<string>(state);

  // console.log(currentPage);

  const { data, isSuccess, isLoading, isError, error } = useGetAllUsersQuery(query);

  const [
    deleteUser,
    {
      data: user,
      isLoading: isDelLoading,
      isSuccess: isDelsuccess,
      isError: isDelerror,
      error: delerror,
    },
  ] = useDeleteUserMutation();
  // console.log(data);

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
        navigate(`/dash/users/search/?${queryStr}`);
      } else {
        navigate(`/dash/users/search/?keyword=${debounced}`);
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

  const onDeleteUserClicked = async (id: string) => {
    await deleteUser({ id });
  };
  //после удаления user -идем на home
  useEffect(() => {
    if (isDelsuccess) {
      navigate('/dash', { state: { successDel: isDelsuccess, messageDel: user?.message } });
    }
  }, [navigate, isDelsuccess, user]);

  useEffect(() => {
    if (error?.data?.message === 'PageError') {
      setCurrentPage(1);
    }
  }, [error]);

  useCreateAndRemoveToast(isDelerror, delerror?.data?.message, 'error');

  let content = <></>;
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }
  if (isLoading || isDelLoading) content = <PulseLoader color={'#000'} />;

  if (isSuccess) {
    const resultPerPage = data?.resultPerPage;

    const filteredUsersCount = data?.filteredUsersCount;

    const ids = data?.ids;

    const tableContent = ids?.map((userId: EntityId, index: number) => (
      <DashUser
        key={userId}
        user={data.entities[userId]}
        number={index + (number * resultPerPage - (resultPerPage - 1))}
        currentUserId={currentUserId}
        onDeleteUserClicked={(id) => onDeleteUserClicked(id)}
      />
    ));
    if (data.filteredUsersCount) {
      content = (
        <>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Search Users By:' {search}'</h1>
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
              <div className=" row mb-2">
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
                          <th>Name</th>
                          <th>Email</th>
                          <th>Posts№</th>
                          <th>Roles</th>
                          <th>Avatar</th>
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
            {resultPerPage < filteredUsersCount ? (
              <div className="col-4 paginationBox">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={filteredUsersCount}
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
      content = <h1>There are not users by: {search}</h1>;
    }
  }

  return <>{content}</>;
};

export default DashSearch;
