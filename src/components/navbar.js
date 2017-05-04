'use strict';


import React from 'react';


const Burger = (props) => {

  if (!props.userCtx || !props.userCtx.name) {
    return null;
  }

  return (
    <span className="nav-toggle">
      <span></span>
      <span></span>
      <span></span>
    </span>
  );
};


const UserMenu = (props) => {

  const userCtx = props.userCtx || {};

  if (!userCtx.name) {
    return null;
  }

  const gravatar = 'https://www.gravatar.com/avatar/' + userCtx.md5 + '?s=16';

  return (
    <div className="nav-right nav-menu">
      <a className="nav-item is-tab">
        <img src={gravatar} alt="{userCtx.name}" /> {userCtx.name}
      </a>
      <a className="nav-item is-tab" onClick={props.signOut}>Log out</a>
    </div>
  );
};


const Navbar = (props) => {

  return (
    <div className="nav">
      <div className="nav-left">
        <img alt="Laboratoria código que transforma" className="logo" src="img/logo.svg"/>
      </div>
      <Burger userCtx={props.userCtx} />
      <UserMenu userCtx={props.userCtx} signOut={props.signOut} />
    </div>
  );
};


export default Navbar;
