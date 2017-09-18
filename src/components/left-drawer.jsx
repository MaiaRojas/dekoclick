import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Hidden from 'material-ui/Hidden';


const styles = {
  drawer: {
    width: 320,
  },
};


const LeftDrawer = props => (
  <Hidden smDown>
    <Drawer className={props.classes.drawer} open type="permanent">
      {props.children}
    </Drawer>
  </Hidden>
);


LeftDrawer.propTypes = {
  classes: PropTypes.shape({
    drawer: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.shape({}).isRequired,
};


export default withStyles(styles)(LeftDrawer);
