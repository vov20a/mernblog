import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ICategory } from '../../types/ICategory';

interface ItemProps {
  cat: ICategory;
  clickOpenAccordionId: (e: React.MouseEvent<HTMLLIElement, MouseEvent>, Id: string) => void;
  isOpen: boolean;
  setActiveIdFirst: (Id: string) => void;
  setCurrentItemId: (id: string) => void;
  currentId: string;
  setActiveMenuId: (id: string) => void;
  setOpenBurger: (val: boolean) => void;
}

const MenuAccordionItem = ({
  cat,
  clickOpenAccordionId,
  isOpen,
  setCurrentItemId,
  setActiveIdFirst,
  setActiveMenuId,
  currentId,
  setOpenBurger,
}: ItemProps) => {
  const itemRef = useRef<HTMLDivElement | null>(null);

  return (
    <li
      onClick={(e) => clickOpenAccordionId(e, cat?.parentCategory ?? '')}
      className={`accordion-item`}
    >
      <div
        className="accordion-collapse"
        style={isOpen ? { height: itemRef?.current?.scrollHeight } : { height: '0px' }}
      >
        <div className="accordion-body" ref={itemRef}>
          <Link
            to={`/category/${cat.id}`}
            onClick={() => {
              setActiveIdFirst('');
              setCurrentItemId(currentId);
              localStorage.setItem('activeMenu', currentId);
              setActiveMenuId(currentId);
              setOpenBurger(false);
            }}
          >
            {cat.title}
          </Link>
        </div>
      </div>
    </li>
  );
};

export default MenuAccordionItem;
