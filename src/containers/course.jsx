import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { firestoreConnect } from 'react-redux-firebase';
import { CircularProgress } from 'material-ui/Progress';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import ScheduleIcon from 'material-ui-icons/Schedule';
import TopBar from '../components/top-bar';
import UnitCard from '../components/unit-card';
import Loader from '../components/loader';


const drawerWidth = 320;
const styles = theme => ({
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


const Course = (props) => {
  if (!props.course || props.cohortUser === undefined || props.courseProgressStats === undefined) {
    return (<Loader />);
  }

  const isAdmin = props.profile.roles && props.profile.roles.admin;

  if (!props.cohortUser && !isAdmin) {
    return null; // unauthorised?
  }

  const canManageCourse =
    isAdmin
    || ['instructor', 'admin'].indexOf(props.cohortUser.role) > -1;

  return (
    <div className="course">
      <TopBar title={props.course.title}>
        {props.course.stats && props.course.stats.durationString &&
          <Chip
            avatar={<Avatar><ScheduleIcon /></Avatar>}
            label={props.course.stats.durationString}
          />
        }
      </TopBar>
      <div
        position="absolute"
        className={
          classNames(props.classes.appBar, props.drawerOpen && props.classes.appBarShift)
        }
      >
        {props.syllabus && props.syllabus.map((unit, idx) => (
          <UnitCard
            key={unit.id}
            idx={idx}
            unit={unit}
            courseProgressStats={props.courseProgressStats}
            course={props.match.params.courseid}
            cohort={props.match.params.cohortid}
            canManageCourse={canManageCourse}
            courseSettings={props.courseSettings}
            syllabus={props.syllabus}
          />
        ))}
      </div>
    </div>
  );
};


Course.propTypes = {
  course: PropTypes.shape({
    title: PropTypes.string.isRequired,
    stats: PropTypes.shape({
      durationString: PropTypes.string.isRequired,
    }),
  }),
  syllabus: PropTypes.arrayOf(PropTypes.shape({})),
  cohortUser: PropTypes.shape({
    role: PropTypes.string.isRequired,
  }),
  courseProgressStats: PropTypes.shape({}),
  courseSettings: PropTypes.shape({}),
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseid: PropTypes.string.isRequired,
      cohortid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  profile: PropTypes.shape({
    roles: PropTypes.shape({
      admin: PropTypes.bool.isRequired,
    }),
  }).isRequired,
  classes: PropTypes.shape({
    appBar: PropTypes.string.isRequired,
    appBarShift: PropTypes.string.isRequired,
  }).isRequired,
  drawerOpen: PropTypes.bool,
};


Course.defaultProps = {
  course: undefined,
  syllabus: undefined,
  cohortUser: undefined,
  courseProgressStats: undefined,
  courseSettings: undefined,
  drawerOpen: undefined,
};

const mapStateToProps = ({ topbar }) => ({
  drawerOpen: topbar.drawerOpen,
});

export default compose(
  firestoreConnect(({ auth, match: { params: { cohortid, courseid } } }) => [
    {
      collection: `cohorts/${cohortid}/courses`,
      doc: courseid,
    },
    {
      collection: `cohorts/${cohortid}/coursesSettings`,
      doc: courseid,
    },
    {
      collection: `cohorts/${cohortid}/courses/${courseid}/syllabus`,
    },
    {
      collection: `cohorts/${cohortid}/users`,
      doc: auth.uid,
    },
    {
      collection: `cohorts/${cohortid}/users/${auth.uid}/progress`,
      doc: courseid,
    },
  ]),
  connect(({ firestore }, { auth, profile, match: { params: { cohortid, courseid } } }) => ({
    course: firestore.data[`cohorts/${cohortid}/courses`]
      ? firestore.data[`cohorts/${cohortid}/courses`][courseid]
      : undefined,
    syllabus: firestore.ordered[`cohorts/${cohortid}/courses/${courseid}/syllabus`],
    cohortUser: firestore.data[`cohorts/${cohortid}/users`]
      ? firestore.data[`cohorts/${cohortid}/users`][auth.uid] || null
      : undefined,
    courseProgressStats: firestore.data[`cohorts/${cohortid}/users/${auth.uid}/progress`]
      ? firestore.data[`cohorts/${cohortid}/users/${auth.uid}/progress`][courseid] || null
      : undefined,
    courseSettings: firestore.data[`cohorts/${cohortid}/coursesSettings`]
      ? firestore.data[`cohorts/${cohortid}/coursesSettings`][courseid]
      : undefined,
  })),
  connect(mapStateToProps),
  withStyles(styles),
)(Course);
