import { useParams } from 'react-router-dom';
import EditUserForm from './EditUserForm';
import { PulseLoader } from 'react-spinners';
import { useGetUsersQuery } from '../usersApiSlice';
import { IUser } from '../../../types/IUserType';

const EditUser = () => {
  const { id } = useParams();

  const { user } = useGetUsersQuery(`usersList`, {
    selectFromResult: ({ data }) => ({
      user: id ? data?.entities[id] : ({} as IUser),
    }),
  });

  const content = user ? <EditUserForm user={user} /> : <PulseLoader color={'#000'} />;

  return content;
};

export default EditUser;
