import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import DashboardIcon from 'material-ui-icons/Dashboard';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import LeftDrawer from './left-drawer';


const styles = {
  list: {
    width: 320,
  },
  logo: {
    height: 20,
    display: 'block',
    margin: 'auto',
    padding: 10,
  },
};


const MainNav = props => (
  <LeftDrawer>
    <List disablePadding className={props.classes.list}>
      <ListItem>
        <img
          alt="Laboratoria, código que transforma"
          className={props.classes.logo}
          src="/img/logo.svg"
        />
      </ListItem>
      <Divider />
      <ListItem button onClick={() => props.history.push('/')}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button onClick={() => props.history.push('/account')}>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary="Mi cuenta" />
      </ListItem>
      <Divider />
      <ListItem button onClick={() => props.firebase.logout()}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Cerrar sessión" />
      </ListItem>
    </List>
  </LeftDrawer>
);


MainNav.propTypes = {
  classes: PropTypes.shape({
    list: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  firebase: PropTypes.shape({
    logout: PropTypes.func.isRequired,
  }).isRequired,
};


export default compose(
  connect(),
  firebaseConnect(),
  withStyles(styles),
)(MainNav);
