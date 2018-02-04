import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import CohortUser from './cohort-user';
import { toggleCohortUserMoveDialog } from '../reducers/cohort-user-move-dialog';


const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    backgroundColor: theme.palette.background.contentFrame,
  },
});


const profilesLoaded = profiles => Object.keys(profiles)
  .reduce((memo, uid) => memo && profiles[uid], true);


const CohortUsers = (props) => {
  if (!profilesLoaded(props.profiles || {})) {
    return <CircularProgress />;
  }

  return (
    <div className={props.classes.root}>
      <Grid container>
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
  }).isRequired,
};


const mapStateToProps = ({ firestore }, ownProps) => ({
  profiles: ownProps.users.reduce((memo, item) => ({
    ...memo,
    [item.key]: (firestore.data.users || {})[item.key],
  }), {}),
});


const mapDispatchToProps = {
  toggleMoveDialog: toggleCohortUserMoveDialog,
};


export default compose(
  firestoreConnect(props => props.users.map(obj => `users/${obj.key}`)),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(CohortUsers);
