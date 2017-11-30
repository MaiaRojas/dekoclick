import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import InfoOutlineIcon from 'material-ui-icons/InfoOutline';


const Info = props => (
  <Typography style={{ display: 'flex', alignItems: 'center' }}>
    <InfoOutlineIcon />
    <span style={{ marginLeft: 8 }}>{props.message}</span>
  </Typography>
);


Info.propTypes = {
  message: PropTypes.string.isRequired,
};


export default Info;
