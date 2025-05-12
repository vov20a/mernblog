import { Link, useNavigate } from 'react-router-dom';
import useTitle from '../../../hooks/useTitle';
import { useAddNewCategoryMutation, useGetCategoriesQuery } from '../categoriesApiSlice';
import { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { useCreateCategoryArray } from '../../../hooks/createCategoryArray';
import DashMenu from '../../../components/dash/DashMenu';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';

const TITLE_REGEX = /^[A-z0-9]{3,30}$/;

const NewCategory = () => {
  useTitle('New Category Page');

  const { data: catsData, isSuccess: isSuccessArray } = useGetCategoriesQuery('categoriesList');

  const array = useCreateCategoryArray(catsData ? catsData.categories : []);

  let menuHtml = <></>;

  if (isSuccessArray) {
    menuHtml = array?.length ? <DashMenu catsArray={array} /> : <></>;
  }

  const navigate = useNavigate();

  const [addNewCategory, { data, isSuccess, isLoading, isError, error }] =
    useAddNewCategoryMutation();

  const [title, setTitle] = useState('');
  const [validTitle, setValidTitle] = useState(false);
  const [parentCategory, setParentCategory] = useState<string | null>(null);

  useEffect(() => {
    setValidTitle(TITLE_REGEX.test(title));
  }, [title]);

  useEffect(() => {
    if (isSuccess) {
      setTitle('');
      setParentCategory(null);
      navigate('/dash/categories', {
        state: { successNewCat: isSuccess, messageNewCat: data?.message },
      });
    }
  }, [isSuccess, navigate, data?.message]);

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);

  const onCategoriesChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let parentId: string | null = e.target.value;
    if (parentId === '') parentId = null;
    setParentCategory(parentId);
  };

  const canSave = [validTitle].every(Boolean) && !isLoading;

  const onSaveCategoryClicked = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canSave) {
      // console.log({ title, parentCategory });
      await addNewCategory({ title, parentCategory });
    }
  };

  const errClass = isError ? 'errmsg' : 'offscreen';
  const validTitleClass = !validTitle ? 'form__input--incomplete' : '';
  const validCatsClass = !Boolean(Object.keys(array).length) ? 'form__input--incomplete' : '';

  useCreateAndRemoveToast(isError, error?.data?.message, 'error');

  let content = <></>;
  if (isLoading) content = <PulseLoader color={'#000'} />;
  else {
    content = (
      <div className="card card-primary" style={{ boxShadow: 'none', backgroundColor: '#f4f6f9' }}>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Create New Category</h1>
                <p className={errClass}>{error?.data?.message}</p>
                {/* <p style={{ color: 'green' }}>{data?.message}</p> */}
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/dash">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">newCategory</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <form className="form" onSubmit={onSaveCategoryClicked}>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="exampleInputName1">User name</label>
              <input
                type="text"
                className={`form-control form__input ${validTitleClass}`}
                id="exampleInputName1"
                placeholder="Enter name"
                value={title}
                onChange={onTitleChanged}
              />
            </div>

            <div className="form-group">
              <select
                style={{ width: '100%' }}
                className={`form__input  ${validCatsClass}`}
                value={parentCategory ?? ''}
                onChange={onCategoriesChanged}
              >
                <option value=""> Base Category</option>
                {menuHtml}
              </select>
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

export default NewCategory;
