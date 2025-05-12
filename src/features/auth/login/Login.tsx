import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../../../app/store';
import { setCredentials } from './../authSlice';
import { useLoginMutation } from './../authApiSlice';
import RingLoader from 'react-spinners/RingLoader';
import usePersist from '../../../hooks/usePersist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './login.css';

const Login = () => {
  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email, password]);

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ email, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setEmail('');
      setPassword('');
      navigate('/');
    } catch (err: any) {
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.status === 401) {
        setErrMsg('Unauthorized ');
      } else {
        setErrMsg(err.data?.message);
      }
      if (errRef.current) {
        errRef.current.focus();
      }
    }
  };

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePwdInput = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev: boolean) => !prev);

  const errClass = errMsg ? 'errmsg' : 'offscreen';

  if (isLoading) return <RingLoader color={'#000'} className="pulse-loader" />;

  return (
    <div className="login">
      <div className="container">
        <div className="login__inner">
          <p ref={errRef} className={errClass} aria-live="assertive">
            {errMsg}
          </p>
          <h3 className="login__title">Login</h3>
          <form className="login__form" onSubmit={handleSubmit}>
            <div className="login__form-email">
              <FontAwesomeIcon icon="mail-bulk" className="login__form-icon" />
              <input
                className="login__form-input"
                placeholder="Email"
                type="email"
                id="email"
                ref={userRef}
                value={email}
                onChange={handleEmailInput}
                required
              />
            </div>
            <div className="login__form-password">
              <FontAwesomeIcon icon="lock" className="login__form-icon" />
              <input
                className="login__form-input"
                placeholder="Password"
                type="password"
                id="password"
                onChange={handlePwdInput}
                value={password}
                required
              />
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
            <button
              className="login__form-btn"
              type="submit"
              disabled={!Boolean(email) || !Boolean(password)}
            >
              Login
            </button>
          </form>
          <div className="login__service">
            <Link to="/forgot" className="login__forgot">
              Forgot Password
            </Link>
            <Link to="/register" className="login__register">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
