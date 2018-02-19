import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import moment from 'moment';
import { withStyles } from 'material-ui/styles';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormControlLabel, FormGroup } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Switch from 'material-ui/Switch';
import Checkbox from 'material-ui/Checkbox';
import { ListItemText } from 'material-ui/List';
import {
  updateCohortCalendarAddDialogField,
  validateAndSubmitCohortCalendarAddDialogForm,
  resetCohortCalendarAddDialog,
} from '../reducers/cohort-calendar-add-dialog';
import hasOwnProperty from '../util/hasOwnProperty';


const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    width: '100%',
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


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: (ITEM_HEIGHT * 4.5) + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const CohortCalendarAddDialog = ({
  data,
  errors,
  isValid,
  updateField,
  validateAndSubmitForm,
  reset,
  cohortid,
  profiles,
  toggleCalendarAddDialog,
  classes,
  firebase,
}) => {
  if (isValid) {
    firebase.firestore().collection('calendar')
      .add({ ...data, cohortid })
      .then(() => reset())
      .catch(console.error);
    return null;
  }

  return (
    <div>
      <Dialog open onClose={toggleCalendarAddDialog}>
        <DialogTitle>{data.id ? 'Edit event' : 'New event'}</DialogTitle>
        <DialogContent>
          <FormControl
            error={hasOwnProperty(errors, 'type')}
            className={classes.formControl}
          >
            <InputLabel htmlFor="type">Type</InputLabel>
            <Select
              value={data.type}
              onChange={e => updateField('type', e.target.value)}
              input={<Input id="type" />}
            >
              <MenuItem value="classroom">Classroom</MenuItem>
              <MenuItem value="webinar">Webinar</MenuItem>
              <MenuItem value="interview">Interview</MenuItem>
              <MenuItem value="milestone">Milestone</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="title"
            className={classes.textField}
            value={data.title}
            onChange={e => updateField('title', e.target.value)}
            error={hasOwnProperty(errors, 'title')}
            helperText="..."
            margin="dense"
            label="Title"
            type="text"
            fullWidth
          />
          <TextField
            id="description"
            className={classes.textField}
            value={data.description}
            onChange={e => updateField('description', e.target.value)}
            error={hasOwnProperty(errors, 'description')}
            helperText="..."
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
          />
          <FormGroup className={classes.formControl}>
            <FormControlLabel
              control={
                <Switch
                  checked={data.allDay}
                  onChange={(e, checked) => updateField('allDay', checked)}
                />
              }
              label="All day event"
            />
          </FormGroup>
          <TextField
            id="start"
            className={classes.dateField}
            value={data.start ? moment(data.start).format('YYYY-MM-DDTHH:mm') : ''}
            onChange={e => updateField('start', moment(e.target.value).toDate())}
            error={hasOwnProperty(errors, 'start')}
            margin="dense"
            label="Start date"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
          />
          {!data.allDay && (
            <TextField
              id="end"
              className={classes.dateField}
              value={data.end ? moment(data.end).format('YYYY-MM-DDTHH:mm') : ''}
              onChange={e => updateField('end', moment(e.target.value).toDate())}
              error={hasOwnProperty(errors, 'end')}
              margin="dense"
              label="End date"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
            />
          )}
          <FormGroup className={classes.formControl}>
            <FormControlLabel
              control={
                <Switch
                  checked={data.allCohort}
                  onChange={(e, checked) => updateField('allCohort', checked)}
                />
              }
              label="Invite all cohort users (students, instructors and admins)"
            />
          </FormGroup>
          {!data.allCohort && (
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="invitees">Invitees</InputLabel>
              <Select
                multiple
                value={data.invitees}
                onChange={e => updateField('invitees', e.target.value)}
                input={<Input id="invitees" />}
                renderValue={selected =>
                  selected
                    .map(key => profiles.filter(p => p.uid === key)[0].name)
                    .join(', ')
                }
                MenuProps={MenuProps}
              >
                {profiles && profiles.length && profiles.map(profile => (
                  <MenuItem key={profile.uid} value={profile.uid}>
                    <Checkbox checked={data.invitees.indexOf(profile.uid) > -1} />
                    <ListItemText primary={`${profile.name} <${profile.email}>`} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleCalendarAddDialog} color="default">
            Cancel
          </Button>
          <Button
            variant="raised"
            color="primary"
            onClick={validateAndSubmitForm}
          >
            {data.id ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


CohortCalendarAddDialog.propTypes = {
  cohortid: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  isValid: PropTypes.bool,
  profiles: PropTypes.arrayOf(PropTypes.shape({})),
  updateField: PropTypes.func.isRequired,
  validateAndSubmitForm: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  toggleCalendarAddDialog: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  firebase: PropTypes.shape({
    firestore: PropTypes.func.isRequired,
  }).isRequired,
};


CohortCalendarAddDialog.defaultProps = {
  isValid: undefined,
  profiles: undefined,
};

const sortProfiles = (() => {
  let cachedProfiles = [];
  return (firestore, ownProps) => {
    if (!ownProps.users) {
      return undefined;
    }
    const keys = Object.keys(ownProps.users);
    if (!keys.length) {
      return undefined;
    }

    const nextProfiles = keys.reduce((memo, key) => {
      const val = (firestore.data.users || {})[key];
      if (!val) {
        return memo;
      }
      const found = memo.filter(p => p.uid === key)[0];
      if (found && found.email === val.email && found.name === val.name) {
        return memo;
      }
      return [...memo, { uid: key, ...val }];
    }, cachedProfiles);

    if (cachedProfiles !== nextProfiles) {
      cachedProfiles = nextProfiles;
    }

    return cachedProfiles;
  };
})();


const mapStateToProps = ({ cohortCalendarAddDialog, firestore }, ownProps) => ({
  data: cohortCalendarAddDialog.data,
  errors: cohortCalendarAddDialog.errors,
  isValid: cohortCalendarAddDialog.isValid,
  profiles: sortProfiles(firestore, ownProps),
});


const mapDispatchToProps = {
  updateField: updateCohortCalendarAddDialogField,
  validateAndSubmitForm: validateAndSubmitCohortCalendarAddDialogForm,
  reset: resetCohortCalendarAddDialog,
};


export default compose(
  firestoreConnect(props =>
    Object.keys(props.users || []).map(key => `users/${key}`)),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(CohortCalendarAddDialog);
