import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';


const styles = () => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


const Loader = props => (
  <div className={props.classes.root} >
    <CircularProgress />
  </div>
);


Loader.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
  }).isRequired,
};


export default withStyles(styles)(Loader);
