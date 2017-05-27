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

  const style = {
    nav: {
      display: 'flex',
      flexDirection: 'row',
      padding: '14px 0px',
      minHeight: '65px',
      left: {
        flex: 1,
        textAlign: 'left',
        paddingLeft: '20px'
      },
      center: {
        flex: 1,
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        logo: {
          width: '190px'
        }
      },
      right: {
        flex: 1,
        textAlign: 'right',
        paddingRight: '20px'
      }
    }
  };

  return (
    <div className="nav" style={style.nav}>
      <div className="left" style={style.nav.left}>
        {/*<Burger userCtx={props.userCtx} />*/}
      </div>
      <div className="center" style={style.nav.center}>
        {props.linkable ?
          <Link to="/">
            <img alt="Laboratoria, código que transforma" style={style.nav.center.logo} src="img/logo.svg"/>
          </Link> :
          <img alt="Laboratoria, código que transforma" style={style.nav.center.logo} src="img/logo.svg"/>
        }
      </div>
      <div className="right" style={style.nav.right}>
        <UserMenu userCtx={props.userCtx} signOut={props.signOut} />
      </div>
    </div>
  );
};


export default Navbar;
