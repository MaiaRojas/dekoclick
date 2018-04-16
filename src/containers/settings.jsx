import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import TopBar from '../components/top-bar';
import SettingsForm from '../components/settings-form';


const drawerWidth = 321;
const styles = theme => ({
  paper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing.unit * 3,
  },
  legend: {
    marginBottom: theme.spacing.unit * 2,
  },
  appBar: {
    width: '100%',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('md')]: {
      width: 'calc(100% - 73px)',
      marginLeft: '73px',
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
});


const Settings = props => (
  <div className="settings">
    <TopBar title="Settings" />
    <div
      position="absolute"
      className={classNames(props.classes.appBar, props.drawerOpen && props.classes.appBarShift)}
    >
      <SettingsForm {...props} uid={props.auth.uid} showOptsInSettings />
    </div>
  </div>
);

const mapStateToProps = ({ topbar }) => ({
  drawerOpen: topbar.drawerOpen,
});


Settings.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  auth: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string,
  }).isRequired,
  classes: PropTypes.shape({
    paper: PropTypes.string.isRequired,
    legend: PropTypes.string.isRequired,
    appBar: PropTypes.string.isRequired,
    appBarShift: PropTypes.string.isRequired,
  }).isRequired,
};


export default compose(
  connect(mapStateToProps),
  withStyles(styles),
)(Settings);
