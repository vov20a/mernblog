import { IComment } from '../types/IComment';

export const createCommentsPostTree = (comments: (IComment | undefined)[]) => {
  const array: (IComment | undefined)[] = comments.map((item) => {
    let obj: IComment | undefined;
    obj = structuredClone(item);
    return obj;
  });
  let makeTree = (catsArray: IComment[]) =>
    catsArray.filter((item: IComment) => {
      item.children = catsArray.filter((i: IComment) => i.parentComment === item.id);
      return item.parentComment === null;
    });
  return makeTree(array as unknown as IComment[]);
};
