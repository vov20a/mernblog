import { Link } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';

interface TagsProps {
  tags: string[] | undefined;
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  error: { data: { message: string } };
}

const TagsElement = ({ tags, isSuccess, isLoading, isError, error }: TagsProps) => {
  let content;
  if (isLoading) content = <PulseLoader color={'#000'} />;

  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;

  if (isSuccess) {
    content = tags?.map((tag) => (
      <p key={tag}>
        <Link to={`/tag/${tag}`}>{tag}</Link>
      </p>
    ));
  }

  return (
    <div className="tags">
      <h2 className="sidebar-title">Tags</h2>
      {content}
    </div>
  );
};

export default TagsElement;
