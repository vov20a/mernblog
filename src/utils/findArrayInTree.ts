import { ICategory } from '../types/ICategory';

type FuncType<T> = (array: T[], id: string, tail?: T[]) => T[];

export const findArrayInTree: FuncType<ICategory> = (array, id, tail = []) => {
  for (const obj of array) {
    if (obj.id === id) {
      tail.push(obj);
      return tail;
    }
    if (obj.children) {
      const childrenTail = findArrayInTree(obj.children, id, [...tail].concat(obj));
      //   const child = findElementInTree(obj.children, id, tail);
      if (childrenTail.length) return childrenTail;
    }
  }
  return [] as ICategory[];
};

export const findArrayInCategoriesTree = (
  array: ICategory[],
  id: string,
  tail: ICategory[] = [],
): ICategory[] => {
  for (const obj of array) {
    if (obj.id === id) {
      tail.push(obj);
      return tail;
    }
    if (obj.children) {
      const childrenTail = findArrayInCategoriesTree(obj.children, id, [...tail].concat(obj));
      //   const child = findElementInTree(obj.children, id, tail);
      if (childrenTail.length) return childrenTail;
    }
  }
  return [] as ICategory[];
};
