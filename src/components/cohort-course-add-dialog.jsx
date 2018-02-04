import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { FormControl } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Input, { InputLabel } from 'material-ui/Input';
import Button from 'material-ui/Button';
import Select from 'material-ui/Select';
import {
  toggleCohortCourseAddDialog,
  updateCohortCourseAddDialogCourse,
  resetCohortCourseAddDialog,
} from '../reducers/cohort-course-add-dialog';
import hasOwnProperty from '../util/hasOwnProperty';


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
    marginBottom: theme.spacing.unit * 2,
  },
});


const CohortCourseAddDialogSelect = props => (
  <FormControl className={props.classes.formControl}>
    <InputLabel htmlFor="course">Curso</InputLabel>
    <Select
      value={props.course}
      onChange={e => props.updateCohortCourseAddDialogCourse(e.target.value)}
      input={<Input id="course" />}
    >
      {props.coursesIndex.map(course => (
        <MenuItem key={course.id} value={course.id}>
          {course.title} ({course.id})
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);


CohortCourseAddDialogSelect.propTypes = {
  course: PropTypes.string.isRequired,
  coursesIndex: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  updateCohortCourseAddDialogCourse: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    formControl: PropTypes.string.isRequired,
  }).isRequired,
};


const CohortCourseAddDialog = ({ classes, ...props }) => {
  let content = null;

  if (!props.coursesIndex) {
    content = (<CircularProgress />);
  } else if (!props.coursesIndex.length) {
    content = (<DialogContentText>No hay más cursos disponibles</DialogContentText>);
  } else {
    content = (<CohortCourseAddDialogSelect classes={classes} {...props} />);
  }

  return (
    <div className={classes.container}>
      <Dialog open={props.open} onClose={props.toggleCohortCourseAddDialog}>
        <DialogTitle>Añade curso al cohort</DialogTitle>
        <DialogContent>
          {content}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.resetCohortCourseAddDialog} color="default">
            Cancelar
          </Button>
          <Button
            raised
            color="primary"
            disabled={!props.coursesIndex.length}
            onClick={() => {
              const courseSummary = props.coursesIndex.find(obj => obj.id === props.course);
              const db = props.firebase.database();
              const courseRef = db.ref(`courses/${courseSummary.track}/${props.course}`);
              courseRef.once('value', (snap) => {
                db.ref(`cohortCourses/${props.cohortid}/${props.course}`)
                  .set(snap.val())
                  .then(props.resetCohortCourseAddDialog)
                  .catch(console.error);
              });
            }}
          >
            Añadir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


CohortCourseAddDialog.propTypes = {
  cohortid: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  course: PropTypes.string,
  coursesIndex: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  toggleCohortCourseAddDialog: PropTypes.func.isRequired,
  resetCohortCourseAddDialog: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  firebase: PropTypes.shape({
    database: PropTypes.func.isRequired,
  }).isRequired,
};


CohortCourseAddDialog.defaultProps = {
  course: '',
};


const flattenCourses = (cohortCourses, coursesIndex) =>
  Object.keys(coursesIndex || {})
    .reduce(
      (results, track) => results.concat(Object.keys(coursesIndex[track])
        .reduce(
          (nestedResult, id) =>
            nestedResult.concat({ ...coursesIndex[track][id], id, track }),
          [],
        )),
      [],
    )
    .filter(item => !hasOwnProperty(cohortCourses || {}, item.id))
    .sort((a, b) => {
      if (a.order > b.order) {
        return 1;
      }
      if (a.order < b.order) {
        return -1;
      }
      return 0;
    });


const mapStateToProps = ({ firestore, cohortCourseAddDialog }, { cohortCourses }) => ({
  coursesIndex: flattenCourses(cohortCourses, firestore.data.coursesIndex),
  open: cohortCourseAddDialog.open,
  course: cohortCourseAddDialog.course,
});


const mapDispatchToProps = {
  toggleCohortCourseAddDialog,
  updateCohortCourseAddDialogCourse,
  resetCohortCourseAddDialog,
};


export default compose(
  firestoreConnect(() => ['coursesIndex']),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(CohortCourseAddDialog);
