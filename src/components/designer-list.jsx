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


const DesignerList = ({
  designer,
  designers,
  classes,
  // auth,
  drawerOpen,
}) => {
  // if (!designers) {
  //   return (<Loader />);
  // }
  return (
    <div
      position="absolute"
      className={classNames(classes.appBar, drawerOpen && classes.appBarShift)}
    >
      <div className={classes.heading}>
        {/* <Typography variant="subheading" gutterBottom className={classes.headline}>
          <FormattedMessage id="group.title" /> {' : '}{group.id}
        </Typography> */}
      </div>
      <div className={classes.container}>
        {!designers.length
          ? <FormattedMessage id="course-list.content" />
          : (projects.map(designer => (
            <DesignerCard
              key={designer.id}
              designer={designer.id}
              designer={designer}
              auth={auth}
            />
          )))}
      </div>
    </div>
  );
};
// console.log(designer.id))};

DesignerList.propTypes = {
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

// const mapStateToProps = ({
//   firestore, designers, topbar,
// }) => ({
//   projects: filterProjects(firestore.ordered.projects, {
//     campus: projects.campusFilter,
//     program: projects.programFilter,
//   }),
//   campuses: firestore.ordered.campuses,
//   estadoFilter: projects.estadoFilter,
//   programFilter: projects.programFilter,
//   newDialogOpen: projectNewDialog.open,
//   drawerOpen: topbar.drawerOpen,
// });


DesignerList.defaultProps = {
  projects: undefined,
};


export default
  // compose(
  //   firestoreConnect(() => ['designers']),
  //   connect(({ firestore }, { designer }) => ({
  //     designer: firestore.ordered[`designers/${designer.id}`],
  //   })),
  withStyles(styles)(DesignerList);

// export default compose(
//   firestoreConnect(({ auth }) => [{
//     collection: `users/${auth.uid}/cohorts`,
//   }]),
//   connect(({ firestore }, { auth }) => ({
//     cohorts: firestore.ordered[`users/${auth.uid}/cohorts`],
//   })),
//   connect(mapStateToProps),
//   withStyles(styles),
// )(Courses);