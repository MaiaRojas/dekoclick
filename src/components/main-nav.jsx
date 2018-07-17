import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import RemoveIcon from 'material-ui-icons/Remove';
import LocalLibraryIcon from 'material-ui-icons/LocalLibrary';
import GroupIcon from 'material-ui-icons/Group';
import SettingsIcon from 'material-ui-icons/Settings';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import { FormattedMessage } from 'react-intl';
import LeftDrawer from './left-drawer';
import DetailsIcon from 'material-ui-icons/Details';


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
    minHeight: '90px',
  },
  active: {
    opacity: 1,
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
  divider: {
    backgroundColor: '#969696',
  },
  listItemIcon: {
    color: '#969696',
    marginLeft: theme.spacing.unit,
    opacity: 'inherit',
  },
  primary: {
    color: '#777777',
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


const isActive = ({ match }, container) => {
  switch (container) {
    case 'dashboard':
      return match.path === '/';
    case 'courses':
      return match.path === '/courses' || /^\/cohorts\/[^/]+\/courses/.test(match.path);
    case 'cohorts':
      return match.path === '/cohorts' || /^\/cohorts\/[^/]+$/.test(match.path);
    case 'settings':
      return match.path === '/settings';
    default:
      return '';
  }
};


const MainNav = props => (
  <LeftDrawer>
    <List disablePadding className={props.classes.list}>
      <ListItem className={props.classes.profileBadge}>
        <ListItemIcon className={props.classes.listItemIcon}>
          <DetailsIcon />
        </ListItemIcon>
        <ListItemText
          classes={{ primary: props.classes.primary }}
          primary={'Filtros'}
        />
      </ListItem>
      <Divider className={props.classes.divider} />
      <ListItem
        button
        style={{ maxHeight: '48px', padding: '16px' }}
      >
        <ListItemText
          classes={{ primary: props.classes.primary }}
          primary="Estado"
        />
        <ListItemIcon className={props.classes.listItemIcon}>
          <RemoveIcon />
        </ListItemIcon>
      </ListItem>
      <Divider className={props.classes.divider} />
      <ListItem
        button
        style={{ maxHeight: '48px', padding: '16px'}}
      >
        <ListItemText
          classes={{ primary: props.classes.primary }}
          primary='Tipo'
        />
        <ListItemIcon className={props.classes.listItemIcon}>
          <RemoveIcon />
        </ListItemIcon>
      </ListItem>
      <Divider className={props.classes.divider} />
      <ListItem
        button
        style={{ maxHeight: '48px', padding: '16px' }}
      >
        <ListItemText
          classes={{ primary: props.classes.primary }}
          primary="Estilo"
        />
        <ListItemIcon className={props.classes.listItemIcon}>
          <RemoveIcon />
        </ListItemIcon>
      </ListItem>
      <Divider className={props.classes.divider} />
      <ListItem
        button
        style={{ maxHeight: '48px', padding: '16px' }}
      >
        <ListItemText
          classes={{ primary: props.classes.primary }}
          primary={'Tiempo'}
        />
        <ListItemIcon className={props.classes.listItemIcon}>
          <RemoveIcon />
        </ListItemIcon>
      </ListItem>
    </List>
  </LeftDrawer>
);


MainNav.propTypes = {
  // auth: PropTypes.shape({
  //   displayName: PropTypes.string,
  //   email: PropTypes.string.isRequired,
  // }).isRequired,
  // profile: PropTypes.shape({
  //   name: PropTypes.string,
  //   github: PropTypes.string,
  //   roles: PropTypes.shape({
  //     admin: PropTypes.bool,
  //   }),
  // }),
  // classes: PropTypes.shape({
  //   list: PropTypes.string.isRequired,
  //   logo: PropTypes.string.isRequired,
  //   profileBadge: PropTypes.string.isRequired,
  //   active: PropTypes.string.isRequired,
  //   bottom: PropTypes.string.isRequired,
  //   signoutBtn: PropTypes.string.isRequired,
  //   divider: PropTypes.string.isRequired,
  //   listItemIcon: PropTypes.string.isRequired,
  //   avatar: PropTypes.string.isRequired,
  //   primary: PropTypes.string.isRequired,
  //   item: PropTypes.string.isRequired,
  // }).isRequired,
  // // eslint-disable-next-line react/no-unused-prop-types
  // match: PropTypes.shape({
  //   path: PropTypes.string.isRequired,
  // }).isRequired,
  // history: PropTypes.shape({
  //   push: PropTypes.func.isRequired,
  // }).isRequired,
  // firebase: PropTypes.shape({
  //   logout: PropTypes.func.isRequired,
  // }).isRequired,
  // drawerOpen: PropTypes.bool.isRequired,
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
