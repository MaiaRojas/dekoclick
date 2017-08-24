'use strict';


import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, isLoaded, isEmpty, pathToJS } from 'react-redux-firebase';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom';
//import { resetErrorMessage } from '../actions';


import Navbar from '../components/navbar';
import SignIn from './signin';
import Dashboard from './dashboard';
import Course from './course';
import Group from './group';
import Lesson from './lesson';


const PrivateRoute = ({ component: Component, auth, path, exact }) => (
  <Route path={path} exact={exact} render={props => (
    <div className="app">
      <Navbar auth={auth} linkable={true} />
      {auth ?
        <Component auth={auth} {...props} /> :
        <Redirect to="/signin" />}
    </div>
  )}/>
);


const App = props => {
  if (!isLoaded(props.auth)) {
    return (<div>Loading...</div>);
  }
  // else if (isEmpty(props.auth)) {
  //   return (<div className="app"><SignIn error={null} /></div>);
  // }

  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/" component={Dashboard} auth={props.auth} />
        <PrivateRoute path="/courses/:courseid" component={Course} auth={props.auth} />
        <Route path="/signin" render={() => (
          <div className="app">
            {props.auth ?
              <Redirect to="/" /> :
              <SignIn error={null} />}
          </div>
        )} />
      </Switch>
    </Router>
  );
};


const mapStateToProps = ({ firebase }) => ({
  authError: pathToJS(firebase, 'authError'),
  auth: pathToJS(firebase, 'auth'),
});


const mapDispatchToProps = {
  //resetErrorMessage
};


export default compose(
  firebaseConnect(),
  connect(mapStateToProps, mapDispatchToProps)
)(App);
