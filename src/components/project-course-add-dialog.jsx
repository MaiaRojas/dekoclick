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
  toggleProjectCourseAddDialog,
  updateProjectCourseAddDialogCourse,
  resetProjectCourseAddDialog,
} from '../reducers/project-course-add-dialog';
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


const ProjectCourseAddDialogSelect = props => (
  <FormControl className={props.classes.formControl}>
    <InputLabel htmlFor="course">Curso</InputLabel>
    <Select
      value={props.course}
      onChange={e => props.updateProjectCourseAddDialogCourse(e.target.value)}
      input={<Input id="course" />}
    >
      {props.courses.map(course => (
        <MenuItem key={course.id} value={course.id}>
          {course.title} ({course.id})
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);


ProjectCourseAddDialogSelect.propTypes = {
  course: PropTypes.string.isRequired,
  courses: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  updateCohortCourseAddDialogCourse: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    formControl: PropTypes.string.isRequired,
  }).isRequired,
};


const ProjectCourseAddDialog = ({ classes, ...props }) => {
  let content = null;

  if (!props.courses) {
    content = (<CircularProgress />);
  } else if (!props.courses.length) {
    content = (<DialogContentText>No hay más cursos disponibles</DialogContentText>);
  } else {
    content = (<ProjectCourseAddDialogSelect classes={classes} {...props} />);
  }

  return (
    <div className={classes.container}>
      <Dialog open={props.open} onClose={props.toggleCohortCourseAddDialog}>
        <DialogTitle>Añade curso al cohort</DialogTitle>
        <DialogContent>
          {content}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.resetProjectCourseAddDialog} color="default">
            Cancelar
          </Button>
          <Button
            variant="raised"
            color="primary"
            disabled={!props.courses || !props.courses.length}
            onClick={() => {
              const { cohortid, course } = props;
              const db = props.firebase.firestore();
              const courseRef = db.collection('courses').doc(course);
              const syllabusRef = courseRef.collection('syllabus');
              const cohortCourseRef = db.collection(`projects/${cohortid}/courses`).doc(course);
              const cohortCourseSyllabusRef = cohortCourseRef.collection('syllabus');
              const batch = db.batch();

              courseRef.get()
                .then(courseSnap => (
                  (!courseSnap.exists)
                    ? new Error('Not found')
                    : batch.set(cohortCourseRef, courseSnap.data())
                ))
                .then(() =>
                  syllabusRef.get().then((syllabusSnap) => {
                    const partsPromises = [];
                    syllabusSnap.forEach((docSnap) => {
                      const cohortCourseUnitRef = cohortCourseSyllabusRef.doc(docSnap.id);
                      batch.set(cohortCourseUnitRef, docSnap.data());
                      const partsRef = syllabusRef.doc(docSnap.id).collection('parts');
                      partsPromises.push(partsRef.get().then((partsSnap) => {
                        partsSnap.forEach((partSnap) => {
                          batch.set(cohortCourseUnitRef.collection('parts').doc(partSnap.id), partSnap.data());
                        });
                      }));
                    });
                    return Promise.all(partsPromises);
                  }))
                .then(() => batch.commit())
                .then(props.resetCohortCourseAddDialog)
                .catch(console.error);
            }}
          >
            Añadir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


ProjectCourseAddDialog.propTypes = {
  projectid: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  course: PropTypes.string,
  courses: PropTypes.arrayOf(PropTypes.shape({})),
  toggleProjectCourseAddDialog: PropTypes.func.isRequired,
  resetProjectCourseAddDialog: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  firebase: PropTypes.shape({
    firestore: PropTypes.func.isRequired,
  }).isRequired,
};


ProjectCourseAddDialog.defaultProps = {
  course: '',
  courses: undefined,
};


const selectCourses = (projectCourses, courses) => (
  (!courses || !courses.length)
    ? courses
    : courses.filter(item => !hasOwnProperty(projectCourses || {}, item.id))
);


const mapStateToProps = ({ firestore, projectCourseAddDialog }, { courses }) => ({
  courses: selectCourses(courses, firestore.ordered.courses),
  open: projectCourseAddDialog.open,
  course: projectCourseAddDialog.course,
});


const mapDispatchToProps = {
  toggleProjectCourseAddDialog,
  updateProjectCourseAddDialogCourse,
  resetProjectCourseAddDialog,
};


export default compose(
  firestoreConnect(() => [{
    collection: 'courses',
    orderBy: ['order'],
  }]),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(ProjectCourseAddDialog);
