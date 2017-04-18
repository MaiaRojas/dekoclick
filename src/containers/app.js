'use strict';


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { resetErrorMessage, loadSession, signIn, signOut } from '../actions';
import SignIn from './signin';
import { Nav } from 'react-laboratoria-ui';


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

    const goTo = (path) => {

      this.props.router.push(path);
    };

    return (
      <div>
        <Nav>
          <div className="nav-left">
          </div>
          <span className="nav-toggle">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <div className="nav-right nav-menu">
            <a className="nav-item is-tab">
              <figure className="image is-16x16" style={{'marginRight': '8px'}}>
                <img src="http://bulma.io/images/jgthms.png" alt="{this.props.userCtx.name}" />
              </figure>
              {this.props.userCtx.name}
            </a>
            <a className="nav-item is-tab" onClick={this.props.signOut}>Log out</a>
          </div>
        </Nav>
        <section className="section">
          {this.props.children}
        </section>
      </div>
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
