'use strict';


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { Layout, Header, Drawer, Content, Navigation } from 'react-mdl';
import { resetErrorMessage, loadSession, signIn, signOut } from '../actions';
import SignIn from './signin';


const AdminNav = (props) => {

  return (
    <Navigation>
      <Link to="/users">Users</Link>
      <Link to="/tracks">Tracks</Link>
      <Link to="/locations">Locations</Link>
      <Link to="/groups">Groups</Link>
      <Link to="/lessons">Lessons</Link>
    </Navigation>
  );
};


class App extends Component {

  componentWillMount() {

    this.props.loadSession();
  }

  render() {

    if (!this.props.hasLoaded) {
      return null;
    }

    if (!this.props.isSignedIn) {
      return (
        <SignIn signIn={this.props.signIn} />
      );
    }

    let adminNav = null;

    if (this.props.userCtx.roles.indexOf('_admin') >= 0) {
      adminNav = <AdminNav />
    }

    return (
      <Layout fixedHeader={true} fixedDrawer={true}>
        <Header title={this.props.app.title}></Header>
        <Drawer>
          <img className="logo" src="/img/logo.svg" />
          <Navigation>
            <Link to="/">Dashboard</Link>
            <a href="#" onClick={this.props.signOut}>Sign out</a>
          </Navigation>
          {adminNav}
        </Drawer>
        <Content>
          {this.props.children}
        </Content>
      </Layout>
    );
  }

}


const mapStateToProps = (state, ownProps) => {

  return {
    app: state.app,
    hasLoaded: state.session.hasLoaded,
    isSignedIn: state.session.isSignedIn,
    userCtx: state.session.userCtx,
    //errorMessage: state.errorMessage,
  };
};


const mapDispatchToProps = {
  resetErrorMessage,
  loadSession,
  signIn,
  signOut
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
