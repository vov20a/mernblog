import React, { useEffect, useRef, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../../types/IUserType';
import useTitle from '../../hooks/useTitle';
import { useDebounce } from '../../hooks/debounce';
import Sidebar from '../../components/public/Sidebar';
import { useGetUsersQuery, useUpdateUserPasswordMutation } from './usersApiSlice';
import { PulseLoader } from 'react-spinners';
import { useCreateAndRemoveToast } from '../../hooks/useCreateAndRemoveToast';
import { useSendLogoutMutation } from '../auth/authApiSlice';
import SearchForm from '../../components/public/SearchForm';
import '../auth/login/login.css';

const CreateNewPassword = () => {
  const { id: userId, username } = useAuth();

  useTitle(`Password of  ${username}`);

  const navigate = useNavigate();

  const userRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<{ id: string; password: string }>({ id: '', password: '' });
  const [search, setSearch] = useState<string>('');
  const [user, setUser] = useState<IUser>({} as IUser);
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>();
  const [coinsedence, setCoinsedence] = useState<boolean>(false);
  const [showIconsPass, setShowIconsPass] = useState<boolean>(false);
  const [showIconsConf, setShowIconsConf] = useState<boolean>(false);

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (password !== '' && confirm !== '' && password === confirm) {
      setCoinsedence(true);
      setQuery({ id: user.id, password });
    } else {
      setCoinsedence(false);
    }
  }, [password, confirm, user]);

  const [updatePassword, { data, isSuccess, isLoading, isError, error }] =
    useUpdateUserPasswordMutation();

  const [sendLogout, { isSuccess: isSuccessLogout }] = useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) sendLogout({});
    if (isSuccessLogout) navigate('/login');
  }, [isSuccess, isSuccessLogout, navigate, sendLogout]);

  const { userData, isSuccessUser } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data, isSuccess }) => ({
      userData: data?.entities[userId ?? ''],
      isSuccessUser: isSuccess,
    }),
  });

  useEffect(() => {
    if (isSuccessUser) setUser(userData ?? ({} as IUser));
  }, [userData, isSuccessUser]);

  const debounced = useDebounce(search, 500);
  useEffect(() => {
    if (debounced.length > 2) {
      navigate('/search', { state: debounced });
    }
  }, [debounced, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updatePassword(query);
    setConfirm('');
    setPassword('');
  };

  useCreateAndRemoveToast(isError, error?.data?.message || 'Server Error', 'error');

  useCreateAndRemoveToast(isSuccess, data ? data.message : 'Success', 'success');

  let content = <></>;

  if (isLoading) content = <PulseLoader color={'#000'} />;

  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;

  if (isSuccessUser) {
    content = (
      <div className="login" style={{ width: '100%' }}>
        <div className="login__inner-password">
          <h3 className="login__title">Form</h3>
          <form className="password-form" onSubmit={(e) => handleSubmit(e)}>
            <p className="password-input-box">
              Новый пароль
              <input
                className=""
                ref={userRef}
                type={showIconsPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="password-icons" onClick={() => setShowIconsPass((prev) => !prev)}>
                <i className={`fa fa-eye${showIconsPass ? '' : '-slash'}`} aria-hidden="true"></i>
              </span>
            </p>
            <p className="password-input-box">
              Повторите пароль
              <input
                className=""
                type={showIconsConf ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <span className="password-icons" onClick={() => setShowIconsConf((prev) => !prev)}>
                <i className={`fa fa-eye${showIconsConf ? '' : '-slash'}`} aria-hidden="true"></i>
              </span>
            </p>
            <button className="password-btn" type="submit" disabled={!coinsedence}>
              Сохранить
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <section className="single-blog-area">
      <div className="container">
        <div className="row mt-3 breadcrumbs-search">
          <div className="col-md-8 title-breadcrumbs">
            <h1>Create New Password : {user?.username}</h1>
          </div>
          <div className="col-md-4 category-posts  justify-content-end">
            <SearchForm search={search} setSearch={setSearch} />
          </div>
        </div>
        <div className="row  posts-align">
          <div className="col-md-8">
            <div className="blog-post-area posts-center">{content}</div>
          </div>
          <Sidebar currentUser={user} />
        </div>
      </div>
    </section>
  );
};
export default CreateNewPassword;
