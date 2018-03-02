import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TopBar from '../components/top-bar';
import SettingsForm from '../components/settings-form';


const styles = theme => ({
  paper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing.unit * 3,
  },
  legend: {
    marginBottom: theme.spacing.unit * 2,
  },

});


const Settings = props => (
  <div className="settings">
    <TopBar title="Settings" />
    <SettingsForm {...props} uid={props.auth.uid} showOptsInSettings />
  </div>
);


Settings.propTypes = {
  auth: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string,
  }).isRequired,
  classes: PropTypes.shape({
    paper: PropTypes.string.isRequired,
    legend: PropTypes.string.isRequired,
  }).isRequired,
};


export default withStyles(styles)(Settings);
