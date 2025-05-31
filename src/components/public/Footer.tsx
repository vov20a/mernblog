import { Link } from 'react-router-dom';
import { Container, Col } from 'react-bootstrap';
import { FiFacebook } from 'react-icons/fi';
import { FaAlignJustify, FaTwitter, FaLinkedinIn, FaVideo } from 'react-icons/fa';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApiSlice';
import { useCreateCategoryArray } from '../../hooks/createCategoryArray';
import { useRef, useState } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { PulseLoader } from 'react-spinners';
import FooterMenu from './FooterMenu';

const Footer = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [activeIdFirst, setActiveIdFirst] = useState('');

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

  let menuContent = <></>;

  if (isLoading) menuContent = <PulseLoader color={'#'} className="pulse-loader" />;

  if (isError) {
    menuContent = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    menuContent = (
      <FooterMenu
        catsArray={catsArray}
        activeIdFirst={activeIdFirst}
        setActiveIdFirst={setActiveIdFirst}
        setOpenBurger={setOpen}
      />
    );
  }
  return (
    <footer className="footer">
      <Container fluid>
        <Col md={12} style={{ padding: 0 }}>
          <div className="footer-bg">
            <div style={{ padding: 0 }}>
              <div className="footer-menu" ref={closeMenuRef}>
                <div className={`footer__nav ${isOpen ? ' active' : ''}`}>{menuContent}</div>
                <button onClick={() => setOpen(!isOpen)} className="footer__menu-button">
                  <FaAlignJustify />
                </button>
              </div>
            </div>
            <div className="footer-icon">
              <Link to="#">
                <FiFacebook style={{ fontSize: 25, fill: '#fff', strokeWidth: 0 }} />
              </Link>
              <Link to="#">
                <FaTwitter style={{ fontSize: 25, fill: '#fff', strokeWidth: 0 }} />
              </Link>
              <Link to="#">
                <FaLinkedinIn style={{ fontSize: 25, fill: '#fff', strokeWidth: 0 }} />
              </Link>
              <Link to="/videos">
                <FaVideo style={{ fontSize: 25, fill: '#fff', strokeWidth: 0 }} />
              </Link>
            </div>
          </div>
        </Col>
      </Container>
    </footer>
  );
};

export default Footer;
