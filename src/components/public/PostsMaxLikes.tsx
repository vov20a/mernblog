import { PulseLoader } from 'react-spinners';
import PostsMaxLikesItem from './PostsMaxLikesItem';
import { IPostType } from '../../types/IPostType';

interface LikesProps {
  likes:
    | {
        id: string;
        title: string;
        imageUrl: string;
        user: string;
        category: string;
        createdAt: Date;
        maxCount: number;
      }[]
    | undefined;
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  error: { data: { message: string } };
  currentPost?: IPostType;
  refetch: () => void;
}

const PostsMaxLikes = ({
  likes,
  isSuccess,
  isLoading,
  isError,
  error,
  currentPost,
  refetch,
}: LikesProps) => {
  let content;
  if (isLoading) content = <PulseLoader color={'#000'} />;

  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;

  if (isSuccess) {
    content = likes?.map((like, index) => (
      <PostsMaxLikesItem
        key={like.id}
        like={like}
        number={index}
        currentPost={currentPost}
        refetch={refetch}
      />
    ));
  }

  return (
    <div className="likes">
      <h2 className="sidebar-title">Post's MaxLikes</h2>
      <div className="grid grid-content">{content}</div>
    </div>
  );
};

export default PostsMaxLikes;
