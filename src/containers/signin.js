'use strict';


import React, { Component } from 'react';


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
        <section className="login">
          <h2 className="is-hidden-mobile">ingresa</h2>
          <div className="is-hidden-mobile separator separator-primary separator-centered"></div>
          <h4>Bienvenido al capitán <br/> Ingresa a tu cuenta</h4>
          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <label className="label">Email:</label>
              <div className="control">
                <input ref="email" type="email" placeholder="example@laboratoria.la" />
              </div>
            </div>

            <div className="field">
              <label className="label">Password:</label>
              <div className="control">
                <input ref="password" type="password" placeholder="your password" />
              </div>
            </div>

            <div className="field">
              <div className="control">
                <button className="button is-primary">Login</button>
              </div>
            </div>
          </form>
        </section>
      </div>
    );
  }
}
