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
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    width: 60,
    height: 60,
  },
});


const Designer = (props) => {
  if (!props.designer) {
    return (<Loader />);
  }

  const isAdmin = props.profile.roles && props.profile.roles.admin;

  if (!props.projectUser && !isAdmin) {
    return null; // unauthorised?
  }

  const canManageCourse =
    isAdmin
    || ['instructor', 'admin'].indexOf(props.cohortUser.role) > -1;

  return (
    <div className="designer">
      <TopBar >

      </TopBar>
      <div
        position="absolute"
        className={
          classNames(props.classes.appBar, props.drawerOpen && props.classes.appBarShift)
        }
      >
        <div>
          <Avatar
            alt="Adelle Charles"
            src="/static/images/uxceo-128.jpg"
            className={classNames(classes.avatar, classes.bigAvatar)}
          />
        </div>
        {props.projects && props.projects.map((project, idx) => {
          <ProjectCard
            key={project.id}
            // idx={idx}
            // unit={unit}
            // courseProgressStats={props.courseProgressStats}
            // course={props.match.params.courseid}
            // cohort={props.match.params.cohortid}
            // canManageCourse={canManageCourse}
            // courseSettings={props.courseSettings}
            // syllabus={props.syllabus}
          />
          // <Button
          //   size="small"
          //   variant="raised"
          //   color="primary"
          //   to={`/designers/${props.designers}`}
          //   component={Link}
          // >
          //   Ver Perfil
          // </Button>
        })}
      </div>
    </div>
  );
};


Designer.propTypes = {

};


Designer.defaultProps = {

};

const mapStateToProps = ({ topbar }) => ({
  drawerOpen: topbar.drawerOpen,
});

export default compose(
  firestoreConnect(({ auth, match: { params: { projectid, courseid } } }) => [
    {
      collection: `projects/${projectid}/designers`,
      doc: courseid,
    },
    {
      collection: `projects/${projectid}/coursesSettings`,
      doc: courseid,
    },
    {
      collection: `projects/${projectid}/designers/${designerid}/syllabus`,
    },
    {
      collection: `projects/${projectid}/users`,
      doc: auth.uid,
    },
    {
      collection: `projects/${projectid}/users/${auth.uid}/progress`,
      doc: courseid,
    },
  ]),
  connect(({ firestore }, { auth, match: { params: { projectid, courseid } } }) => ({
    course: firestore.data[`projects/${projectid}/designers`]
      ? firestore.data[`projects/${projectid}/designers`][courseid]
      : undefined,
    syllabus: firestore.ordered[`projects/${projectid}/designers/${courseid}/syllabus`],
    projectUser: firestore.data[`projects/${projectid}/users`]
      ? firestore.data[`projects/${projectid}/users`][auth.uid] || null
      : undefined,
    courseProgressStats: firestore.data[`projects/${projectid}/users/${auth.uid}/progress`]
      ? firestore.data[`projects/${projectid}/users/${auth.uid}/progress`][courseid] || null
      : undefined,
    courseSettings: firestore.data[`projects/${projectid}/coursesSettings`]
      ? firestore.data[`projects/${projectid}/coursesSettings`][courseid]
      : undefined,
  })),
  connect(mapStateToProps),
  withStyles(styles),
)(Course);