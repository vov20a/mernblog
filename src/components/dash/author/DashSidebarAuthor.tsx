import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../assets/images/AdminLTELogo.png';
import { useOpenDashMenu } from '../../../hooks/useOpenAuthorMenu';
import useAuth from '../../../hooks/useAuth';
interface SidebarProps {
  closeBar: boolean;
  windowLess768: boolean;
  setCloseBar: (value: boolean) => void;
}
interface IFunc {
  openSingleMenu: boolean;
  onClickOpenSingleMenu: () => void;
  //
  openMenuPosts: boolean;
  activeMenuPosts1: boolean;
  activeMenuPosts2: boolean;
  //
  onClickOpenMenuPosts: () => void;
  //
  onClickPostsItem: (e: React.MouseEvent<HTMLLIElement>, num: number) => void;
}

const DashSidebarAuthor = ({ closeBar, windowLess768, setCloseBar }: SidebarProps) => {
  const location = useLocation();
  const { username, avatarUrl, status } = useAuth();

  const {
    openSingleMenu,
    onClickOpenSingleMenu,
    //
    openMenuPosts,
    activeMenuPosts1,
    activeMenuPosts2,
    //
    onClickOpenMenuPosts,
    //
    onClickPostsItem,
  }: IFunc = useOpenDashMenu();

  return (
    <aside
      className="main-sidebar sidebar-dark-primary elevation-4"
      style={
        closeBar
          ? { transform: 'translateX(-150%', transition: 'all 0.5s' }
          : { transition: 'all 0.5s' }
      }
    >
      <div
        className="row"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div className="col-10">
          <Link to="/" className="brand-link">
            <img
              src={logo}
              alt="AdminLTE Logo"
              className="brand-image img-circle elevation-3"
              style={{ opacity: '0.8' }}
            />
            <span className="brand-text font-weight-light">GO SITE</span>
          </Link>
        </div>
        <div className="col-1" style={{ marginRight: 20 }}>
          {windowLess768 && (
            <button
              onClick={() => setCloseBar(true)}
              type="submit"
              className="btn btn-default"
              style={{ padding: 0, backgroundColor: 'transparent', border: 'none' }}
            >
              <i
                className="fa fa-window-close"
                aria-hidden="true"
                style={{ color: '#fff', fontSize: 20 }}
              ></i>
            </button>
          )}
        </div>
      </div>

      <div className="sidebar">
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img src={avatarUrl} className="img-circle elevation-2" alt="User" />
          </div>
          <div className="info">
            <Link to="#" className="d-block">
              {username} : {status}
            </Link>
          </div>
        </div>

        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-item">
              <Link
                to="/author"
                onClick={onClickOpenSingleMenu}
                className={`nav-link ${openSingleMenu ? ' active' : ''} `}
              >
                <i className="nav-icon fas fa-home"></i>
                <p>HOME</p>
              </Link>
            </li>

            <li
              onClick={onClickOpenMenuPosts}
              className={`nav-item has-treeview` + openMenuPosts ? ' open-menu' : ''}
            >
              <Link to="#" className={`nav-link  ${openMenuPosts ? ' active' : ''}`}>
                <i className="nav-icon fas fa-edit"></i>
                <p>
                  POSTS
                  <i
                    className={`right fas fa-angle-left posts author ${
                      openMenuPosts ? ' rotate' : ''
                    } ${openMenuPosts ? ' author-active' : ''}`}
                  ></i>
                </p>
              </Link>
              <ul className="nav nav-treeview" style={openMenuPosts ? { display: 'block' } : {}}>
                <li className="nav-item" onClick={(e) => onClickPostsItem(e, 1)}>
                  <Link
                    to="/author/posts"
                    className={`nav-link  ${activeMenuPosts1 ? ' active' : ''}`}
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>PostsList</p>
                  </Link>
                </li>
                <li className="nav-item" onClick={(e) => onClickPostsItem(e, 2)}>
                  <Link
                    to="/author/posts/new"
                    className={`nav-link  ${activeMenuPosts2 ? ' active' : ''}`}
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>NewPost</p>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <div
                className={`nav-link ${location.pathname.includes('search') ? ' active' : ' '} `}
              >
                <i className="nav-icon fas fa-search"></i>
                <p>SEARCH</p>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default DashSidebarAuthor;
