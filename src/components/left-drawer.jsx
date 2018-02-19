import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Hidden from 'material-ui/Hidden';
import { displayDrawer } from '../reducers/top-bar';


const styles = theme => ({
  drawer: {
    width: theme.leftDrawerWidth,
  },
});

const LeftDrawer = props => (
  <div>
    <Hidden mdUp>
      <Drawer
        classes={{ paper: props.classes.drawer }}
        open={props.drawerOpen}
        onClose={() => props.displayDrawer()}
        variant="temporary"
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        anchor="left"
      >
        {props.children}
      </Drawer>
    </Hidden>
    <Hidden smDown implementation="css">
      <Drawer
        classes={{ paper: props.classes.drawer }}
        open
        variant="permanent"
      >
        {props.children}
      </Drawer>
    </Hidden>
  </div>
);


LeftDrawer.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  displayDrawer: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    drawer: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.shape({}).isRequired,
};

const mapStateToProps = ({ topbar }) => ({
  drawerOpen: topbar.drawerOpen,
});

const mapDispatchToProps = {
  displayDrawer,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(LeftDrawer);
