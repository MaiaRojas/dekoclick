import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, getVal, isLoaded } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import {
  toggleCohortUserMoveDialog,
  resetCohortUserMoveDialog,
  moveUser,
} from '../reducers/cohort-user-move-dialog';
import cohort from '../util/cohort';


const styles = () => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});


const CohortUserMoveDialog = (props) => {
  if (!props.uid || !props.user || !isLoaded(props.targetCohort)) {
    return null;
  }

  return (
    <div className={props.classes.container}>
      <Dialog open={props.open} onClose={props.toggleCohortUserMoveDialog}>
        <DialogTitle>
          Mueve alumnx al turno <strong>{props.targetCohort.parsedId.name}</strong>
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
              ({props.user.email}) al cohort <code>{props.targetCohort.id}</code>?
            </DialogContentText>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={props.resetCohortUserMoveDialog} color="default">
            Cancelar
          </Button>
          {!props.moveError && (
            <Button
              color="primary"
              raised
              disabled={props.moving}
              onClick={() =>
                props.moveUser(props.cohortid, props.uid, props.targetCohort.id)
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


CohortUserMoveDialog.propTypes = {
  cohortid: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  uid: PropTypes.string,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
  moving: PropTypes.bool.isRequired,
  moveError: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
  targetCohort: PropTypes.shape({
    id: PropTypes.string.isRequired,
    parsedId: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  toggleCohortUserMoveDialog: PropTypes.func.isRequired,
  resetCohortUserMoveDialog: PropTypes.func.isRequired,
  moveUser: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    container: PropTypes.string.isRequired,
  }).isRequired,
};


CohortUserMoveDialog.defaultProps = {
  uid: null,
  user: null,
  moveError: null,
};


const getTargetCohortId = (cohortid) => {
  const parsedCohortId = cohort.parse(cohortid);
  const targetShift = (parsedCohortId.name === 'am') ? 'pm' : 'am';
  const targetCohortIdObj = { ...parsedCohortId, name: targetShift };
  return cohort.stringify(targetCohortIdObj);
};


const mapStateToProps = ({ firebase, cohortUserMoveDialog }, { cohortid }) => {
  const targetCohortId = getTargetCohortId(cohortid);
  return {
    open: cohortUserMoveDialog.open,
    uid: cohortUserMoveDialog.uid,
    user: cohortUserMoveDialog.user,
    moving: cohortUserMoveDialog.moving,
    moveError: cohortUserMoveDialog.moveError,
    targetCohort: {
      ...getVal(firebase, `data/cohorts/${targetCohortId}`),
      id: targetCohortId,
      parsedId: cohort.parse(targetCohortId),
    },
  };
};


const mapDispatchToProps = {
  toggleCohortUserMoveDialog,
  resetCohortUserMoveDialog,
  moveUser,
};


export default compose(
  firebaseConnect(props => [`cohorts/${getTargetCohortId(props.cohortid)}`]),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(CohortUserMoveDialog);
