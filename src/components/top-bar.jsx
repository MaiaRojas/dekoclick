import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { displayDrawer } from '../reducers/top-bar';


const styles = theme => ({
  appBar: {
    boxShadow: 'none',
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${theme.leftDrawerWidth}px)`,
    },
  },
  menuIcon: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  flex: {
    flex: 1,
  },
});


const TopBar = props => (
  <AppBar className={props.classes.appBar}>
    <Toolbar>
      <IconButton
        className={props.classes.menuIcon}
        aria-label="open drawer"
        onClick={() => props.displayDrawer()}
      >
        <MenuIcon />
      </IconButton>
      <Typography type="title" className={props.classes.flex}>
        {props.title}
      </Typography>
      <div>
        {props.children}
      </div>
    </Toolbar>
  </AppBar>
);


TopBar.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.shape({}),
  displayDrawer: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    appBar: PropTypes.string.isRequired,
    menuIcon: PropTypes.string.isRequired,
    flex: PropTypes.string.isRequired,
  }).isRequired,
};


TopBar.defaultProps = {
  children: undefined,
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
)(TopBar);
