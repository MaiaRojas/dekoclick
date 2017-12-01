import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import InfoOutlineIcon from 'material-ui-icons/InfoOutline';
import WarningIcon from 'material-ui-icons/Warning';
import ErrorIcon from 'material-ui-icons/Error';


const Icon = props => {
  switch (props.type) {
    case 'warn':
      return <WarningIcon />;
    case 'error':
      return <ErrorIcon />;
    default:
      return <InfoOutlineIcon />;
  }
};


const Alert = props => (
  <Typography style={{ display: 'flex', alignItems: 'center' }}>
    <Icon type={props.type} />
    <span style={{ marginLeft: 8 }}>{props.message}</span>
  </Typography>
);


Alert.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'warn', 'error']),
};


export default Alert;
