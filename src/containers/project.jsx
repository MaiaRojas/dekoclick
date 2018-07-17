import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { firestoreConnect } from 'react-redux-firebase';
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


const Project = (props) => {
  // if (!props.project || props.cohortUser === undefined || props.courseProgressStats === undefined) {
  //   return (<Loader />);
  // }

  // const isAdmin = props.profile.roles && props.profile.roles.admin;

  // if (!props.cohortUser && !isAdmin) {
  //   return null; // unauthorised?
  // }

  // const canManageCourse =
  //   isAdmin
  //   || ['instructor', 'admin'].indexOf(props.cohortUser.role) > -1;

  return (
    <div className="project">
      <TopBar title=''>
        {/* {props.course.stats && props.course.stats.durationString &&
          <Chip
            avatar={<Avatar><ScheduleIcon /></Avatar>}
            label={props.course.stats.durationString}
          />
        } */}
      </TopBar>
      <div
        position="absolute"
        className={
          classNames(props.classes.appBar, props.drawerOpen && props.classes.appBarShift)
        }
      >
        <h1>Implementando ...</h1>
        {/* {props.syllabus && props.syllabus.map((unit, idx) => (
          <UnitCard
            key={unit.id}
            idx={idx}
            unit={unit}
            courseProgressStats={props.courseProgressStats}
            course={props.match.params.projectid}
            cohort={props.match.params.cohortid}
            canManageCourse={canManageCourse}
            courseSettings={props.courseSettings}
            syllabus={props.syllabus}
          />
        ))} */}
      </div>
    </div>
  );
};


Project.propTypes = {
  // course: PropTypes.shape({
  //   title: PropTypes.string.isRequired,
  //   stats: PropTypes.shape({
  //     durationString: PropTypes.string.isRequired,
  //   }),
  // }),
  // syllabus: PropTypes.arrayOf(PropTypes.shape({})),
  // cohortUser: PropTypes.shape({
  //   role: PropTypes.string.isRequired,
  // }),
  // courseProgressStats: PropTypes.shape({}),
  // courseSettings: PropTypes.shape({}),
  // match: PropTypes.shape({
  //   params: PropTypes.shape({
  //     projectid: PropTypes.string.isRequired,
  //     cohortid: PropTypes.string.isRequired,
  //   }).isRequired,
  // }).isRequired,
  // profile: PropTypes.shape({
  //   roles: PropTypes.shape({
  //     admin: PropTypes.bool.isRequired,
  //   }),
  // }).isRequired,
  // classes: PropTypes.shape({
  //   appBar: PropTypes.string.isRequired,
  //   appBarShift: PropTypes.string.isRequired,
  // }).isRequired,
  // drawerOpen: PropTypes.bool,
};


Project.defaultProps = {
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
  firestoreConnect(({ auth, match: { params: { groupid, projectid } } }) => [
    {
      collection: `groups/${groupid}/projects`,
      doc: projectid,
    },
    // {
    //   collection: `groups/${groupid}/coursesSettings`,
    //   doc: projectid,
    // },
    // {
    //   collection: `groups/${groupid}/projects/${projectid}/syllabus`,
    // },
    // {
    //   collection: `groups/${groupid}/users`,
    //   doc: auth.uid,
    // },
    // {
    //   collection: `groups/${groupid}/users/${auth.uid}/progress`,
    //   doc: projectid,
    // },
  ]),
  connect(({ firestore }, { auth, match: { params: { groupid, projectid } } }) => ({
    project: firestore.data[`groups/${groupid}/projects`]
      ? firestore.data[`groups/${groupid}/projects`][projectid]
      : undefined,
    // syllabus: firestore.ordered[`groups/${groupid}/projects/${projectid}/syllabus`],
    // cohortUser: firestore.data[`groups/${groupid}/users`]
    //   ? firestore.data[`groups/${groupid}/users`][auth.uid] || null
    //   : undefined,
    // courseProgressStats: firestore.data[`groups/${groupid}/users/${auth.uid}/progress`]
    //   ? firestore.data[`groups/${groupid}/users/${auth.uid}/progress`][projectid] || null
    //   : undefined,
    // courseSettings: firestore.data[`groups/${groupid}/coursesSettings`]
    //   ? firestore.data[`groups/${groupid}/coursesSettings`][projectid]
    //   : undefined,
  })),
  connect(mapStateToProps),
  withStyles(styles),
)(Project);
