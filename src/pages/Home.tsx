import { Link } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { useGetPostsQuery } from '../features/posts/postsApiSlice';
import useTitle from '../hooks/useTitle';
import PostsList from '../features/posts/PostsList';
import HTMLStringToJSX from '../components/dash/HTMLStringToJSX';
import { useBaseCategory } from '../hooks/useBaseCategory';
import { useContext } from 'react';
import { ActiveMenuContext, MenuContextType } from '../context';

const Home = () => {
  useTitle('Home Page');

  const { setActiveMenuId } = useContext(ActiveMenuContext) as MenuContextType;

  const { bigPost, isBigSuccess } = useGetPostsQuery('postsList', {
    selectFromResult: ({ data, isSuccess }) => ({
      bigPost: data?.posts.find((post) => post.tags.includes('$big_post&')),
      isBigSuccess: isSuccess,
    }),
  });

  const { breadcrumbs: baseCategory } = useBaseCategory(bigPost ? bigPost.category._id : '');

  const onSaveMenuItemClick = () => {
    localStorage.setItem('activeMenu', baseCategory[0]._id);
    setActiveMenuId(baseCategory[0]._id);
  };

  let bigContent = <></>;
  if (isBigSuccess) {
    bigContent = (
      <div className="single-post-big">
        <div className="big-image">
          <img src={bigPost?.imageUrl.url} alt="" />
        </div>
        <div className="big-text">
          <h3 style={{ margin: 0 }} onClick={onSaveMenuItemClick}>
            <Link to={`/post/${baseCategory[0]?.title.toLowerCase()}/${bigPost?.id}`}>
              {bigPost?.title}
            </Link>
          </h3>
          <HTMLStringToJSX str={bigPost?.text} />
          <h4>
            <span className="date">
              {bigPost
                ? new Date(bigPost?.createdAt).toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : ''}
            </span>
            <span className="author">
              Posted By: <span className="author-name">{bigPost?.user.username}</span>
            </span>
          </h4>
        </div>
      </div>
    );
  }

  return (
    <section className="blog-post-area">
      <Container>
        <div className="posts-content">
          <Col md={12}>{bigContent}</Col>
          <PostsList />
        </div>
      </Container>
    </section>
  );
};

export default Home;
