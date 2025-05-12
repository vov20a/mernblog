import React, { useEffect, useRef, useState } from 'react';
import { useRegisterMutation } from '../authApiSlice';
import usePersist from '../../../hooks/usePersist';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/store';
import { RingLoader } from 'react-spinners';
import { setCredentials } from '../authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../login/login.css';
import useTitle from '../../../hooks/useTitle';

const USER_REGEX = /^[A-zА-я0-9\s]{3,20}$/;
const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PWD_REGEX = /^[A-zА-я0-9!@#$%]{4,12}$/;

const Register = () => {
  useTitle('Register Page');

  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);
  const inputAvatarFileRef = React.useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [persist, setPersist] = usePersist();

  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(null);

  // console.log(avatar);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email, password, username]);

  const canSave = [validUsername, validEmail, validPassword].every(Boolean) && !isLoading;

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { accessToken } = await register({
        username,
        email,
        password,
        avatar: avatar ?? null,
      }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername('');
      setEmail('');
      setPassword('');
      navigate('/');
    } catch (err: any) {
      if (!err.status) {
        setErrMsg('No Server Response');
      }
      //  else if (err.status === 400) {
      //   setErrMsg('Missing Username or Password or Username');
      // } else if (err.status === 401) {
      //   setErrMsg('Unauthorized ');
      // }
      else {
        setErrMsg(err.data?.message);
      }
      if (errRef.current) {
        errRef.current.focus();
      }
    }
  };

  const handleUsernameInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePwdInput = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev: boolean) => !prev);

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

  const handleDeleteFile = () => {
    setAvatar(null);
  };

  const errClass = errMsg ? 'errmsg' : 'offscreen';
  const validUserClass = !validUsername ? 'form__input--incomplete' : 'form__input--complete';
  const validEmailClass = !validEmail ? 'form__input--incomplete' : 'form__input--complete';
  const validPwdClass = !validPassword ? 'form__input--incomplete' : 'form__input--complete';

  if (isLoading) return <RingLoader color={'#000'} className="pulse-loader" />;

  return (
    <div className="login">
      <div className="container">
        <div className="login__inner">
          <h3 className="login__title">Register</h3>
          <p ref={errRef} className={errClass} aria-live="assertive">
            {errMsg}
          </p>
          <form className="login__form" onSubmit={handleSubmit}>
            <div className="login__form-username">
              <FontAwesomeIcon icon="user" className="login__form-icon" />
              <input
                placeholder="Username"
                type="text"
                id="username"
                className={`login__form-input form__input ${validUserClass}`}
                ref={userRef}
                value={username}
                onChange={handleUsernameInput}
                required
              />
            </div>
            <div className="login__form-email">
              <FontAwesomeIcon icon="mail-bulk" className="login__form-icon" />
              <input
                placeholder="Email"
                type="email"
                id="email"
                className={`login__form-input form__input ${validEmailClass}`}
                value={email}
                onChange={handleEmailInput}
                required
              />
            </div>
            <div className="login__form-password">
              <FontAwesomeIcon icon="lock" className="login__form-icon" />
              <input
                placeholder="Password"
                type="password"
                id="password"
                className={`login__form-input form__input ${validPwdClass}`}
                onChange={handlePwdInput}
                value={password}
                required
              />
            </div>
            <div className="register__form-avatar">
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
                        Input Avatar (not required)
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
            <label htmlFor="persist" className="form__persist">
              <input
                type="checkbox"
                className="form__checkbox"
                id="persist"
                onChange={handleToggle}
                checked={persist}
              />
              Trust Me
            </label>
            <button disabled={!canSave} className="login__form-btn" type="submit">
              Submit
            </button>
          </form>
          <div className="login__service">
            <Link to="/forgot" className="login__forgot">
              Forgot Password
            </Link>
            <Link to="/login" className="login__register">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
