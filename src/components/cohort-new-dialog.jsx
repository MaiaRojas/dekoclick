import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, getVal } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import {
  toggleCohortNewDialog,
  updateCohortNewDialogCampus,
  updateCohortNewDialogProgram,
  updateCohortNewDialogTrack,
  updateCohortNewDialogName,
  updateCohortNewDialogStart,
  updateCohortNewDialogEnd,
  updateCohortNewDialogErrors,
  updateCohortNewDialogKey,
  resetCohortNewDialog,
} from '../reducers/cohort-new-dialog';
import hasOwnProperty from '../util/hasOwnProperty';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  textField: {
    margin: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
  dateField: {
    margin: theme.spacing.unit,
    width: 200,
  },
});


const CohortNewDialogForm = ({ classes, ...props }) => (
  <DialogContent>
    <FormControl
      error={hasOwnProperty(props.errors, 'campus')}
      className={classes.formControl}
    >
      <InputLabel htmlFor="campus">Campus</InputLabel>
      <Select
        value={props.campus}
        onChange={e => props.updateCohortNewDialogCampus(e.target.value)}
        input={<Input id="campus" />}
      >
        {Object.keys(props.campuses).map(key =>
          <MenuItem key={key} value={key}>{props.campuses[key].name}</MenuItem>)}
      </Select>
    </FormControl>
    <FormControl
      error={hasOwnProperty(props.errors, 'program')}
      className={classes.formControl}
    >
      <InputLabel htmlFor="program">Program</InputLabel>
      <Select
        value={props.program}
        onChange={e => props.updateCohortNewDialogProgram(e.target.value)}
        input={<Input id="program" />}
      >
        <MenuItem value="bc">Bootcamp</MenuItem>
        <MenuItem value="ec">Educación Continua</MenuItem>
      </Select>
    </FormControl>
    <FormControl
      error={hasOwnProperty(props.errors, 'track')}
      className={classes.formControl}
    >
      <InputLabel htmlFor="track">Track</InputLabel>
      <Select
        value={props.track}
        onChange={e => props.updateCohortNewDialogTrack(e.target.value)}
        input={<Input id="track" />}
      >
        <MenuItem value="core">Common core</MenuItem>
        <MenuItem value="js">JavaScript</MenuItem>
        <MenuItem value="ux">UX</MenuItem>
        <MenuItem value="mobile">Mobile</MenuItem>
      </Select>
    </FormControl>
    <TextField
      id="name"
      className={classes.textField}
      value={props.name}
      onChange={e => props.updateCohortNewDialogName(e.target.value)}
      error={hasOwnProperty(props.errors, 'name')}
      helperText="Minúsculas y sin espacios. Por ejemplo: am/pm para bootcamp o react para ec"
      margin="dense"
      autoFocus
      label="Nombre"
      type="text"
      fullWidth
    />
    <TextField
      id="start"
      className={classes.dateField}
      defaultValue={props.start}
      onChange={e => props.updateCohortNewDialogStart(e.target.value)}
      error={hasOwnProperty(props.errors, 'start')}
      margin="dense"
      label="Fecha de inicio"
      type="date"
      InputLabelProps={{ shrink: true }}
    />
    <TextField
      id="end"
      className={classes.dateField}
      defaultValue={props.end}
      onChange={e => props.updateCohortNewDialogEnd(e.target.value)}
      error={hasOwnProperty(props.errors, 'end')}
      margin="dense"
      label="Fecha de cierre"
      type="date"
      InputLabelProps={{ shrink: true }}
    />
  </DialogContent>
);


CohortNewDialogForm.propTypes = {
  campus: PropTypes.string.isRequired,
  program: PropTypes.string.isRequired,
  track: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  errors: PropTypes.shape({}).isRequired,
  updateCohortNewDialogCampus: PropTypes.func.isRequired,
  updateCohortNewDialogProgram: PropTypes.func.isRequired,
  updateCohortNewDialogTrack: PropTypes.func.isRequired,
  updateCohortNewDialogName: PropTypes.func.isRequired,
  updateCohortNewDialogStart: PropTypes.func.isRequired,
  updateCohortNewDialogEnd: PropTypes.func.isRequired,
  campuses: PropTypes.shape({}).isRequired,
  classes: PropTypes.shape({}).isRequired,
};


const CohortNewDialogConfirm = props => (
  <DialogContent>
    {Object.keys(props.cohorts).indexOf(props.cohortKey) === -1 ?
      <DialogContentText>
        Estás a punto de crear un nuevo cohort con el id <code>{props.cohortKey}</code>.
        Estás segura de que quieres hacer esto?
      </DialogContentText> :
      <DialogContentText>
        Este cohort con el id <code>{props.cohortKey}</code> ya EXISTE, solo se
        actualizarán las fechas de inicio y fin. Estás segura de que quieres
        hacer esto?
      </DialogContentText>
    }
  </DialogContent>
);


CohortNewDialogConfirm.propTypes = {
  cohorts: PropTypes.shape({}).isRequired,
  cohortKey: PropTypes.string.isRequired,
};


const parseDateString = str => new Date(
  parseInt(str.slice(0, 4), 10),
  parseInt(str.slice(5, 7), 10) - 1,
  parseInt(str.slice(8, 10), 10),
);


const validate = (props) => {
  const {
    campus, program, track, name, start, end,
  } = props;
  const errors = [];
  const campuses = Object.keys(props.campuses);

  if (campuses.indexOf(campus) === -1) {
    errors.push({
      field: 'campus',
      message: `Campus should be one of ${campuses}`,
    });
  }
  if (['bc', 'ec'].indexOf(program) === -1) {
    errors.push({
      field: 'program',
      message: `Program should be one of ${['bc', 'ec']}`,
    });
  }
  if (['core', 'js', 'ux', 'mobile'].indexOf(track) === -1) {
    errors.push({
      field: 'track',
      message: `Track should be one of ${['core', 'js', 'ux', 'mobile']}`,
    });
  }
  if (!name) {
    errors.push({
      field: 'name',
      message: 'Name is required',
    });
  }

  const startDate = parseDateString(start);
  const endDate = parseDateString(end);

  if (startDate >= endDate) {
    errors.push({
      field: 'end',
      message: 'End date can not be earlier then start date',
    });
  }

  if (errors.length) {
    return { errors };
  }

  return {
    cohort: {
      key: `${campus}-${start.slice(0, 7)}-${program}-${track}-${name}`,
      value: { start, end },
    },
  };
};


const CohortNewDialog = ({ classes, ...props }) => (
  <div className={classes.container}>
    <Dialog open={props.open} onClose={props.toggleCohortNewDialog}>
      <DialogTitle>Nuevo cohort</DialogTitle>
      {props.cohortKey ?
        <CohortNewDialogConfirm classes={classes} {...props} /> :
        <CohortNewDialogForm classes={classes} {...props} />
      }
      <DialogActions>
        <Button onClick={props.toggleCohortNewDialog} color="default">
          Cancelar
        </Button>
        <Button
          raised
          color="primary"
          onClick={() => {
            const { cohort, errors } = validate(props);

            if (errors && errors.length) {
              return props.updateCohortNewDialogErrors(errors);
            }

            props.updateCohortNewDialogErrors([]);

            if (!props.cohortKey) {
              return props.updateCohortNewDialogKey(cohort.key);
            }

            return props.firebase.database()
              .ref(`cohorts/${props.cohortKey}`)
              .set(cohort.value)
              .then(props.resetCohortNewDialog, console.error);
          }}
        >
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);


CohortNewDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  cohortKey: PropTypes.string.isRequired,
  errors: PropTypes.shape({}).isRequired,
  toggleCohortNewDialog: PropTypes.func.isRequired,
  updateCohortNewDialogErrors: PropTypes.func.isRequired,
  updateCohortNewDialogKey: PropTypes.func.isRequired,
  resetCohortNewDialog: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  firebase: PropTypes.shape({
    database: PropTypes.func.isRequired,
  }).isRequired,
};


const mapStateToProps = ({ firebase, cohortNewDialog }) => ({
  cohorts: getVal(firebase, 'data/cohorts'),
  open: cohortNewDialog.open,
  campus: cohortNewDialog.campus,
  program: cohortNewDialog.program,
  track: cohortNewDialog.track,
  name: cohortNewDialog.name,
  start: cohortNewDialog.start,
  end: cohortNewDialog.end,
  errors: cohortNewDialog.errors,
  cohortKey: cohortNewDialog.key,
});


const mapDispatchToProps = {
  toggleCohortNewDialog,
  updateCohortNewDialogCampus,
  updateCohortNewDialogProgram,
  updateCohortNewDialogTrack,
  updateCohortNewDialogName,
  updateCohortNewDialogStart,
  updateCohortNewDialogEnd,
  updateCohortNewDialogErrors,
  updateCohortNewDialogKey,
  resetCohortNewDialog,
};


export default compose(
  firebaseConnect(() => ['cohorts']),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(CohortNewDialog);
