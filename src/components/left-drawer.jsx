import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Hidden from 'material-ui/Hidden';
import { displayDrawer } from '../reducers/top-bar';


const styles = {
  drawer: {
    width: 320,
  },
};


const LeftDrawer = props => (
  <div>
    <Hidden mdUp>
      <Drawer
        className={props.classes.drawer}
        open={props.drawerOpen}
        onRequestClose={() => props.displayDrawer()}
        type="temporary"
        ModalProps={{
          keepMounted: true,
        }}
      >
        {props.children}
      </Drawer>
    </Hidden>
    <Hidden mdDown implementation="css">
      <Drawer
        className={props.classes.drawer}
        open
        type="permanent"
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
