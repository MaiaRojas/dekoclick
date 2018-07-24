import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import ProjectUser from './cohort-user';
import { toggleProjectUserMoveDialog } from '../reducers/project-user-move-dialog';


const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    backgroundColor: theme.palette.background.contentFrame,
  },
});


const profilesLoaded = profiles => Object.keys(profiles)
  .reduce((memo, uid) => memo && profiles[uid], true);


const ProjectUsers = (props) => {
  if (!profilesLoaded(props.profiles || {})) {
    return <CircularProgress />;
  }

  return (
    <div className={props.classes.root}>
      <Grid container>
        {props.users.map(cohortUser => (
          <ProjectUser
            key={cohortUser.id}
            uid={cohortUser.id}
            cohortUser={cohortUser}
            profile={props.profiles[cohortUser.id]}
            cohortid={props.cohortid}
            toggleMoveDialog={props.toggleMoveDialog}
            firebase={props.firebase}
            auth={props.auth}
            parsedCohortId={props.parsedCohortId}
          />
        ))}
      </Grid>
    </div>
  );
};


ProjectUsers.propTypes = {
  // cohortid: PropTypes.string.isRequired,
  // users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  // profiles: PropTypes.shape({}).isRequired,
  // toggleMoveDialog: PropTypes.func.isRequired,
  // auth: PropTypes.shape({}),
  // parsedCohortId: PropTypes.shape({}),
  // firebase: PropTypes.shape({}).isRequired,
  // classes: PropTypes.shape({
  //   root: PropTypes.string.isRequired,
  // }).isRequired,
};


ProjectUsers.defaultProps = {
  auth: undefined,
  parsedCohortId: undefined,
};


const mapStateToProps = ({ firestore }, ownProps) => ({
  profiles: ownProps.users.reduce((memo, item) => ({
    ...memo,
    [item.id]: (firestore.data.users || {})[item.id],
  }), {}),
});


const mapDispatchToProps = {
  toggleMoveDialog: toggleProjectUserMoveDialog,
};


export default compose(
  firestoreConnect(props => props.users.map(obj => `users/${obj.id}`)),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(ProjectUsers);
