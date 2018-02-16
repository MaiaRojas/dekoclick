import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import EmailIcon from 'material-ui-icons/Email';
import DeleteIcon from 'material-ui-icons/Delete';
import SwapHorizIcon from 'material-ui-icons/SwapHoriz';
import DirectionsWalkIcon from 'material-ui-icons/DirectionsWalk';
import gravatarUrl from '../util/gravatarUrl';
import cohort from '../util/cohort';
import SettingsIcon from 'material-ui-icons/Settings';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import CohortUserValidationForm from './cohort-user-validation-form'
import CloseIcon from 'material-ui-icons/Close';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

class CohortUserOpenModalButton extends React.Component {

  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <React.Fragment>
          <IconButton onClick={this.handleClickOpen}>   <SettingsIcon /> </IconButton>

          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Valida la información de {this.props.profile.name}</DialogTitle>

            <DialogContent>
                <CohortUserValidationForm  {...this.props}/>

            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
    );
  }
}

export default CohortUserOpenModalButton;
