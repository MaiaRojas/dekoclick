import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import DashboardIcon from 'material-ui-icons/Dashboard';
import SettingsIcon from 'material-ui-icons/Settings';
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
  profileBadge: {
    padding: '22px 16px',
    backgroundColor: '#ecebeb',
  },
  profileBadgeText: {
    color: '#333',
  },
  active: {
    backgroundColor: '#ffc107',
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
};


const nameToInitials = (name = '') => name.split(' ').reduce((memo, item) => {
  if (memo.length < 3) {
    return memo += item[0].toUpperCase();
  }
  return memo;
}, '');


const getName = ({ profile, auth }) =>
  (profile || {}).name || auth.displayName;


const getEmail = ({ profile, auth }) =>
  (profile || {}).email || auth.email;


const MainNav = props => console.log('MainNav', props.match.path) || (
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
      <ListItem className={props.classes.profileBadge}>
        <Avatar>
          {nameToInitials(getName(props))}
        </Avatar>
        <ListItemText
          classes={{ text: props.classes.profileBadgeText }}
          primary={getName(props)}
          secondary={getEmail(props)}
        />
      </ListItem>
      <Divider />
      <ListItem
        button
        onClick={() => props.history.push('/')}
        className={props.match.path === '/' ? props.classes.active : ''}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem
        button
        onClick={() => props.history.push('/settings')}
        className={props.match.path === '/settings' ? props.classes.active : ''}
      >
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItem>
      <div className={props.classes.bottom}>
        <Divider />
        <ListItem button onClick={() => props.firebase.logout()}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar sessión" />
        </ListItem>
      </div>
    </List>
  </LeftDrawer>
);


MainNav.propTypes = {
  auth: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  profile: PropTypes.shape({
    name: PropTypes.string,
    github: PropTypes.string,
  }),
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


MainNav.defaultProps = {
  profile: {},
};


export default withStyles(styles)(MainNav);
