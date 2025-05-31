import { createSelector, createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';
import { IPostType } from '../../types/IPostType';
import { RootState } from '../../app/store';
import { IUser } from '../../types/IUserType';
import { IComment } from '../../types/IComment';

export interface PostsResponse {
  // ids: EntityId[],
  // entities: Dictionary<IPost>
  posts: IPostType[];
}
export type IPostsCount = EntityState<IPostType> & { posts: IPostType[] } & {
  postsCount: number;
} & { message: string };
export type ICategoryIdQuery = { categoryId: string | undefined; query: string };
export type IAllPosts = EntityState<IPostType> & { posts: IPostType[] } & { postsCount: number } & {
  resultPerPage: number;
} & { filteredPostsCount: number };
export type IAllPostsEnter = { posts: IPostType[] } & { postsCount: number } & {
  resultPerPage: number;
} & { filteredPostsCount: number };
export type IPopularUsersEnter = { _id: string } & { postsCount: number } & { users: IUser[] };
export type IPopularUsers = { _id: string } & { id?: string } & { postsCount: number } & {
  users: IUser[];
};
export type ISinglePost = { post: IPostType } & { comments: IComment[] } & { message: number };
export type ITagsEnter = { tags: string[] } & {
  likes: {
    id: string;
    title: string;
    imageUrl: string;
    user: string;
    category: string;
    createdAt: Date;
    maxCount: number;
  }[];
};

export type IParentCatPosts = EntityState<IPostType> & { posts: IPostType[] } & { message: string };
export type IParentCatPostsEnter = { posts: IPostType[] } & { message: string };

const postsAdapter = createEntityAdapter({
  // sortComparer: (a: IPostsCount, b: IPostsCount) => a.entities[ids[0]]?.title.localeCompare(b.entities[ids[0]]?.title),
});

const initialState = postsAdapter.getInitialState<IPostsCount>({
  ids: [],
  entities: {},
  posts: [],
  postsCount: 0,
  message: '',
});

let initialAllState = postsAdapter.getInitialState<IAllPosts>({
  ids: [],
  entities: {},
  posts: [],
  postsCount: 0,
  resultPerPage: 0,
  filteredPostsCount: 0,
});

let initialParentCatState = postsAdapter.getInitialState<IParentCatPosts>({
  ids: [],
  entities: {},
  posts: [],
  message: '',
});

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCount: builder.query<IPostsCount, string & string>({
      query: (categoryId = '', query = '') => ({
        url: categoryId !== 'postsList' ? `/posts/count/${categoryId}` : `/posts/count/${query}`,
        validateStatus: (response: any, result: any) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (count: number): IPostsCount => {
        initialState.postsCount = count;
        return postsAdapter.setOne(initialState, { count });
      },
      providesTags: ['Post'],
    }),
    getPosts: builder.query<IPostsCount, string>({
      query: (query = '') => ({
        url: query !== 'postsList' ? `/posts/${query}` : `/posts`,
        validateStatus: (response: any, result: any) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData: IPostsCount): IPostsCount => {
        const loadedPosts = responseData.posts.map((post) => {
          post.id = post._id;
          return post;
        });
        initialState.postsCount = responseData.postsCount;
        initialState.posts = loadedPosts;
        initialState.message = responseData.message;
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result: IPostsCount | undefined, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Post', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Post' as const, id })),
          ];
        } else return [{ type: 'Post', id: 'LIST' }];
      },
    }),

    getAllPosts: builder.query<IAllPosts, string>({
      query: (query = '') => ({
        url: query !== 'postsList' ? `/posts/all/?${query}` : '/posts/all',
        validateStatus: (response: { status: number }, result: { isError: Boolean }) => {
          return response.status === 200 && !result.isError;
        },
      }),
      keepUnusedDataFor: 3,
      transformResponse: (responseData: IAllPostsEnter): IAllPosts => {
        const loadedPosts = responseData?.posts.map((post: IPostType) => {
          post.id = post._id;
          return post;
        });
        // return  responseData;
        initialAllState.posts = loadedPosts;
        initialAllState.postsCount = responseData.postsCount;
        initialAllState.resultPerPage = responseData.resultPerPage;
        initialAllState.filteredPostsCount = responseData.filteredPostsCount;

        return postsAdapter.setAll(initialAllState, loadedPosts);
      },
      providesTags: (result: IAllPosts | undefined, error, arg) => {
        if (result?.posts) {
          return [
            { type: 'Post', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Post' as const, id })),
          ];
        } else return [{ type: 'Post', id: 'LIST' }];
      },
    }),

    getPostsByParam: builder.query<IAllPosts, { param: string; query: string }>({
      query: ({ param, query }) => ({
        url: `/posts/${param}/?${query}`,
        validateStatus: (response: any, result: any) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData: IAllPostsEnter): IAllPosts => {
        const loadedPosts = responseData?.posts.map((post: IPostType) => {
          post.id = post._id;
          return post;
        });
        initialAllState.posts = loadedPosts;
        initialAllState.postsCount = responseData.postsCount;
        initialAllState.resultPerPage = responseData.resultPerPage;
        initialAllState.filteredPostsCount = responseData.filteredPostsCount;

        return postsAdapter.setAll(initialAllState, loadedPosts);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Post', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Post' as const, id })),
          ];
        } else return [{ type: 'Post', id: 'LIST' }];
      },
    }),

    getPostsByParentCategory: builder.query<IParentCatPosts, { param: string[] }>({
      query: ({ param }) => ({
        url: `/posts/cats/${param}`,
        validateStatus: (response: any, result: any) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData: IParentCatPostsEnter): IParentCatPosts => {
        const loadedPosts = responseData?.posts.map((post: IPostType) => {
          post.id = post._id;
          return post;
        });
        initialParentCatState.posts = loadedPosts;
        initialParentCatState.message = responseData.message;

        return postsAdapter.setAll(initialParentCatState, loadedPosts);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Post', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Post' as const, id })),
          ];
        } else return [{ type: 'Post', id: 'LIST' }];
      },
    }),

    getPopularUsers: builder.query<IPopularUsers[], void>({
      query: () => ({
        url: `/posts/users`,
        validateStatus: (response: any, result: any) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData: IPopularUsersEnter[]): IPopularUsers[] => {
        const loadedData = responseData?.map((item: IPopularUsers) => {
          item.id = item._id;
          return item;
        });
        return loadedData;
      },
    }),

    getSinglePost: builder.query<ISinglePost, { query: string; comm: string }>({
      query: (params) => ({
        url: `/posts/single/${params.query}/?comm=${params.comm}`,
        validateStatus: (response: any, result: any) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData: ISinglePost): ISinglePost => {
        responseData.post.id = responseData.post._id;
        return responseData;
      },
      providesTags: (result, error, arg) => {
        if (result?.post) {
          return [{ type: 'Post', id: result?.post.id }];
        } else return [{ type: 'Post', id: 'LIST' }];
      },
    }),

    getTags: builder.query<ITagsEnter, string>({
      query: () => ({
        url: `/posts/tags`,
        validateStatus: (response: any, result: any) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData: ITagsEnter): ITagsEnter => {
        return responseData;
      },
    }),

    addNewPost: builder.mutation<
      { message: string },
      {
        title: string;
        text: string;
        category: string;
        tags: string[] | undefined;
        user: string;
        imageUrl: string | ArrayBuffer | null;
      }
    >({
      query: (initialPostData) => {
        return {
          url: '/posts',
          method: 'POST',
          body: {
            ...initialPostData,
          },
        };
      },
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),

    updateLikesPost: builder.mutation<{ message: string }, { id: string; userId: string }>({
      query: ({ id, userId }) => {
        return {
          url: `/posts/likes/${id}/?userId=${userId}`,
          method: 'PATCH',
          body: { id },
        };
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }],
    }),

    updatePost: builder.mutation<
      { message: string },
      {
        id: string;
        title: string;
        text: string;
        category: string;
        tags: string[] | undefined;
        user: string;
        imageUrl?: string | ArrayBuffer | null;
      }
    >({
      query: (initialPostData) => {
        return {
          url: '/posts',
          method: 'PATCH',
          body: {
            ...initialPostData,
          },
        };
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }],
    }),

    deletePost: builder.mutation<{ message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/posts`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetAllPostsQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useGetCountQuery,
  useGetSinglePostQuery,
  useDeletePostMutation,
  useGetPostsByParamQuery,
  useLazyGetPostsByParamQuery,
  useGetPostsByParentCategoryQuery,
  useGetPopularUsersQuery,
  useGetTagsQuery,
  useUpdateLikesPostMutation,
} = postsApiSlice;

// returns the query result object
//@ts-ignore
export const selectPostsResult = postsApiSlice.endpoints.getPosts.select();

// creates memoized selector
const selectPostsData = createSelector(
  selectPostsResult,
  (postsResult) => postsResult.data, // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // Pass in a selector that returns the users slice of state
} = postsAdapter.getSelectors((state: RootState) => selectPostsData(state) ?? initialState);
