import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { FormControl } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Input, { InputLabel } from 'material-ui/Input';
import TextField from 'material-ui/TextField';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import {
  toggleCohortUserAddDialog,
  updateCohortUserAddDialogEmail,
  updateCohortUserAddDialogRole,
  updateCohortUserAddDialogName,
  updateCohortUserAddDialogGithub,
  updateCohortUserAddDialogErrors,
  resetCohortUserAddDialog,
  fetchCohortUserAddDialogUserRecord,
  addCohortUser,
} from '../reducers/cohort-user-add-dialog';
import hasOwnProperty from '../util/hasOwnProperty';
import isEmail from '../util/isEmail';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    marginBottom: theme.spacing.unit,
    minWidth: 120,
  },
  textField: {
    // margin: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
  dateField: {
    margin: theme.spacing.unit,
    width: 200,
  },
});


const validate = (props, emailOnly) => {
  const {
    email, role, name, github,
  } = props;
  const errors = [];

  if (!isEmail(email)) {
    errors.push({
      field: 'email',
      message: 'Invalid email',
    });
  }
  if (!emailOnly && ['student', 'instructor', 'admin'].indexOf(role) === -1) {
    errors.push({
      field: 'role',
      message: `Role should be one of ${['student', 'instructor', 'admin']}`,
    });
  }
  if (!emailOnly && !name) {
    errors.push({
      field: 'name',
      message: 'Name is required',
    });
  }

  if (errors.length) {
    return { errors };
  }

  return {
    data: {
      email,
      profile: {
        name,
        github,
      },
      cohorts: {
        [props.cohortid]: role,
      },
    },
  };
};


const emailNotExists = ({ userRecordError }) =>
  userRecordError && userRecordError.statusCode === 404;


const hasVerifiedEmail = ({ userRecord, userRecordError }) =>
  (userRecord || (userRecordError && userRecordError.statusCode === 404));


const CohortUserAddDialog = ({ classes, ...props }) => (
  <div className={classes.container}>
    <Dialog open={props.open} onClose={props.toggleCohortUserAddDialog}>
      <DialogTitle>Añade usuario al cohort</DialogTitle>
      <DialogContent>
        <TextField
          id="email"
          className={classes.textField}
          value={props.email}
          onChange={e => props.updateCohortUserAddDialogEmail(e.target.value)}
          error={hasOwnProperty(props.errors, 'email')}
          disabled={!!props.userRecord || !!props.userRecordLoading}
          margin="dense"
          autoFocus
          label="Email"
          type="email"
          fullWidth
        />

        {props.userRecord && (
          <DialogContentText>
            Ya existe un usuario registrado con el correo <code>{props.email}</code>.
            Al agregarlo al cohort, NO se enviará invitación por email.
          </DialogContentText>
        )}

        {emailNotExists(props) && (
          <DialogContentText>
            El correo <code>{props.email}</code> todavía no está registrado en
            el LMS. Al agregarlo al cohort, se le enviará una invitación por
            email automáticamente.
          </DialogContentText>
        )}

        {hasVerifiedEmail(props) && (
          <div>
            <FormControl
              error={hasOwnProperty(props.errors, 'role')}
              className={classes.formControl}
            >
              <InputLabel htmlFor="role">Rol</InputLabel>
              <Select
                value={props.role}
                onChange={e => props.updateCohortUserAddDialogRole(e.target.value)}
                input={<Input id="role" />}
              >
                {['student', 'instructor', 'admin'].map(key =>
                  <MenuItem key={key} value={key}>{key}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              id="name"
              className={classes.textField}
              value={props.name}
              onChange={e => props.updateCohortUserAddDialogName(e.target.value)}
              error={hasOwnProperty(props.errors, 'name')}
              margin="dense"
              label="Nombre completo"
              type="text"
              fullWidth
            />
            <TextField
              id="github"
              className={classes.textField}
              value={props.github}
              onChange={e => props.updateCohortUserAddDialogGithub(e.target.value)}
              error={hasOwnProperty(props.errors, 'github')}
              margin="dense"
              label="Usuario de GitHub"
              type="text"
              fullWidth
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.resetCohortUserAddDialog} color="default">
          Cancelar
        </Button>
        <Button
          raised
          color="primary"
          disabled={!!props.userRecordLoading || !!props.addingUser}
          onClick={() => {
            const { data, errors } = validate(props, !hasVerifiedEmail(props));

            if (errors && errors.length) {
              return props.updateCohortUserAddDialogErrors(errors);
            }

            props.updateCohortUserAddDialogErrors([]);

            if (!hasVerifiedEmail(props)) {
              return props.fetchCohortUserAddDialogUserRecord(props.email);
            }

            return props.addCohortUser(data);
          }}
        >
          {hasVerifiedEmail(props) ? 'Añadir usuario' : 'Verificar email'}
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);


CohortUserAddDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  email: PropTypes.string,
  role: PropTypes.string,
  name: PropTypes.string,
  github: PropTypes.string,
  errors: PropTypes.shape({}),
  userRecord: PropTypes.shape({}),
  userRecordLoading: PropTypes.bool.isRequired,
  addingUser: PropTypes.bool.isRequired,
  toggleCohortUserAddDialog: PropTypes.func.isRequired,
  updateCohortUserAddDialogEmail: PropTypes.func.isRequired,
  updateCohortUserAddDialogRole: PropTypes.func.isRequired,
  updateCohortUserAddDialogName: PropTypes.func.isRequired,
  updateCohortUserAddDialogGithub: PropTypes.func.isRequired,
  updateCohortUserAddDialogErrors: PropTypes.func.isRequired,
  fetchCohortUserAddDialogUserRecord: PropTypes.func.isRequired,
  resetCohortUserAddDialog: PropTypes.func.isRequired,
  addCohortUser: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};


CohortUserAddDialog.defaultProps = {
  email: '',
  role: '',
  name: '',
  github: '',
  errors: {},
  userRecord: undefined,
};


const mapStateToProps = ({ cohortUserAddDialog }) => ({
  open: cohortUserAddDialog.open,
  email: cohortUserAddDialog.email,
  role: cohortUserAddDialog.role,
  name: cohortUserAddDialog.name,
  github: cohortUserAddDialog.github,
  errors: cohortUserAddDialog.errors,
  userRecord: cohortUserAddDialog.userRecord,
  userRecordError: cohortUserAddDialog.userRecordError,
  userRecordLoading: cohortUserAddDialog.userRecordLoading,
  addingUser: cohortUserAddDialog.addingUser,
  addUserError: cohortUserAddDialog.addUserError,
  addUserSuccess: cohortUserAddDialog.addUserSuccess,
});


const mapDispatchToProps = {
  toggleCohortUserAddDialog,
  updateCohortUserAddDialogEmail,
  updateCohortUserAddDialogRole,
  updateCohortUserAddDialogName,
  updateCohortUserAddDialogGithub,
  updateCohortUserAddDialogErrors,
  resetCohortUserAddDialog,
  fetchCohortUserAddDialogUserRecord,
  addCohortUser,
};


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(CohortUserAddDialog);
