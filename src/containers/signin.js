'use strict';


import React, { Component, PropTypes } from 'react';
import { Field, Input } from 'react-laboratoria-ui';


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

          <Field>
            <p className="control has-icons-left">
              <Input ref="email" type="email" placeholder="Email" />
            </p>
          </Field>

          <Field>
            <p className="control has-icons-left">
              <Input ref="password" type="password" placeholder="Password" />
            </p>
          </Field>

          <Field>
            <p className="control">
              <button className="button is-primary">
                Login
              </button>
            </p>
          </Field>

        </form>

      </div>
    );
  }
}
