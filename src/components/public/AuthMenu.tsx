import { useLogin } from '../../hooks/useLogin';
import RingLoader from 'react-spinners/RingLoader';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSendLogoutMutation } from '../../features/auth/authApiSlice';
import { useClickOutside } from '../../hooks/useClickOutside';

const AuthMenu = () => {
  const { username, avatarUrl, isAuthor, isAdmin, status, isLogin, isLoading } = useLogin();

  const navigate = useNavigate();

  const [sendLogout, { isSuccess }] = useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate('/login');
  }, [isSuccess, navigate]);

  const [isOpen, setOpen] = useState(false);
  const menuRef = useRef(null);
  useClickOutside(menuRef, () => {
    if (isOpen) setTimeout(() => setOpen(false), 200);
  });

  if (isLoading)
    return <RingLoader className="auth-header" key={Math.random()} style={{ width: 30 }} />;

  return (
    <header className="auth-header">
      {isLogin ? (
        <button className="menu-button" onClick={() => setOpen(!isOpen)}>
          <img src={avatarUrl} alt="avatar" style={{ width: 35, borderRadius: '50%' }} />
        </button>
      ) : (
        <li className="auth-menu__item menu-button">
          <Link to="/login">Login</Link>
        </li>
      )}
      <nav className={`auth-menu ${isOpen ? 'active' : ''}`} ref={menuRef}>
        {isOpen && (
          <ul className="auth-menu__list">
            <li className="auth-menu__item">{username}</li>
            <li className="auth-menu__item">
              <button className="icon-button" title="Logout" onClick={sendLogout}>
                Logout
              </button>
            </li>
            <li className="auth-menu__item" onClick={() => setOpen(false)}>
              <Link to={`/account`}>Account</Link>
            </li>
            {isAdmin && status === 'Admin' && (
              <li className="auth-menu__item" onClick={() => setOpen(false)}>
                <Link to="/dash">Dash</Link>
              </li>
            )}
            {isAuthor && status === 'Author' && (
              <li className="auth-menu__item" onClick={() => setOpen(false)}>
                <Link to="/author">Author</Link>
              </li>
            )}
            {((isAuthor && status === 'Author') || (isAdmin && status === 'Admin')) && (
              <li className="auth-menu__item" onClick={() => setOpen(false)}>
                <Link to="/mainchat">Chat</Link>
              </li>
            )}
          </ul>
        )}
      </nav>
    </header>
  );
};
export default AuthMenu;
