import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBaseCategory } from '../hooks/useBaseCategory';
import { useGetPostsByParentCategoryQuery } from '../features/posts/postsApiSlice';
import useTitle from '../hooks/useTitle';
import { useDebounce } from '../hooks/debounce';
import { useCreateAndRemoveToast } from '../hooks/useCreateAndRemoveToast';
import { PulseLoader } from 'react-spinners';
import PostCard from '../features/posts/PostCard';
import { EntityId } from '@reduxjs/toolkit';
import Sidebar from '../components/public/Sidebar';
import Breadcrumbs from '../components/public/Breadcrumbs';
import SearchForm from '../components/public/SearchForm';
import { useGetCategoriesQuery } from '../features/categories/categoriesApiSlice';
import { findArrayInCategoriesTree } from '../utils/findArrayInTree';
import { useCreateCategoryArray } from '../hooks/createCategoryArray';
import { flatten, flattenClean } from '../utils/changeTreeToFlatArray';

const PostsByParentCategory = () => {
  const { state } = useLocation();

  useTitle(`Category: ${state.categoryTitle}`);

  const { data: catsData, isSuccess: isCatsSuccess } = useGetCategoriesQuery('categoriesList');

  const categoriesTree = useCreateCategoryArray(catsData ? catsData?.categories : []);

  let catsPart: string[] = [] as string[];
  if (isCatsSuccess) {
    let catsPartTree = findArrayInCategoriesTree(categoriesTree, state.categoryId);

    if (catsPartTree[1] !== undefined && catsPartTree[1].id === state.categoryId) {
      catsPartTree = [catsPartTree[1]];
    }
    catsPart = flattenClean(flatten(catsPartTree));
  }

  const { breadcrumbs } = useBaseCategory(state.categoryId);

  const navigate = useNavigate();

  const [, setQuery] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [, setCatId] = useState<string>('');
  const [catTitle, setCatTitle] = useState<string>('');

  const { data, isLoading, isSuccess, isError, error } = useGetPostsByParentCategoryQuery({
    param: catsPart,
  });

  useEffect(() => {
    setCatId(state.categoryId);
    setCatTitle(state.categoryTitle);
    setQuery(state.categoryId);
  }, [state]);

  const debounced = useDebounce(search, 500);
  useEffect(() => {
    if (debounced.length > 2) {
      navigate('/search', { state: debounced });
    }
  }, [debounced, navigate]);

  useCreateAndRemoveToast(isError, error?.data?.message || error?.status, 'error');

  useCreateAndRemoveToast(isSuccess, data?.message ?? '', 'success');

  let content = <></>;

  if (isLoading) content = <PulseLoader color={'#000'} />;

  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;

  if (isSuccess) {
    const ids = data.ids;

    const postContent = ids?.map((postId: EntityId) => (
      <PostCard key={postId} post={data?.entities[postId]} md={6} />
    ));

    content = <div className="row posts-align">{postContent}</div>;
  }

  return (
    <section className="single-blog-area">
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
          <div className="col-md-8 blog-post-area posts-center">
            <div className="row " style={{ marginBottom: 20 }}>
              {data?.ids && data?.ids.length > 0 ? (
                <h1>Posts By Category : {catTitle}</h1>
              ) : (
                <h1>There are not posts by category : {catTitle}</h1>
              )}
              {content}
            </div>
          </div>
          <Sidebar />
        </div>
      </div>
    </section>
  );
};

export default PostsByParentCategory;
