export interface ICategory {
  _id: string;
  id: string;
  title: string;
  parentCategory: string | null;
  createdAt: Date;
  updatedAt: Date;
  children: ICategory[];
}
