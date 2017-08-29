'use strict';

import React from 'react';
import { firebaseConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';


export default firebaseConnect()(props => (
  <AppBar color="default">
    <Toolbar>
      <Link to="/" style={{ flex: 1 }}>
        <img
          alt="Laboratoria, código que transforma"
          style={{ width: '130px', marginTop: '10px' }}
          src="/img/logo.svg"
        />
      </Link>
      <Button color="contrast" onClick={() => props.firebase.logout()}>
        Logout
      </Button>
    </Toolbar>
  </AppBar>
));
