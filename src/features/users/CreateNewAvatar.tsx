import React, { useEffect, useRef, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useTitle from '../../hooks/useTitle';
import { useNavigate } from 'react-router-dom';
import { useGetUsersQuery, useUpdateUserAvatarMutation } from './usersApiSlice';
import { useDebounce } from '../../hooks/debounce';
import { useCreateAndRemoveToast } from '../../hooks/useCreateAndRemoveToast';
import { PulseLoader } from 'react-spinners';
import SearchForm from '../../components/public/SearchForm';
import Sidebar from '../../components/public/Sidebar';
import { IUser } from '../../types/IUserType';
import { useSendLogoutMutation } from '../auth/authApiSlice';

const CreateNewAvatar = () => {
  const { id: userId, username, avatarUrl } = useAuth();

  useTitle(`Avatar of  ${username}`);

  const navigate = useNavigate();

  const inputAvatarFileRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<{ id: string; avatar: string | ArrayBuffer | null }>({
    id: '',
    avatar: '',
  });
  const [search, setSearch] = useState<string>('');
  const [user, setUser] = useState<IUser>({} as IUser);
  const [avatar, setAvatar] = React.useState<string | ArrayBuffer | null>(null);
  const [oldAvatar, setOldAvatar] = useState<string | undefined>(avatarUrl);

  const [updateAvatar, { data, isSuccess, isLoading, isError, error }] =
    useUpdateUserAvatarMutation();

  useEffect(() => {
    if (avatar !== null) {
      setQuery({ id: user.id, avatar });
    }
  }, [avatar, user]);

  const { userData, isSuccessUser } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data, isSuccess }) => ({
      userData: data?.entities[userId ?? ''],
      isSuccessUser: isSuccess,
    }),
  });

  useEffect(() => {
    if (isSuccessUser) setUser(userData ?? ({} as IUser));
  }, [userData, isSuccessUser]);

  const [sendLogout, { isSuccess: isSuccessLogout }] = useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) {
        sendLogout({});
        setAvatar(null)
    }
    if (isSuccessLogout) navigate('/login');
  }, [isSuccess, isSuccessLogout, navigate, sendLogout]);

  const debounced = useDebounce(search, 500);
  useEffect(() => {
    if (debounced.length > 2) {
      navigate('/search', { state: debounced });
    }
  }, [debounced, navigate]);

  useCreateAndRemoveToast(isError, error?.data?.message || 'Server Error', 'error');

  useCreateAndRemoveToast(isSuccess, data ? data.message : 'Success', 'success');

  useEffect(() => {
    if (isError) {
      setAvatar(avatar);
      setOldAvatar(oldAvatar);
    }
  }, [isError, avatar, oldAvatar]);

  const createAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let files: File[] = [];
    if (event.target.files?.length === 1) {
      const fileObj = event.target.files;
      files = Object.values(fileObj);
    }
    setAvatar(null);
    setOldAvatar('');

    files.forEach((file) => {
      const reader = new FileReader();
      // const arr: ((prevState: string[]) => string[]) | (string | ArrayBuffer)[] = [];
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file); //load in buffer
    });
  };

  const canSave = avatar !== null && user?.id !== null && !isLoading;
  console.log(canSave);
  console.log({ id: user?.id, avatar });
  const onSaveAvatarClicked = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canSave) {
      await updateAvatar(query);
    }
  };

  const validAvatarClass =
    avatar === null && oldAvatar === undefined ? 'form__input--incomplete' : '';

  const handleDeleteFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOldAvatar(undefined);
    setAvatar(null);
  };

  let content = <></>;

  if (isLoading) content = <PulseLoader color={'#000'} />;

  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;
  if (isSuccessUser) {
    content = (
      <div className="login" style={{ width: '100%' }}>
        <div className="login__inner-password">
          <h3 className="login__title">Form</h3>
          <form className="password-form" onSubmit={(e) => onSaveAvatarClicked(e)}>
            <div className="form-group">
              <label htmlFor="exampleInputFile">Avatar</label>
              <div className={`input-group  ${validAvatarClass}`}>
                {oldAvatar ? (
                  <div
                    className="custom-file"
                    style={{
                      border: '1px solid #ccc',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <img
                      style={{ width: '37px', cursor: 'pointer' }}
                      src={oldAvatar as string}
                      alt="Avatar Preview"
                    />
                    <i
                      className="fa fa-window-close"
                      aria-hidden="true"
                      style={{ fontSize: 40, cursor: 'pointer' }}
                      onClick={handleDeleteFile}
                    ></i>
                  </div>
                ) : !avatar ? (
                  <>
                    <div className="custom-file" style={{ cursor: 'pointer' }}>
                      <input
                        ref={inputAvatarFileRef}
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={createAvatarChange}
                        className="custom-file-input"
                        id="exampleInputFile"
                      />
                      <label
                        style={{ cursor: 'pointer' }}
                        className="custom-file-label"
                        htmlFor="exampleInputFile"
                        onClick={() => {
                          if (inputAvatarFileRef.current) inputAvatarFileRef.current.click();
                        }}
                      >
                        Input File
                      </label>
                    </div>
                  </>
                ) : (
                  avatar && (
                    <div
                      className="custom-file"
                      style={{
                        border: '1px solid #ccc',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <img
                        style={{ width: '37px', cursor: 'pointer' }}
                        src={avatar as string}
                        alt=""
                      />
                      <i
                        className="fa fa-window-close"
                        aria-hidden="true"
                        style={{ fontSize: 40, cursor: 'pointer' }}
                        onClick={handleDeleteFile}
                      ></i>
                    </div>
                  )
                )}
              </div>
            </div>
            <button className="password-btn" type="submit" disabled={!canSave}>
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
            <h1>Create New Avatar : {username}</h1>
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

export default CreateNewAvatar;
