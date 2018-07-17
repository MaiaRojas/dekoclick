import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage } from 'react-intl';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import BorderColorIcon from 'material-ui-icons/BorderColor';
import ProjectCard from './project-card';
import Loader from './loader';


const drawerWidth = 320;
const styles = theme => ({
  heading: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  headline: {
    marginBottom: theme.spacing.unit * 2,
    color: theme.palette.text.primary,
  },
  headingButton: {
    top: theme.spacing.unit * -1,
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
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


const ProjectList = ({
  group,
  projects,
  classes,
  auth,
  profile,
  history,
  drawerOpen,
}) => {
  if (!projects) {
    return (<Loader />);
  }
  console.log(group);
  const canManageCourse =
    ['instructor', 'admin'].indexOf(group.role) > -1
    || (profile.roles && profile.roles.admin);
  return (
    <div
      position="absolute"
      className={classNames(classes.appBar, drawerOpen && classes.appBarShift)}
    >
      <div className={classes.heading}>
        {/* <Typography variant="subheading" gutterBottom className={classes.headline}>
          <FormattedMessage id="group.title" /> {' : '}{group.id}
        </Typography> */}
        {canManageCourse && (
          <IconButton
            className={classes.headingButton}
            aria-label="Manage"
            onClick={() => history.push(`/groups/${group.id}`)}
          >
            <BorderColorIcon />
          </IconButton>
        )}
      </div>
      <div className={classes.container}>
        {!projects.length
          ? <FormattedMessage id="course-list.content" />
          : (projects.map(project => (
            <ProjectCard
              key={project.id}
              group={group.id}
              project={project}
              auth={auth}
            />
          )))}
      </div>
    </div>
  );
};


ProjectList.propTypes = {
  // drawerOpen: PropTypes.bool.isRequired,
  // courses: PropTypes.arrayOf(PropTypes.shape({
  //   id: PropTypes.string.isRequired,
  // })),
  // cohort: PropTypes.shape({
  //   id: PropTypes.string.isRequired,
  // }).isRequired,
  // auth: PropTypes.shape({}).isRequired,
  // classes: PropTypes.shape({
  //   heading: PropTypes.string.isRequired,
  //   headline: PropTypes.string.isRequired,
  //   headingButton: PropTypes.string.isRequired,
  //   container: PropTypes.string.isRequired,
  //   appBar: PropTypes.string.isRequired,
  //   appBarShift: PropTypes.string.isRequired,
  // }).isRequired,
  // profile: PropTypes.shape({}).isRequired,
  // history: PropTypes.shape({}).isRequired,
};


ProjectList.defaultProps = {
  projects: undefined,
};


export default compose(
  firestoreConnect(props => [{
    collection: `groups/${props.group.id}/projects`,
    orderBy: ['order'],
  }]),
  connect(({ firestore }, { group }) => ({
    projects: firestore.ordered[`groups/${group.id}/projects`],
  })),
  withStyles(styles),
)(ProjectList);
