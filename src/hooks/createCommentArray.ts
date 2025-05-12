import { useMemo } from 'react';
import { IComment } from '../types/IComment';

export const useCreateCommentArray = (catsArray: IComment[]) => {
  const Tree = useMemo(() => {
    //make copy []
    const array: IComment[] = catsArray.map((item) => {
      let obj: IComment = {} as IComment;
      obj = structuredClone(item);
      return obj;
    });
    let makeTree = (catsArray: IComment[]) =>
      catsArray.filter((item: IComment) => {
        // создаем у каждого элемента массив из ссылок на его потомков
        item.children = catsArray.filter((i: IComment) => i.parentComment === item._id);
        // оставляем в фильтруемом массиве только элементы верхнего уровня
        return item.parentComment === null;
      });
    return makeTree(array);
  }, [catsArray]);

  return Tree;
};
