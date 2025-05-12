import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/images/AdminLTELogo.png';
import { useOpenDashMenu } from '../../hooks/useOpenDashMenu';
import useAuth from '../../hooks/useAuth';
interface SidebarProps {
  closeBar: boolean;
  windowLess768: boolean;
  setCloseBar: (value: boolean) => void;
}
interface IFunc {
  openSingleMenu: boolean;
  onClickOpenSingleMenu: () => void;
  // setOpenSingleMenu: React.Dispatch<React.SetStateAction<boolean>>;
  //
  openMenuUsers: boolean;
  activeMenuUsers1: boolean;
  activeMenuUsers2: boolean;
  // setActiveMenuUsers1: React.Dispatch<React.SetStateAction<boolean>>;
  //
  openMenuPosts: boolean;
  activeMenuPosts1: boolean;
  activeMenuPosts2: boolean;
  //
  openMenuCategories: boolean;
  activeMenuCategories1: boolean;
  activeMenuCategories2: boolean;
  //
  openMenuComments: boolean;
  activeMenuComments1: boolean;
  activeMenuComments2: boolean;
  //
  onClickOpenMenuUsers: () => void;
  onClickOpenMenuPosts: () => void;
  onClickOpenMenuCategories: () => void;
  onClickOpenMenuComments: () => void;
  //
  onClickUsersItem: (e: React.MouseEvent<HTMLLIElement>, num: number) => void;
  onClickPostsItem: (e: React.MouseEvent<HTMLLIElement>, num: number) => void;
  onClickCategoriesItem: (e: React.MouseEvent<HTMLLIElement>, num: number) => void;
  onClickCommentsItem: (e: React.MouseEvent<HTMLLIElement>, num: number) => void;
}

const DashSidebar = ({ closeBar, windowLess768, setCloseBar }: SidebarProps) => {
  const location = useLocation();
  const { username, avatarUrl, status, id } = useAuth();

  const {
    openSingleMenu,
    onClickOpenSingleMenu,
    //
    openMenuUsers,
    activeMenuUsers1,
    activeMenuUsers2,
    //
    openMenuPosts,
    activeMenuPosts1,
    activeMenuPosts2,
    //
    openMenuCategories,
    activeMenuCategories1,
    activeMenuCategories2,
    //
    openMenuComments,
    activeMenuComments1,
    activeMenuComments2,
    //
    onClickOpenMenuUsers,
    onClickOpenMenuPosts,
    onClickOpenMenuCategories,
    onClickOpenMenuComments,
    //
    onClickUsersItem,
    onClickPostsItem,
    onClickCategoriesItem,
    onClickCommentsItem,
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
            <Link to={`/dash/users/user/${id}`} className="d-block">
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
                to="/dash"
                onClick={onClickOpenSingleMenu}
                className={`nav-link ${openSingleMenu ? ' active' : ''} `}
              >
                <i className="nav-icon fas fa-home"></i>
                <p>HOME</p>
              </Link>
            </li>
            <li
              onClick={onClickOpenMenuUsers}
              className={`nav-item has-treeview` + openMenuUsers ? ' open-menu' : ''}
            >
              <Link to="#" className={`nav-link  ${openMenuUsers ? ' active' : ''}`}>
                <i className="nav-icon fas fa-user"></i>
                <p>
                  USERS
                  <i
                    className={`right fas fa-angle-left users ${openMenuUsers ? ' rotate' : ''}`}
                  ></i>
                </p>
              </Link>
              <ul className="nav nav-treeview" style={openMenuUsers ? { display: 'block' } : {}}>
                <li className="nav-item" onClick={(e) => onClickUsersItem(e, 1)}>
                  <Link
                    to="/dash/users"
                    className={`nav-link  ${activeMenuUsers1 ? ' active' : ''}`}
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>UserList</p>
                  </Link>
                </li>
                <li className="nav-item" onClick={(e) => onClickUsersItem(e, 2)}>
                  <Link
                    to="/dash/users/new"
                    className={`nav-link  ${activeMenuUsers2 ? ' active' : ''}`}
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>NewUser</p>
                  </Link>
                </li>
              </ul>
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
                    className={`right fas fa-angle-left posts ${openMenuPosts ? ' rotate' : ''} ${
                      openMenuUsers ? ' user-active' : ''
                    }`}
                  ></i>
                </p>
              </Link>
              <ul className="nav nav-treeview" style={openMenuPosts ? { display: 'block' } : {}}>
                <li className="nav-item" onClick={(e) => onClickPostsItem(e, 1)}>
                  <Link
                    to="/dash/posts"
                    className={`nav-link  ${activeMenuPosts1 ? ' active' : ''}`}
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>PostsList</p>
                  </Link>
                </li>
                <li className="nav-item" onClick={(e) => onClickPostsItem(e, 2)}>
                  <Link
                    to="/dash/posts/new"
                    className={`nav-link  ${activeMenuPosts2 ? ' active' : ''}`}
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>NewPost</p>
                  </Link>
                </li>
              </ul>
            </li>
            <li
              onClick={onClickOpenMenuCategories}
              className={`nav-item has-treeview` + openMenuCategories ? ' open-menu' : ''}
            >
              <Link to="#" className={`nav-link  ${openMenuCategories ? ' active' : ''}`}>
                <i className="nav-icon fas fa-chart-pie"></i>
                <p>
                  CATEGORIES
                  <i
                    className={`right fas fa-angle-left categories ${
                      openMenuCategories ? ' rotate' : ''
                    } ${openMenuUsers ? ' user-active' : ''}  ${
                      openMenuPosts ? ' post-active' : ''
                    }`}
                  ></i>
                </p>
              </Link>
              <ul
                className="nav nav-treeview"
                style={openMenuCategories ? { display: 'block' } : {}}
              >
                <li className="nav-item" onClick={(e) => onClickCategoriesItem(e, 1)}>
                  <Link
                    to="/dash/categories"
                    className={`nav-link  ${activeMenuCategories1 ? ' active' : ''}`}
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>CategoriesList</p>
                  </Link>
                </li>
                <li className="nav-item" onClick={(e) => onClickCategoriesItem(e, 2)}>
                  <Link
                    to="/dash/categories/new"
                    className={`nav-link  ${activeMenuCategories2 ? ' active' : ''}`}
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>NewCategory</p>
                  </Link>
                </li>
              </ul>
            </li>
            <li
              onClick={onClickOpenMenuComments}
              className={`nav-item has-treeview` + openMenuComments ? ' open-menu' : ''}
            >
              <Link to="#" className={`nav-link  ${openMenuComments ? ' active' : ''}`}>
                <i className="nav-icon fas fa-comments"></i>
                <p>
                  COMMENTS
                  <i
                    className={`right fas fa-angle-left comments ${
                      openMenuComments ? ' rotate' : ''
                    } ${openMenuUsers ? ' user-active' : ''}  ${
                      openMenuPosts ? ' post-active' : ''
                    } ${openMenuCategories ? ' category-active' : ''}`}
                  ></i>
                </p>
              </Link>
              <ul className="nav nav-treeview" style={openMenuComments ? { display: 'block' } : {}}>
                <li className="nav-item" onClick={(e) => onClickCommentsItem(e, 1)}>
                  <Link
                    to="/dash/comments"
                    className={`nav-link  ${activeMenuComments1 ? ' active' : ''}`}
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>CommentsList</p>
                  </Link>
                </li>
                <li className="nav-item" onClick={(e) => onClickCommentsItem(e, 2)}>
                  <Link
                    to="/dash/comments/new"
                    className={`nav-link  ${activeMenuComments2 ? ' active' : ''}`}
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>NewComment</p>
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

export default DashSidebar;
