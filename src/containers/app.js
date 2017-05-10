'use strict';


import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom';
import { resetErrorMessage, loadSession, signIn, signOut } from '../actions';
import Spinner from 'react-spinner';
import Navbar from '../components/navbar';
import SignIn from './signin';
import Dashboard from './dashboard';
import Course from './course';
import Group from './group';
import Lesson from './lesson';
//import Problem from './problem';


const PrivateRoute = ({ component: Component, userCtx, path, exact }) => (
  <Route path={path} exact={exact} render={props => (
    userCtx && userCtx.name ?
      <Component userCtx={userCtx} {...props} /> :
      <Redirect to="/signin" />
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
        <div className="app">
          <div className="top">
            <Navbar userCtx={userCtx} signOut={this.props.signOut} />
          </div>
          {/*<Spinner />*/}
          <div className="main">
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} userCtx={userCtx} />
              <PrivateRoute path="/courses/:courseid" component={Course} userCtx={userCtx} />
              {/*<PrivateRoute path="/groups/:groupid" component={Group} userCtx={userCtx} />*/}
              {/*<PrivateRoute path="/groups/:groupid/lessons/:lessonid" component={Lesson} userCtx={userCtx} />*/}
              {/*<PrivateRoute path="/groups/:groupid/lessons/:lessonid/problems/:problemid" component={Problem} userCtx={userCtx} />*/}
              <Route path="/signin" render={() => (
                userCtx && userCtx.name ?
                  <Redirect to="/" /> :
                  <SignIn signIn={this.props.signIn} error={error} />
              )} />
            </Switch>
          </div>
        </div>
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
