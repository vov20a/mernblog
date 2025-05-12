import { useGetCategoriesQuery } from '../features/categories/categoriesApiSlice';
import { useCreateCategoryArray } from './createCategoryArray';
import { ICategory } from '../types/ICategory';
import { findArrayInTree } from '../utils/findArrayInTree';

type ExitType = {
  breadcrumbs: ICategory[];
  isCatSuccess: boolean;
  currentCategory: ICategory;
};

export const useBaseCategory = (childCategoryId: string): ExitType => {
  const { dataCategories, category, isCatSuccess } = useGetCategoriesQuery('categoriesList', {
    selectFromResult: ({ data, isSuccess }) => ({
      category: data?.categories.find((cat) => cat.id === childCategoryId),
      isCatSuccess: isSuccess,
      dataCategories: data,
    }),
  });

  const catsArray = useCreateCategoryArray(dataCategories ? dataCategories.categories : []);

  const breadcrumbs = findArrayInTree(catsArray, category?._id ?? '');
  const arrLength = breadcrumbs.length;
  const currentCategory = breadcrumbs[arrLength - 1];
  return { breadcrumbs, isCatSuccess, currentCategory };
};
