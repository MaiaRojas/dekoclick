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
import DesignerCard from '../components/designer-card';
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
  container: {
    padding: theme.spacing.unit,
    display: 'flex',
    justifyContent: 'start',
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
  <div className="designers">
    <TopBar title={<FormattedMessage id="projects.title" />} />
      {!designers && <Loader />}
      {designers && !designers.length && (
        <div
          position="absolute"
          className={classNames(classes.appBar, drawerOpen && classes.appBarShift)}
        >
          <Alert message={<FormattedMessage id="courses.noCoursesWarning" />} />
        </div>
      )}

    <div
      position="absolute"
      className={classNames(classes.appBar, drawerOpen && classes.appBarShift)}
    >
      <div className={classes.heading}>
        <h1>Diseñadores</h1>
      </div>
      <div className={classes.container}>
        {designers && designers.length > 0 && (
          [...designers].reverse().map(designer => (
            <DesignerCard
              drawerOpen={drawerOpen}
              key={designer.id}
              designer={designer}
            />
          ))
        )}
      </div>
    </div>
  </div>
);


Designers.propTypes = {

};


Designers.defaultProps = {
  designers: undefined,
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