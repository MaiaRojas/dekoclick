import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import List from 'material-ui/List';
import TopBar from '../components/top-bar';
import Alert from '../components/alert';
import ProjectSection from '../components/project-section';
// import CohortCalendar from '../components/cohort-calendar';
import ProjectCourse from '../components/project-course';
import ProjectUsers from '../components/project-users';
// import ProjectCalendarAddDialog from '../components/project-calendar-add-dialog';
import ProjectUserAddDialog from '../components/project-user-add-dialog';
import ProjectUserMoveDialog from '../components/project-user-move-dialog';
import ProjectCourseAddDialog from '../components/project-course-add-dialog';
import { selectProjectUsersTab } from '../reducers/project';
// import { toggleProjectCalendarAddDialog } from '../reducers/project-calendar-add-dialog';
import { toggleProjectCourseAddDialog } from '../reducers/project-course-add-dialog';
import { toggleProjectUserAddDialog } from '../reducers/project-user-add-dialog';
import { parse as parseProjectid } from '../util/project';
import programs from '../util/programs';
import Loader from '../components/loader';

const drawerWidth = 320;
const styles = theme => ({
  root: {
    width: '100%',
  },
  courseListWrapper: {
    background: theme.palette.background.paper,
  },
  appBar: {
    width: '100%',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('md')]: {
      width: 'calc(100% - 73px)',
      marginLeft: '73px',
    },
  },
  appBarShift: {
    width: '100%',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
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


const Project = ({
  project,
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
  drawerOpen,
}) => {
  if (!project || typeof courses === 'undefined' || typeof users === 'undefined') {
    return (<Loader />);
  }

  const { cohortid } = match.params;
  const {
    students,
    instructors,
    admins,
  } = usersByRole(users);

  const parsedProjectId = parseProjectid(projectid);
  const program = programs.getById(parsedProjectId.program);

  return (
    <div className={`project ${classes.root}`}>
      <TopBar title={`Project : ${cohortid}`} />
      <div
        position="absolute"
        className={classNames(classes.appBar, drawerOpen && classes.appBarShift)}
      >
        <ProjectSection title="Overview">
          <p>
            Campus: {parsedProjectId.campus.toUpperCase()}<br />
            Program: {program && program.name && program.name}<br />
            Track: {parsedProjectId.track}
          </p>
        </ProjectSection>

        {/*
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
        */}

        <ProjectSection
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
                    <ProjectCourse
                      key={course.id}
                      projectid={projectid}
                      courseid={course.id}
                      course={course}
                      history={history}
                    />
                  ))}
                </List>
              </div>
            )
          }
        </ProjectSection>

        <ProjectSection
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
                  <ProjectUsers
                    projectid={projectid}
                    users={students}
                    auth={auth}
                    parsedProjectId={parsedProjectId}
                  />
                )}
                {currentTab === 1 && (
                  <ProjectUsers projectid={projectid} users={instructors} />
                )}
                {currentTab === 2 && (
                  <ProjectUsers projectid={projectid} users={admins} />
                )}
              </div>
            )
          }
        </ProjectSection>

        {calendarAddDialogOpen && (
          <CohortCalendarAddDialog
            projectid={projectid}
            users={users}
            toggleCalendarAddDialog={toggleCalendarAddDialog}
          />
        )}

        {courseAddDialogOpen && (
          <ProjectCourseAddDialog projectid={projectid} courses={courses} />
        )}

        {userAddDialogOpen && (
          <ProjectUserAddDialog projectid={projectid} />
        )}

        <ProjectUserMoveDialog projectid={projectid} />
      </div>
    </div>
  );
};


Project.propTypes = {
//   cohort: PropTypes.shape({}),
//   users: PropTypes.arrayOf(PropTypes.shape({})),
//   courses: PropTypes.arrayOf(PropTypes.shape({})),
//   currentTab: PropTypes.number.isRequired,
//   calendarAddDialogOpen: PropTypes.bool.isRequired,
//   courseAddDialogOpen: PropTypes.bool.isRequired,
//   userAddDialogOpen: PropTypes.bool.isRequired,
//   selectTab: PropTypes.func.isRequired,
//   toggleCalendarAddDialog: PropTypes.func.isRequired,
//   toggleUserAddDialog: PropTypes.func.isRequired,
//   toggleCourseAddDialog: PropTypes.func.isRequired,
//   match: PropTypes.shape({
//     params: PropTypes.shape({
//       cohortid: PropTypes.string.isRequired,
//     }).isRequired,
//   }).isRequired,
//   history: PropTypes.shape({}).isRequired,
//   auth: PropTypes.shape({}).isRequired,
//   classes: PropTypes.shape({
//     root: PropTypes.string.isRequired,
//   }).isRequired,
//   drawerOpen: PropTypes.bool.isRequired,
};


Project.defaultProps = {
  // cohort: undefined,
  // users: undefined,
  // courses: undefined,
};


const mapStateToProps = ({
  firestore,
  project,
  projectCalendarAddDialog,
  projectUserAddDialog,
  projectCourseAddDialog,
  topbar,
}, { match }) => ({
  project: (firestore.data.projects || {})[match.params.projectid],
  users: firestore.ordered[`projects/${match.params.projectid}/users`],
  courses: firestore.ordered[`projects/${match.params.projectid}/courses`],
  currentTab: project.currentTab,
  calendarAddDialogOpen: projectCalendarAddDialog.open,
  courseAddDialogOpen: projectCourseAddDialog.open,
  userAddDialogOpen: projectUserAddDialog.open,
  drawerOpen: topbar.drawerOpen,
});
//

const mapDispatchToProps = {
  selectTab: selectProjectUsersTab,
  toggleUserAddDialog: toggleProjectUserAddDialog,
  toggleCourseAddDialog: toggleProjectCourseAddDialog,
  //toggleCalendarAddDialog: toggleProjectCalendarAddDialog,
};


export default compose(
  firestoreConnect(({ match }) => ([
    {
      collection: 'projects',
      doc: match.params.id,
    },
    {
      collection: `projects/${match.params.projectid}/users`,
    },
    {
      collection: `projects/${match.params.projectid}/courses`,
      orderBy: ['order'],
    },
  ])),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Project);
