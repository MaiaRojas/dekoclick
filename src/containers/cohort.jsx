import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import List from 'material-ui/List';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import TopBar from '../components/top-bar';
import Alert from '../components/alert';
import CohortCourse from '../components/cohort-course';
import CohortUsers from '../components/cohort-users';
import CohortUserAddDialog from '../components/cohort-user-add-dialog';
import CohortUserMoveDialog from '../components/cohort-user-move-dialog';
import CohortCourseAddDialog from '../components/cohort-course-add-dialog';
import { selectCohortUsersTab } from '../reducers/cohort';
import { toggleCohortUserAddDialog } from '../reducers/cohort-user-add-dialog';
import { toggleCohortCourseAddDialog } from '../reducers/cohort-course-add-dialog';


const styles = theme => ({
  root: {
    width: '100%',
  },
  grid: {
    marginBottom: 20,
  },
  heading: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headingButton: {
    top: -16,
    width: 48,
    height: 48,
  },
  title: {
    margin: `0 0 ${theme.spacing.unit * 2}px`,
  },
  courseListWrapper: {
    background: theme.palette.background.paper,
  },
});


const usersByRole = users => Object.keys(users || {})
  .reduce(
    (memo, item) => ({
      ...memo,
      [`${users[item]}s`]: [
        ...memo[`${users[item]}s`],
        {
          key: item,
          value: users[item],
        },
      ],
    }),
    {
      students: [],
      instructors: [],
      admins: [],
    },
  );


const Cohort = ({
  cohort,
  campuses,
  courses,
  users,
  currentTab,
  userAddDialogOpen,
  courseAddDialogOpen,
  selectTab,
  toggleUserAddDialog,
  toggleCourseAddDialog,
  match,
  classes,
  history,
  firebase,
}) => {
  if (!isLoaded(cohort) || !isLoaded(campuses) || !isLoaded(courses) ||
    !isLoaded(users)) {
    return (<CircularProgress />);
  }

  if (isEmpty(cohort)) {
    return (<div>No cohort :-(</div>);
  }

  const { cohortid } = match.params;
  const courseKeys = Object.keys(courses || {}).sort((a, b) => {
    if (courses[a].order > courses[b].order) {
      return 1;
    }
    if (courses[a].order < courses[b].order) {
      return -1;
    }
    return 0;
  });

  const {
    students,
    instructors,
    admins,
  } = usersByRole(users);

  return (
    <div className={`cohort ${classes.root}`}>
      <TopBar title={`Cohort: ${cohortid}`} />
      <Grid item xs={12} md={12} className={classes.grid}>
        <div className={classes.heading}>
          <Typography type="headline" gutterBottom className={classes.title}>
            Cursos
          </Typography>
          <Button
            fab
            color="default"
            aria-label="add course"
            className={classes.headingButton}
            onClick={() => toggleCourseAddDialog()}
          >
            <AddIcon />
          </Button>
        </div>
        {!courseKeys.length ?
          (
            <Alert
              message="Todavía no se han añadido cursos a este cohort. Puedes
                añadir cursos usando el botón '+' a la derecha."
            />
          )
          :
          (
            <div className={classes.courseListWrapper}>
              <List dense={false}>
                {courseKeys.map(courseid => (
                  <CohortCourse
                    key={courseid}
                    cohortid={cohortid}
                    courseid={courseid}
                    course={courses[courseid]}
                    history={history}
                    firebase={firebase}
                  />
                ))}
              </List>
            </div>
          )
        }
      </Grid>

      <div className={classes.heading} style={{ marginTop: 40 }}>
        <Typography type="headline" gutterBottom className={classes.title}>
          Usuarixs ({Object.keys(users || {}).length})
        </Typography>
        <Button
          fab
          color="default"
          aria-label="add user"
          className={classes.headingButton}
          onClick={toggleUserAddDialog}
        >
          <AddIcon />
        </Button>
      </div>

      {!Object.keys(users || {}).length ?
        (
          <Alert
            message="Todavía no se han añadido usuarios a este curso. Para
            añadir alumnxs, instructorxs o admins usa el botón '+' a la
            derecha."
          />
        )
        :
        (
          <div>
            <AppBar position="static">
              <Tabs value={currentTab} onChange={(e, val) => selectTab(val)}>
                <Tab label={`Alumnxs (${students.length})`} />
                <Tab label={`Instructorxs (${instructors.length})`} />
                <Tab label={`Admins (${admins.length})`} />
              </Tabs>
            </AppBar>
            {currentTab === 0 && (
              <CohortUsers cohortid={cohortid} users={students} />
            )}
            {currentTab === 1 && (
              <CohortUsers cohortid={cohortid} users={instructors} />
            )}
            {currentTab === 2 && (
              <CohortUsers cohortid={cohortid} users={admins} />
            )}
          </div>
        )
      }

      {courseAddDialogOpen && (
        <CohortCourseAddDialog cohortid={cohortid} cohortCourses={courses} />
      )}

      {userAddDialogOpen && (
        <CohortUserAddDialog cohortid={cohortid} firebase={firebase} />
      )}

      <CohortUserMoveDialog cohortid={cohortid} />
    </div>
  );
};


Cohort.propTypes = {
  cohort: PropTypes.shape({}),
  campuses: PropTypes.shape({}),
  users: PropTypes.shape({}),
  courses: PropTypes.shape({}),
  currentTab: PropTypes.number.isRequired,
  userAddDialogOpen: PropTypes.bool.isRequired,
  courseAddDialogOpen: PropTypes.bool.isRequired,
  selectTab: PropTypes.func.isRequired,
  toggleUserAddDialog: PropTypes.func.isRequired,
  toggleCourseAddDialog: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      cohortid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({}).isRequired,
  firebase: PropTypes.shape({}).isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
  }).isRequired,
};


Cohort.defaultProps = {
  cohort: undefined,
  campuses: undefined,
  users: undefined,
  courses: undefined,
};


const mapStateToProps = ({
  firebase,
  cohort,
  cohortUserAddDialog,
  cohortCourseAddDialog,
}, { match }) => ({
  campuses: dataToJS(firebase, 'campuses'),
  cohort: dataToJS(firebase, `cohorts/${match.params.cohortid}`),
  users: dataToJS(firebase, `cohortUsers/${match.params.cohortid}`),
  courses: dataToJS(firebase, `cohortCourses/${match.params.cohortid}`),
  currentTab: cohort.currentTab,
  userAddDialogOpen: cohortUserAddDialog.open,
  courseAddDialogOpen: cohortCourseAddDialog.open,
});


const mapDispatchToProps = {
  selectTab: selectCohortUsersTab,
  toggleUserAddDialog: toggleCohortUserAddDialog,
  toggleCourseAddDialog: toggleCohortCourseAddDialog,
};


export default compose(
  firebaseConnect(({ match }) => ([
    'campuses',
    `cohorts/${match.params.cohortid}`,
    `cohortUsers/${match.params.cohortid}`,
    `cohortCourses/${match.params.cohortid}`,
  ])),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Cohort);
