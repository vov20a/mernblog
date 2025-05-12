import { Link, useLocation } from 'react-router-dom';
import { useGetUsersQuery } from '../../features/users/usersApiSlice';
import { PulseLoader } from 'react-spinners';
import { useGetPostsQuery } from '../../features/posts/postsApiSlice';
import useTitle from '../../hooks/useTitle';
import { useCreateAndRemoveToast } from '../../hooks/useCreateAndRemoveToast';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApiSlice';
import { useGetCommentsQuery } from '../../features/comments/commentsApiSlice';
import { useEffect, useState } from 'react';
import { IComment } from '../../types/IComment';

const Main = () => {
  useTitle('Admin Page');

  const [commArrError, setCommArrError] = useState<(IComment | undefined)[]>([]);

  const { countUsers, isSuccessUsers, isLoadingUser, isErrorUser, errorUser } = useGetUsersQuery(
    'usersList',
    {
      selectFromResult: ({ data, isSuccess, isLoading, isError, error }) => ({
        countUsers: data?.usersCount,
        isSuccessUsers: isSuccess,
        isLoadingUser: isLoading,
        isErrorUser: isError,
        errorUser: error,
      }),
    },
  );

  const { idsPosts, countPosts, isSuccessPosts, isLoadingPost, isErrorPost, errorPost } =
    useGetPostsQuery('postsList', {
      selectFromResult: ({ data, isSuccess, isLoading, isError, error }) => ({
        countPosts: data?.postsCount,
        isSuccessPosts: isSuccess,
        isLoadingPost: isLoading,
        isErrorPost: isError,
        errorPost: error,
        idsPosts: data?.ids,
      }),
    });

  const {
    countCategories,
    isSuccessCategories,
    isLoadingCategories,
    isErrorCategories,
    errorCategories,
  } = useGetCategoriesQuery('categoriesList', {
    selectFromResult: ({ data, isSuccess, isLoading, isError, error }) => ({
      countCategories: data?.ids?.length,
      isSuccessCategories: isSuccess,
      isLoadingCategories: isLoading,
      isErrorCategories: isError,
      errorCategories: error,
    }),
  });
  const {
    countComments,
    isSuccessComments,
    isLoadingComments,
    isErrorComments,
    errorComments,
    dataComments,
    refetch: refrechComm,
  } = useGetCommentsQuery('commentsList', {
    selectFromResult: ({ data, isSuccess, isLoading, isError, error }) => ({
      countComments: data?.commentsCount,
      isSuccessComments: isSuccess,
      isLoadingComments: isLoading,
      isErrorComments: isError,
      errorComments: error,
      dataComments: data,
    }),
  });

  const location = useLocation();
  //from DelUser
  useCreateAndRemoveToast(
    location.state?.successDel,
    location.state?.messageDel ?? 'User deleted',
    'success',
  );

  //from NewUser
  useCreateAndRemoveToast(
    location.state?.successNew,
    location.state?.messageNew ?? 'User created',
    'success',
  );
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
  //from DelComment
  useCreateAndRemoveToast(
    location.state?.successDelComment,
    location.state?.messageDelComment ?? 'Comment deleted',
    'success',
  );

  useEffect(() => {
    refrechComm();
  }, [countPosts, refrechComm]);

  //check comments for posts
  useEffect(() => {
    const arr = [];
    for (let comId of dataComments?.ids ?? []) {
      if (
        dataComments?.entities[comId]?.post === null &&
        !idsPosts?.includes(dataComments?.entities[comId]?.post as unknown as string)
      ) {
        arr.push(dataComments?.entities[comId]);
      }
      setCommArrError(arr);
    }
  }, [dataComments, idsPosts]);

  let commErrContent = undefined;
  if (commArrError && commArrError?.length > 0) {
    commErrContent = commArrError.map((comm) => <div key={comm?._id}>{comm?._id}</div>);
  }

  let usersContent;

  if (isLoadingUser) usersContent = <PulseLoader color={'#000'} />;

  if (isErrorUser) {
    usersContent = <p className="errmsg">{errorUser?.data?.message}</p>;
  }

  if (isSuccessUsers) {
    usersContent = (
      <div className="inner">
        <h3>{countUsers ?? 0}</h3>
        <p>Users</p>
      </div>
    );
  }
  let postsContent;

  if (isLoadingPost) postsContent = <PulseLoader color={'#000'} />;

  if (isErrorPost) {
    postsContent = <p className="errmsg">{errorPost?.data?.message}</p>;
  }

  if (isSuccessPosts) {
    postsContent = (
      <div className="inner">
        <h3>{countPosts ?? 0}</h3>
        <p>Posts</p>
      </div>
    );
  }

  let categoriesContent = <></>;

  if (isLoadingCategories) categoriesContent = <PulseLoader color={'#000'} />;

  if (isErrorCategories) {
    categoriesContent = <p className="errmsg">{errorCategories?.data?.message}</p>;
  }

  if (isSuccessCategories) {
    categoriesContent = (
      <div className="inner">
        <h3>{countCategories ?? 0}</h3>
        <p>Categories</p>
      </div>
    );
  }
  let commentsContent = <></>;

  if (isLoadingComments) commentsContent = <PulseLoader color={'#000'} />;

  if (isErrorComments) {
    commentsContent = <p className="errmsg">{errorComments?.data?.message}</p>;
  }

  if (isSuccessComments) {
    commentsContent = (
      <div className="inner">
        <h3>{countComments ?? 0}</h3>
        <p>Comments</p>
      </div>
    );
  }
  useCreateAndRemoveToast(isErrorPost, errorPost?.data?.message || 'Server Error Posts', 'error');
  useCreateAndRemoveToast(isErrorUser, errorUser?.data?.message || 'Server Error User', 'error');
  useCreateAndRemoveToast(
    isErrorCategories,
    errorCategories?.data?.message || 'Server Error Cats',
    'error',
  );
  useCreateAndRemoveToast(
    isErrorComments,
    errorComments?.data?.message || 'Server Error Comm',
    'error',
  );
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
            <div className="small-box bg-info">
              {usersContent}
              <div className="icon">
                <i className="fas fa-user"></i>
              </div>
              <Link to="/dash/users" className="small-box-footer">
                More info <i className="fas fa-arrow-circle-right"></i>
              </Link>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="small-box bg-success">
              <div className="inner">
                {postsContent}
                <div className="icon">
                  <i className="fas fa-edit"></i>
                </div>
              </div>
              <Link to="/dash/posts" className="small-box-footer">
                More info <i className="fas fa-arrow-circle-right"></i>
              </Link>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="small-box bg-warning">
              {categoriesContent}
              <div className="icon">
                <i className="fas fa-chart-pie"></i>
              </div>
              <Link to="/dash/categories" className="small-box-footer">
                More info <i className="fas fa-arrow-circle-right"></i>
              </Link>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="small-box bg-danger">
              {commentsContent}
              <div className="icon">
                <i className="fas fa-comments"></i>
              </div>
              <Link to="/dash/comments" className="small-box-footer">
                More info <i className="fas fa-arrow-circle-right"></i>
              </Link>
            </div>
          </div>
          {commArrError && commArrError?.length > 0 && (
            <>
              <p className="errmsg">Delete this comments</p>
              <div className="">{commErrContent}</div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Main;
