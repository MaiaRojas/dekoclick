'use strict';


import React, { Component, PropTypes } from 'react';
import { Button, Textfield } from 'react-mdl';


export default class SignIn extends Component {

  constructor(props) {

    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {

    e.preventDefault();

    const email = this.refs.email.inputRef.value;
    const password = this.refs.password.inputRef.value;

    // TODO: validate email and password!!!

    this.props.signIn(email, password);

    return false;
  }

  render() {

    return (
      <div className="signin-form-wrapper">
        <form className="signin-form" onSubmit={this.handleSubmit}>
          <img className="logo" src="/img/logo.svg" />
          <Textfield label="email" ref="email" />
          <Textfield label="password" ref="password" type="password" />
          <Button raised colored>Inciar sessión</Button>
        </form>
      </div>
    );
  }
}
