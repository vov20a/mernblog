import { EntityState } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';
import { IMail } from '../../types/IMail';

// export interface ProductsResponse {
//     ids: string[],
//     entities: { id: string }
// };

// const mailsAdapter: EntityAdapter<IMail> = createEntityAdapter({
//     // sortComparer:()=>
// })
// const initialState = mailsAdapter.getInitialState({})

export const mailsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addOrderMail: builder.mutation<
      EntityState<IMail>,
      {
        email: string;
        message: string;
      }
    >({
      query: (initialMailData) => {
        return {
          url: '/mails',
          method: 'POST',
          body: {
            ...initialMailData,
          },
        };
      },
      // invalidatesTags: [
      //     { type: 'Mail', id: "LIST" }
      // ]
    }),

    checkEmail: builder.mutation<{ message: string }, { email: string }>({
      query: (params) => {
        return {
          url: '/mails/restore',
          method: 'POST',
          body: { ...params },
        };
      },
      invalidatesTags: [{ type: 'Mail', id: 'LIST' }],
    }),

    createPassword: builder.mutation<
      { accessToken: string; message: string },
      { password: string }
    >({
      query: (params) => {
        return {
          url: '/mails/create',
          method: 'POST',
          body: { ...params },
        };
      },
      invalidatesTags: [{ type: 'Mail', id: 'LIST' }],
    }),

    sendMessage: builder.mutation<{ message: string }, { text: string; username: string }>({
      query: (params) => {
        return {
          url: '/mails/message',
          method: 'POST',
          body: { ...params },
        };
      },
      invalidatesTags: [{ type: 'Mail', id: 'LIST' }],
    }),
  }),
});

export const {
  useAddOrderMailMutation,
  useCheckEmailMutation,
  useCreatePasswordMutation,
  useSendMessageMutation,
} = mailsApiSlice;
