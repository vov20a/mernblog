import React from 'react';
import { Link } from 'react-router-dom';
import { ICategory } from '../../types/ICategory';

interface BreadcrumbsProp {
  breadcrumbs: ICategory[];
}

const Breadcrumbs = ({ breadcrumbs }: BreadcrumbsProp) => {
  return (
    <ol className="breadcrumb float-sm-right">
      <li className="breadcrumb-item">
        <Link to="/">Home</Link>
      </li>
      {breadcrumbs.map((item: ICategory, index) =>
        breadcrumbs.length - 1 === index ? (
          <li key={item.id} className="breadcrumb-item active">
            {item.title}
          </li>
        ) : (
          <li key={item.id} className="breadcrumb-item active">
            <Link
              to={`/categories/${item.id}`}
              state={{ categoryTitle: item.title, categoryId: item.id }}
            >
              {item.title}
            </Link>
          </li>
        ),
      )}
    </ol>
  );
};

export default Breadcrumbs;
