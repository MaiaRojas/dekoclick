import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import {
  toggleQuizConfirmationDialog,
  startQuizAndCloseConfirmationDialog,
} from '../reducers/quiz-confirmation-dialog';

const styles = () => ({
  dialog: {
    width: '100%',
  },
});

const QuizConfirmationDialog = ({ classes, ...props}) => (
  <Dialog
    ignoreBackdropClick
    ignoreEscapeKeyUp
    open={props.quizConfirmationDialogOpen}
    classes={{ paper: classes.dialog }}
  >
    <DialogTitle>Quiz: Piénsalo bien...</DialogTitle>
    <DialogContent>
      <Typography>
        ¿Estás totalmente segura de que quieres comenzar a responder ESTE quiz?
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button color="primary" onClick={props.toggleQuizConfirmationDialog}>
        Sí
      </Button>
      <Button color="primary" onClick={props.startQuizAndCloseConfirmationDialog}>
        No
      </Button>
    </DialogActions>
  </Dialog>
);

QuizConfirmationDialog.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  quizConfirmationDialogOpen: PropTypes.bool.isRequired,
  toggleQuizConfirmationDialog: PropTypes.func.isRequired,
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
