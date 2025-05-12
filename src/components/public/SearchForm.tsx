import React, { useEffect, useRef } from 'react';
interface SearchProps {
  search: string;
  setSearch: (val: string) => void;
}

const SearchForm = ({ search, setSearch }: SearchProps) => {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchRef.current && !search) {
      searchRef.current.focus();
    }
  }, [search]);

  return (
    <div className="card-tools">
      <div className="input-group input-group-sm" style={{ width: '170px', zIndex: 0 }}>
        <input
          type="text"
          ref={searchRef}
          name="table_search"
          className="form-control float-right"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="input-group-append">
          <button onClick={() => setSearch('')} type="submit" className="btn btn-default">
            <i className="fa fa-window-close" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
