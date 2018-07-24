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
  toggleProjectUserAddDialog,
  updateProjectUserAddDialogEmail,
  updateProjectUserAddDialogRole,
  updateProjectUserAddDialogName,
  updateProjectUserAddDialogGithub,
  updateProjectUserAddDialogErrors,
  resetProjectUserAddDialog,
  fetchProjectUserAddDialogUserRecord,
  addProjectUser,
} from '../reducers/project-user-add-dialog';
import hasOwnProperty from '../util/hasOwnProperty';
import isEmail from '../util/isEmail';


const styles = theme => ({
  root: {
    color: theme.palette.text.primary,
  },
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


const ProjectUserAddDialog = ({ classes, ...props }) => (
  <div className={classes.container}>
    <Dialog open={props.open} onClose={props.toggleProjectUserAddDialog}>
      <DialogTitle>Añade un diseñador al projecto </DialogTitle>
      <DialogContent>
        <TextField
          id="email"
          className={classes.textField}
          value={props.email}
          onChange={e => props.updateProjectUserAddDialogEmail(e.target.value)}
          error={hasOwnProperty(props.errors, 'email')}
          disabled={!!props.userRecord || !!props.userRecordLoading}
          margin="dense"
          autoFocus
          label="Email"
          type="email"
          fullWidth
        />

        {props.userRecord && (
          <DialogContentText classes={{ root: classes.root }}>
            Ya existe un usuario registrado con el correo <code>{props.email}</code>.
            Al agregarlo al cohort, NO se enviará invitación por email.
          </DialogContentText>
        )}

        {emailNotExists(props) && (
          <DialogContentText classes={{ root: classes.root }}>
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
                onChange={e => props.updateProjectUserAddDialogRole(e.target.value)}
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
              onChange={e => props.updateProjectUserAddDialogName(e.target.value)}
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
              onChange={e => props.updateProjectUserAddDialogGithub(e.target.value)}
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
        <Button onClick={props.resetProjectUserAddDialog} color="default">
          Cancelar
        </Button>
        <Button
          variant="raised"
          color="primary"
          disabled={!!props.userRecordLoading || !!props.addingUser}
          onClick={() => {
            const { data, errors } = validate(props, !hasVerifiedEmail(props));

            if (errors && errors.length) {
              return props.updateProjectUserAddDialogErrors(errors);
            }

            props.updateProjectUserAddDialogErrors([]);

            if (!hasVerifiedEmail(props)) {
              return props.fetchProjectUserAddDialogUserRecord(props.email);
            }

            return props.addProjectUser(data);
          }}
        >
          {hasVerifiedEmail(props) ? 'Añadir usuario' : 'Verificar email'}
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);


ProjectUserAddDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  email: PropTypes.string,
  role: PropTypes.string,
  name: PropTypes.string,
  github: PropTypes.string,
  errors: PropTypes.shape({}),
  userRecord: PropTypes.shape({}),
  userRecordLoading: PropTypes.bool.isRequired,
  addingUser: PropTypes.bool.isRequired,
  toggleProjectUserAddDialog: PropTypes.func.isRequired,
  updateProjectUserAddDialogEmail: PropTypes.func.isRequired,
  updateProjectUserAddDialogRole: PropTypes.func.isRequired,
  updateProjectUserAddDialogName: PropTypes.func.isRequired,
  updateProjectUserAddDialogGithub: PropTypes.func.isRequired,
  updateProjectUserAddDialogErrors: PropTypes.func.isRequired,
  fetchProjectUserAddDialogUserRecord: PropTypes.func.isRequired,
  resetProjectUserAddDialog: PropTypes.func.isRequired,
  addProjectUser: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};


ProjectUserAddDialog.defaultProps = {
  email: '',
  role: '',
  name: '',
  github: '',
  errors: {},
  userRecord: undefined,
};


const mapStateToProps = ({ propjectUserAddDialog }) => ({
  open: propjectUserAddDialog.open,
  email: propjectUserAddDialog.email,
  role: propjectUserAddDialog.role,
  name: propjectUserAddDialog.name,
  github: propjectUserAddDialog.github,
  errors: propjectUserAddDialog.errors,
  userRecord: propjectUserAddDialog.userRecord,
  userRecordError: propjectUserAddDialog.userRecordError,
  userRecordLoading: propjectUserAddDialog.userRecordLoading,
  addingUser: propjectUserAddDialog.addingUser,
  addUserError: propjectUserAddDialog.addUserError,
  addUserSuccess: propjectUserAddDialog.addUserSuccess,
});


const mapDispatchToProps = {
  toggleProjectUserAddDialog,
  updateProjectUserAddDialogEmail,
  updateProjectUserAddDialogRole,
  updateProjectUserAddDialogName,
  updateProjectUserAddDialogGithub,
  updateProjectUserAddDialogErrors,
  resetProjectUserAddDialog,
  fetchProjectUserAddDialogUserRecord,
  addProjectUser,
};


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(ProjectUserAddDialog);
