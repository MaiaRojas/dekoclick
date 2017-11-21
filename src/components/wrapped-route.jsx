import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import ReactGA from 'react-ga';
import WithMainNav from './with-main-nav';


ReactGA.initialize('UA-54283238-19');


const WrappedRoute = ({
  path,
  exact,
  component: Component,
  mainNav,
  ...props
}) => (
  <Route
    exact={!!exact}
    path={path}
    render={(routeProps) => {
      // Google Analytics tracking...
      const { pathname, search } = routeProps.location;
      const page = pathname + search;
      ReactGA.set({ page });
      ReactGA.pageview(page);

      return mainNav ?
        <WithMainNav component={Component} {...props} {...routeProps} /> :
        <Component {...props} {...routeProps} />;
    }}
  />
);


WrappedRoute.propTypes = {
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool,
  component: PropTypes.func.isRequired,
  mainNav: PropTypes.bool,
};


WrappedRoute.defaultProps = {
  exact: false,
  mainNav: true,
};


export default WrappedRoute;
