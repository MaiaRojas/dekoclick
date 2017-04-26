'use strict';


import React, { Component, PropTypes } from 'react';
import { Field, Control, Input, Section, Container, Box } from 'react-laboratoria-ui';


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
      <div className="wrapper">
        <header className="has-text-centered pv-14">
          <img alt="Laboratoria código que transforma" className="logo" src="img/logo.svg"/>
        </header>
        <Section className="login">
          <Container>
            <h2 className="is-hidden-mobile">ingresa</h2>
            <div className="is-hidden-mobile separator separator-primary separator-centered"></div>
            <h4>Bienvenido al capitán <br/> Ingresa a tu cuenta</h4>
            <Box>
              <form onSubmit={this.handleSubmit}>
                <Field>
                  <label className="label">Email:</label>
                  <Control>
                    <Input ref="email" type="email" placeholder="example@laboratoria.la"/>
                  </Control>
                </Field>

                <Field>
                  <label className="label">Password:</label>
                  <Control>
                    <Input ref="password" type="password" placeholder="your password"/>
                  </Control>
                </Field>

                <Field className="is-grouped">
                  <Control>
                    <button className="button is-primary">Login</button>
                  </Control>
                </Field>
              </form>
            </Box>
          </Container>
        </Section>
      </div>
    );
  }
}
