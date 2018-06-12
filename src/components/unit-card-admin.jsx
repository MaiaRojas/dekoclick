import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui-icons/Settings';
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
} from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import Dialog, { DialogContent, DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import { toggleUnitCardAdminActions } from '../reducers/unit-card-admin';


const styles = theme => ({
  root: {
    position: 'absolute',
    top: 8,
    right: 4,
    zIndex: 1205,
  },
  headingButton: {
    top: theme.spacing.unit * -1,
  },
  formControl: {
    display: 'block',
  },
});


const buildDepPath = ({ unitid, partid, formid }) =>
  `${unitid}${partid ? `/${partid}` : ''}${formid ? `/forms/${formid}` : ''}`;


const CompletedInput = (props) => {
  const key = !props.partid ? 'percent' : 'completed';
  const value = ((((props.unitSettings || {}).dependencies || {})[
    buildDepPath(props)
  ] || {})[key] || {}).value || 0;

  if (props.part && props.part.exercises) {
    return (
      <TextField
        style={{ marginLeft: 8 }}
        id="number"
        label="Compl."
        value={value}
        onChange={() => props.updateDependencies(key, props)}
        type="number"
        className=""
        inputProps={{ max: 100, min: 0, size: 3 }}
        InputLabelProps={{ shrink: true }}
      />
    );
  }

  return (
    <FormControlLabel
      style={{ marginLeft: 8 }}
      control={
        <Switch
          checked={!!value}
          onChange={() => props.updateDependencies(
            key,
            props,
            {
              value: (!value && !props.partid)
                ? 100
                : (!value)
                  ? 1
                  : 0,
            },
          )}
          value="completed"
        />
      }
      label="Completed"
    />
  );
};


CompletedInput.propTypes = {
  partid: PropTypes.string,
  unitSettings: PropTypes.shape({}).isRequired,
  part: PropTypes.shape({
    exercises: PropTypes.shape({}),
  }),
  updateDependencies: PropTypes.func.isRequired,
};

CompletedInput.defaultProps = {
  partid: undefined,
  part: undefined,
};


const ScoreInput = (props) => {
  const { value, operator } = ((((props.unitSettings || {}).dependencies || {})[
    buildDepPath(props)
  ] || {}).score || {});
  return (
    <div style={{ marginLeft: 8 }}>
      <TextField
        id="select-operator"
        select
        className=""
        value={operator || '>'}
        onChange={e =>
          props.updateDependencies('score', props, { operator: e.target.value })
        }
        InputLabelProps={{ shrink: true }}
      >
        <MenuItem value=">">&gt;</MenuItem>
        <MenuItem value="<">&lt;</MenuItem>
      </TextField>

      <TextField
        id="number"
        label="Score"
        value={value || 0}
        onChange={e =>
          props.updateDependencies('score', props, {
            value: parseInt(e.target.value, 10) || 0,
          })
        }
        type="number"
        className=""
        inputProps={{ max: 100, min: 0, size: 3 }}
        InputLabelProps={{ shrink: true }}
      />
    </div>
  );
};


ScoreInput.propTypes = {
  unitSettings: PropTypes.shape({}).isRequired,
  updateDependencies: PropTypes.func.isRequired,
};


const hasScore = (props) => {
  if (props.formid) {
    return true;
  }
  if (props.part && props.part.type === 'quiz') {
    return true;
  }
  if (props.part && props.part.type === 'practice' && props.part.exercises) {
    return true;
  }
  return false;
};


const Dependency = props => (
  <div style={{ marginLeft: 8 }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    }}
    >
      <div>
        {props.formid
          ? `Typeform: ${props.formid}`
          : props.partid
            ? `Part: ${props.partid}`
            : `Unit: ${props.unitid}`
        }
      </div>
      <div style={{ display: 'flex' }}>
        <CompletedInput {...props} />
        {hasScore(props) && <ScoreInput {...props} />}
      </div>
    </div>
    <div>
      {props.children}
    </div>
  </div>
);


Dependency.propTypes = {
  formid: PropTypes.string,
  partid: PropTypes.string,
  unitid: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};

Dependency.defaultProps = {
  formid: undefined,
  partid: undefined,
};


const selfAssessmentIsEnabled = (courseSettings, unitid) =>
  (!(courseSettings
  && courseSettings.units
  && courseSettings.units[unitid]
  && courseSettings.units[unitid].selfAssessment
  && courseSettings.units[unitid].selfAssessment.enabled === false));


const UnitCardAdmin = (props) => {
  const db = props.firebase.firestore();
  const courseSettingsDocPath = `cohorts/${props.cohort}/coursesSettings/${props.course}`;
  const courseSettingsDocRef = db.doc(courseSettingsDocPath);
  const courseSettings = props.courseSettings || { units: {} };
  const courseProgressStats = props.courseProgressStats || { units: {} };

  const toggleDialog = () =>
    props.toggleAdminActions(`${props.cohort}/${props.course}/${props.unit.id}`);

  const toggleSelfAssessmentEnable = () =>
    db.runTransaction(t =>
      t.get(courseSettingsDocRef).then((docSnap) => {
        const data = docSnap.data() || {};
        t[docSnap.exists ? 'update' : 'set'](courseSettingsDocRef, {
          ...data,
          units: {
            ...(data.units || {}),
            [props.unit.id]: {
              ...(data.units || {})[props.unit.id] || {},
              selfAssessment: {
                enabled: !selfAssessmentIsEnabled(data, props.unit.id),
              },
            },
          },
        });
      }));

  const updateDependencies = (key, params, value) => {
    const depPath = buildDepPath(params);
    db.runTransaction(t =>
      t.get(courseSettingsDocRef).then((docSnap) => {
        const data = docSnap.data() || {};
        const units = data.units || {};
        const unit = units[props.unit.id] || {};
        const deps = unit.dependencies || {};
        const prevDep = deps[depPath] || {};
        const otherDeps = Object.keys(deps || {})
          .reduce((memo, k) => (k !== depPath ? { ...memo, [k]: deps[k] } : memo), {});
        const prevDepOtherProps = Object.keys(prevDep || {})
          .reduce((memo, k) => (k !== key ? { ...memo, [k]: prevDep[k] } : memo), {});
        t[docSnap.exists ? 'update' : 'set'](courseSettingsDocRef, {
          ...data,
          units: {
            ...units,
            [props.unit.id]: {
              ...unit,
              dependencies: (['percent', 'completed', 'score'].includes(key) && !value.value && !Object.keys(prevDepOtherProps).filter(k => k !== 'operator').length)
                ? otherDeps
                : {
                  ...otherDeps,
                  [depPath]: { ...prevDep, [key]: { ...prevDep[key], ...value } },
                },
            },
          },
        });
      }));
  };

  const unitIdx = props.syllabus.reduce(
    (memo, unit, idx) => ((unit.id === props.unit.id) ? idx : memo),
    null,
  );
  const prevUnits = props.syllabus.slice(0, unitIdx);

  return (
    <div className={props.classes.root}>
      <IconButton
        className={props.classes.headingButton}
        aria-label="Manage"
        onClick={toggleDialog}
      >
        <SettingsIcon />
      </IconButton>
      <Dialog
        fullScreen={false}
        open={!!props.openUnits[`${props.cohort}/${props.course}/${props.unit.id}`]}
        onClose={toggleDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Unit options</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" className={props.classes.formControl}>
            <FormLabel component="legend">Self assessment</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={selfAssessmentIsEnabled(courseSettings, props.unit.id)}
                    onChange={toggleSelfAssessmentEnable}
                    value="enable"
                  />
                }
                label="Enable"
              />
            </FormGroup>
          </FormControl>
          {prevUnits.length > 0 && (
            <FormControl component="fieldset" className={props.classes.formControl}>
              <FormLabel component="legend">Dependencies</FormLabel>
              <FormGroup>
                {prevUnits.map(unit => (
                  <Dependency
                    key={unit.id}
                    unitid={unit.id}
                    updateDependencies={updateDependencies}
                    unitSettings={courseSettings.units[props.unit.id]}
                  >
                    {Object.keys((courseProgressStats.units[unit.id] || {}).parts || {})
                      .map(partid => (
                        <Dependency
                          key={partid}
                          unitid={unit.id}
                          partid={partid}
                          part={courseProgressStats.units[unit.id].parts[partid]}
                          updateDependencies={updateDependencies}
                          unitSettings={courseSettings.units[props.unit.id]}
                        >
                          {Object.keys(courseProgressStats.units[unit.id].parts[partid].forms || {})
                            .map(formid => (
                              <Dependency
                                key={formid}
                                unitid={unit.id}
                                partid={partid}
                                formid={formid}
                                updateDependencies={updateDependencies}
                                unitSettings={courseSettings.units[props.unit.id]}
                              />
                          ))}
                        </Dependency>
                    ))}
                  </Dependency>
                ))}
              </FormGroup>
            </FormControl>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};


UnitCardAdmin.propTypes = {
  unit: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    headingButton: PropTypes.string.isRequired,
    formControl: PropTypes.string.isRequired,
  }).isRequired,
  cohort: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
  courseSettings: PropTypes.shape({}),
  courseProgressStats: PropTypes.shape({}),
  syllabus: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  openUnits: PropTypes.shape({}).isRequired,
  toggleAdminActions: PropTypes.func.isRequired,
  firebase: PropTypes.shape({
    firestore: PropTypes.func.isRequired,
  }).isRequired,

};


UnitCardAdmin.defaultProps = {
  courseSettings: undefined,
  courseProgressStats: undefined,
};


export default compose(
  firestoreConnect(() => []),
  connect(({ unitCardAdmin }) => ({
    openUnits: unitCardAdmin.openUnits,
  }), {
    toggleAdminActions: toggleUnitCardAdminActions,
  }),
  withStyles(styles),
)(UnitCardAdmin);
