import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAddNewVideoMutation } from '../videosApiSlice';
import useTitle from '../../../hooks/useTitle';
import { PulseLoader } from 'react-spinners';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';

const TITLE_REGEX = /^[A-zА-я0-9.\-!@#$%,|\s?]{3,}$/;
const VIDEOID_REGEX = /^[A-z0-9.!@#$%,]{4,20}$/;

const NewVideo = () => {
  useTitle('New Video Page');

  const navigate = useNavigate();

  const [addNewVideo, { data, isLoading, isSuccess, isError, error }] = useAddNewVideoMutation();

  const [title, setTitle] = useState('');
  const [validTitle, setValidTitle] = useState(false);
  const [videoId, setVideoId] = useState('');
  const [validVideoId, setValidVideoId] = useState(false);

  useEffect(() => {
    setValidTitle(TITLE_REGEX.test(title));
  }, [title]);

  useEffect(() => {
    setValidVideoId(VIDEOID_REGEX.test(videoId));
  }, [videoId]);

  useEffect(() => {
    if (isSuccess) {
      setTitle('');
      setVideoId('');
      navigate('/dash', { state: { successNew: isSuccess, messageNew: data?.message } });
    }
  }, [isSuccess, navigate, data?.message]);

  useEffect(() => {
    if (isError) {
      setTitle(title);
      setVideoId(videoId);
    }
  }, [isError, title, videoId]);

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onVideoIdChanged = (e: React.ChangeEvent<HTMLInputElement>) => setVideoId(e.target.value);

  const canSave = [validTitle, validVideoId].every(Boolean) && !isLoading;

  const onSaveVideoClicked = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canSave) {
      await addNewVideo({
        title,
        youtubeId: videoId,
      });
    }
  };

  const errClass = isError ? 'errmsg' : 'offscreen';
  const validTitleClass = !validTitle ? 'form__input--incomplete' : '';
  const validVideoIdClass = !validVideoId ? 'form__input--incomplete' : '';

  useCreateAndRemoveToast(isError, error?.data?.message, 'error');

  useCreateAndRemoveToast(isSuccess, data?.message as string, 'success');

  let content = <></>;
  if (isLoading) content = <PulseLoader color={'#000'} />;
  else {
    content = (
      <div className="card card-primary" style={{ boxShadow: 'none', backgroundColor: '#f4f6f9' }}>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Create New Video</h1>
                <p className={errClass}>{error?.data?.message}</p>
                {/* <p style={{ color: 'green' }}>{data?.message}</p> */}
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/dash">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">newVideo</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <form className="form" onSubmit={onSaveVideoClicked}>
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

export default NewVideo;
