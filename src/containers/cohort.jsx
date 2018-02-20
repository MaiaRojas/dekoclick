import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import List from 'material-ui/List';
import TopBar from '../components/top-bar';
import Alert from '../components/alert';
import CohortSection from '../components/cohort-section';
import CohortCalendar from '../components/cohort-calendar';
import CohortCourse from '../components/cohort-course';
import CohortUsers from '../components/cohort-users';
import CohortCalendarAddDialog from '../components/cohort-calendar-add-dialog';
import CohortUserAddDialog from '../components/cohort-user-add-dialog';
import CohortUserMoveDialog from '../components/cohort-user-move-dialog';
import CohortCourseAddDialog from '../components/cohort-course-add-dialog';
import { selectCohortUsersTab } from '../reducers/cohort';
import { toggleCohortCalendarAddDialog } from '../reducers/cohort-calendar-add-dialog';
import { toggleCohortCourseAddDialog } from '../reducers/cohort-course-add-dialog';
import { toggleCohortUserAddDialog } from '../reducers/cohort-user-add-dialog';
import { parse as parseCohortid } from '../util/cohort';
import programs from '../util/programs';


const styles = theme => ({
  root: {
    width: '100%',
  },
  courseListWrapper: {
    background: theme.palette.background.paper,
  },
});


const usersByRole = users =>
  users.reduce(
    (memo, user) => ({
      ...memo,
      [`${user.role}s`]: [
        ...memo[`${user.role}s`],
        user,
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
  courses,
  users,
  currentTab,
  calendarAddDialogOpen,
  courseAddDialogOpen,
  userAddDialogOpen,
  selectTab,
  toggleCalendarAddDialog,
  toggleUserAddDialog,
  toggleCourseAddDialog,
  match,
  classes,
  history,
  auth,
}) => {
  if (!cohort || typeof courses === 'undefined' || typeof users === 'undefined') {
    return (<CircularProgress />);
  }

  const { cohortid } = match.params;

  const {
    students,
    instructors,
    admins,
  } = usersByRole(users);

  const parsedCohortId = parseCohortid(cohortid);
  const program = programs.getById(parsedCohortId.program);

  return (
    <div className={`cohort ${classes.root}`}>
      <TopBar title={`Cohort: ${cohortid}`} />

      <CohortSection title="Overview">
        <p>
          Campus: {parsedCohortId.campus.toUpperCase()}<br />
          Program: {program && program.name && program.name}<br />
          Track: {parsedCohortId.track}
        </p>
      </CohortSection>

      <CohortSection
        title="Agenda"
        onAdd={toggleCalendarAddDialog}
      >
        <CohortCalendar
          cohortid={cohortid}
          cohort={cohort}
          toggleCalendarAddDialog={toggleCalendarAddDialog}
        />
      </CohortSection>

      <CohortSection
        title="Cursos"
        onAdd={toggleCourseAddDialog}
      >
        {!courses.length ?
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
                {courses.map(course => (
                  <CohortCourse
                    key={course.id}
                    cohortid={cohortid}
                    courseid={course.id}
                    course={course}
                    history={history}
                  />
                ))}
              </List>
            </div>
          )
        }
      </CohortSection>

      <CohortSection
        title={`Usuarixs (${users.length})`}
        onAdd={toggleUserAddDialog}
      >
        {!users.length ?
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
                <CohortUsers cohortid={cohortid} users={students} auth={auth} />
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
      </CohortSection>

      {calendarAddDialogOpen && (
        <CohortCalendarAddDialog
          cohortid={cohortid}
          users={users}
          toggleCalendarAddDialog={toggleCalendarAddDialog}
        />
      )}

      {courseAddDialogOpen && (
        <CohortCourseAddDialog cohortid={cohortid} courses={courses} />
      )}

      {userAddDialogOpen && (
        <CohortUserAddDialog cohortid={cohortid} />
      )}

      <CohortUserMoveDialog cohortid={cohortid} />
    </div>
  );
};


Cohort.propTypes = {
  cohort: PropTypes.shape({}),
  users: PropTypes.arrayOf(PropTypes.shape({})),
  courses: PropTypes.arrayOf(PropTypes.shape({})),
  currentTab: PropTypes.number.isRequired,
  calendarAddDialogOpen: PropTypes.bool.isRequired,
  courseAddDialogOpen: PropTypes.bool.isRequired,
  userAddDialogOpen: PropTypes.bool.isRequired,
  selectTab: PropTypes.func.isRequired,
  toggleCalendarAddDialog: PropTypes.func.isRequired,
  toggleUserAddDialog: PropTypes.func.isRequired,
  toggleCourseAddDialog: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      cohortid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({}).isRequired,
  auth: PropTypes.shape({}).isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
  }).isRequired,
};


Cohort.defaultProps = {
  cohort: undefined,
  users: undefined,
  courses: undefined,
};


const mapStateToProps = ({
  firestore,
  cohort,
  cohortCalendarAddDialog,
  cohortUserAddDialog,
  cohortCourseAddDialog,
}, { match }) => ({
  cohort: (firestore.data.cohorts || {})[match.params.cohortid],
  users: firestore.ordered[`cohorts/${match.params.cohortid}/users`],
  courses: firestore.ordered[`cohorts/${match.params.cohortid}/courses`],
  currentTab: cohort.currentTab,
  calendarAddDialogOpen: cohortCalendarAddDialog.open,
  courseAddDialogOpen: cohortCourseAddDialog.open,
  userAddDialogOpen: cohortUserAddDialog.open,
});


const mapDispatchToProps = {
  selectTab: selectCohortUsersTab,
  toggleUserAddDialog: toggleCohortUserAddDialog,
  toggleCourseAddDialog: toggleCohortCourseAddDialog,
  toggleCalendarAddDialog: toggleCohortCalendarAddDialog,
};


export default compose(
  firestoreConnect(({ match }) => ([
    {
      collection: 'cohorts',
      doc: match.params.cohortid,
    },
    {
      collection: `cohorts/${match.params.cohortid}/users`,
    },
    {
      collection: `cohorts/${match.params.cohortid}/courses`,
      orderBy: ['order'],
    },
  ])),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Cohort);
