import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetVideosQuery, useUpdateVideoMutation } from '../videosApiSlice';
import useTitle from '../../../hooks/useTitle';
import { PulseLoader } from 'react-spinners';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';
import { IVideoType } from '../../../types/IVideoType';

const TITLE_REGEX = /^[A-zА-я0-9.\-!@#$%,|\s?]{3,}$/;
const VIDEOID_REGEX = /^[A-z0-9.!@#$%,]{4,20}$/;

const EditVideo = () => {
  useTitle('Edit Video Page');

  const { id } = useParams();

  const { video } = useGetVideosQuery(`videosList`, {
    selectFromResult: ({ data }) => ({
      video: id ? data?.entities[id] : ({} as IVideoType),
    }),
  });

  const navigate = useNavigate();

  const [updateVideo, { data, isLoading, isSuccess, isError, error }] = useUpdateVideoMutation();

  const [title, setTitle] = useState<string | undefined>(video?.title);
  const [validTitle, setValidTitle] = useState(false);
  const [videoId, setVideoId] = useState<string | undefined>(
    video?.videoUrl.replace('https://www.youtube.com/embed/', ''),
  );
  const [validVideoId, setValidVideoId] = useState(false);

  useEffect(() => {
    setValidTitle(TITLE_REGEX.test(title ?? ''));
  }, [title]);

  useEffect(() => {
    setValidVideoId(VIDEOID_REGEX.test(videoId ?? ''));
  }, [videoId]);

  useEffect(() => {
    if (isError) {
      setTitle(title);
      setVideoId(videoId);
    }
  }, [isError, title, videoId]);

  useEffect(() => {
    if (isSuccess) {
      setTitle('');
      setVideoId('');
      navigate('/dash/videos', {
        state: {
          successEdit: isSuccess,
          messageEdit: data?.message,
        },
      });
    }
  }, [isSuccess, navigate, data?.message]);

  useCreateAndRemoveToast(isError, error?.data?.message ?? 'Error updated', 'error');

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onVideoIdChanged = (e: React.ChangeEvent<HTMLInputElement>) => setVideoId(e.target.value);

  const canSave = [validTitle, validVideoId].every(Boolean) && !isLoading;

  const onUpdateVideoClicked = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canSave) {
      await updateVideo({
        id: video?.id ?? '',
        title: title ?? '',
        youtubeId: videoId ?? '',
      });
    }
  };

  const errClass = isError ? 'errmsg' : 'offscreen';
  const validTitleClass = !validTitle ? 'form__input--incomplete' : '';
  const validVideoIdClass = !validVideoId ? 'form__input--incomplete' : '';

  let content = <></>;
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }
  if (isLoading) content = <PulseLoader color={'#000'} />;
  else {
    content = (
      <div className="card card-primary" style={{ boxShadow: 'none', backgroundColor: '#f4f6f9' }}>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Update Video</h1>
                <p className={errClass}>{error?.data?.message}</p>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/dash">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">editVideo</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <form className="form" onSubmit={onUpdateVideoClicked}>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="exampleInputName1">User name</label>
              <input
                type="text"
                className={`form-control form__input ${validTitleClass}`}
                id="exampleInputName1"
                placeholder="Enter title"
                value={title}
                onChange={onTitleChanged}
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Video Id</label>
              <input
                type="text"
                className={`form-control form__input ${validVideoIdClass}`}
                id="exampleInputEmail1"
                placeholder="Enter youtube id"
                value={videoId}
                onChange={onVideoIdChanged}
              />
            </div>
          </div>

          <div className="ml-4 ">
            <button type="submit" className="btn btn-primary" disabled={!canSave}>
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
  return <>{content}</>;
};

export default EditVideo;
