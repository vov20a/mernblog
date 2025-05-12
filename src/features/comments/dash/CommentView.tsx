import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDeleteCommentMutation, useGetCommentsQuery } from '../commentsApiSlice';
import { IComment } from '../../../types/IComment';
import { useCreateCommentArray } from '../../../hooks/createCommentArray';
import { PulseLoader } from 'react-spinners';
import DashCommentForCardPost from '../../../components/dash/DashCommentForCardPost';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';

const CommentView = () => {
  const { id } = useParams();

  const { state } = useLocation();
  // console.log(state);
  const navigate = useNavigate();

  const { data, isLoading, isSuccess, isError, error } = useGetCommentsQuery('commentsList');

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

  const [postId] = useState<string | undefined>(
    data?.comments?.find((comm) => comm.id === id)?.post?._id,
  );
  const [postComments, setPostComments] = useState<string[]>([]);

  useEffect(() => {
    if (postId !== undefined && data?.ids !== undefined) {
      const cmt_ids: string[] = [];
      for (const id of data?.ids) {
        if (data?.entities[id]?.post === null) continue;
        if (data?.entities[id]?.post._id === postId) {
          cmt_ids.push(id as string);
        }
      }
      setPostComments(cmt_ids);
    }
  }, [postId, data]);

  const comArray: IComment[] = postComments.map((id) => data?.entities[id]) as IComment[];

  const commentsTree = useCreateCommentArray(comArray ? comArray : []);

  // console.log(commentsTree);

  let commentsHtml = undefined;
  if (commentsTree.length > 0 && postId !== undefined) {
    commentsHtml = (
      <DashCommentForCardPost
        commentsTree={commentsTree}
        commentActiveId={state.commentId}
        page={state.page}
        onDeleteCommentClicked={(id) => onDeleteCommentClicked(id)}
      />
    );
  }

  useCreateAndRemoveToast(isError, error?.data?.message, 'error');
  //   const errClass = isError ? 'errmsg' : 'offscreen';

  let content = <></>;

  if (isLoading) content = <PulseLoader color={'#000'} />;
  if (isSuccess) {
    content = (
      <div className="card card-primary">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>
                  View comments of post :
                  {data?.comments?.find((comm) => comm.id === id)?.post?.title}
                </h1>
                {/* <p className={errClass}>{error?.data?.message}</p> */}
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/dash">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">viewPostComments</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <div className="card-footer card-comments">{commentsHtml}</div>
      </div>
    );
  }
  return <>{content}</>;
};

export default CommentView;
