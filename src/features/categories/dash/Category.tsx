import { memo } from 'react';
import { ICategory } from '../../../types/ICategory';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

interface CategoryProps {
  catsArray: ICategory[];
  onDeleteCategory: (cat: ICategory) => void;
}

const Category = ({ catsArray, onDeleteCategory }: CategoryProps) => {
  let content = catsArray.map((item: ICategory) => (
    <div key={item.id} className="form-group">
      <div className=" form-control form__input" style={{ height: 'auto' }}>
        {item.children.length === 0 ? (
          <div className="category-child__link">
            {item.title}
            <span>
              <Link
                className="btn btn-primary btn-sm"
                to={`edit/${item.id}`}
                style={{ color: 'white' }}
              >
                <i className="fas fa-folder"></i>
                Edit
              </Link>
              <Link
                className="btn btn-primary btn-sm"
                to={`cat/${item.id}`}
                style={{ color: 'white' }}
              >
                <i className="fas fa-folder"></i>
                Posts
              </Link>
              <Button
                onClick={() => onDeleteCategory(item)}
                className="btn btn-danger btn-sm"
                style={{ color: 'white' }}
              >
                <i className="fas fa-trash"></i>
                Delete
              </Button>
            </span>
          </div>
        ) : (
          <div className="category-child__link">{item.title}</div>
        )}
      </div>
      {item.children?.length > 0 &&
        item.children.map((child: ICategory) => (
          <div key={child.id} className="category-child">
            {child.children.length === 0 ? (
              <div className="category-child__link">
                {child.title}
                <span>
                  <Link
                    className="btn btn-primary btn-sm"
                    to={`edit/${child.id}`}
                    style={{ color: 'white' }}
                  >
                    <i className="fas fa-folder"></i>
                    Edit
                  </Link>
                  <Link
                    className="btn btn-primary btn-sm"
                    to={`cat/${child.id}`}
                    style={{ color: 'white' }}
                  >
                    <i className="fas fa-folder"></i>
                    Posts
                  </Link>
                  <Button
                    onClick={() => onDeleteCategory(child)}
                    className="btn btn-danger btn-sm"
                    style={{ color: 'white' }}
                  >
                    <i className="fas fa-trash"></i>
                    Delete
                  </Button>
                </span>
              </div>
            ) : (
              <div className="category-child__link">{child.title}</div>
            )}
            {Array.isArray(child?.children) &&
              child?.children?.length > 0 &&
              child.children.map((cat: ICategory) => (
                <div key={cat.id} className=" category-child">
                  <div className="category-child__link">
                    {cat.title}
                    <span>
                      <Link
                        className="btn btn-primary btn-sm"
                        to={`edit/${cat.id}`}
                        style={{ color: 'white' }}
                      >
                        <i className="fas fa-folder"></i>
                        Edit
                      </Link>
                      <Link
                        className="btn btn-primary btn-sm"
                        to={`cat/${cat.id}`}
                        style={{ color: 'white' }}
                      >
                        <i className="fas fa-folder"></i>
                        Posts
                      </Link>
                      <Button
                        onClick={() => onDeleteCategory(cat)}
                        className="btn btn-danger btn-sm"
                        style={{ color: 'white' }}
                      >
                        <i className="fas fa-trash"></i>
                        Delete
                      </Button>
                    </span>
                  </div>
                </div>
              ))}
          </div>
        ))}
    </div>
  ));

  return <>{content}</>;
};

const memoizedCategory = memo(Category);

export default memoizedCategory;
