import { EntityId, EntityState } from '@reduxjs/toolkit';
import React, { ReactElement, useEffect, useState } from 'react';
import { IPostType } from '../../../types/IPostType';
import { IUser } from '../../../types/IUserType';
import { Link, useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { useAddNewCommentMutation } from '../commentsApiSlice';
import { IComment } from '../../../types/IComment';
import { useCreateCommentArray } from '../../../hooks/createCommentArray';
import DashCommentsForPost from '../../../components/dash/DashCommentsForPost';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';

interface NewCommentProps {
  posts: EntityState<IPostType>;
  users: EntityState<IUser>;
  comments: EntityState<IComment>;
}

const TEXT_REGEX = /^[A-zА-я0-9\s?]{3,}/;

const NewCommentForm = ({ posts, users, comments }: NewCommentProps) => {
  const navigate = useNavigate();
  // console.log(comments);
  const [addNewComment, { data, isLoading, isSuccess, isError, error }] =
    useAddNewCommentMutation();

  const [text, setText] = useState('');
  const [validText, setValidText] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [postId, setPostId] = useState<string | undefined>(undefined);
  const [parentComment, setParentComment] = useState<string>('');
  const [postComments, setPostComments] = useState<EntityId[]>([]);
  const [basePostOption, setBasePostOption] = useState<boolean>(false);

  useEffect(() => {
    setValidText(TEXT_REGEX.test(text));
  }, [text]);

  const usersOptions: ReactElement[] = [];
  if (users.ids.length && Object.keys(users.entities).length) {
    users.ids.map((id) => {
      usersOptions.push(
        <option key={id} value={users.entities[id]?.id}>
          {users.entities[id]?.username}
        </option>,
      );
      return [];
    });
  }
  const postsOptions: ReactElement[] = [];
  if (posts.ids.length && Object.keys(posts.entities).length) {
    posts.ids.map((id) => {
      postsOptions.push(
        <option key={id} value={posts.entities[id]?.id}>
          {posts.entities[id]?.title}
        </option>,
      );
      return [];
    });
  }

  useEffect(() => {
    if (isSuccess) {
      setText('');
      setUserId('');
      setPostId('');
      setPostComments([]);
      setBasePostOption(false);
      setParentComment('');
      navigate('/dash/comments', {
        state: { successNewComment: isSuccess, messageNewComment: data?.message },
      });
    }
  }, [isSuccess, navigate, data?.message]);
  useEffect(() => {
    if (isError) {
      setText(text);
      setUserId(userId);
      setPostId(postId);
      setPostComments(postComments);
      setBasePostOption(basePostOption);
      setParentComment(parentComment);
    }
  }, [isError, text, userId, postId, postComments, basePostOption, parentComment]);

  useEffect(() => {
    if (postId !== undefined) {
      const cmt_ids: string[] = [];
      for (const id of comments.ids) {
        if (comments.entities[id]?.post._id === postId) {
          cmt_ids.push(id as string);
        }
      }
      setPostComments(cmt_ids);
    }
  }, [postId, comments]);

  const comArray: IComment[] = postComments.map((id) => comments.entities[id]) as IComment[];
  const commentTree = useCreateCommentArray(comArray ? comArray : []);
  // array.unshift(postId??'')

  let commentsHtml = undefined;
  if (commentTree.length > 0 && postId !== undefined) {
    commentsHtml = (
      <DashCommentsForPost
        commsArray={commentTree}
        postTitle={postId ? posts.entities[postId]?.title : ''}
      />
    );
  }
  if (commentTree.length === 0 && postId !== undefined) {
    commentsHtml = (
      <option
        key={'Level 0'}
        value=""
        className=" form-control form__input"
        style={{ height: 'auto', color: 'tomato' }}
      >
        Comment to post: {postId ? posts.entities[postId]?.title : ''}
      </option>
    );
    if (basePostOption) {
      commentsHtml = undefined;
    }
  }

  const onTextChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value);
  const onUsersChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(e.target.value);
  };
  const onPostsChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '') {
      setBasePostOption(true);
      setPostId(e.target.value);
    } else {
      setBasePostOption(false);
      setPostId(e.target.value);
    }
  };

  const canSave =
    [validText, userId, postId, parentComment !== undefined].every(Boolean) && !isLoading;
  // console.log(parentComment);
  const onSaveCommentClicked = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(validText, userId, postId, parentComment !== undefined);
    // console.log(canSave);
    if (canSave) {
      await addNewComment({ text, user: userId, post: postId ?? '', parentComment });
    }
  };

  const errClass = isError ? 'errmsg' : 'offscreen';
  const validTextClass = !validText ? 'form__input--incomplete' : '';
  const validUsersClass = !userId ? 'form__input--incomplete' : '';
  const validPostsClass = !postId ? 'form__input--incomplete' : '';

  useCreateAndRemoveToast(isError, error?.data?.message, 'error');

  //   console.log(usersOptions);
  let content = <></>;
  if (isLoading) content = <PulseLoader color={'#000'} />;
  else {
    content = (
      <div className="card card-primary">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Create New Comment</h1>
                <p className={errClass}>{error?.data?.message}</p>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/dash">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">newPost</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <form className="form" onSubmit={onSaveCommentClicked}>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">User</label>
              <select
                style={{ width: '100%' }}
                className={`form__input  ${validUsersClass}`}
                value={userId}
                onChange={onUsersChanged}
              >
                <option value="" disabled={true}>
                  Choose user
                </option>
                {usersOptions ?? []}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Post</label>
              <select
                style={{ width: '100%' }}
                className={`form__input  ${validPostsClass}`}
                value={postId}
                onChange={onPostsChanged}
              >
                <option key={postId} value="">
                  Choose post
                </option>
                {postsOptions}
              </select>
            </div>
            {commentTree.length >= 0 && commentsHtml !== undefined && (
              <div className="form-group">
                <label htmlFor="exampleSelect2">Choose parentComment</label>
                <select
                  id="exampleSelect2"
                  style={{ width: '100%' }}
                  className={`form__input`}
                  value={parentComment}
                  onChange={(e) => setParentComment(e.target.value)}
                >
                  {commentsHtml}
                </select>
              </div>
            )}

            <div className="form-group form-textarea">
              <label htmlFor="exampleInputText">Text Editor</label>
              <textarea
                className={validTextClass}
                id="exampleInputText"
                value={text}
                rows={3}
                onChange={onTextChanged}
              >
                {text}
              </textarea>
            </div>
          </div>

          <div className="card-footer">
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

export default NewCommentForm;
