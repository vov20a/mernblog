import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDeleteVideoMutation, useGetVideosQuery } from '../videosApiSlice';
import { PulseLoader } from 'react-spinners';
import { EntityId } from '@reduxjs/toolkit';
import DashVideo from './DashVideo';
import useTitle from '../../../hooks/useTitle';
import { useDebounce } from '../../../hooks/debounce';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';
import SearchForm from '../../../components/public/SearchForm';

const DashSearch = () => {
  useTitle('Search Videos List');

  const navigate = useNavigate();

  const { state: debounce } = useLocation();

  const [search, setSearch] = useState<string>(debounce);

  const { data, isSuccess, isLoading, isError, error } = useGetVideosQuery(search);

  const [
    deleteVideo,
    {
      data: video,
      isLoading: isDelLoading,
      isSuccess: isDelsuccess,
      isError: isDelerror,
      error: delerror,
    },
  ] = useDeleteVideoMutation();

  const debounced = useDebounce(search, 500);
  useEffect(() => {
    if (debounced.length > 2) {
      navigate('/dash/videos/search', { state: debounced });
    }
  }, [debounced, navigate]);

  const onDeleteVideoClicked = async (id: string) => {
    await deleteVideo({ id });
  };

  //после удаления video -идем на home
  useEffect(() => {
    if (isDelsuccess) {
      navigate('/dash', { state: { successDelVideo: isDelsuccess, messageDel: video?.message } });
    }
  }, [navigate, isDelsuccess, video]);

  let content = <></>;

  useCreateAndRemoveToast(isError, error?.data?.message || error?.status, 'error');

  useCreateAndRemoveToast(isDelerror, delerror?.data?.message, 'error');

  if (isLoading || isDelLoading) content = <PulseLoader color={'#000'} />;

  let videosCount = 0;
  if (isSuccess) {
    videosCount = data?.videosCount;

    const ids = data?.ids;

    const tableContent =
      ids?.length &&
      ids.map((videoId: EntityId, index) => (
        <DashVideo
          key={videoId}
          video={data.entities[videoId]}
          number={index + 1}
          onDeleteVideoClicked={(id) => onDeleteVideoClicked(id)}
        />
      ));
    if (videosCount) {
      content = (
        <>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Videos List</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <Link to="/dash">Home</Link>
                    </li>
                    <li className="breadcrumb-item active">videosList</li>
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
                          <th>Video_Id</th>
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
          </div>
        </>
      );
    } else {
      content = <h1>There are not videos</h1>;
    }
  }

  return <>{content}</>;
};

export default DashSearch;
