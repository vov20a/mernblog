import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/public/Breadcrumbs';
import Sidebar from '../components/public/Sidebar';
import { useGetSinglePostQuery, useUpdateLikesPostMutation } from '../features/posts/postsApiSlice';
import useTitle from '../hooks/useTitle';
import { useDebounce } from '../hooks/debounce';
import { PulseLoader } from 'react-spinners';
import HTMLStringToJSXParts from '../components/public/HTMLStringToJSXParts';
import { useBaseCategory } from '../hooks/useBaseCategory';
import CommentsForCardPost from '../components/public/CommentsForCardPost';
import CreateCommentsForm from '../components/public/CreateCommentsForm';
import { IComment } from '../types/IComment';
import { useCreateAndRemoveToast } from '../hooks/useCreateAndRemoveToast';
import useAuth from '../hooks/useAuth';
import SearchForm from '../components/public/SearchForm';

const SinglePostPage = () => {
  const { id } = useParams();

  const { id: userId } = useAuth();

  const { state } = useLocation();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [parent, setParent] = useState<IComment | undefined>(undefined);
  const [parentNull, setParentNull] = useState<boolean>(true);
  const [refetchComm, setRefetchComm] = useState<boolean>(false);
  const [comments, setComments] = useState<IComment[]>([]);
  const [postLikesCount, setPostLikesCount] = useState<number>(0);
  const [postLikesUsers, setPostLikesUsers] = useState<string[]>([]);

  const { post, isLoading, isSuccess, isError, error, refetch } = useGetSinglePostQuery(
    { query: id ?? '', comm: '' },
    {
      selectFromResult: ({ data, isLoading, isSuccess, isError, error }) => ({
        post: data?.post,
        isLoading,
        isSuccess,
        isError,
        error,
      }),
    },
  );

  useEffect(() => {
    if (isSuccess) {
      setPostLikesCount(post?.likes.count ?? 0);
      setPostLikesUsers(post?.likes.usersArray ?? []);
    }
  }, [post, isSuccess]);

  useEffect(() => {
    if (state !== null) {
      if (state?.refetch === true) {
        refetch();
      }
    }
  }, [state, refetch]);

  useTitle(`Post: ${post?.title}`);

  const { breadcrumbs } = useBaseCategory(post?.category ? post?.category._id : '');

  const navigate = useNavigate();

  const [search, setSearch] = useState<string>('');

  const debounced = useDebounce(search, 500);
  useEffect(() => {
    if (debounced.length > 2) {
      navigate('/search', { state: debounced });
    }
  }, [debounced, navigate]);

  let commentsHtml = undefined;
  if (post !== undefined) {
    commentsHtml = (
      <CommentsForCardPost
        inputRef={inputRef}
        setParent={setParent}
        setParentNull={setParentNull}
        post={post}
        refetchComm={refetchComm}
        setRefetchComm={setRefetchComm}
        setComments={setComments}
      />
    );
  }

  const [
    editLikes,
    { data: likes, isSuccess: isPostLikesSuccess, isError: isPostLikesError, error: likeError },
  ] = useUpdateLikesPostMutation();

  const editLikesPost = () => {
    editLikes({ id: post?.id ?? '', userId });

    if (!postLikesUsers?.includes(userId)) {
      setPostLikesCount(postLikesCount + 1);
      setPostLikesUsers([...postLikesUsers, userId]);
    }
  };

  useCreateAndRemoveToast(isPostLikesError, likeError?.data?.message || 'Server Error', 'error');

  useCreateAndRemoveToast(isPostLikesSuccess, likes?.message ?? '', 'success');

  let content = <></>;

  if (isLoading) content = <PulseLoader color={'#000'} />;

  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;

  if (isSuccess) {
    // const textArray = post ? post?.text.match(RegExp(/<p>.*<\/p>/g)) : ('' as unknown as []);

    let textArray = post?.text.split('</p>');
    textArray = textArray?.slice(0, -1);
    const arr = [];
    if (textArray?.length) {
      for (let item of textArray) {
        item = `${item}</p>`;
        arr.push(item);
      }
    }
    textArray = arr;
    //clean Html text from tags
    const re = RegExp(/<[^>]*>/g);
    const startChar: string = textArray[0].replace(re, '')[0];
    // console.log(startChar);
    const quote = textArray[1].replace(re, '').split(' ', 15).join(' ');
    // console.log(quote);

    content = (
      <div className="blog-area">
        <div className="blog-area-part">
          <h2 style={{ margin: 0, fontWeight: 700 }}>{post?.title}</h2>
          <div className="post-info">
            <h4 style={{ fontWeight: 700 }}>
              <span>
                Posted By:{' '}
                <span className="author-name">
                  <Link to={`/user/${post?.user._id}`}>{post?.user.username}</Link>
                </span>
              </span>
            </h4>
            <h4>
              <span>
                {new Date(post ? post?.createdAt : '').toLocaleString('ru-RU', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </h4>
          </div>
          <div className="for-style">
            <div className="single-text__part1">
              <span className="drop_caps">{startChar}</span>
              {textArray?.map(
                (item, index) =>
                  index === 0 && (
                    <HTMLStringToJSXParts
                      key={index}
                      str={item}
                      num={index}
                      startChar={startChar}
                    />
                  ),
              )}
            </div>
          </div>
          <img src={post?.imageUrl.url} alt="img" />
          {textArray?.map(
            (item, index) =>
              index === 1 && (
                <span key={index}>
                  <HTMLStringToJSXParts str={item} num={index} />
                  <h3>
                    <i className="fa fa-quote-left" aria-hidden="true"></i>
                    <HTMLStringToJSXParts str={quote} num={index} />
                    <i className="fa fa-quote-right" aria-hidden="true"></i>
                  </h3>
                </span>
              ),
          )}
          {textArray?.map(
            (item, index) =>
              index > 1 && <HTMLStringToJSXParts key={index} str={item} num={index} />,
          )}
          <div className="row">
            <div className="col-md-12">
              <button type="button" className="btn btn-default btn-sm" onClick={editLikesPost}>
                <i className="far fa-thumbs-up"></i> Like
              </button>
              <span className="float-right text-muted">
                {postLikesCount} like(s) - {comments ? comments.length : 0} comment(s)
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <h4 style={{ fontWeight: 700 }}>
                <span>
                  Views: <span className="author-name">{post?.views}</span>
                </span>
              </h4>
            </div>
          </div>
        </div>
        {commentsHtml}
        <h4 style={{ marginTop: 10 }}>Add Comment </h4>
        <CreateCommentsForm
          post={post}
          parent={parent}
          setParent={setParent}
          parentNull={parentNull}
          setParentNull={setParentNull}
          inputRef={inputRef}
          setRefetchComm={setRefetchComm}
        />
      </div>
    );
  }

  return (
    <section className="single-blog-area" style={{ fontFamily: 'Geometria' }}>
      <div className="container">
        <div className="row mt-3 breadcrumbs-search">
          <div className="title-breadcrumbs col-md-8">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
          <div className="col-md-4 category-posts  justify-content-end">
            <SearchForm search={search} setSearch={setSearch} />
          </div>
        </div>
        <div className="row posts-align">
          <div className="col-md-8 blog-post-area posts-center">{content}</div>
          <Sidebar currentPost={post} />
        </div>
      </div>
    </section>
  );
};

export default SinglePostPage;
