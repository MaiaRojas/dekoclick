import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';
import Tooltip from 'material-ui/Tooltip';


const styles = theme => ({
  root: {
    width: '100%',
    margin: `${theme.spacing.unit}px 0`,
  },
});


const Progress = ({ value, classes }) => (
  <div className={classes.root}>
    <Tooltip title={`${value}%`} placement="left">
      <LinearProgress mode="determinate" value={value} />
    </Tooltip>
  </div>
);


Progress.propTypes = {
  value: PropTypes.number.isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
  }).isRequired,
};


export default withStyles(styles)(Progress);
