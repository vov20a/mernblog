export interface IUser {  
    _id: string;
    id: string;
     username: string;
    email: string;
    roles: ('User' | 'Author' | 'Admin' |undefined)[];
    avatar?: {
        public_id: string,
        url: string,
    },
    createdAt:Date;
    updatedAt:Date;
}