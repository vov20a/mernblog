import { IPostType } from './IPostType';
import { IUser } from './IUserType';

export interface ILikesComment {
  count: number;
  usersArray: string[];
}

export interface IComment {
  _id: string;
  id: string;
  text: string;
  user: IUser;
  post: IPostType;
  parentComment: string;
  likes: ILikesComment;
  children: IComment[];
  createdAt: Date;
  updatedAt: Date;
}
