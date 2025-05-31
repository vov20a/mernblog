import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';
import { IVideoType } from '../../types/IVideoType';

export interface VideosResponse {
  posts: IVideoType[];
}
export type IVideosCount = EntityState<IVideoType> & { videos: IVideoType[] } & {
  videosCount: number;
} & { message: string };

export type ISingleVideo = { video: IVideoType } & { message: number };
export type IVideoCreate = { title: string; youtubeId: string };
export type IVideoUpdate = { id: string; title: string; youtubeId: string };

const videosAdapter = createEntityAdapter({
  // sortComparer: (a: IPostsCount, b: IPostsCount) => a.entities[ids[0]]?.title.localeCompare(b.entities[ids[0]]?.title),
});

const initialState = videosAdapter.getInitialState<IVideosCount>({
  ids: [],
  entities: {},
  videos: [],
  videosCount: 0,
  message: '',
});

export const videosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVideos: builder.query<IVideosCount, string>({
      query: (query = '') => ({
        url: query === 'videosList' ? `/videos` : `/videos?query=${query}`,
        validateStatus: (response: any, result: any) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData: IVideosCount): IVideosCount => {
        const loadedPosts = responseData.videos.map((video) => {
          video.id = video._id;
          return video;
        });
        initialState.videosCount = responseData.videosCount;
        initialState.videos = loadedPosts;
        initialState.message = responseData.message;
        return videosAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result: IVideosCount | undefined, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Video', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Video' as const, id })),
          ];
        } else return [{ type: 'Video', id: 'LIST' }];
      },
    }),

    getSingleVideo: builder.query<ISingleVideo, { query: string }>({
      query: ({ query }) => ({
        url: `/videos/${query}`,
        validateStatus: (response: any, result: any) => {
          return response.status === 200 && !result.isError;
        },
      }),
      keepUnusedDataFor: 3,
      transformResponse: (responseData: ISingleVideo): ISingleVideo => {
        responseData.video.id = responseData.video._id;
        return responseData;
      },
      providesTags: (result, error, arg) => {
        if (result?.video) {
          return [{ type: 'Video', id: result?.video.id }];
        } else return [{ type: 'Video', id: 'LIST' }];
      },
    }),

    addNewVideo: builder.mutation<{ message: string }, IVideoCreate>({
      query: (initialVideoData) => {
        return {
          url: '/videos',
          method: 'POST',
          body: {
            ...initialVideoData,
          },
        };
      },
      invalidatesTags: [{ type: 'Video', id: 'LIST' }],
    }),

    updateVideo: builder.mutation<{ message: string }, IVideoUpdate>({
      query: (initialPostData) => {
        return {
          url: '/videos',
          method: 'PATCH',
          body: {
            ...initialPostData,
          },
        };
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Video', id: arg.id }],
    }),

    deleteVideo: builder.mutation<{ message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/videos`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Video', id: arg.id }],
    }),
  }),
});

export const {
  useGetVideosQuery,
  useGetSingleVideoQuery,
  useAddNewVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
} = videosApiSlice;
