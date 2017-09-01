'use strict';


import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  pathToJS
} from 'react-redux-firebase';


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


const WrapRoute = ({
  path,
  exact,
  component: Component,
  mainNav=true,
  ...props
}) => (
  <Route
    exact={!!exact}
    path={path}
    render={routeProps =>
      mainNav ?
        <WithMainNav component={Component} {...props} {...routeProps} /> :
        <Component {...props} {...routeProps} />}
  />
);


const App = props => {
  if (!isLoaded(props.auth)) {
    return (<div>Loading...</div>);
  }

  if (isEmpty(props.auth)) {
    return (<SignIn error={null} />);
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


const mapStateToProps = ({ firebase }) => ({
  authError: pathToJS(firebase, 'authError'),
  auth: pathToJS(firebase, 'auth'),
});


export default compose(
  firebaseConnect(),
  connect(mapStateToProps)
)(App);
