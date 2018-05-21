import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
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
import { displayDrawer } from '../reducers/top-bar';


const styles = theme => ({
  list: {
    width: theme.leftDrawerWidth,
    color: theme.palette.common.white,
    backgroundColor: theme.palette.background.secondary,
  },
  logo: {
    height: 20,
    display: 'block',
    margin: 'auto',
    padding: 10,
  },
  profileBadge: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
    backgroundColor: theme.palette.background.secondary,
  },
  active: {
    backgroundColor: theme.palette.primary[500],
    width: 0,
    height: 0,
    borderRight: '15px solid #ffe521',
    borderTop: '12px solid transparent',
    borderBottom: '12px solid transparent',
    position: 'absolute',
  },
  open: {
    right: 0,
  },
  close: {
    left: '57px',
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
    backgroundColor: theme.palette.common.white,
  },
  listItemIcon: {
    color: theme.palette.common.white,
  },
  avatar: {
    width: `${theme.spacing.unit * 5}px`,
    height: `${theme.spacing.unit * 5}px`,
    borderRadius: 0,
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
      <Divider className={props.classes.divider} />
      <ListItem className={props.classes.profileBadge}>
        <Avatar className={props.classes.avatar} >
          {nameToInitials(getName(props.auth, props.profile))}
        </Avatar>
        <ListItemText
          className="mainNav-email"
          primary={getName(props.auth, props.profile)}
          secondary={getEmail(props.auth, props.profile)}
        />
      </ListItem>
      <Divider className={props.classes.divider} />
      <ListItem
        style={{ display: 'none' }}
        button
        onClick={() => props.history.push('/')}
        // className={isActive(props, 'dashboard')}
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
        // className={isActive(props, 'courses')}
        style={{minHeight: '60px'}}
      >
        <ListItemIcon className={props.classes.listItemIcon}>
          <LocalLibraryIcon />
        </ListItemIcon>
        <ListItemText
          className="mainNav-text"
          primary={<FormattedMessage id="main-nav.courses" />}
        />
        <div className={ isActive(props, 'courses') && props.drawerOpen ? 'selectorActive open' : isActive(props, 'courses') ? 'selectorActive close' : '' }>
        </div>
      </ListItem>
      {props.profile && props.profile.roles && props.profile.roles.admin &&
        <ListItem
          button
          onClick={() => props.history.push('/cohorts')}
          // className={isActive(props, 'cohorts')}
          style={{minHeight: '60px'}}
        >
          <ListItemIcon className={props.classes.listItemIcon}>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText
            className="mainNav-text"
            primary="Cohorts"
          />
        <div className={ isActive(props, 'cohorts') && props.drawerOpen ? 'selectorActive open' : isActive(props, 'cohorts') ? 'selectorActive close' : '' }>
        </div>
        </ListItem>
      }

      <ListItem
        button
        onClick={() => props.history.push('/settings')}
        // className={isActive(props, 'settings')}
        style={{minHeight: '60px'}}
      >
        <ListItemIcon className={props.classes.listItemIcon}>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText
          className="mainNav-text"
          primary={<FormattedMessage id="main-nav.settings" />}
        />
        <div className={ props.drawerOpen && isActive(props, 'settings') ? 'selectorActive open' : isActive(props, 'settings') ? 'selectorActive close' : '' }>
        </div>
      </ListItem>

      <div className={props.classes.bottom}>
        <Divider className={props.classes.divider} />
        <ListItem
          button
          className={props.classes.signoutBtn}
          onClick={() => props.firebase.logout()}
          style={{minHeight: '90px'}}
        >
          <ListItemIcon className={props.classes.listItemIcon}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText
            className="mainNav-text"
            primary={<FormattedMessage id="main-nav.signout" />}
          />
        </ListItem>
      </div>
    </List>
  </LeftDrawer>
);

const mapStateToProps = ({ topbar }) => ({
  drawerOpen: topbar.drawerOpen,
});

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


export default compose(
  connect(mapStateToProps),
  withStyles(styles),
)(MainNav);
