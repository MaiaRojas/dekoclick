import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  pathToJS,
} from 'react-redux-firebase';
import { CircularProgress } from 'material-ui/Progress';
import ScrollToTop from '../components/scroll-to-top';
import MainNav from '../components/main-nav';
import SignIn from './signin';
import Dashboard from './dashboard';
import Account from './account';
import Course from './course';
import Unit from './unit';


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


const WrapRoute = ({
  path,
  exact,
  component: Component,
  mainNav,
  ...props
}) => (
  <Route
    exact={!!exact}
    path={path}
    render={routeProps => (
      mainNav ?
        <WithMainNav component={Component} {...props} {...routeProps} /> :
        <Component {...props} {...routeProps} />
    )}
  />
);


WrapRoute.propTypes = {
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool,
  component: PropTypes.func.isRequired,
  mainNav: PropTypes.bool.isRequired,
};


WrapRoute.defaultProps = {
  exact: false,
  mainNav: true,
};


const App = (props) => {
  if (!isLoaded(props.auth)) {
    return (<CircularProgress />);
  }

  if (isEmpty(props.auth)) {
    return (<SignIn error={null} authError={props.authError} />);
  }

  return (
    <Router>
      <ScrollToTop>
        <Switch>
          <WrapRoute
            path="/cohorts/:cohortid/courses/:courseid/:unitid/:partid?/:exerciseid?"
            component={Unit}
            mainNav={false}
            {...props}
          />
          <WrapRoute
            path="/cohorts/:cohortid/courses/:courseid"
            component={Course}
            {...props}
          />
          <WrapRoute path="/account" component={Account} {...props} />
          <WrapRoute exact path="/" component={Dashboard} {...props} />
        </Switch>
      </ScrollToTop>
    </Router>
  );
};


App.propTypes = {
  auth: PropTypes.shape({}),
  authError: PropTypes.shape({
    code: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }),
};


App.defaultProps = {
  auth: undefined,
  authError: undefined,
};


const mapStateToProps = ({ firebase }) => ({
  authError: pathToJS(firebase, 'authError'),
  auth: pathToJS(firebase, 'auth'),
});


export default compose(
  firebaseConnect(),
  connect(mapStateToProps),
)(App);
