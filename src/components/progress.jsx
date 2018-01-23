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


const Progress = props => (
  <div className={props.classes.root}>
    <Tooltip title={`${props.value}%`} placement="left">
      <LinearProgress mode="determinate" value={props.value} />
    </Tooltip>
  </div>
);


export default withStyles(styles)(Progress);
