import React, { useEffect } from 'react';
import { IComment } from '../../types/IComment';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useGetSinglePostQuery } from '../../features/posts/postsApiSlice';
import { useCreateCommentArray } from '../../hooks/createCommentArray';
import { IPostType } from '../../types/IPostType';
import { PulseLoader } from 'react-spinners';
import { useCreateAndRemoveToast } from '../../hooks/useCreateAndRemoveToast';
import { useUpdateLikeCommentMutation } from '../../features/comments/commentsApiSlice';
import useAuth from '../../hooks/useAuth';

interface CommentProps {
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  setParent: (val: IComment) => void;
  setParentNull: (val: boolean) => void;
  post: IPostType;
  refetchComm: boolean;
  setRefetchComm: (val: boolean) => void;
  setComments: (comm: IComment[]) => void;
}

const CommentsForCardPost = ({
  post,
  inputRef,
  setParent,
  refetchComm,
  setParentNull,
  setRefetchComm,
  setComments,
}: CommentProps) => {
  const { comments, isLoading, isSuccess, isError, error, refetch } = useGetSinglePostQuery(
    { query: post._id ?? '', comm: 'only_comm' },
    {
      selectFromResult: ({ data, isLoading, isSuccess, isError, error }) => ({
        comments: data?.comments,
        isLoading,
        isSuccess,
        isError,
        error,
      }),
    },
  );

  useEffect(() => {
    if (isSuccess) {
      setComments(comments ?? []);
    }
  }, [isSuccess, comments, setComments]);

  useCreateAndRemoveToast(isError, error?.data?.message || error?.status, 'error');

  const commentsTree = useCreateCommentArray(comments ? comments : []);

  const setFocusParentClick = (parent: IComment) => {
    inputRef.current?.focus();
    setParent(parent);
    setParentNull(false);
  };

  const [
    editLike,
    { data: likes, isSuccess: isLikeSuccess, isError: isLikeError, error: likeError },
  ] = useUpdateLikeCommentMutation();

  useEffect(() => {
    if (refetchComm) {
      refetch();
      setRefetchComm(false);
    }
    if (likes) {
      refetch();
    }
  }, [refetchComm, refetch, setRefetchComm, likes]);

  const { id: userId } = useAuth();

  const updateLikes = (id: string) => {
    const params = { id: id, user: userId };
    // console.log(params);
    editLike(params);
  };

  useCreateAndRemoveToast(isLikeError, likeError?.data?.message || error?.status, 'error');

  useCreateAndRemoveToast(isLikeSuccess, likes?.message ?? '', 'success');

  const parts: React.ReactNode[] = [];

  for (const item of commentsTree) {
    parts.push(
      <li key={item?._id}>
        {item.children.length === 0 ? (
          <article className="comment">
            <header className="comment-author">
              <img src={item?.user?.avatar?.url} alt="avatar" className="comment-avatar" />
            </header>
            <section className="comment-details">
              <div className="author-name">
                <h5>
                  <Link to={`/user/${item.user._id}`}>{item?.user.username}</Link>
                </h5>
                <p>
                  {' '}
                  {new Date(item?.createdAt ?? '').toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="reply">
                <p>
                  <span>
                    <Button onClick={() => updateLikes(item._id)} className="button-reply">
                      <i className="fa fa-thumbs-up" aria-hidden="true"></i>
                    </Button>
                    {item.likes.count}
                  </span>
                  <span>
                    <Button onClick={() => setFocusParentClick(item)} className="button-reply">
                      <i className="fa fa-reply" aria-hidden="true"></i>
                    </Button>
                    {item.children.length}
                  </span>
                </p>
              </div>
            </section>
            <div className="comment-body">
              <p>{item.text.replace(/\[.+/, '')}</p>
            </div>
          </article>
        ) : (
          <>
            <article className="comment">
              <header className="comment-author">
                <img src={item?.user?.avatar?.url} alt="avatar" className="comment-avatar" />
              </header>
              <section className="comment-details">
                <div className="author-name">
                  <h5>
                    <Link to={`/user/${item?.user._id}`}>{item?.user.username}</Link>
                  </h5>
                  <p>
                    {' '}
                    {new Date(item?.createdAt ?? '').toLocaleString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="reply">
                  <p>
                    <span>
                      <Button onClick={() => updateLikes(item._id)} className="button-reply">
                        <i className="fa fa-thumbs-up" aria-hidden="true"></i>
                      </Button>
                      {item.likes.count}
                    </span>
                    <span>
                      <Button onClick={() => setFocusParentClick(item)} className="button-reply">
                        <i className="fa fa-reply" aria-hidden="true"></i>
                      </Button>
                      {item.children.length}
                    </span>
                  </p>
                </div>
              </section>
              <div className="comment-body">
                <p>{item.text.replace(/\[.+/, '')}</p>
              </div>
            </article>
            <ul className="children">
              {item.children.map((child) => (
                <li key={child?._id}>
                  {child.children.length === 0 ? (
                    <article className="comment">
                      <header className="comment-author">
                        <img
                          src={child?.user?.avatar?.url}
                          alt="avatar"
                          className="comment-avatar"
                        />
                      </header>
                      <section className="comment-details">
                        <div className="author-name">
                          <h5>
                            <Link to={`/user/${child?.user._id}`}>{child?.user.username}</Link>
                          </h5>
                          <p>
                            {' '}
                            {new Date(child?.createdAt ?? '').toLocaleString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="reply">
                          <p>
                            <span>
                              <Button
                                onClick={() => updateLikes(child._id)}
                                className="button-reply"
                              >
                                <i className="fa fa-thumbs-up" aria-hidden="true"></i>
                              </Button>
                              {child.likes.count}
                            </span>
                            <span>
                              <Button
                                onClick={() => setFocusParentClick(child)}
                                className="button-reply"
                              >
                                <i className="fa fa-reply" aria-hidden="true"></i>
                              </Button>
                              {child.children.length}
                            </span>
                          </p>
                        </div>
                      </section>
                      <div className="comment-body">
                        <p>{child.text.replace(/\[.+/, '')}</p>
                      </div>
                    </article>
                  ) : (
                    <>
                      <article className="comment">
                        <header className="comment-author">
                          <img
                            src={child?.user?.avatar?.url}
                            alt="avatar"
                            className="comment-avatar"
                          />
                        </header>
                        <section className="comment-details">
                          <div className="author-name">
                            <h5>
                              <Link to={`/user/${child?.user._id}`}>{child?.user.username}</Link>
                            </h5>
                            <p>
                              {' '}
                              {new Date(child?.createdAt ?? '').toLocaleString('ru-RU', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="reply">
                            <p>
                              <span>
                                <Button
                                  onClick={() => updateLikes(child._id)}
                                  className="button-reply"
                                >
                                  <i className="fa fa-thumbs-up" aria-hidden="true"></i>
                                </Button>
                                {child.likes.count}
                              </span>
                              <span>
                                <Button
                                  onClick={() => setFocusParentClick(child)}
                                  className="button-reply"
                                >
                                  <i className="fa fa-reply" aria-hidden="true"></i>
                                </Button>
                                {child.children.length}
                              </span>
                            </p>
                          </div>
                        </section>
                        <div className="comment-body">
                          <p>{child.text.replace(/\[.+/, '')}</p>
                        </div>
                      </article>
                      <ul className="children">
                        {child.children.map((comm) => (
                          <li key={comm?._id}>
                            <article className="comment">
                              <header className="comment-author">
                                <img
                                  src={comm?.user?.avatar?.url}
                                  alt="avatar"
                                  className="comment-avatar"
                                />
                              </header>
                              <section className="comment-details">
                                <div className="author-name">
                                  <h5>
                                    <Link to={`/user/${comm?.user._id}`}>
                                      {comm?.user.username}
                                    </Link>
                                  </h5>
                                  <p>
                                    {' '}
                                    {new Date(comm?.createdAt ?? '').toLocaleString('ru-RU', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    })}
                                  </p>
                                </div>
                                <div className="reply">
                                  <p>
                                    <span>
                                      <Button
                                        onClick={() => updateLikes(comm._id)}
                                        className="button-reply"
                                      >
                                        <i className="fa fa-thumbs-up" aria-hidden="true"></i>
                                      </Button>
                                      {comm.likes.count}
                                    </span>
                                    {/* <span>
                                      <i className="fa fa-reply" aria-hidden="true"></i>
                                      Stop reply
                                    </span> */}
                                  </p>
                                </div>
                              </section>
                              <div className="comment-body">
                                <p>{comm.text.replace(/\[.+/, '')}</p>
                              </div>
                            </article>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </li>,
    );
  }
  let content = <></>;

  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;

  if (isLoading) content = <PulseLoader color={'#000'} />;

  if (isSuccess)
    content = (
      <div className="commententries">
        {commentsTree.length > 0 ? (
          <>
            <h3>Comments :</h3>
            <ul className="commentlist"> {parts}</ul>
          </>
        ) : (
          <h3>No Comments</h3>
        )}
      </div>
    );

  return <>{content}</>;
};

export default CommentsForCardPost;
