import { Link, useLocation } from 'react-router-dom';
import { ICategory } from '../../types/ICategory';
import { useContext, useEffect, useRef, useState } from 'react';
import MenuAccordionItem from './MenuAccordionItem';

import { ReactComponent as ArrowIcon } from '../../assets/images/arrow-icon.svg';
import { useClickOutside } from '../../hooks/useClickOutside';
import { ActiveMenuContext, MenuContextType } from '../../context';
import { RingLoader } from 'react-spinners';

interface MenuProps {
  catsArray: ICategory[];
  setActiveIdFirst: (val: string) => void;
  activeIdFirst: string;
  setOpenBurger: (val: boolean) => void;
}

const HeaderMenu = ({ catsArray, setActiveIdFirst, activeIdFirst, setOpenBurger }: MenuProps) => {
  const { activeMenuId, setActiveMenuId, isLoading } = useContext(
    ActiveMenuContext,
  ) as MenuContextType;

  const { pathname } = useLocation();

  const [openAccordionId, setOpenAccordionId] = useState('');
  const [currentItemId, setCurrentItemId] = useState('');

  const showCategoryFirst = (e: React.MouseEvent<HTMLLIElement>, Id: string) => {
    e.stopPropagation();
    if (activeIdFirst) {
      setActiveIdFirst('');
    }
    setActiveIdFirst(catsArray.find((child) => child.id === Id)?.id || '');
  };

  const clickOpenAccordionId = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, Id: string) => {
    e.stopPropagation();
    Id === openAccordionId ? setOpenAccordionId('') : setOpenAccordionId(Id);
  };

  const closeRef = useRef<HTMLUListElement>(null);

  useClickOutside(closeRef, () => {
    if (Boolean(activeIdFirst)) {
      setTimeout(() => {
        setActiveIdFirst('');
      }, 50);
    }
  });

  useEffect(() => {
    if (pathname === '/') {
      // setCurrentItemId(catsArray.find((child) => child.title === 'Home')?.id || '');
      setCurrentItemId('');
      localStorage.setItem(
        'activeMenu',
        catsArray.find((child) => child.title === 'Home')?.id || '',
      );
      setActiveMenuId(catsArray.find((child) => child.title === 'Home')?.id || '');
    } else if (
      pathname.includes('search') ||
      pathname.includes('tag') ||
      pathname.includes('mainchat') ||
      pathname.includes('videos') ||
      pathname.includes('account')
    ) {
      setCurrentItemId('');
      localStorage.setItem('activeMenu', '');
      setActiveMenuId('');
    }
  }, [pathname, activeIdFirst, setActiveMenuId, setCurrentItemId, catsArray]);

  useEffect(() => {
    setCurrentItemId(activeMenuId);
  }, [activeMenuId]);

  // console.log(activeIdSecond);
  const parts: React.ReactNode[] = [];

  for (const item of catsArray) {
    parts.push(
      <li
        key={item.id}
        className={`header__nav-list__item ${
          pathname === '/' && item.title === 'Home'
            ? ' active'
            : currentItemId === item.id
            ? ' active'
            : activeIdFirst === item.id
            ? ' openChildren'
            : ''
        }
           `}
        onClick={(e) => showCategoryFirst(e, item.id)}
        style={activeIdFirst === item.id ? { overflow: 'visible' } : {}}
      >
        {item.children.length === 0 ? (
          <Link to="/" className="home" onClick={() => setOpenBurger(false)}>
            {item.title}
          </Link>
        ) : (
          <>
            {item.title}
            <ArrowIcon className={`menu-arrow ${activeIdFirst === item.id ? ' active' : ''}`} />
            <ul className="child__list">
              {item.children.map((child) => (
                <li
                  style={{ position: 'relative' }}
                  key={child.id}
                  className={`child__item-first  ${
                    child.parentCategory === activeIdFirst ? ' open' : ''
                  }
                   `}
                  onClick={(e) => clickOpenAccordionId(e, child.id)}
                >
                  {child.children.length === 0 ? (
                    <Link
                      to={`/category/${child.id}`}
                      onClick={() => {
                        setOpenBurger(false);
                        setActiveIdFirst('');
                        setCurrentItemId(item.id);
                        localStorage.setItem('activeMenu', item.id);
                        setActiveMenuId(item.id);
                      }}
                    >
                      {child.title}
                    </Link>
                  ) : (
                    <>
                      {child.title}
                      <ArrowIcon
                        className={`accordion-arrow ${
                          openAccordionId === child.id ? ' active-accordion' : ''
                        }`}
                      />
                      <ul className="accordion__list">
                        {child.children.map((cat) => (
                          <MenuAccordionItem
                            cat={cat}
                            clickOpenAccordionId={clickOpenAccordionId}
                            isOpen={cat.parentCategory === openAccordionId}
                            key={cat.id}
                            setActiveIdFirst={setActiveIdFirst}
                            setCurrentItemId={setCurrentItemId}
                            currentId={item.id}
                            setActiveMenuId={setActiveMenuId}
                            setOpenBurger={setOpenBurger}
                          />
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </li>,
    );
  }
  //делаем задержку чтобы получить сохраненный activeMenuId
  if (isLoading) {
    return <RingLoader />;
  }
  return (
    <ul ref={closeRef} className="header__nav-list">
      {parts}
    </ul>
  );
};

export default HeaderMenu;
