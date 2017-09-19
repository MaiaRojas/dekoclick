import React from 'react';
import PropTypes from 'prop-types';
import MainNav from '../components/main-nav';


const WithMainNav = ({ component: Component, ...props }) => (
  <div className="app">
    <MainNav {...props} />
    <div className="main">
      <Component {...props} />
    </div>
  </div>
);


WithMainNav.propTypes = {
  component: PropTypes.func.isRequired,
};


export default WithMainNav;
