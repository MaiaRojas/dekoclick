import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import DashboardIcon from 'material-ui-icons/Dashboard';
import LocalLibraryIcon from 'material-ui-icons/LocalLibrary';
import GroupIcon from 'material-ui-icons/Group';
import SettingsIcon from 'material-ui-icons/Settings';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import LeftDrawer from './left-drawer';


const styles = theme => ({
  list: {
    width: theme.leftDrawerWidth,
  },
  logo: {
    height: 20,
    display: 'block',
    margin: 'auto',
    padding: 10,
  },
  profileBadge: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
    backgroundColor: theme.palette.background.default,
  },
  active: {
    backgroundColor: theme.palette.primary[500],
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  signoutBtn: {
    backgroundColor: theme.palette.background.default,
  },
});


const nameToInitials = (name = '') => name.split(' ').reduce((memo, item) => {
  if (item[0] && memo.length < 3) {
    return memo + item[0].toUpperCase();
  }
  return memo;
}, '');


const getName = (auth, profile) =>
  (profile || {}).name || auth.displayName || '';


const getEmail = (auth, profile) =>
  (profile || {}).email || auth.email;


const isActive = ({ match, classes }, container) => {
  switch (container) {
    case 'dashboard':
      return match.path === '/' ? classes.active : '';
    case 'courses':
      return match.path === '/courses' || /^\/cohorts\/[^/]+\/courses/.test(match.path) ?
        classes.active : '';
    case 'cohorts':
      return match.path === '/cohorts' || /^\/cohorts\/[^/]+$/.test(match.path) ?
        classes.active : '';
    case 'settings':
      return match.path === '/settings' ? classes.active : '';
    default:
      return '';
  }
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
      <ListItem className={props.classes.profileBadge}>
        <Avatar>
          {nameToInitials(getName(props.auth, props.profile))}
        </Avatar>
        <ListItemText
          primary={getName(props.auth, props.profile)}
          secondary={getEmail(props.auth, props.profile)}
        />
      </ListItem>
      <Divider />
      <ListItem
        style={{ display: 'none' }}
        button
        onClick={() => props.history.push('/')}
        className={isActive(props, 'dashboard')}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem
        button
        onClick={() => props.history.push('/courses')}
        className={isActive(props, 'courses')}
      >
        <ListItemIcon>
          <LocalLibraryIcon />
        </ListItemIcon>
        <ListItemText primary="Mis cursos" />
      </ListItem>
      {props.profile && props.profile.roles && props.profile.roles.admin &&
        <ListItem
          button
          onClick={() => props.history.push('/cohorts')}
          className={isActive(props, 'cohorts')}
        >
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Cohorts" />
        </ListItem>
      }
      <ListItem
        button
        onClick={() => props.history.push('/settings')}
        className={isActive(props, 'settings')}
      >
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItem>
      <div className={props.classes.bottom}>
        <Divider />
        <ListItem
          button
          className={props.classes.signoutBtn}
          onClick={() => props.firebase.logout()}
        >
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
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired,
  }).isRequired,
  profile: PropTypes.shape({
    name: PropTypes.string,
    github: PropTypes.string,
    roles: PropTypes.shape({
      admin: PropTypes.bool,
    }),
  }),
  classes: PropTypes.shape({
    list: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    profileBadge: PropTypes.string.isRequired,
    active: PropTypes.string.isRequired,
    bottom: PropTypes.string.isRequired,
    signoutBtn: PropTypes.string.isRequired,
  }).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
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
