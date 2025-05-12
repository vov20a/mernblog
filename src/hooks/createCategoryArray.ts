import { useMemo } from 'react';
import { ICategory } from '../types/ICategory';

export const useCreateCategoryArray = (catsArray: ICategory[]) => {
  const Tree = useMemo(() => {
    //make copy []
    const array: ICategory[] = catsArray.map((item) => {
      let obj: ICategory = {} as ICategory;
      obj = structuredClone(item);
      return obj;
    });
    let makeTree = (catsArray: ICategory[]) =>
      catsArray.filter((item: ICategory) => {
        // создаем у каждого элемента массив из ссылок на его потомков
        item.children = catsArray.filter((i: ICategory) => i.parentCategory === item.id);
        // оставляем в фильтруемом массиве только элементы верхнего уровня
        return item.parentCategory === null;
      });
    return makeTree(array);
  }, [catsArray]);

  return Tree;

  //another func
  // const makeTree = (array: ICategory[]) =>
  //   array
  //     .reduce((a: ICategory[], c: ICategory) => {
  //       c.children = array.filter((i) => i.parentCategory === c.id);
  //       a.push(c);
  //       return a;
  //     }, [])
  //     .filter((i: ICategory) => i.parentCategory === null);
  //resource data
  // let array:ICategory[] = [
  //   {id: '5', title: 'vueJS', parentCategory: '3',_id:'5', createdAt:new Date(), updatedAt:new Date(), children:[]},
  //   {id: '6', title: 'reactJS', parentCategory: '3',_id:'6', createdAt:new Date(), updatedAt:new Date(), children:[]},
  //   {id: '3', title: 'js', parentCategory: '1',_id:'3', createdAt:new Date(), updatedAt:new Date(), children:[]},
  //   {id: '1', title: 'dev', parentCategory: null,_id:'1', createdAt:new Date(), updatedAt:new Date(), children:[]},
  //   {id: '4', title: 'photoshop', parentCategory: '2',_id:'4', createdAt:new Date(), updatedAt:new Date(), children:[]},
  //   {id: '2', title: 'UX', parentCategory: null,_id:'2', createdAt:new Date(), updatedAt:new Date(), children:[]}
  // ];
};
