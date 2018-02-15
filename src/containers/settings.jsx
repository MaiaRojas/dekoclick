import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { FormControl, FormLabel } from 'material-ui/Form';
import Input from 'material-ui/Input';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui-icons/Edit';
import TopBar from '../components/top-bar';
import SettingsForm from '../components/settings-form'

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

         <SettingsForm {...props} uid = {props.auth.uid} showOpenDialog = {true} />
   </div>
);


Settings.propTypes = {
  auth: PropTypes.shape({
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string,
  }).isRequired,
  classes: PropTypes.shape({
    paper: PropTypes.string.isRequired,
    legend: PropTypes.string.isRequired,
  }).isRequired,
};


export default withStyles(styles)(Settings);
