'use strict';


import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';


const styles = theme => ({
  appBar: {
    boxShadow: 'none',
    //width: 'calc(100% - 250px)',
    [theme.breakpoints.up('md')]: {
      width: 'calc(100% - 250px)',
    },
  },
});


const TopBar = props => (
  <AppBar className={props.classes.appBar}>
    <Toolbar>
      <Typography type="title">
        {props.title}
      </Typography>
    </Toolbar>
  </AppBar>
);


export default withStyles(styles)(TopBar);
