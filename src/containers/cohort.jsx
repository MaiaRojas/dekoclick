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
import List, {
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import FolderIcon from 'material-ui-icons/Folder';
import AddIcon from 'material-ui-icons/Add';
import DeleteIcon from 'material-ui-icons/Delete';
import TopBar from '../components/top-bar';
import Alert from '../components/alert';
import CohortUser from '../components/cohort-user';
import CohortUserAddDialog from '../components/cohort-user-add-dialog';
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


const TabContainer = props => (
  <div style={{ padding: 8 * 3, backgroundColor: '#f0f0f0' }}>
    <Grid container className={props.classes.grid}>
      {props.users.map(cohortUser => (
        <CohortUser
          key={cohortUser.key}
          uid={cohortUser.key}
          role={cohortUser.value}
          cohortid={props.cohortid}
        />
      ))}
    </Grid>
  </div>
);

TabContainer.propTypes = {
  cohortid: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  classes: PropTypes.shape({
    grid: PropTypes.string.isRequired,
  }).isRequired,
};


const CohortCourse = ({
  cohortid,
  courseid,
  course,
  history,
  firebase,
}) => (
  <ListItem
    button
    onClick={() => {
      history.push(`/cohorts/${cohortid}/courses/${courseid}`);
    }}
  >
    <ListItemAvatar>
      <Avatar>
        <FolderIcon />
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={course.title}
      secondary={course.stats.durationString}
    />
    <ListItemSecondaryAction>
      <IconButton
        aria-label="Delete"
        onClick={() =>
          window.confirm(`Estás segura de que quieres quitar el curso "${courseid}" del cohort "${cohortid}"?`) &&
            firebase.database()
              .ref(`cohortCourses/${cohortid}/${courseid}`)
              .remove()
              .catch(console.error)
        }
      >
        <DeleteIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);


CohortCourse.propTypes = {
  cohortid: PropTypes.string.isRequired,
  courseid: PropTypes.string.isRequired,
  course: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  firebase: PropTypes.shape({}).isRequired,
};


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
  cohorts,
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
  if (!isLoaded(cohorts) || !isLoaded(campuses) || !isLoaded(courses) ||
    !isLoaded(users)) {
    return (<CircularProgress />);
  }

  if (isEmpty(cohorts)) {
    return (<div>No cohorts :-(</div>);
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
    <div className={`cohorts ${classes.root}`}>
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
              <TabContainer cohortid={cohortid} users={students} classes={classes} />
            )}
            {currentTab === 1 && (
              <TabContainer cohortid={cohortid} users={instructors} classes={classes} />
            )}
            {currentTab === 2 && (
              <TabContainer cohortid={cohortid} users={admins} classes={classes} />
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
    </div>
  );
};


Cohort.propTypes = {
  cohorts: PropTypes.shape({}),
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
  cohorts: undefined,
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
  cohorts: dataToJS(firebase, 'cohorts'),
  campuses: dataToJS(firebase, 'campuses'),
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
    'cohorts',
    'campuses',
    `cohortUsers/${match.params.cohortid}`,
    `cohortCourses/${match.params.cohortid}`,
  ])),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Cohort);
