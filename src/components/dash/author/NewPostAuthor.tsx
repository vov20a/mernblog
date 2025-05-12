import { Link, useNavigate } from 'react-router-dom';
import useTitle from '../../../hooks/useTitle';
import { useEffect, useRef, useState } from 'react';
import { useAddNewPostMutation } from '../../../features/posts/postsApiSlice';
import { useGetCategoriesQuery } from '../../../features/categories/categoriesApiSlice';
import { useCreateCategoryArray } from '../../../hooks/createCategoryArray';
import DashMenuForPost from '../../../components/dash/DashMenuForPost';
import { PulseLoader } from 'react-spinners';
import { useTagsDebounce } from '../../../hooks/debounce';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';
import useAuth from '../../../hooks/useAuth';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
// import TextEditor from '../../../components/dash/textEditor/TextEditor';

const TITLE_REGEX = /^[A-zА-я0-9\s?]{3,20}/;
const TAGS_REGEX = /^[A-zА-я$&\s]{3,}$/;
const TEXT_REGEX = RegExp(/<[^>]*>/g);

const NewPostAuthor = () => {
  const { id: userId, username } = useAuth();

  useTitle(`New Post by ${username}`);

  const { data: catsData, isSuccess: isSuccessArray } = useGetCategoriesQuery('categoriesList');

  const array = useCreateCategoryArray(catsData ? catsData.categories : []);

  let menuHtml = <></>;

  if (isSuccessArray) {
    menuHtml = array?.length ? <DashMenuForPost catsArray={array} /> : <></>;
  }

  const navigate = useNavigate();

  const inputImageFileRef = useRef<HTMLInputElement>(null);

  const [addNewPost, { data, isLoading, isSuccess, isError, error }] = useAddNewPostMutation();

  const [title, setTitle] = useState('');
  const [validTitle, setValidTitle] = useState(false);
  const [author, setAuthor] = useState<string>(userId);
  const [text, setText] = useState('');
  const [validText, setValidText] = useState(false);
  const [tags, setTags] = useState<string>(''); //слова идут через пробел в одной строке
  const [validTags, setValidTags] = useState(false);
  const [category, setCategory] = useState<string>(
    array.filter((item) => item.title === 'Home')[0]?.id,
  );
  const [imageUrl, setImageUrl] = useState<string | ArrayBuffer | null>('');
  const [tagsArray, setTagsArray] = useState<string[] | undefined>([]);

  useEffect(() => {
    setValidTitle(TITLE_REGEX.test(title));
  }, [title]);

  useEffect(() => {
    setValidText(text.replace(TEXT_REGEX, '') !== '');
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
      setAuthor(userId);
      setCategory('');
      setImageUrl('');
      navigate('/author', { state: { successNewPost: isSuccess, messageNewPost: data?.message } });
    }
  }, [isSuccess, navigate, data?.message, userId]);

  useEffect(() => {
    if (isError) {
      setTitle(title);
      setText(text);
      setTags(tags);
      setAuthor(author);
      setCategory(category);
      setImageUrl(imageUrl);
    }
  }, [isError, author, category, imageUrl, tags, text, title]);

  const tagsDebounced: string[] = useTagsDebounce(tags, 500);
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
    setImageUrl('');
    files.forEach((file) => {
      const reader = new FileReader();
      // const arr: ((prevState: string[]) => string[]) | (string | ArrayBuffer)[] = [];
      reader.onload = () => {
        if (reader.readyState === 2) {
          // setAvatarPreview(reader.result);
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file); //load in buffer
    });
  };

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onTagsChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value);
  const onCategoriesChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const canSave =
    [validTitle, author !== '', text !== '', imageUrl !== '', tagsArray?.length].every(Boolean) &&
    !isLoading;

  const onSavePostClicked = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(canSave);
    // console.log({ title, text, tags: tagsArray, category, imageUrl, user: author });
    if (canSave) {
      await addNewPost({ title, text, tags: tagsArray, category, imageUrl, user: author });
    }
  };

  const errClass = isError ? 'errmsg' : 'offscreen';
  const validTitleClass = !validTitle ? 'form__input--incomplete' : '';
  const validTextClass = !validText ? 'form__input--incomplete' : '';
  const validAuthorClass = author === '' ? 'form__input--incomplete' : '';
  const validCatsClass = !Boolean(Object.keys(array).length) ? 'form__input--incomplete' : '';
  const validTagsClass = !validTags ? 'form__input--incomplete' : '';
  const validImageClass = !Boolean(imageUrl) ? 'form__input--incomplete' : '';

  const handleDeleteFile = () => {
    setImageUrl('');
  };

  useCreateAndRemoveToast(isError, error?.data?.message, 'error');

  let content = <></>;
  if (isLoading) content = <PulseLoader color={'#000'} />;
  else {
    content = (
      <div className="card card-primary">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Create New Post</h1>
                <p className={errClass}>{error?.data?.message}</p>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/author">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">newPost</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <form className="form" onSubmit={onSavePostClicked}>
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
              <div
                style={{ width: '100%', border: '1px solid #aaa' }}
                className={`form__input  ${validAuthorClass}`}
              >
                {username}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="exampleSelect">Categories</label>
              <select
                id="exampleSelect"
                style={{ width: '100%' }}
                className={`form__input  ${validCatsClass}`}
                value={category ?? ''}
                onChange={onCategoriesChanged}
              >
                <option value={array.filter((item) => item.title === 'Home')[0]?.id}>Home</option>
                {menuHtml}
              </select>
            </div>
            <div className={`form-group form-textarea quill-reductor ${validTextClass}`}>
              <label htmlFor="exampleInputText">Text Editor</label>
              <ReactQuill theme="snow" value={text} onChange={setText} />
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
                {imageUrl ? (
                  <div
                    className="custom-file"
                    style={{
                      border: '1px solid #ccc',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <img width="37px" src={imageUrl as string} alt="Preview" />
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
                )}
              </div>
            </div>
          </div>

          <div className="card-footer">
            <button type="submit" className="btn btn-primary" disabled={canSave ? false : true}>
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
  return <>{content}</>;
};

export default NewPostAuthor;
