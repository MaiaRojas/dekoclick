import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS, isLoaded } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import CohortUser from './cohort-user';
import { toggleCohortUserMoveDialog } from '../reducers/cohort-user-move-dialog';


const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    backgroundColor: '#f0f0f0',
  },
  grid: {
    marginBottom: 20,
  },
});


const profilesLoaded = profiles => Object.keys(profiles)
  .reduce((memo, uid) => memo && isLoaded(profiles[uid]), true);


const CohortUsers = (props) => {
  if (!profilesLoaded(props.profiles || {})) {
    return <CircularProgress />;
  }

  return (
    <div className={props.classes.root}>
      <Grid container className={props.classes.grid}>
        {props.users.map(cohortUser => (
          <CohortUser
            key={cohortUser.key}
            uid={cohortUser.key}
            role={cohortUser.value}
            profile={props.profiles[cohortUser.key]}
            cohortid={props.cohortid}
            toggleMoveDialog={props.toggleMoveDialog}
            firebase={props.firebase}
          />
        ))}
      </Grid>
    </div>
  );
};


CohortUsers.propTypes = {
  cohortid: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  profiles: PropTypes.shape({}).isRequired,
  toggleMoveDialog: PropTypes.func.isRequired,
  firebase: PropTypes.shape({
    database: PropTypes.func.isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    grid: PropTypes.string.isRequired,
  }).isRequired,
};


const mapStateToProps = ({ firebase }, ownProps) => ({
  profiles: ownProps.users.reduce((memo, item) => ({
    ...memo,
    [item.key]: dataToJS(firebase, `users/${item.key}`),
  }), {}),
});


const mapDispatchToProps = {
  toggleMoveDialog: toggleCohortUserMoveDialog,
};


export default compose(
  firebaseConnect(props => props.users.map(obj => `users/${obj.key}`)),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(CohortUsers);
