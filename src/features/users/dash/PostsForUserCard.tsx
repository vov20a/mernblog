import React, { useEffect } from 'react';
import { useDeletePostMutation, useGetPostsQuery } from '../../posts/postsApiSlice';
import { useNavigate } from 'react-router-dom';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';
import { PulseLoader } from 'react-spinners';
import { IPostType } from '../../../types/IPostType';
import DashPost from '../../posts/dash/DashPost';

interface PostsUserProps {
  userId: string | undefined;
  setPostsCount: (val: number) => void;
}

const PostsForUserCard = ({ userId, setPostsCount }: PostsUserProps) => {
  const navigate = useNavigate();

  const { postsUser, isPostsSuccess } = useGetPostsQuery('postsList', {
    selectFromResult: ({ data, isSuccess }) => ({
      postsUser: data?.posts.filter((post) => post.user._id === userId),
      isPostsSuccess: isSuccess,
    }),
  });

  useEffect(() => {
    if (isPostsSuccess) setPostsCount(postsUser?.length ?? 0);
  }, [isPostsSuccess, postsUser, setPostsCount]);

  const [
    deletePost,
    {
      data: dataPost,
      isLoading: isDelPostLoading,
      isSuccess: isDelPostSuccess,
      isError: isDelPostError,
      error: delPosterror,
    },
  ] = useDeletePostMutation();

  const onDeletePostClicked = async (id: string) => {
    await deletePost({ id });
  };

  //после удаления post -идем на home
  useEffect(() => {
    if (isDelPostSuccess) {
      navigate('/dash', {
        state: { successDelPost: isDelPostSuccess, messageDelPost: dataPost?.message },
      });
    }
  }, [navigate, isDelPostSuccess, dataPost]);

  useCreateAndRemoveToast(isDelPostError, delPosterror?.data?.message, 'error');

  const tableContent = postsUser?.map((post: IPostType, index) => (
    <DashPost
      key={post.id}
      post={post}
      number={index + 1}
      onDeletePostClicked={(id) => onDeletePostClicked(id)}
    />
  ));

  let content = <></>;

  if (isDelPostLoading) content = <PulseLoader color={'#000'} />;

  if (postsUser) {
    if (postsUser?.length > 0) {
      content = (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body table-responsive p-0">
                <table className="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th>№</th>
                      <th>Title</th>
                      <th>Text</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Tags</th>
                      <th>Views</th>
                      <th>Likes</th>
                      <th>Image</th>
                      <th>CreatedAt</th>
                      <th>UpdatedAt</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontWeight: 500 }}>{tableContent}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      content = <h1>There are not posts</h1>;
    }
  } else {
    content = <></>;
  }

  return <>{content}</>;
};

export default PostsForUserCard;
