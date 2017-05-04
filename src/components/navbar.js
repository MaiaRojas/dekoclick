'use strict';


import React from 'react';


const Burger = (props) => {

  if (!props.userCtx) {
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

  if (!props.userCtx) {
    return null;
  }

  return (
    <div className="nav-right nav-menu">
      <a className="nav-item is-tab">
        <figure className="image is-16x16" style={{'marginRight': '8px'}}>
          <img src="http://bulma.io/images/jgthms.png" alt="{props.userCtx.name}" />
        </figure>
        {props.userCtx.name}
      </a>
      <a className="nav-item is-tab" onClick={props.signOut}>Log out</a>
    </div>
  );
};


const Navbar = (props) => {

  return (
    <div className="nav">
      <div className="nav-left">Logo</div>
      <Burger userCtx={props.userCtx} />
      <UserMenu userCtx={props.userCtx} />
    </div>
  );
};


export default Navbar;
