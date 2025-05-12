import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaAlignJustify } from 'react-icons/fa';
import AuthMenu from './AuthMenu';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApiSlice';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useCreateCategoryArray } from '../../hooks/createCategoryArray';
import { PulseLoader } from 'react-spinners';
import HeaderMenu from './HeaderMenu';

const Header = () => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const closeMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(closeMenuRef, () => {
    if (isOpen) {
      setTimeout(() => {
        setOpen(false);
        setActiveIdFirst('');
      }, 50);
    }
  });

  const { data, isLoading, isSuccess, isError, error } = useGetCategoriesQuery('categoriesList');

  const catsArray = useCreateCategoryArray(data ? data.categories : []);

  const [activeIdFirst, setActiveIdFirst] = useState(
    catsArray.find((child) => child.title === 'Home')?.id || '',
  );

  let menuContent = <></>;

  if (isLoading) menuContent = <PulseLoader color={'#000'} className="pulse-loader" />;

  if (isError) {
    menuContent = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    menuContent = (
      <HeaderMenu
        catsArray={catsArray}
        activeIdFirst={activeIdFirst}
        setActiveIdFirst={setActiveIdFirst}
        setOpenBurger={setOpen}
      />
    );
  }

  return (
    <header className="header">
      <div className="container-fluid">
        <div className="header-wrapper">
          <div className="logo">
            <h2>
              <Link to="/">classic</Link>
            </h2>
          </div>
          <div className="header-menu" ref={closeMenuRef}>
            <div className={`menu header__nav ${isOpen ? ' active' : ''}`}>{menuContent}</div>
            <button onClick={() => setOpen(!isOpen)} className="header__menu-button">
              <FaAlignJustify />
            </button>
          </div>
        </div>
        <AuthMenu />
      </div>
    </header>
  );
};

export default Header;
