import { IComment } from '../types/IComment';
import { IAllPosts } from '../features/posts/postsApiSlice';
import { EntityId } from '@reduxjs/toolkit';
import { ICategory } from '../types/ICategory';

export const findElementInTree = (
  array: IComment[],
  id: string,
  tail: IComment[] = [],
): IComment => {
  for (const obj of array) {
    if (obj.id === id) {
      tail.push(obj);
      return obj;
    }
    if (obj.children) {
      // const childrenTail = findById(obj.children, id, [...tail].concat(obj));
      const child = findElementInTree(obj.children, id, tail);
      if (child.children) return child;
    }
  }
  return {} as IComment;
};

export const excludeElementFromPostArray = (
  data: IAllPosts | undefined,
  ID = '67cbf8241700cd5c2cfed4ff',
): EntityId[] => {
  const newArray = [] as EntityId[];
  for (const item of data ? data.ids : []) {
    if (data?.entities[item]?.category.title.toLowerCase() === 'home') continue;
    if (data?.entities[item]?._id === '67cbf8241700cd5c2cfed4ff') continue;
    else newArray.push(item);
  }
  return newArray;
};
