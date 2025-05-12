import { createEntityAdapter, EntityState, EntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';
import { ICategory } from '../../types/ICategory';

export type IAllCategories = EntityState<ICategory> & { categories: ICategory[] } & {
  count: number;
} & { message: string };
export type IAllCategoriesEnter = { categories: ICategory[] } & { count: number } & {
  message: string;
};

type ICreateCategory = {
  title: string;
  parentCategory: null | string;
};
type IUpdateCategory = {
  id: string | undefined;
  title: string | undefined;
  parentCategory: null | string;
};

const categoriesAdapter: EntityAdapter<ICategory> = createEntityAdapter({
  // sortComparer: (a: IAllCategories, b: IAllCategories) =>{} a.entities[a.ids[0]]?.position.localeCompare(b.entities[b.ids[0]]?.position),
});
const initialState = categoriesAdapter.getInitialState({});

let initialAllState = categoriesAdapter.getInitialState<IAllCategories>({
  ids: [],
  entities: {},
  categories: [],
  count: 0,
  message: '',
});

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<IAllCategories, {}>({
      query: () => ({
        url: '/categories',
        validateStatus: (response: { status: number }, result: { isError: boolean }) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData: IAllCategoriesEnter): IAllCategories => {
        const loadedCategories = responseData.categories.map((category) => {
          category.id = category._id;
          category.children = [];
          return category;
        });
        initialAllState.categories = loadedCategories;
        initialAllState.count = responseData.count;
        initialAllState.message = responseData.message;

        return categoriesAdapter.setAll(initialAllState, loadedCategories);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Category', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Category' as const, id })),
          ];
        } else return [{ type: 'Category', id: 'LIST' }];
      },
    }),

    getOneCategory: builder.query<EntityState<ICategory>, { title: string }>({
      query: ({ title }) => ({
        url: `/categories/${title}`,
        validateStatus: (response: any, result: any) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData: ICategory) => {
        responseData.id = responseData._id;

        return categoriesAdapter.setOne(initialState, responseData);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Category', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Category' as const, id })),
          ];
        } else return [{ type: 'Category', id: 'LIST' }];
      },
    }),
    addNewCategory: builder.mutation<{ message: string }, ICreateCategory>({
      query: (initialData) => ({
        url: '/categories',
        method: 'POST',
        body: {
          ...initialData,
        },
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    updateCategory: builder.mutation<IAllCategories, IUpdateCategory>({
      query: (initialData) => ({
        url: '/categories',
        method: 'PATCH',
        body: {
          ...initialData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Category', id: arg.id }],
    }),
    deleteCategory: builder.mutation<{ message: string }, { id: string | undefined }>({
      query: ({ id }) => ({
        url: `/categories`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Category', id: arg.id }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetOneCategoryQuery,
  useAddNewCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApiSlice;
