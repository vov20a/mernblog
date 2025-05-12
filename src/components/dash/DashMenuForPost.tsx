import { memo } from 'react';
import { ICategory } from '../../types/ICategory';

interface MenuProps {
  catsArray: ICategory[];
}

const DashMenu = ({ catsArray }: MenuProps) => {
  const parts: React.ReactNode[] = [];
  for (const item of catsArray) {
    if (item.title === 'Home') continue;
    if (item.children.length > 0) {
      parts.push(
        <option
          key={item.id}
          value={item.id}
          className=" form-control form__input"
          style={{ height: 'auto', color: 'tomato' }}
          disabled={true}
        >
          {item.title}
        </option>,
      );
    } else {
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
    }

    if (item.children.length > 0) {
      for (const child of item.children) {
        if (child.children.length > 0) {
          parts.push(
            <option
              key={child.id}
              value={child.id}
              className=" form-control form__input"
              style={{ height: 'auto', color: 'Highlight' }}
              disabled={true}
            >
              {`______${child.title}`}
            </option>,
          );
        } else {
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
        }

        if (child.children.length > 0) {
          for (const cat of child.children) {
            parts.push(
              <option
                key={cat.id}
                value={cat.id}
                className=" form-control form__input"
                style={{ height: 'auto', color: 'green' }}
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
