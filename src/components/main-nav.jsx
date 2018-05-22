import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import DashboardIcon from 'material-ui-icons/Dashboard';
import LocalLibraryIcon from 'material-ui-icons/LocalLibrary';
import GroupIcon from 'material-ui-icons/Group';
import SettingsIcon from 'material-ui-icons/Settings';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import { FormattedMessage } from 'react-intl';
import LeftDrawer from './left-drawer';
// import { displayDrawer } from '../reducers/top-bar';


const styles = theme => ({
  list: {
    width: theme.leftDrawerWidth,
    color: theme.palette.common.white,
    backgroundColor: theme.palette.background.secondary,
    position: 'static',
  },
  logo: {
    height: 20,
    display: 'block',
    margin: 'auto',
    padding: 10,
  },
  profileBadge: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
    backgroundColor: theme.palette.background.secondary,
  },
  active: {
    opacity: 1,
    // color: theme.palette.text.secondary,
  },
  open: {
    right: 0,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  close: {
    left: '62px',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  signoutBtn: {
    backgroundColor: theme.palette.common.black,
  },
  divider: {
    backgroundColor: theme.palette.background.default,
  },
  listItemIcon: {
    color: theme.palette.common.white,
    marginLeft: theme.spacing.unit,
    opacity: 'inherit',
  },
  avatar: {
    width: `${theme.spacing.unit * 5}px`,
    height: `${theme.spacing.unit * 5}px`,
    borderRadius: 0,
    background: '#56f89a',
    color: theme.palette.primary.secondary,
  },
  primary: {
    color: 'inherit',
    fontWeight: 500,
  },
  root: {
    paddingLeft: theme.spacing.unit,
  },
  item: {
    opacity: 0.7,
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
        true : '';
    case 'cohorts':
      return match.path === '/cohorts' || /^\/cohorts\/[^/]+$/.test(match.path) ?
        classes.active : '';
    case 'settings':
      return match.path === '/settings' ? classes.active : '';
    default:
      return '';
  }
};


const isOpenMenu = (props, container) => {
  if (isActive(props, container) && props.drawerOpen) {
    return 'selectorActive open';
  }
  if (isActive(props, container)) {
    return 'selectorActive close';
  }
  return '';
  // if( isActive(props, container).indexOf('des') !== -1){
  //   return '';
  // }
  // if (props.drawerOpen) {
  //   return 'selectorActive open';
  // } else {
  //   return 'selectorActive close';
  // }
};


const MainNav = props => (
  <LeftDrawer>
    <List disablePadding className={props.classes.list}>
      <ListItem className={props.classes.profileBadge}>
        <Avatar className={props.classes.avatar} >
          {nameToInitials(getName(props.auth, props.profile))}
        </Avatar>
        <ListItemText
          classes={{ primary: props.classes.primary }}
          primary={getName(props.auth, props.profile)}
          secondary={getEmail(props.auth, props.profile)}
        />
      </ListItem>
      <Divider className={props.classes.divider} />
      <ListItem
        style={{ display: 'none' }}
        button
        onClick={() => props.history.push('/')}
      >
        <ListItemIcon className={props.classes.listItemIcon}>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText
          className="mainNav-text"
          primary="Dashboard"
        />
      </ListItem>
      <ListItem
        button
        onClick={() => props.history.push('/courses')}
        style={{ maxHeight: '48px', padding: '16px', marginTop: '16px' }}
        className={isActive(props, 'courses') ? props.classes.active : props.classes.item}
      >
        <ListItemIcon className={props.classes.listItemIcon}>
          <LocalLibraryIcon />
        </ListItemIcon>
        <ListItemText
          classes={{ primary: props.classes.primary }}
          primary={<FormattedMessage id="main-nav.courses" />}
          style={{ paddingLeft: '8px' }}
        />
        <div className={isOpenMenu(props, 'courses')} />
      </ListItem>
      {props.profile && props.profile.roles && props.profile.roles.admin &&
        <ListItem
          button
          onClick={() => props.history.push('/cohorts')}
          style={{ maxHeight: '48px', padding: '16px' }}
          className={isActive(props, 'cohorts') ? props.classes.active : props.classes.item}
        >
          <ListItemIcon className={props.classes.listItemIcon}>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: props.classes.primary }}
            primary="Cohorts"
            style={{ paddingLeft: '8px' }}
          />
          <div className={isOpenMenu(props, 'cohorts')} />
        </ListItem>
      }

      <ListItem
        button
        onClick={() => props.history.push('/settings')}
        style={{ maxHeight: '48px', padding: '16px' }}
        className={isActive(props, 'settings') ? props.classes.active : props.classes.item}
      >
        <ListItemIcon className={props.classes.listItemIcon}>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText
          classes={{ primary: props.classes.primary }}
          primary={<FormattedMessage id="main-nav.settings" />}
          style={{ paddingLeft: '8px' }}
        />
        <div className={isOpenMenu(props, 'settings')} />
      </ListItem>

      <div className={props.classes.bottom}>
        <Divider className={props.classes.divider} />
        <ListItem
          button
          className={props.classes.signoutBtn}
          onClick={() => props.firebase.logout()}
          style={{ minHeight: '90px', padding: '16px' }}
        >
          <ListItemIcon className={props.classes.listItemIcon}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: props.classes.primary }}
            primary={<FormattedMessage id="main-nav.signout" />}
            style={{ paddingLeft: '8px' }}
          />
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
    divider: PropTypes.string.isRequired,
    listItemIcon: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    primary: PropTypes.string.isRequired,
    item: PropTypes.string.isRequired,
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


const mapStateToProps = ({ topbar }) => ({
  drawerOpen: topbar.drawerOpen,
});


MainNav.defaultProps = {
  profile: {},
};


export default compose(
  connect(mapStateToProps),
  withStyles(styles),
)(MainNav);
