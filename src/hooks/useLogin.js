import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useEffect, useState } from 'react';
import { useRefreshMutation } from '../features/auth/authApiSlice';
import useAuth from '../hooks/useAuth';

export const useLogin = () => {
  const dispatch = useDispatch();
  const [isLogin, setLogin] = useState(false);
  const { id, username, avatarUrl, isAuthor, isAdmin, status, roles } = useAuth();
  const [refresh, { isLoading }] = useRefreshMutation();

  useEffect(() => {
    const prefetchToken = async () => {
      try {
        const result = await refresh();
        if (result.data) {
          // console.log(result.data);
          dispatch(setCredentials(result.data));
        } else {
          setLogin(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    prefetchToken();
  }, [dispatch, refresh]);

  useEffect(() => {
    setLogin(true);
  }, [username]);

  return { id, username, avatarUrl, isAuthor, isAdmin, isLogin, isLoading, status, roles };
};
