import useTitle from '../../hooks/useTitle';
import { useGetVideosQuery } from './videosApiSlice';
import { Link } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import Sidebar from '../../components/public/Sidebar';
import { EntityId } from '@reduxjs/toolkit';
import { useCreateAndRemoveToast } from '../../hooks/useCreateAndRemoveToast';

const VideosList = () => {
  useTitle('Video List');

  const { data, isLoading, isSuccess, isError, error } = useGetVideosQuery('videosList');

  useCreateAndRemoveToast(isError, error?.data?.message || error?.status, 'error');

  let content = <></>;

  if (isLoading) content = <PulseLoader color={'#000'} />;

  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;

  let videosCount = 0;

  if (isSuccess) {
    videosCount = data?.videosCount ?? 0;

    const ids = data.ids;

    if (videosCount > 0) {
      content = (
        <div className="row posts-align">
          <ul className="videos-list">
            {ids?.map((videoId: EntityId, index) => (
              <Link className="videos-link" to={`/videos/${videoId}`} key={videoId}>
                <span className="videos-span">{index + 1}.</span>
                <li className="videos-item">{data?.entities[videoId]?.title}</li>
              </Link>
            ))}
          </ul>
        </div>
      );
    }
  }

  return (
    <section className="single-blog-area">
      <div className="container">
        <div className="row mt-3 breadcrumbs-search">
          <div className="videos-breadcrumbs col-md-8">
            <Link to="/">Home</Link> / <span className="videos-span">videosList</span>
          </div>
          <div className="col-md-4 category-posts  justify-content-end"></div>
        </div>

        <div className="row  posts-align">
          <div className="col-md-8 blog-post-area posts-center">
            <div className="row  posts-align" style={{ marginBottom: 20 }}>
              {videosCount > 0 ? (
                <>
                  <h1>Blog's Videos</h1>
                  {content}
                </>
              ) : (
                <h1>There are not videos</h1>
              )}
            </div>
          </div>
          <Sidebar />
        </div>
      </div>
    </section>
  );
};

export default VideosList;
