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

    const formStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    };

    return (
      <div style={formStyle}>
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
              <button>Ingresar</button>
            </div>
          </div>

          {this.props.error && <div className="error">
            {this.props.error.response.data.message}
          </div>}

        </form>
      </div>
    );
  }
}
