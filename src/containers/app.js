'use strict';


import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, isLoaded, isEmpty, pathToJS } from 'react-redux-firebase';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom';


import MainNav from '../components/main-nav';
import SignIn from './signin';
import Dashboard from './dashboard';
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


const App = props => {
  if (!isLoaded(props.auth)) {
    return (<div>Loading...</div>);
  }

  if (isEmpty(props.auth)) {
    return (<SignIn error={null} />);
  }

  return (
    <Router>
      <Switch>
        <Route
          path="/cohorts/:cohortid/courses/:courseid/:unitid"
          render={props => <Unit {...props} />}
        />
        <Route
          path="/cohorts/:cohortid/courses/:courseid"
          render={props => <WithMainNav component={Course} {...props} />}
        />
        <Route exact path="/" >
          <WithMainNav component={Dashboard} {...props} />
        </Route>
      </Switch>
    </Router>
  );
};


const mapStateToProps = ({ firebase }) => ({
  authError: pathToJS(firebase, 'authError'),
  auth: pathToJS(firebase, 'auth'),
});


export default compose(
  firebaseConnect(),
  connect(mapStateToProps, {})
)(App);
