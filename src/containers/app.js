'use strict';


import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import { resetErrorMessage, loadSession, signIn, signOut } from '../actions';
import Spinner from 'react-spinner';
import Navbar from '../components/navbar';
import SignIn from './signin';
import Dashboard from './dashboard';
import Course from './course';
import Group from './group';
import Lesson from './lesson';
import Problem from './problem';


const PrivateRoute = ({ component: Component, userCtx, path }) => (
  <Route path={path} render={props => (
    userCtx ?
      <Component userCtx={userCtx} {...props} /> :
      <Redirect to="/signin" />
  )}/>
);


class App extends React.Component {

  componentWillMount() {

    this.props.loadSession();
  }

  render() {

    const { userCtx } = this.props.session;

    return (
      <Router>
        <div>
          <Navbar userCtx={userCtx} signOut={this.props.signOut} />
          <Spinner />
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute path="/courses/:courseid" component={Course} />
          <PrivateRoute path="/groups/:groupid" component={Group} />
          <PrivateRoute path="/groups/:groupid/lessons/:lessonid" component={Lesson} />
          <PrivateRoute path="/groups/:groupid/lessons/:lessonid/problems/:problemid" component={Problem} />
          <Route path="/signin" render={() => {
            return <SignIn signIn={this.props.signIn} />
          }} />
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
