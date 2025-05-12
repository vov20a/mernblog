import { Link } from 'react-router-dom';

interface HeaderProps {
  onClickCloseSidebar: (closeBar: boolean) => void;
  closeBar: boolean;
}

const DashHeader = ({ onClickCloseSidebar, closeBar }: HeaderProps) => {
  // const [closeHeader, setCloseHeader] = useState(false);

  const onClickCloseHeader = (closeBar: boolean) => {
    onClickCloseSidebar(!closeBar);
    // setCloseHeader(!closeBar);
  };

  return (
    <nav
      className="main-header navbar navbar-expand navbar-white navbar-light"
      style={closeBar ? { marginLeft: 0 } : {}}
    >
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link
            onClick={() => onClickCloseHeader(closeBar)}
            className="nav-link"
            data-widget="pushmenu"
            data-enable-remember="true"
            to="#"
            role="button"
          >
            <i className="fas fa-bars"></i>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default DashHeader;
