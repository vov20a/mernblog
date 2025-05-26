import { createSelector, createEntityAdapter, EntityState, EntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';
import { IUser } from '../../types/IUserType';
import { RootState } from '../../app/store';

export interface UsersResponse {
  ids: string[];
  entities: { id: string };
}

export type IGetUsers = EntityState<IUser> & { users: IUser[] } & { usersCount: number } & {
  message: string;
};

export type IAllUsers = EntityState<IUser> & { users: IUser[] } & { usersCount: number } & {
  resultPerPage: number;
} & { filteredUsersCount: number };

export type IGetUsersEnter = { users: IUser[] } & { usersCount: number } & { message: string };

export type IAllUsersEnter = { users: IUser[] } & { usersCount: number } & {
  resultPerPage: number;
} & { filteredUsersCount: number };

const usersAdapter: EntityAdapter<IUser> = createEntityAdapter({
  // sortComparer:()=>
});
const initialState = usersAdapter.getInitialState({});

let initialGetState = usersAdapter.getInitialState<IGetUsers>({
  ids: [],
  entities: {},
  users: [],
  usersCount: 0,
  message: '',
});
let initialAllState = usersAdapter.getInitialState<IAllUsers>({
  ids: [],
  entities: {},
  users: [],
  usersCount: 0,
  resultPerPage: 0,
  filteredUsersCount: 0,
});

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<IGetUsers, string>({
      query: () => ({
        url: '/users',
        validateStatus: (response: { status: number }, result: { isError: boolean }) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData: IGetUsersEnter): IGetUsers => {
        const loadedUsers = responseData.users.map((user) => {
          user.id = user._id;
          return user;
        });
        initialGetState.users = loadedUsers;
        initialGetState.usersCount = responseData.usersCount;
        initialGetState.message = responseData.message;

        return usersAdapter.setAll(initialGetState, loadedUsers);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'User', id: 'LIST' },
            ...result.ids.map((id) => ({
              type: 'User' as 'User' | 'Post' | 'Category' | 'Mail',
              id,
            })),
            { type: 'User', id: 'DEL' },
          ];
        } else
          return [
            { type: 'User', id: 'LIST' },
            { type: 'User', id: 'DEL' },
          ];
      },
    }),
    getAllUsers: builder.query<IAllUsers, string>({
      query: (query = '') => ({
        url: query !== 'usersList' ? `/users/all/?${query}` : '/users/all',
        validateStatus: (response: { status: number }, result: { isError: boolean }) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData: IAllUsersEnter): IAllUsers => {
        const loadedUsers = responseData.users.map((user) => {
          user.id = user._id;
          return user;
        });
        initialAllState.users = loadedUsers;
        initialAllState.usersCount = responseData.usersCount;
        initialAllState.resultPerPage = responseData.resultPerPage;
        initialAllState.filteredUsersCount = responseData.filteredUsersCount;

        return usersAdapter.setAll(initialAllState, loadedUsers);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'User', id: 'LIST' },
            ...result.ids.map((id) => ({
              type: 'User' as 'User' | 'Post' | 'Category' | 'Mail',
              id,
            })),
            { type: 'User', id: 'DEL' },
          ];
        } else
          return [
            { type: 'User', id: 'LIST' },
            { type: 'User', id: 'DEL' },
          ];
      },
    }),
    addNewUser: builder.mutation<
      { message: string },
      {
        username: string;
        email: string;
        password: string;
        roles: ('User' | 'Author' | 'Admin')[] | undefined;
        avatar: string | ArrayBuffer | null;
      }
    >({
      query: (initialUserData) => ({
        url: '/users',
        method: 'POST',
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    updateUser: builder.mutation<
      { message: string },
      {
        id: string | undefined;
        username: string | undefined;
        email: string | undefined;
        password?: string | undefined;
        roles: ('User' | 'Author' | 'Admin')[] | undefined;
        avatar?: string | ArrayBuffer | null;
      }
    >({
      query: (initialUserData) => ({
        url: '/users',
        method: 'PATCH',
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),
    updateUserPassword: builder.mutation<{ message: string }, { id: string; password: string }>({
      query: ({ id, password }) => ({
        url: '/users/password',
        method: 'PATCH',
        body: { id, password },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),

    updateUserAvatar: builder.mutation<
      { message: string },
      { id: string; avatar: string | ArrayBuffer | null }
    >({
      query: ({ id, avatar }) => ({
        url: '/users/avatar',
        method: 'PATCH',
        body: { id, avatar },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),

    deleteUser: builder.mutation<{ message: string }, { id: string | undefined }>({
      query: ({ id }) => ({
        url: `/users`,
        method: 'DELETE',
        body: { id },
      }),
      // invalidatesTags: (result, error, arg) => ([
      //     { type: 'User', id: arg.id }
      // ])
      invalidatesTags: [{ type: 'User', id: 'DEL' }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetAllUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
  useUpdateUserAvatarMutation,
  useDeleteUserMutation,
} = usersApiSlice;

// returns the query result object
//@ts-ignore
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select({});

// creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data, // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors((state: RootState) => selectUsersData(state) ?? initialState);
