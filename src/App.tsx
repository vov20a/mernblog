import { Suspense, lazy, useEffect, useState } from 'react';
import RingLoader from 'react-spinners/RingLoader';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/public/Layout';

import { ROLES } from './config/roles';
import { ActiveMenuContext } from './context';

const PersistLogin = lazy(() => import('./features/auth/PersistLogin'));
const RequireAuth = lazy(() => import('./features/auth/RequireAuth'));
const RequireNoAuth = lazy(() => import('./features/auth/RequireNoAuth'));
const Prefetch = lazy(() => import('./features/auth/Prefetch'));
const Home = lazy(() => import('./pages/Home'));
const Main = lazy(() => import('./components/dash/Main'));
const DashLayout = lazy(() => import('./components/dash/DashLayout'));
const Login = lazy(() => import('./features/auth/login/Login'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
const Register = lazy(() => import('./features/auth/register/Register'));
const UsersList = lazy(() => import('./features/users/dash/UsersList'));
const NewUser = lazy(() => import('./features/users/dash/NewUser'));
const EditUser = lazy(() => import('./features/users/dash/EditUser'));
const PostsList = lazy(() => import('./features/posts/dash/PostsList'));
const NewPost = lazy(() => import('./features/posts/dash/NewPost'));
const EditPost = lazy(() => import('./features/posts/dash/EditPost'));
const PostCard = lazy(() => import('./features/posts/dash/PostCard'));
const CategoriesList = lazy(() => import('./features/categories/dash/CategoriesList'));
const NewCategory = lazy(() => import('./features/categories/dash/NewCategory'));
const EditCategory = lazy(() => import('./features/categories/dash/EditCategory'));
const DashPostsSearch = lazy(() => import('./features/posts/dash/DashSearch'));
const DashUsersSearch = lazy(() => import('./features/users/dash/DashSearch'));
const UserCard = lazy(() => import('./features/users/dash/UserCard'));
const PostsByCategoryId = lazy(() => import('./features/posts/dash/PostsByCategoryId'));
const SearchByCategoryId = lazy(() => import('./features/posts/dash/SearchByCategoryId'));
const CommentsList = lazy(() => import('./features/comments/dash/CommentsList'));
const NewComment = lazy(() => import('./features/comments/dash/NewComment'));
const EditComment = lazy(() => import('./features/comments/dash/EditComment'));
const DashSearchComment = lazy(() => import('./features/comments/dash/DashSearchComment'));
const CommentsByPostId = lazy(() => import('./features/comments/dash/CommentsByPostId'));
const CommentView = lazy(() => import('./features/comments/dash/CommentView'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const SinglePostPage = lazy(() => import('./pages/SinglePostPage'));
const PostsByCategory = lazy(() => import('./pages/PostsByCategory'));
const PostsByParentCategory = lazy(() => import('./pages/PostsByParentCategory'));
const PostsByTag = lazy(() => import('./pages/PostsByTag'));
const PostsByUser = lazy(() => import('./pages/PostsByUser'));
const AuthorMain = lazy(() => import('./components/dash/author/AuthorMain'));
const PostsListAuthor = lazy(() => import('./components/dash/author/PostsListAuthor'));
const NewPostAuthor = lazy(() => import('./components/dash/author/NewPostAuthor'));
const EditPostAuthor = lazy(() => import('./components/dash/author/EditPostAuthor'));
const DashPostsAuthorSearch = lazy(() => import('./components/dash/author/DashPostsAuthorSearch'));
const ForgotPwd = lazy(() => import('./features/auth/ForgotPwd'));
const CreatePassword = lazy(() => import('./features/auth/CreatePassword'));
const CreateNewPassword = lazy(() => import('./features/users/CreateNewPassword'));
const CreateNewAvatar = lazy(() => import('./features/users/CreateNewAvatar'));
const MainChat = lazy(() => import('./components/chat/Main'));
const Chat = lazy(() => import('./components/chat/Chat'));

function App() {
  const [activeMenuId, setActiveMenuId] = useState<string>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('activeMenu')) {
      setActiveMenuId(localStorage.getItem('activeMenu') ?? '');
    }
    setLoading(false);
  }, []);
  return (
    <ActiveMenuContext.Provider
      value={{ activeMenuId: activeMenuId ?? '', setActiveMenuId, isLoading }}
    >
      <Suspense
        fallback={
          <RingLoader
            style={{
              position: 'fixed',
              width: '60px',
              height: '60px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
            }}
          />
        }
      >
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route element={<RequireNoAuth allowedRoles={[...Object.values(ROLES)]} />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot" element={<ForgotPwd />} />
              <Route path="create" element={<CreatePassword />} />
            </Route>

            {/* protected routes */}
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
                <Route element={<Prefetch />}>
                  <Route path="post/:category/:id" element={<SinglePostPage />} />
                  <Route path="user/:id" element={<PostsByUser />} />
                  <Route path="category/:id" element={<PostsByCategory />} />
                  <Route path="categories/:id" element={<PostsByParentCategory />} />
                  <Route path="tag/:tag" element={<PostsByTag />} />
                  <Route path="account" element={<AccountPage />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="password" element={<CreateNewPassword />} />
                  <Route path="avatar" element={<CreateNewAvatar />} />
                  <Route path="/mainchat" element={<MainChat />} />
                  <Route path="/chat" element={<Chat />} />

                  {/*private routes start /dash for Admin*/}
                  <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                    <Route path="dash" element={<DashLayout />}>
                      <Route index element={<Main />} />

                      <Route path="users">
                        <Route index element={<UsersList />} />
                        <Route path="new" element={<NewUser />} />
                        <Route path="search" element={<DashUsersSearch />} />
                        <Route path="user/:id" element={<UserCard />} />
                        <Route path="edit/:id" element={<EditUser />} />
                      </Route>

                      <Route path="posts">
                        <Route index element={<PostsList />} />
                        <Route path="new" element={<NewPost />} />
                        <Route path="search" element={<DashPostsSearch />} />
                        <Route path="post/:id" element={<PostCard />} />
                        <Route path="edit/:id" element={<EditPost />} />
                      </Route>

                      <Route path="categories">
                        <Route index element={<CategoriesList />} />
                        <Route path="new" element={<NewCategory />} />
                        <Route path="search" element={<SearchByCategoryId />} />
                        <Route path="edit/:id" element={<EditCategory />} />
                        <Route path="cat/:id" element={<PostsByCategoryId />} />
                      </Route>

                      <Route path="comments">
                        <Route index element={<CommentsList />} />
                        <Route path="new" element={<NewComment />} />
                        <Route path="search" element={<DashSearchComment />} />
                        <Route path="edit/:id" element={<EditComment />} />
                        <Route path="post/:id" element={<CommentsByPostId />} />
                        <Route path="view/:id" element={<CommentView />} />
                      </Route>
                    </Route>
                  </Route>
                  {/*private routes start /author for Author*/}
                  <Route element={<RequireAuth allowedRoles={[ROLES.Author]} />}>
                    <Route path="author" element={<DashLayout />}>
                      <Route index element={<AuthorMain />} />

                      <Route path="posts">
                        <Route index element={<PostsListAuthor />} />
                        <Route path="new" element={<NewPostAuthor />} />
                        <Route path="search" element={<DashPostsAuthorSearch />} />
                        <Route path="post/:id" element={<PostCard />} />
                        <Route path="edit/:id" element={<EditPostAuthor />} />
                      </Route>
                    </Route>
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </ActiveMenuContext.Provider>
  );
}

export default App;
