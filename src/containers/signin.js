'use strict';


import React, { Component, PropTypes } from 'react';


export default class SignIn extends Component {

  constructor(props) {

    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {

    e.preventDefault();

    const email = this.refs.email.value;
    const password = this.refs.password.value;

    // TODO: validate email and password!!!

    this.props.signIn(email, password);

    return false;
  }

  render() {

    return (
      <div className="signin-form-wrapper">
        <form className="signin-form" onSubmit={this.handleSubmit}>
          <div className="field">
            <p className="control has-icons-left">
              <input ref="email" className="input" type="email" placeholder="Email" />
              <span className="icon is-small is-left">
                <i className="fa fa-envelope"></i>
              </span>
            </p>
            </div>
            <div className="field">
            <p className="control has-icons-left">
              <input ref="password" className="input" type="password" placeholder="Password" />
              <span className="icon is-small is-left">
                <i className="fa fa-lock"></i>
              </span>
            </p>
            </div>
            <div className="field">
            <p className="control">
              <button className="button is-primary">
                Login
              </button>
            </p>
            </div>
        </form>
      </div>
    );
  }
}
