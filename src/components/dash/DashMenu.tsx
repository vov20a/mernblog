import { memo } from 'react';
import { ICategory } from '../../types/ICategory';

interface MenuProps {
  catsArray: ICategory[];
}

const DashMenu = ({ catsArray }: MenuProps) => {
  const parts: React.ReactNode[] = [];
  for (const item of catsArray) {
    parts.push(
      <option
        key={item.id}
        value={item.id}
        className=" form-control form__input"
        style={{ height: 'auto', color: 'tomato' }}
      >
        {item.title}
      </option>,
    );
    if (item.children.length > 0) {
      for (const child of item.children) {
        parts.push(
          <option
            key={child.id}
            value={child.id}
            className=" form-control form__input"
            style={{ height: 'auto', color: 'Highlight' }}
          >
            {`______${child.title}`}
          </option>,
        );
        if (child.children.length > 0) {
          for (const cat of child.children) {
            parts.push(
              <option
                key={cat.id}
                value={cat.id}
                className=" form-control form__input"
                style={{ height: 'auto', color: 'green' }}
                disabled={true}
              >
                {`________________${cat.title}`}
              </option>,
            );
          }
        }
      }
    }
  }

  return <>{parts}</>;
};

const memoizedMenu = memo(DashMenu);

export default memoizedMenu;
