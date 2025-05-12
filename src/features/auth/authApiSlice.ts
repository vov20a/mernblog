import { apiSlice } from '../../app/api/apiSlice';
// import { IUserInfo } from "../../types/IUserInfo"
import { logOut, setCredentials } from './authSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ accessToken: string }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth',
        method: 'POST',
        body: { ...credentials },
      }),
    }),
    register: builder.mutation<
      { accessToken: string; message: string },
      { username: string; email: string; password: string; avatar: string | ArrayBuffer | null }
    >({
      query: (initialData) => ({
        url: '/auth/register',
        method: 'POST',
        body: { ...initialData },
      }),
    }),
    sendLogout: builder.mutation<{ message: string }, {}>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(logOut());
          //с задержкой login не грузит Categories
          // setTimeout(() => {
          dispatch(apiSlice.util.resetApiState());
          // }, 1000)
        } catch (err) {
          console.log(err);
        }
      },
    }),
    refresh: builder.mutation<{ accessToken: string }, {}>({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          const { accessToken } = data;
          dispatch(setCredentials({ accessToken }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useSendLogoutMutation, useRefreshMutation } =
  authApiSlice;
