import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import Alert from './alert';
import {
  toggleQuizConfirmationDialog,
  startQuizAndCloseConfirmationDialog,
} from '../reducers/quiz-confirmation-dialog';


const styles = () => ({
  dialog: {
    width: '100%',
  },
});


const QuizConfirmationDialog = ({ classes, ...props }) => (
  <Dialog
    onClose={props.toggleQuizConfirmationDialog}
    open={props.quizConfirmationDialogOpen}
    classes={{ paper: classes.dialog }}
  >
    <DialogTitle><FormattedMessage id="quiz-confirmation-dialog.title" /></DialogTitle>
    <DialogContent>
      <Alert
        type="warn"
        message={
          <FormattedMessage
            id="quiz-confirmation-dialog.content"
            values={{ duration: props.part.durationString }}
          />
        }
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={props.toggleQuizConfirmationDialog}>
        <FormattedMessage id="quiz-confirmation-dialog.cancel" />
      </Button>
      <Button variant="raised" color="primary" onClick={props.startQuizAndCloseConfirmationDialog}>
        <FormattedMessage id="quiz-confirmation-dialog.start" />
      </Button>
    </DialogActions>
  </Dialog>
);


QuizConfirmationDialog.propTypes = {
  part: PropTypes.shape({
    durationString: PropTypes.string.isRequired,
  }).isRequired,
  classes: PropTypes.shape({}).isRequired,
  quizConfirmationDialogOpen: PropTypes.bool.isRequired,
  toggleQuizConfirmationDialog: PropTypes.func.isRequired,
  startQuizAndCloseConfirmationDialog: PropTypes.func.isRequired,
};


const mapStateToProps = ({ quizConfirmationDialog }) => ({
  quizConfirmationDialogOpen: quizConfirmationDialog.open,
});


const mapDispatchToProps = {
  toggleQuizConfirmationDialog,
  startQuizAndCloseConfirmationDialog,
};


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(QuizConfirmationDialog);
