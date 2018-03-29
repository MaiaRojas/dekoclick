import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { displayDrawer } from '../reducers/top-bar';

const drawerWidth = 321;
const styles = theme => ({
  appBar: {
    width: `100%`,
    boxShadow: 'none',
    backgroundColor:'#f7f7f7',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - 73px)`,
      position: 'fixed',
    },
  },
  appBarShift: {
    width: '100%',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuIcon: {
    marginLeft: 12,
    marginRight: 36,
    // [theme.breakpoints.up('md')]: {
    //   display: 'none',
    // },
  },
  hide: {
    display: 'block',
  },
  flex: {
    flex: 1,
  },
  minilogo: {
    height: 20,
    with: 20,
    margin: 'auto',
  },
  spaceMenu: {
    padding: `${theme.spacing.unit * 0}px ${theme.spacing.unit * 3}px`,
  }
});


const TopBar = props => (
  <AppBar
    position="absolute"
    className={classNames( props.classes.appBar, props.drawerOpen && props.classes.appBarShift )}>
    <Toolbar disableGutters={!props.drawerOpen} className={props.classes.spaceMenu} >
      <div>
        <IconButton
          className={classNames(props.classes.menuIcon,  props.drawerOpen && props.classes.hide ) }
          aria-label="open drawer"
          onClick={() => props.displayDrawer()}
         >
           <MenuIcon/>
        </IconButton>
      </div>
      <Typography variant="title" className={props.classes.flex}>
        {props.title}
      </Typography>
      <div>
        {props.children}
      </div>
    </Toolbar>
  </AppBar>
);


TopBar.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  children: PropTypes.shape({}),
  displayDrawer: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    appBar: PropTypes.string.isRequired,
    appBarShift:PropTypes.string.isRequired,
    menuIcon: PropTypes.string.isRequired,
    hide: PropTypes.string.isRequired,
    flex: PropTypes.string.isRequired,
    minilogo:PropTypes.string.isRequired,
    spaceMenu:PropTypes.string.isRequired,
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
  withStyles(styles, {withTheme :true}),
)(TopBar);
