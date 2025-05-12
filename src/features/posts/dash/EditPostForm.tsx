import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { IUser } from '../../../types/IUserType';
import { ICategory } from '../../../types/ICategory';
import { Link, useNavigate } from 'react-router-dom';
import DashMenuForPost from '../../../components/dash/DashMenuForPost';
import { useUpdatePostMutation } from '../postsApiSlice';
import { IPostType } from '../../../types/IPostType';
import { useTagsDebounce } from '../../../hooks/debounce';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';
import { PulseLoader } from 'react-spinners';
import { IAllCategories } from '../../categories/categoriesApiSlice';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface EditPostProps {
  post: IPostType | undefined;
  users: IUser[];
  catsData: IAllCategories | undefined;
  catsArray: ICategory[];
}

const TITLE_REGEX = /^[A-zА-я0-9\s?]{3,20}/;
const TAGS_REGEX = /^[A-zА-я$&\s?]{3,}$/;
const TEXT_REGEX = RegExp(/<[^>]*>/g);

const EditPostForm = ({ post, users, catsData, catsArray }: EditPostProps) => {
  // console.log(catsData, catsArray);
  const navigate = useNavigate();

  const menuHtml = catsArray?.length ? <DashMenuForPost catsArray={catsArray} /> : <></>;

  const inputImageFileRef = useRef<HTMLInputElement>(null);

  let usersOptions: ReactElement[] = [];
  if (users.length) {
    users.map((user) => {
      if (user.roles.includes('Author') || user.roles.includes('Admin')) {
        usersOptions.push(
          <option key={user.id} value={user.id}>
            {user.username}
          </option>,
        );
      }
      return [];
    });
  }

  const [updatePost, { data, isLoading, isSuccess, isError, error }] = useUpdatePostMutation();

  const [title, setTitle] = useState(post ? post.title : '');
  const [validTitle, setValidTitle] = useState(false);
  const [text, setText] = useState(post?.text);
  const [validText, setValidText] = useState(false);
  const [tags, setTags] = useState<string>(post?.tags.length ? post?.tags?.join(' ').trim() : ''); //слова идут через пробел в одной строке
  const [validTags, setValidTags] = useState(false);

  const [author, setAuthor] = useState<string>(post?.user ? post.user?._id : '');
  const [category, setCategory] = useState<string>(
    catsData?.categories?.length
      ? catsData.categories.filter((cat) => cat._id === post?.category?._id)[0]?._id
      : '',
  );
  const [newImage, setNewImage] = useState<string | ArrayBuffer | null>(null);
  const [oldImage, setOldImage] = useState<string | undefined>(post?.imageUrl.url);
  const [tagsArray, setTagsArray] = useState<string[] | undefined>(post?.tags);

  useEffect(() => {
    setValidTitle(TITLE_REGEX.test(title));
  }, [title]);

  useEffect(() => {
    setValidText(text?.replace(TEXT_REGEX, '') !== '');
  }, [text]);

  useEffect(() => {
    setValidTags(TAGS_REGEX.test(tags));
  }, [tags]);

  useEffect(() => {
    if (isSuccess) {
      setTitle('');
      setText('');
      setTags('');
      setTagsArray([]);
      setAuthor('');
      setCategory('');
      setNewImage(null);
      navigate('/dash/posts', {
        state: { successEditPost: isSuccess, messageEditPost: data?.message },
      });
    }
  }, [isSuccess, navigate, data?.message]);

  useEffect(() => {
    if (isError) {
      setTitle(title);
      setText(text);
      setTags(tags);
      setAuthor(author);
      setCategory(category);
      setNewImage(newImage);
      setOldImage(oldImage);
    }
  }, [isError, author, category, newImage, oldImage, tags, text, title]);

  const tagsDebounced: string[] = useTagsDebounce(tags.trim(), 500);
  useEffect(() => {
    if (tagsDebounced.length) {
      setTagsArray(tagsDebounced);
    }
  }, [tagsDebounced]);

  const createImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let files: File[] = [];
    if (event.target.files?.length === 1) {
      const fileObj = event.target.files;
      files = Object.values(fileObj);
    }
    setNewImage(null);
    setOldImage(undefined);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setNewImage(reader.result);
        }
      };
      reader.readAsDataURL(file); //load in buffer
    });
  };

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  // const onTextChanged = (content: string) => setText(content);
  const onTagsChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value);
  const onCategoriesChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };
  const onAuthorsChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAuthor(e.target.value);
  };

  const canSave =
    [validTitle, category, text !== '', validTags].every(Boolean) &&
    (newImage !== null || oldImage !== undefined) &&
    !isLoading;

  const onUpdatePostClicked = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(validTitle, category, text !== '', imageUrl !== '', tagsArray?.length);
    // console.log({ title, text, tags: tagsArray, category, newImage, user: author });

    if (canSave) {
      await updatePost({
        id: post?.id ? post.id : '',
        title,
        text: text ?? '',
        tags: tagsArray,
        category,
        imageUrl: newImage ?? null,
        user: author,
      });
    }
  };

  const errClass = isError ? 'errmsg' : 'offscreen';
  const validTitleClass = !validTitle ? 'form__input--incomplete' : '';
  const validTextClass = !validText ? 'form__input--incomplete' : '';
  const validCatsClass = !category ? 'form__input--incomplete' : '';
  const validTagsClass = !validTags ? 'form__input--incomplete' : '';
  const validUsersClass = !Boolean(Object.keys(users ?? []).length)
    ? 'form__input--incomplete'
    : '';
  const validImageClass =
    newImage === null && oldImage === undefined ? 'form__input--incomplete' : '';

  const handleDeleteFile = () => {
    setNewImage(null);
    setOldImage(undefined);
  };

  useCreateAndRemoveToast(
    isError,
    error?.data?.message || error?.status || 'Server Error 500',
    'error',
  );

  let content = <></>;
  if (isLoading) content = <PulseLoader color={'#000'} />;
  else {
    content = (
      <div className="card card-primary">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Edit Post:{post?.title}</h1>
                <p className={errClass}>{error?.data?.message}</p>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/dash">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">{post?.title}</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <form className="form" onSubmit={onUpdatePostClicked}>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="exampleInputName1">Title</label>
              <input
                type="text"
                className={`form-control ${validTitleClass}`}
                id="exampleInputName1"
                placeholder="Enter title"
                value={title}
                onChange={onTitleChanged}
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInput1">Tags</label>
              <input
                type="text"
                className={`form-control ${validTagsClass}`}
                id="exampleInput1"
                placeholder="Enter tags through spacelatter"
                value={tags}
                onChange={onTagsChanged}
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Author</label>
              <select
                style={{ width: '100%' }}
                className={`form__input  ${validUsersClass}`}
                value={author}
                onChange={onAuthorsChanged}
              >
                {usersOptions ?? []}
              </select>
            </div>
            <div className="form-group">
              <select
                style={{ width: '100%' }}
                className={`form__input  ${validCatsClass}`}
                value={category ?? ''}
                onChange={onCategoriesChanged}
              >
                <option value={catsArray.filter((item) => item.title === 'Home')[0]?.id}>
                  Home
                </option>
                {menuHtml}
              </select>
            </div>
            <div className={`form-group form-textarea quill-reductor ${validTextClass}`}>
              <label htmlFor="exampleInputText">Text Editor</label>
              <ReactQuill theme="snow" value={text} onChange={setText} />
              {/* <QuillTextEditor text={text} setText={(txt) => setText(txt)} /> */}
              {/* <textarea
                className={validTextClass}
                id="exampleInputText"
                value={text}
                rows={8}
                onChange={(e) => setText(e.target.value)}
              >
                {text}
              </textarea> */}
              {/* <TextEditor
                value={text}
                validTextClass={validTextClass}
                onTextChanged={(content: string) => onTextChanged(content)}
              /> */}
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputFile">Image</label>
              <div className={`input-group  ${validImageClass}`}>
                {oldImage ? (
                  <div
                    className="custom-file"
                    style={{
                      border: '1px solid #ccc',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <img width="37px" src={oldImage as string} alt="" />
                    <i
                      className="fa fa-window-close"
                      aria-hidden="true"
                      style={{ fontSize: 40 }}
                      onClick={handleDeleteFile}
                    ></i>
                  </div>
                ) : !newImage ? (
                  <>
                    <div className="custom-file">
                      <input
                        ref={inputImageFileRef}
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={createImageChange}
                        className="custom-file-input"
                        id="exampleInputFile"
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="exampleInputFile"
                        onClick={() => {
                          if (inputImageFileRef.current) inputImageFileRef.current.click();
                        }}
                      >
                        Input File
                      </label>
                    </div>
                  </>
                ) : (
                  newImage && (
                    <div
                      className="custom-file"
                      style={{
                        border: '1px solid #ccc',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <img width="37px" src={newImage as string} alt="" />
                      <i
                        className="fa fa-window-close"
                        aria-hidden="true"
                        style={{ fontSize: 40 }}
                        onClick={handleDeleteFile}
                      ></i>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="card-footer">
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

export default EditPostForm;
