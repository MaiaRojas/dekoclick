import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui-icons/Settings';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import CohortUserValidationForm from './cohort-user-validation-form';


class CohortUserOpenModalButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };

    this.handleClickOpen = () => {
      this.setState({ open: true });
    };

    this.handleClose = () => {
      this.setState({ open: false });
    };
  }

  render() {
    return (
      <React.Fragment>
        <IconButton onClick={this.handleClickOpen}>
          <SettingsIcon />
        </IconButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Valida la información de {this.props.profile.name}
          </DialogTitle>
          <DialogContent>
            <CohortUserValidationForm {...this.props} />
          </DialogContent>
          <DialogActions>
            <p>
              <a
                href={`https:/profile/${this.props.uid}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver su perfil.
              </a>
            </p>
            <Button onClick={this.handleClose} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}


CohortUserOpenModalButton.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  uid: PropTypes.string.isRequired,
};


export default CohortUserOpenModalButton;
