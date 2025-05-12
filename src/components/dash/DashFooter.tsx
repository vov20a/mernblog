import React from 'react';
import { Link } from 'react-router-dom';

const DashFooter = () => {
  return (
    <footer className="main-footer">
      <div className="float-right d-none d-sm-block">
        <b>Version</b> 3.0.5
      </div>
      <strong>
        Copyright &copy; 2014-2019 <Link to="http://adminlte.io">AdminLTE.io</Link>.
      </strong>{' '}
      All rights reserved.
    </footer>
  );
};

export default DashFooter;
