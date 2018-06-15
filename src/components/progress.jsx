import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';
import Tooltip from 'material-ui/Tooltip';


const styles = theme => ({
  content: {
    width: '100%',
  },
  root: {
    height: theme.spacing.unit * 2,
  },
  secundary: {
    backgroundColor: '#eee',
  },
});


const Progress = ({ value, classes }) => (
  <div className={classes.content}>
    <Tooltip title={`${value}%`} placement="top">
      <LinearProgress
        className="linear-progress"
        classes={{
          root: classes.root,
          colorSecondary: classes.secundary,
        }}
        variant="determinate"
        value={value}
        color="secondary"
      />
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
