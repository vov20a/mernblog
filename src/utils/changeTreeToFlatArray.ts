import { ICategory } from '../types/ICategory';

type IFlattenExit =
  | {
      id: string;
      children: ICategory[];
    }[]
  | [];

type IFlatten = {
  (tree: ICategory[]): IFlattenExit;
};
//получаем плоский массив со всеми детьми
export const flatten: IFlatten = (tree: ICategory[]): IFlattenExit =>
  tree.flatMap(({ id, children }) => [{ id, children }, ...flatten(children || [])]);

//получаем плоский массив со id у которых нет детей,т.е. категории с постами
export const flattenClean = (flatArr: IFlattenExit): string[] => {
  const arr: string[] = [] as string[];
  for (let obj of flatArr) {
    if (obj.children.length === 0) {
      arr.push(obj.id);
    }
  }
  return arr;
};
