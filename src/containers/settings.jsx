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
    <div>

      <Paper className={props.classes.paper}>
        <FormControl component="fieldset">
          <FormLabel component="legend" className={props.classes.legend}>
            Correo electrónico
          </FormLabel>
          <Input
            id="email"
            label="Email"
            margin="normal"
            disabled
            value={props.auth.email}
          />
        </FormControl>
        <IconButton>
          <EditIcon />
        </IconButton>
      </Paper>

      <Paper className={props.classes.paper}>
        <FormControl component="fieldset">
          <FormLabel component="legend" className={props.classes.legend}>
            Nombre
          </FormLabel>
          <Input
            id="displayName"
            label="Nombre"
            margin="normal"
            disabled
            value={props.auth.displayName || ''}
          />
        </FormControl>
        <IconButton>
          <EditIcon />
        </IconButton>
      </Paper>

      <Paper className={props.classes.paper}>
        <FormControl component="fieldset">
          <FormLabel component="legend" className={props.classes.legend}>
            Contraseña
          </FormLabel>
          <Button raised>Cambiar contraseña</Button>
        </FormControl>
      </Paper>

    </div>
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
