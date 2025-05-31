import { Link, useParams } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';
import ReactPlayer from 'react-player/youtube';
import Sidebar from '../../components/public/Sidebar';
import { useGetSingleVideoQuery } from './videosApiSlice';
import { PulseLoader } from 'react-spinners';

const VideosItem = () => {
  useTitle('Video Player');
  const { id } = useParams();

  const { data, isLoading, isError, isSuccess, error } = useGetSingleVideoQuery({
    query: id ?? '',
  });

  const videoUrl = data?.video.videoUrl;

  let content = <></>;
  if (isLoading) content = <PulseLoader color="#000" />;

  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;

  if (isSuccess) {
    content = (
      <section className="single-blog-area">
        <div className="container">
          <div className="row mt-3 breadcrumbs-search">
            <div className="videos-breadcrumbs col-md-8">
              <Link to="/">Home</Link> / <Link to="/videos">videosList</Link> /{' '}
              <span className="videos-span">videoItem</span>
            </div>
            <div className="col-md-4 category-posts  justify-content-end"></div>
          </div>
          <div className="row  posts-align">
            <div className="col-md-8 blog-post-area posts-center">
              <div className="row " style={{ marginBottom: 20 }}>
                <ReactPlayer
                  light
                  url={videoUrl}
                  //  width="100%" height="440px"
                  playing
                  controls
                  style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
                />
                <h4 style={{ fontWeight: 500, marginTop: 40 }}>
                  <span>
                    Views: <span className="author-name">{data?.video.views}</span>
                  </span>
                </h4>
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

export default VideosItem;
