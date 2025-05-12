import React, { useEffect } from 'react';
import useTitle from '../../../hooks/useTitle';
import { useGetPostsByParamQuery } from '../../../features/posts/postsApiSlice';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';
import { Link, useLocation } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import useAuth from '../../../hooks/useAuth';

const AuthorMain = () => {
  const { id: userId, username } = useAuth();

  useTitle(`Author Page by : ${username}`);

  const param = ' UID';

  const {
    data,
    isSuccess: isSuccessPosts,
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    refetch,
  } = useGetPostsByParamQuery({
    param: userId + param,
    query: '',
  });

  const location = useLocation();

  useEffect(() => {
    if (location.state?.successNewPost || location.state?.successDelPost) {
      refetch();
    }
  }, [location.state?.successNewPost, location.state?.successDelPost, refetch]);

  //from NewPost
  useCreateAndRemoveToast(
    location.state?.successNewPost,
    location.state?.messageNewPost ?? 'Post created',
    'success',
  );
  //from DelPost
  useCreateAndRemoveToast(
    location.state?.successDelPost,
    location.state?.messageDelPost ?? 'Post deleted',
    'success',
  );

  useCreateAndRemoveToast(isErrorPost, errorPost?.data?.message || 'Server Error Posts', 'error');

  let postsContent;

  if (isLoadingPost) postsContent = <PulseLoader color={'#000'} />;

  if (isErrorPost) {
    postsContent = <p className="errmsg">{errorPost?.data?.message}</p>;
  }

  if (isSuccessPosts) {
    postsContent = (
      <div className="inner">
        <h3>{data.postsCount}</h3>
        <p>Posts</p>
      </div>
    );
  }

  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Home Page</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="row">
          <div className="col-lg-3 col-6">
            <div className="small-box bg-success">
              <div className="inner">
                {postsContent}
                <div className="icon">
                  <i className="fas fa-edit"></i>
                </div>
              </div>
              <Link to="/author/posts" className="small-box-footer">
                More info <i className="fas fa-arrow-circle-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AuthorMain;
