import { useDeleteCategoryMutation, useGetCategoriesQuery } from '../categoriesApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../../../hooks/useTitle';
import { useCreateCategoryArray } from '../../../hooks/createCategoryArray';

import Category from './Category';
import { Link, useLocation } from 'react-router-dom';
import { useCreateAndRemoveToast } from '../../../hooks/useCreateAndRemoveToast';
import DashModal from '../../../components/dash/DashModal';
import { useState } from 'react';
import { ICategory } from '../../../types/ICategory';

const CategoriesList = () => {
  useTitle('Categories List');

  const [isShow, setShow] = useState(false);
  const [cat, setCat] = useState<ICategory>({} as ICategory);

  const { data, isLoading, isSuccess, isError, error } = useGetCategoriesQuery('categoriesList');

  const [
    deleteCategory,
    {
      data: delData,
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeleteCategoryMutation();

  const array = useCreateCategoryArray(data ? data.categories : []);

  const location = useLocation();
  //from NewCategories
  useCreateAndRemoveToast(
    location.state?.successNewCat,
    location.state?.messageNewCat ?? 'Category created',
    'success',
  );
  //from EditCategories
  useCreateAndRemoveToast(
    location.state?.successEditCat,
    location.state?.messageEditCat ?? 'Category updated',
    'success',
  );
  //get all cats
  // useCreateAndRemoveToast(isSuccess, data?.message || 'Cats recieved', 'success');

  useCreateAndRemoveToast(isError, error?.data?.message || error?.status, 'error');

  const onDeleteCategory = async (cat: ICategory) => {
    setShow(true);
    setCat(cat);
  };

  const onDeleteCategoryClicked = async () => {
    await deleteCategory({ id: cat.id });
  };

  useCreateAndRemoveToast(isDelSuccess, delData?.message || 'Cat deleted', 'success');
  useCreateAndRemoveToast(isDelError, delerror?.data?.message || error?.status, 'error');

  let content;

  if (isLoading || isDelLoading) content = <PulseLoader color={'#000'} className="pulse-loader" />;

  if (isError || isDelError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  let tableContent;
  if (isSuccess) {
    tableContent = array?.length && (
      <Category catsArray={array} onDeleteCategory={(cat) => onDeleteCategory(cat)} />
    );

    content = (
      <>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Categories List</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/dash">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">categoriesList</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body table-responsive p-0">{tableContent}</div>
              </div>
            </div>
          </div>
        </div>
        <DashModal
          isShow={isShow}
          setShow={(show) => setShow(show)}
          data={cat.title}
          id={cat._id}
          onDeleteClicked={onDeleteCategoryClicked}
        />
      </>
    );
  }
  if (!tableContent) {
    content = <h1>THere are not categories</h1>;
  }
  return <>{content}</>;
};
export default CategoriesList;
