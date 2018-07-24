import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import {
  toggleProjectUserMoveDialog,
  resetProjectUserMoveDialog,
  moveUser,
} from '../reducers/project-user-move-dialog';
import { parse, stringify } from '../util/project';


const styles = () => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});


const ProjectUserMoveDialog = (props) => {
  if (!props.uid || !props.user || props.targetProject === undefined) {
    return null;
  }

  return (
    <div className={props.classes.container}>
      <Dialog open={props.open} onClose={props.toggleProjectUserMoveDialog}>
        <DialogTitle>
          Mueve alumnx al turno <strong>{props.targetProject.parsedId.name}</strong>
        </DialogTitle>
        <DialogContent>
          {props.moveError && props.moveError.message &&
            <DialogContentText>
              {props.moveError.message}
            </DialogContentText>
          }
          {!props.moveError &&
            <DialogContentText>
              Estás segura de que quieres mover a {props.user.name}&nbsp;
              ({props.user.email}) al Project <code>{props.targetProject.id}</code>?
            </DialogContentText>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={props.resetProjectUserMoveDialog} color="default">
            Cancelar
          </Button>
          {!props.moveError && (
            <Button
              color="primary"
              variant="raised"
              disabled={props.moving}
              onClick={() =>
                props.moveUser(props.projectid, props.uid, props.targetProject.id)
              }
            >
              Mover
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};


ProjectUserMoveDialog.propTypes = {
  // cohortid: PropTypes.string.isRequired,
  // open: PropTypes.bool.isRequired,
  // uid: PropTypes.string,
  // user: PropTypes.shape({
  //   name: PropTypes.string.isRequired,
  //   email: PropTypes.string.isRequired,
  // }),
  // moving: PropTypes.bool.isRequired,
  // moveError: PropTypes.shape({
  //   message: PropTypes.string.isRequired,
  // }),
  // targetCohort: PropTypes.shape({
  //   id: PropTypes.string.isRequired,
  //   parsedId: PropTypes.shape({
  //     name: PropTypes.string.isRequired,
  //   }).isRequired,
  // }).isRequired,
  // toggleCohortUserMoveDialog: PropTypes.func.isRequired,
  // resetCohortUserMoveDialog: PropTypes.func.isRequired,
  // moveUser: PropTypes.func.isRequired,
  // classes: PropTypes.shape({
  //   container: PropTypes.string.isRequired,
  // }).isRequired,
};


ProjectUserMoveDialog.defaultProps = {
  uid: null,
  user: null,
  moveError: null,
};


const getTargetProjectId = (projectid) => {
  const parsedProjectId = parse(projectid);
  const targetShift = (parsedProjectId.name === 'am') ? 'pm' : 'am';
  const targetProjectIdObj = { ...parsedProjectId, name: targetShift };
  return stringify(targetProjectIdObj);
};


const mapStateToProps = ({ firestore, projectUserMoveDialog }, { projectid }) => {
  const targetProjectId = getTargetProjectId(projectid);
  return {
    open: projectUserMoveDialog.open,
    uid: projectUserMoveDialog.uid,
    user: projectUserMoveDialog.user,
    moving: projectUserMoveDialog.moving,
    moveError: projectUserMoveDialog.moveError,
    targetProject: {
      ...((firestore.data.projects || {})[targetProjectId]),
      id: targetProjectId,
      parsedId: parse(targetProjectId),
    },
  };
};


const mapDispatchToProps = {
  toggleProjectUserMoveDialog,
  resetProjectUserMoveDialog,
  moveUser,
};


export default compose(
  firestoreConnect(props => [`projects/${getTargetProjectId(props.projectid)}`]),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(ProjectUserMoveDialog);
