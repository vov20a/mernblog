import { ICategory } from './ICategory';
import { ILikesComment } from './IComment';
import { IUser } from './IUserType';

export interface IPostType {
  _id?: string;
  id?: string;
  title: string;
  text: string;
  category: ICategory;
  tags: string[];
  views: number;
  user: IUser;
  imageUrl: {
    public_id: string;
    url: string;
  };
  createdAt: Date;
  updatedAt: Date;
  count?: number;
  likes: ILikesComment;
}
