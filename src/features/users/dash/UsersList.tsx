import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDeleteUserMutation, useGetAllUsersQuery } from '../usersApiSlice';
import { PulseLoader } from 'react-spinners';
import { EntityId } from '@reduxjs/toolkit';
import Pagination from 'react-js-pagination';
import DashUser from './DashUser';
import useTitle from '../../../hooks/useTitle';
import qs from 'qs';
import { useDebounce } from '../../../hooks/debounce';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';
import SearchForm from '../../../components/public/SearchForm';
import useAuth from '../../../hooks/useAuth';

const UsersList = () => {
  useTitle('Users List');

  const { id: currentUserId } = useAuth();

  const navigate = useNavigate();

  const isMounted = useRef(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [number, setNumber] = useState<number>(1);
  const [query, setQuery] = useState<string>('');
  const [search, setSearch] = useState<string>('');

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
        navigate(`/dash/users/?${queryStr}`);
      } else {
        navigate(`/dash/users`);
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
      navigate('/dash/users/search', { state: debounced });
    }
  }, [debounced, navigate]);

  const onDeleteUserClicked = async (id: string) => {
    await deleteUser({ id });
  };
  //после удаления user -идем на home
  useEffect(() => {
    if (isDelsuccess) {
      navigate('/dash', { state: { successDel: isDelsuccess, messageDel: user?.message } });
    }
  }, [navigate, isDelsuccess, user]);

  let content = <></>;

  useCreateAndRemoveToast(isError, error?.data?.message || error?.status, 'error');

  useCreateAndRemoveToast(isDelerror, delerror?.data?.message, 'error');

  if (isLoading || isDelLoading) content = <PulseLoader color={'#000'} />;

  // useCreateAndRemoveToast(isDelLoading, 'Please wait! Deleting....');

  // useCreateAndRemoveToast(isDelsuccess, user?.message as string, 'success');

  const location = useLocation();
  //from EditUser
  useCreateAndRemoveToast(
    location.state?.successEdit,
    location.state?.messageEdit ?? 'User updated',
    'success',
  );

  let usersCount = 0;
  if (isSuccess) {
    const resultPerPage = data?.resultPerPage;
    usersCount = data?.usersCount;

    const ids = data?.ids;

    const tableContent =
      ids?.length &&
      ids.map((userId: EntityId, index) => (
        <DashUser
          key={userId}
          user={data.entities[userId]}
          number={index + (number * resultPerPage - (resultPerPage - 1))}
          page={currentPage}
          currentUserId={currentUserId}
          onDeleteUserClicked={(id) => onDeleteUserClicked(id)}
        />
      ));
    if (usersCount) {
      content = (
        <>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Users List</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <Link to="/dash">Home</Link>
                    </li>
                    <li className="breadcrumb-item active">usersList</li>
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
                          <th>Name</th>
                          <th>Email</th>
                          <th>Post№</th>
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
            <div className="row">
              {resultPerPage < usersCount ? (
                <div className="col-12 paginationBox">
                  <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resultPerPage}
                    totalItemsCount={usersCount}
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
      content = <h1>There are not users</h1>;
    }
  }

  return <>{content}</>;
};

export default UsersList;
