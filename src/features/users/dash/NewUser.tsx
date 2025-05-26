import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAddNewUserMutation } from '../usersApiSlice';
import useTitle from '../../../hooks/useTitle';
import SelectedRoles from '../../../components/dash/SelectedRoles';
import { PulseLoader } from 'react-spinners';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';
import { IOption } from '../../../types/IOption';

const USER_REGEX = /^[A-zА-я0-9\s?]{3,20}$/;
const EMAIL_REGEX = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NewUser = () => {
  useTitle('New User Page');

  const navigate = useNavigate();

  const inputAvatarFileRef = useRef<HTMLInputElement>(null);

  const [addNewUser, { data, isLoading, isSuccess, isError, error }] = useAddNewUserMutation();

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState<IOption[]>([]);
  const [avatar, setAvatar] = React.useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess) {
      setUsername('');
      setEmail('');
      setPassword('');
      setRoles([]);
      setAvatar(null);
      navigate('/dash', { state: { successNew: isSuccess, messageNew: data?.message } });
    }
  }, [isSuccess, navigate, data?.message]);

  const createAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let files: File[] = [];
    if (event.target.files?.length === 1) {
      const fileObj = event.target.files;
      files = Object.values(fileObj);
    }
    setAvatar('');

    files.forEach((file) => {
      const reader = new FileReader();
      // const arr: ((prevState: string[]) => string[]) | (string | ArrayBuffer)[] = [];
      reader.onload = () => {
        if (reader.readyState === 2) {
          // setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file); //load in buffer
    });
  };

  const onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  const onEmailChanged = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const canSave =
    [roles?.length, validUsername, validEmail, validPassword].every(Boolean) && !isLoading;

  const onSaveUserClicked = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canSave) {
      // console.log({ username, email, password, roles, avatar });
      await addNewUser({
        username,
        email,
        password,
        roles: roles ?? undefined,
        avatar: avatar ?? null,
      });
    }
  };

  const errClass = isError ? 'errmsg' : 'offscreen';
  const validUserClass = !validUsername ? 'form__input--incomplete' : '';
  const validEmailClass = !validEmail ? 'form__input--incomplete' : '';
  const validPwdClass = !validPassword ? 'form__input--incomplete' : '';
  const validRolesClass = !Boolean(roles?.length) ? 'form__input--incomplete' : '';
  // const validAvatarClass = !Boolean(avatar) ? 'form__input--incomplete' : '';

  const handleDeleteFile = () => {
    setAvatar(null);
  };

  useCreateAndRemoveToast(isError, error?.data?.message, 'error');

  useCreateAndRemoveToast(isSuccess, data?.message as string, 'success');

  let content = <></>;
  if (isLoading) content = <PulseLoader color={'#000'} />;
  else {
    content = (
      <div className="card card-primary" style={{ boxShadow: 'none', backgroundColor: '#f4f6f9' }}>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Create New User</h1>
                <p className={errClass}>{error?.data?.message}</p>
                {/* <p style={{ color: 'green' }}>{data?.message}</p> */}
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/dash">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">newUser</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <form className="form" onSubmit={onSaveUserClicked}>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="exampleInputName1">User name</label>
              <input
                type="text"
                className={`form-control form__input ${validUserClass}`}
                id="exampleInputName1"
                placeholder="Enter name"
                value={username}
                onChange={onUsernameChanged}
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                className={`form-control form__input ${validEmailClass}`}
                id="exampleInputEmail1"
                placeholder="Enter email"
                value={email}
                onChange={onEmailChanged}
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                className={`form-control form__input ${validPwdClass}`}
                id="exampleInputPassword1"
                placeholder="Password"
                value={password}
                onChange={onPasswordChanged}
              />
            </div>
            <div className="form-group" style={{ zIndex: 1000, position: 'relative' }}>
              <label htmlFor="roles">Roles(only one)</label>
              <SelectedRoles validRolesClass={validRolesClass} onChangeValue={setRoles} />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputFile">Avatar</label>
              <div className={`input-group `}>
                {avatar ? (
                  <div
                    className="custom-file"
                    style={{
                      border: '1px solid #ccc',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <img width="37px" src={avatar as string} alt="Preview" />
                    <i
                      className="fa fa-window-close"
                      aria-hidden="true"
                      style={{ fontSize: 40 }}
                      onClick={handleDeleteFile}
                    ></i>
                  </div>
                ) : (
                  <>
                    <div className="custom-file">
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
                        className="custom-file-label"
                        htmlFor="exampleInputFile"
                        onClick={() => {
                          if (inputAvatarFileRef.current) inputAvatarFileRef.current.click();
                        }}
                      >
                        Input File, Not Required
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="ml-4 ">
            <button type="submit" className="btn btn-primary" disabled={!canSave}>
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }

  return <>{content}</>;
};

export default NewUser;
