import { Col, Container, Row } from 'react-bootstrap';
import { useGetPostsQuery } from '../../features/posts/postsApiSlice';
import HTMLStringToJSX from '../dash/HTMLStringToJSX';

const HomeBanner = () => {
  const { post, isSuccess } = useGetPostsQuery('postsList', {
    selectFromResult: ({ data, isSuccess }) => ({
      post: data?.posts.find((post) => post.tags.includes('$home_banner&')),
      isSuccess,
    }),
  });

  let content = <></>;

  if (isSuccess) {
    content = (
      <section className="bg-text-area">
        <Container fluid>
          <Row>
            <Col md={12}>
              <div className="bg-text" style={{ backgroundImage: `url(${post?.imageUrl.url})` }}>
                <h3>{post?.title}</h3>
                <HTMLStringToJSX str={post?.text} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  return <>{content}</>;
};

export default HomeBanner;
