import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';
import { IComment } from '../../types/IComment';

export interface CommentsResponse {
  comments: IComment[];
}
export type ICommentsCount = EntityState<IComment> & { comments: IComment[] } & {
  commentsCount: number;
} & { message: string };
export type IAllComments = EntityState<IComment> & { comments: IComment[] } & {
  commentsCount: number;
} & {
  resultPerPage: number;
} & { filteredCommentsCount: number };
export type IAllCommentsEnter = { comments: IComment[] } & { commentsCount: number } & {
  resultPerPage: number;
} & { filteredCommentsCount: number };

const commentsAdapter = createEntityAdapter({
  // sortComparer: (a: ICommentsCount, b: ICommentsCount) => a.entities[ids[0]]?.title.localeCompare(b.entities[ids[0]]?.title),
});

const initialState = commentsAdapter.getInitialState<ICommentsCount>({
  ids: [],
  entities: {},
  comments: [],
  commentsCount: 0,
  message: '',
});

let initialAllState = commentsAdapter.getInitialState<IAllComments>({
  ids: [],
  entities: {},
  comments: [],
  commentsCount: 0,
  resultPerPage: 0,
  filteredCommentsCount: 0,
});

export const commentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query<ICommentsCount, string>({
      query: (query = '') => ({
        url: `/comments`,
        method: 'GET',
        validateStatus: (response: any, result: any) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData: ICommentsCount): ICommentsCount => {
        const loadedComments = responseData.comments.map((comment) => {
          comment.id = comment._id;
          return comment;
        });
        initialState.commentsCount = responseData.commentsCount;
        initialState.comments = loadedComments;
        initialState.message = responseData.message;
        return commentsAdapter.setAll(initialState, loadedComments);
      },
      providesTags: (result: ICommentsCount | undefined, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Comment', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Comment' as const, id })),
          ];
        } else return [{ type: 'Comment', id: 'LIST' }];
      },
    }),

    getAllComments: builder.query<IAllComments, string>({
      query: (query = '') => ({
        url: query !== 'commentsList' ? `/comments/all/?${query}` : '/comments/all',
        method: 'GET',
        validateStatus: (response: { status: number }, result: { isError: Boolean }) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData: IAllCommentsEnter): IAllComments => {
        const loadedComments = responseData?.comments.map((comment: IComment) => {
          comment.id = comment._id;
          return comment;
        });
        // return  responseData;
        initialAllState.comments = loadedComments;
        initialAllState.commentsCount = responseData.commentsCount;
        initialAllState.resultPerPage = responseData.resultPerPage;
        initialAllState.filteredCommentsCount = responseData.filteredCommentsCount;

        return commentsAdapter.setAll(initialAllState, loadedComments);
      },
      providesTags: (result: IAllComments | undefined, error, arg) => {
        if (result?.comments) {
          return [
            { type: 'Comment', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Comment' as const, id })),
          ];
        } else return [{ type: 'Comment', id: 'LIST' }];
      },
    }),

    addNewComment: builder.mutation<
      { message: string },
      { text: string; post: string; user: string; parentComment: string }
    >({
      query: (initialCommentData) => {
        return {
          url: '/comments',
          method: 'POST',
          body: {
            ...initialCommentData,
          },
        };
      },
      invalidatesTags: [{ type: 'Comment', id: 'LIST' }],
    }),

    updateComment: builder.mutation<
      { message: string },
      { id: string; text: string; post: string; user: string; parentComment: string }
    >({
      query: (initialCommentData) => {
        return {
          url: '/comments',
          method: 'PATCH',
          body: {
            ...initialCommentData,
          },
        };
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Comment', id: arg.id }],
    }),

    updateLikeComment: builder.mutation<{ message: string }, { id: string; user: string }>({
      query: ({ id, user }) => {
        return {
          url: `/comments/like/${id}`,
          method: 'PATCH',
          body: {
            likeAuthor: user,
          },
        };
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Comment', id: arg.id }],
    }),

    deleteComment: builder.mutation<{ message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/comments`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Comment', id: arg.id }],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useGetAllCommentsQuery,
  useAddNewCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useUpdateLikeCommentMutation,
} = commentsApiSlice;
