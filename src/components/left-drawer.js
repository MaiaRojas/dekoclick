'use strict';


import React from 'react';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Hidden from 'material-ui/Hidden';


const styles = theme => ({
  drawer: {
    width: 250
  },
});


const LeftDrawer = props => (
	<Hidden smDown={true}>
    <Drawer
      className={props.classes.drawer}
      open={true}
      docked={true}
    >
      {props.children}
    </Drawer>
  </Hidden>
);


export default withStyles(styles)(LeftDrawer);
