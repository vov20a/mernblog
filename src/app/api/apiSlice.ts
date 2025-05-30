import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
  // baseUrl: 'http://localhost:3500',
  baseUrl: 'https://mernblog-api-be61.onrender.com',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const f: any = getState();
    const token = f.auth.token;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
      // headers.set('content-type', 'multipart/form-data')
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  // If you want, handle other status codes, too
  if (result?.error?.status === 403) {
    console.log('sending refresh token');

    // send refresh token to get new access token
    const refreshResult: any = await baseQuery('/auth/refresh', api, extraOptions);

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }));

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = 'Your login has expired.';
      }
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi<
  (args: any, api: any, extraOptions: any) => Promise<any>,
  {},
  'api',
  'User' | 'Post' | 'Category' | 'Comment' | 'Mail' | 'Video'
>({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Post', 'Category', 'Comment', 'Mail', 'Video'],
  endpoints: (builder) => ({}),
});
