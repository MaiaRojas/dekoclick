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
import DesignerList from '../components/designer-list';
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


const Designers = ({
  designers,
  auth,
  profile,
  history,
  drawerOpen,
  classes,
}) => (
  <div className="courses">
    <TopBar title={<FormattedMessage id="projects.title" />} />
    {console.log(designers)}
    {/* {!designers && <Loader />}
    {designers && !designers.length && (
      <div
        position="absolute"
        className={classNames(classes.appBar, drawerOpen && classes.appBarShift)}
      >
        <Alert message={<FormattedMessage id="courses.noCoursesWarning" />} />
      </div>
    )}
    <div>
      <h1>Diseñadores</h1>
      {designers && designers.length > 0 && (
      [...designers].reverse().map(designer => (
        <DesignerList
          drawerOpen={drawerOpen}
          key={designer.id}
          designer={designer}
          auth={auth}
          profile={profile}
          history={history}
        />
      ))
    )}
    </div> */}
  </div>
);


Designers.propTypes = {
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


Designers.defaultProps = {
  projets: undefined,
  drawerOpen: undefined,
};

const mapStateToProps = ({ topbar }) => ({
  drawerOpen: topbar.drawerOpen,
});

export default compose(
  firestoreConnect(( ) => [{
    collection: `designers`,
  }]),
  connect(({ firestore }, { auth }) => ({
    designers: firestore.ordered[`designers`],
  })),
  connect(mapStateToProps),
  withStyles(styles),
)(Designers);

// export default compose(
//   firestoreConnect(() => ['cohorts', 'campuses']),
//   connect(mapStateToProps, mapDispatchToProps),
//   withStyles(styles),
// )(Cohorts);
