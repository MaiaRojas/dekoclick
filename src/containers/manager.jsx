import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { firestoreConnect } from 'react-redux-firebase';
import { FormattedMessage } from 'react-intl';
import TopBar from '../components/top-bar';
import Alert from '../components/alert';
import ProjectList from '../components/project-list';
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


const Manager = ({
  groups,
  auth,
  profile,
  history,
  drawerOpen,
  classes,
}) => (
  <div className="courses">
    <TopBar title={<FormattedMessage id="projects.title" />} />
    {console.log(!groups)}
    {!groups && <Loader />}
    {groups && !groups.length && (
      <div
        position="absolute"
        className={classNames(classes.appBar, drawerOpen && classes.appBarShift)}
      >
        <Alert message={<FormattedMessage id="courses.noCoursesWarning" />} />
      </div>
    )}
    <div>
      <h1>Proyectos</h1>
      {groups && groups.length > 0 && (
      [...groups].reverse().map(group => (
        <ProjectList
          drawerOpen={drawerOpen}
          key={group.id}
          group={group}
          auth={auth}
          profile={profile}
          history={history}
        />
      ))
    )}
    </div>
  </div>
);


Manager.propTypes = {
  // projets: PropTypes.arrayOf(PropTypes.shape({
  //   id: PropTypes.string.isRequired,
  //   role: PropTypes.string.isRequired,
  // })),
  // auth: PropTypes.shape({}).isRequired,
  // profile: PropTypes.shape({}).isRequired,
  // history: PropTypes.shape({}).isRequired,
  // drawerOpen: PropTypes.bool,
  // classes: PropTypes.shape({}).isRequired,
};


Manager.defaultProps = {
  projets: undefined,
  drawerOpen: undefined,
};

const mapStateToProps = ({ topbar }) => ({
  drawerOpen: topbar.drawerOpen,
});

export default compose(
  firestoreConnect(({ auth }) => [{
    collection: `users/${auth.uid}/groups`,
  }]),
  connect(({ firestore }, { auth }) => ({
    groups: firestore.ordered[`users/${auth.uid}/groups`],
  })),
  connect(mapStateToProps),
  withStyles(styles),
)(Manager);
