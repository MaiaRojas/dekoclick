'use strict';


import React from 'react';
import { Link } from 'react-router-dom';


const Burger = (props) => {

  //if (!props.userCtx || !props.userCtx.name) {
  //  return null;
  //}

  return (
    <span className="burger">
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

  const imgStyle = {
    borderRadius: '100%'
  };

  const aStyle = {
    //textDecoration: 'none',
    //marginTop: '-10px',
    //marginLeft: '-10px'
  };

  const gravatar = 'https://www.gravatar.com/avatar/' + userCtx.md5 + '?s=28';

  return (
    <div className="menu">
      <a style={aStyle}>
        <img src={gravatar} alt="{userCtx.name}" style={imgStyle} /> {/*userCtx.name*/}
      </a>
      <ul>
        <li><a href="#">Mi perfil</a></li>
        <li><a href="#">Mi cuenta</a></li>
        <li><a onClick={props.signOut}>Salir</a></li>
      </ul>
    </div>
  );
};


const Navbar = (props) => {

  const navStyle = {
    //backgroundColor: 'rgba(255, 255, 255, 0.1)',
    //display: 'flex',
    //height: '60px',
    //position: 'fixed',
    //width: '100%',

    //flexDirection: 'row',
    //justifyContent: 'space-between',
    //justifyContent: 'center',
    //alignItems: 'center',
  };

  const navCenterStyle = {
    //textAlign: 'center',
    //width: '100%',
    //flex: 1
  };

  const logoStyle = {
    width: '120px',
    paddingTop: '12px'
  };

  return (
    <div className="nav" style={navStyle}>
      <div className="nav-left">
        {/*<Burger userCtx={props.userCtx} />*/}
      </div>
      <div className="nav-center" style={navCenterStyle}>
        <Link to="/">
          <img alt="Laboratoria, código que transforma" style={logoStyle} src="img/logo.svg"/>
        </Link>
      </div>
      <div className="nav-right">
        <UserMenu userCtx={props.userCtx} signOut={props.signOut} />
      </div>
    </div>
  );
};


export default Navbar;
