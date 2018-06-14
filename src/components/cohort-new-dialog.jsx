import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormControlLabel, FormGroup } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Switch from 'material-ui/Switch';
import {
  setInProgressCohortNewDialog,
  toggleCohortNewDialog,
  updateCohortNewDialogCampus,
  updateCohortNewDialogProgram,
  updateCohortNewDialogTrack,
  updateCohortNewDialogName,
  updateCohortNewDialogPublicAdmission,
  updateCohortNewDialogStart,
  updateCohortNewDialogEnd,
  updateCohortNewDialogErrors,
  updateCohortNewDialogKey,
  resetCohortNewDialog,
} from '../reducers/cohort-new-dialog';
import hasOwnProperty from '../util/hasOwnProperty';
import programs from '../util/programs';


const styles = theme => ({
  root: {
    color: theme.palette.text.primary,
  },
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
        {props.campuses.map(campus =>
          <MenuItem key={campus.id} value={campus.id}>{campus.name}</MenuItem>)}
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
        {programs.sorted.map(program => (
          <MenuItem key={program.id} value={program.id}>{program.name}</MenuItem>
        ))}
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
        <MenuItem value="business">Business</MenuItem>
      </Select>
    </FormControl>
    <FormGroup className={classes.formControl}>
      <FormControlLabel
        control={
          <Switch
            checked={props.publicAdmission}
            onChange={(e, checked) => props.updateCohortNewDialogPublicAdmission(checked)}
          />
        }
        label="Public admission"
      />
    </FormGroup>
    <TextField
      id="name"
      className={classes.textField}
      value={props.name}
      onChange={e => props.updateCohortNewDialogName(e.target.value)}
      error={hasOwnProperty(props.errors, 'name')}
      helperText="Lower case, no spaces. For example: am/pm for bootcamp or react for ec"
      margin="dense"
      autoFocus
      label="Name"
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
      label="Start"
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
      label="End"
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
  publicAdmission: PropTypes.bool.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  errors: PropTypes.shape({}).isRequired,
  updateCohortNewDialogCampus: PropTypes.func.isRequired,
  updateCohortNewDialogProgram: PropTypes.func.isRequired,
  updateCohortNewDialogTrack: PropTypes.func.isRequired,
  updateCohortNewDialogName: PropTypes.func.isRequired,
  updateCohortNewDialogPublicAdmission: PropTypes.func.isRequired,
  updateCohortNewDialogStart: PropTypes.func.isRequired,
  updateCohortNewDialogEnd: PropTypes.func.isRequired,
  campuses: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  classes: PropTypes.shape({}).isRequired,
};


const isNewCohort = (cohorts, cohortKey) =>
  Object.keys(cohorts).indexOf(cohortKey) === -1;


const CohortNewDialogConfirm = props => (
  <DialogContent>
    {isNewCohort(props.cohorts, props.cohortKey) ?
      <DialogContentText className={props.classes.root}>
        Estás a punto de crear un nuevo cohort con el id <code>{props.cohortKey}</code>.
        Estás segura de que quieres hacer esto?
      </DialogContentText> :
      <DialogContentText className={props.classes.root}>
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
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
  }).isRequired,
};


const parseDateString = str => new Date(
  parseInt(str.slice(0, 4), 10),
  parseInt(str.slice(5, 7), 10) - 1,
  parseInt(str.slice(8, 10), 10),
);


const validate = (props) => {
  const {
    campus, program, track, name, start, end, publicAdmission,
  } = props;
  const errors = [];
  const campusesKeys = props.campuses.map(item => item.id);

  if (campusesKeys.indexOf(campus) === -1) {
    errors.push({
      field: 'campus',
      message: `Campus should be one of ${campusesKeys}`,
    });
  }
  if (programs.keys.indexOf(program) === -1) {
    errors.push({
      field: 'program',
      message: `Program should be one of ${programs.keys}`,
    });
  }
  if (['core', 'js', 'ux', 'mobile', 'business'].indexOf(track) === -1) {
    errors.push({
      field: 'track',
      message: `Track should be one of ${['core', 'js', 'ux', 'mobile', 'business']}`,
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
      value: { start, end, publicAdmission },
    },
  };
};


class CohortNewDialog extends React.Component {
  shouldComponentUpdate({ isInProgress, cohortKey }) {
    return !(isInProgress && cohortKey);
  }

  render() {
    const { classes, ...props } = this.props;
    return (
      <div className={classes.container}>
        <Dialog open={props.open} onClose={props.toggleCohortNewDialog}>
          <DialogTitle>
            {isNewCohort(props.cohorts, props.cohortKey) ? 'New cohort' : 'Update cohort'}
          </DialogTitle>
          {props.cohortKey ?
            <CohortNewDialogConfirm classes={classes} {...props} /> :
            <CohortNewDialogForm classes={classes} {...props} />
          }
          <DialogActions>
            <Button onClick={props.toggleCohortNewDialog} color="default">
              Cancel
            </Button>
            <Button
              variant="raised"
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

                props.setInProgressCohortNewDialog();

                return props.firebase.firestore()
                  .collection('cohorts')
                  .doc(props.cohortKey)
                  .set(cohort.value)
                  .then(props.resetCohortNewDialog, console.error);
              }}
            >
              {isNewCohort(props.cohorts, props.cohortKey) ? 'Create' : 'Update'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}


CohortNewDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  cohorts: PropTypes.shape({}).isRequired,
  cohortKey: PropTypes.string.isRequired,
  errors: PropTypes.shape({}).isRequired,
  toggleCohortNewDialog: PropTypes.func.isRequired,
  updateCohortNewDialogErrors: PropTypes.func.isRequired,
  updateCohortNewDialogKey: PropTypes.func.isRequired,
  resetCohortNewDialog: PropTypes.func.isRequired,
  isInProgress: PropTypes.bool.isRequired,
  classes: PropTypes.shape({}).isRequired,
  firebase: PropTypes.shape({
    firestore: PropTypes.func.isRequired,
  }).isRequired,
};


const mapStateToProps = ({ firestore, cohortNewDialog }) => ({
  cohorts: (firestore.data.cohorts === null) ? {} : firestore.data.cohorts,
  open: cohortNewDialog.open,
  campus: cohortNewDialog.campus,
  program: cohortNewDialog.program,
  track: cohortNewDialog.track,
  name: cohortNewDialog.name,
  publicAdmission: cohortNewDialog.publicAdmission,
  start: cohortNewDialog.start,
  end: cohortNewDialog.end,
  errors: cohortNewDialog.errors,
  cohortKey: cohortNewDialog.key,
  isInProgress: cohortNewDialog.isInProgress,
});


const mapDispatchToProps = {
  setInProgressCohortNewDialog,
  toggleCohortNewDialog,
  updateCohortNewDialogCampus,
  updateCohortNewDialogProgram,
  updateCohortNewDialogTrack,
  updateCohortNewDialogName,
  updateCohortNewDialogPublicAdmission,
  updateCohortNewDialogStart,
  updateCohortNewDialogEnd,
  updateCohortNewDialogErrors,
  updateCohortNewDialogKey,
  resetCohortNewDialog,
};


export default compose(
  firestoreConnect(() => ['cohorts']),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(CohortNewDialog);
