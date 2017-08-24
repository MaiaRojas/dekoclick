'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom';

import { resetErrorMessage, loadSession, signIn, signOut } from '../actions';

import Navbar from '../components/navbar';
import SignIn from './signin';
import Dashboard from './dashboard';
import Course from './course';
import Group from './group';
import Lesson from './lesson';

const PrivateRoute = ({ component: Component, userCtx, signOut, path, exact }) => (
  <Route path={path} exact={exact} render={props => (
    <div className="app">
      <Navbar userCtx={userCtx} signOut={signOut} linkable={true} />
      {userCtx && userCtx.name ?
        <Component userCtx={userCtx} {...props} /> :
        <Redirect to="/signin" />}
    </div>
  )}/>
);

class App extends React.Component {

  componentWillMount() {
    this.props.loadSession();
  }

  render() {
    const { userCtx, error } = this.props.session;

    return (
      <Router>
        <Switch>
          <PrivateRoute exact path="/" component={Dashboard} userCtx={userCtx} signOut={this.props.signOut} />
          <PrivateRoute path="/courses/:courseid" component={Course} userCtx={userCtx} />
          <Route path="/signin" render={() => (
            <div className="app">
              {userCtx && userCtx.name ?
                <Redirect to="/" /> :
                <SignIn signIn={this.props.signIn} error={error} />}
            </div>
          )} />
        </Switch>
      </Router>
    );
  }
}


const mapStateToProps = (state, ownProps) => ({
  app: state.app,
  session: state.session
});


const mapDispatchToProps = {
  resetErrorMessage,
  loadSession,
  signIn,
  signOut
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
