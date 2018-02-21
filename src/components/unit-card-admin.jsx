import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirestore } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui-icons/Settings';
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
} from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import Typography from 'material-ui/Typography';
import Dialog, {
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';
import { toggleUnitCardAdminActions } from '../reducers/unit-card-admin';


const styles = theme => ({
  root: {
    position: 'absolute',
    top: 8,
    right: 4,
  },
  headingButton: {
    top: theme.spacing.unit * -1,
  },
});


const UnitCardAdmin = (props) => {
  const toggle = () =>
    props.toggleAdminActions(`${props.cohort}/${props.course}/${props.unit.id}`);

  return (
    <div className={props.classes.root}>
      <IconButton
        className={props.classes.headingButton}
        aria-label="Manage"
        onClick={toggle}
      >
        <SettingsIcon />
      </IconButton>
      <Dialog
        fullScreen={false}
        open={!!props.openUnits[`${props.cohort}/${props.course}/${props.unit.id}`]}
        onClose={toggle}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Unit options</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <FormLabel component="legend">Self assessment</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={!!((((props.courseSettings || {}).units || {})[props.unit.id] || {}).selfAssessment || {}).enabled}
                    onChange={() => {
                      const db = props.firestore.firestore();
                      const courseSettingsDocPath = `cohorts/${props.cohort}/coursesSettings/${props.course}`;
                      const courseSettingsDocRef = db.doc(courseSettingsDocPath);

                      db.runTransaction((t) => {
                        return t.get(courseSettingsDocRef).then((docSnap) => {
                          const data = docSnap.data() || {};
                          t[docSnap.exists ? 'update' : 'set'](courseSettingsDocRef, {
                            ...data,
                            units: {
                              ...(data.units || {}),
                              [props.unit.id]: {
                                ...(data.units || {})[props.unit.id] || {},
                                selfAssessment: {
                                  enabled: !(((data.units || {})[props.unit.id] || {}).selfAssessment || {}).enabled,
                                },
                              },
                            }
                          });
                        });
                      });
                    }}
                    value="enable"
                  />
                }
                label="Enable"
              />
            </FormGroup>
            <FormHelperText>Be careful</FormHelperText>
          </FormControl>
        </DialogContent>
      </Dialog>
    </div>
  );
};


UnitCardAdmin.propTypes = {
  unit: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  cohort: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
  openUnits: PropTypes.shape({}).isRequired,
  toggleAdminActions: PropTypes.func.isRequired,
};


export default compose(
  connect(({ unitCardAdmin }) => ({
    openUnits: unitCardAdmin.openUnits,
  }), {
    toggleAdminActions: toggleUnitCardAdminActions,
  }),
  withFirestore,
  withStyles(styles),
)(UnitCardAdmin);
