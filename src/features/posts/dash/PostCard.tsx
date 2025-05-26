import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import useTitle from '../../../hooks/useTitle';
import { useGetPostsQuery } from '../postsApiSlice';
import { PulseLoader } from 'react-spinners';
import HTMLStringToJSX from '../../../components/dash/HTMLStringToJSX';
import { useGetCommentsQuery, useDeleteCommentMutation } from '../../comments/commentsApiSlice';
import { findPostComments } from '../../../utils/findPostComments';
import { createCommentsPostTree } from '../../../utils/createCommentsPostTree';
import DashCommentForCardPost from '../../../components/dash/DashCommentForCardPost';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';

const PostCard = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const { id } = useParams();

  useTitle('Post Card Page');

  const [mode, setMode] = useState<'dash' | 'author'>('dash');

  useEffect(() => {
    if (location.pathname.includes('dash')) setMode('dash');
    else if (location.pathname.includes('author')) setMode('author');
  }, [location]);

  const { post, isLoading, isSuccess, isError, error } = useGetPostsQuery(`postsList`, {
    selectFromResult: ({ data, isLoading, isSuccess, isError, error }) => ({
      post: data?.entities[id ?? ''],
      isLoading,
      isSuccess,
      isError,
      error,
    }),
  });

  const { postComments, isSuccessComm } = useGetCommentsQuery('commentsList', {
    selectFromResult: ({ data, isSuccess }) => ({
      postComments: findPostComments(data?.entities, data?.ids, id),
      isSuccessComm: isSuccess,
    }),
  });

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
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }
  if (isLoading) content = <PulseLoader color={'#000'} />;

  const commentsTree = createCommentsPostTree(postComments);

  let commentsHtml = undefined;
  if (commentsTree.length > 0) {
    commentsHtml = (
      <DashCommentForCardPost
        commentsTree={commentsTree}
        onDeleteCommentClicked={(id) => onDeleteCommentClicked(id)}
      />
    );
  }

  if (isSuccess) {
    let status = '';
    status =
      post?.user?.roles !== undefined && post?.user?.roles.includes('Author') ? 'Author' : 'User';
    status =
      post?.user?.roles !== undefined && post?.user?.roles.includes('Admin') ? 'Admin' : status;

    content = (
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-5">
            <div className="col-sm-6">
              <h1>Post :{post?.title}</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dash">Home</Link>
                </li>
                <li className="breadcrumb-item active">postCard</li>
              </ol>
            </div>
          </div>
          <div className="col-md-10">
            <div className="card card-widget">
              <div className="card-header">
                <div className="user-block">
                  <img className="img-circle" src={post?.user.avatar?.url} alt="User" />
                  <span className="username">
                    <Link to={`/dash/users/user/${post?.user._id}`}>
                      {post?.user.username}. Role: {status}
                    </Link>
                  </span>
                  <span className="description">
                    Date publicly -{' '}
                    {new Date(post?.createdAt ?? '').toLocaleString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="description">Category publicly -{post?.category.title}</span>
                </div>
                <div className="card-tools">
                  <div className="text-right">
                    <Link
                      className="btn btn-info btn-sm"
                      to={`/${mode}/posts/edit/${post?.id}`}
                      // state={{ page: location.state.page }}
                      style={{ color: 'white' }}
                    >
                      <i className="fas fa-pencil-alt"></i>
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <img className="img-fluid pad" src={post?.imageUrl.url} alt="img" />

                <div className="main-container">
                  <div className="editor-container editor-container_classic-editor">
                    <div className={`editor-container__editor `}>
                      <HTMLStringToJSX str={post?.text} />
                    </div>
                  </div>
                </div>
                <span className="float-right text-muted">
                  {post?.likes.count} like(s) - {postComments.length} comment(s)
                </span>
              </div>
              <div className="card-footer card-comments">{isSuccessComm && commentsHtml}</div>
              <div className="card-footer">
                {/* <form action="#" method="post">
                  <img
                    className="img-fluid img-circle img-sm"
                    src="../dist/img/user4-128x128.jpg"
                    alt="Alt Text"
                  />
                  <div className="img-push">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Press enter to post comment"
                    />
                  </div>
                </form> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <>{content}</>;
};
export default PostCard;
