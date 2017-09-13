import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';


const styles = theme => ({
  appBar: {
    boxShadow: 'none',
    [theme.breakpoints.up('md')]: {
      width: 'calc(100% - 320px)',
    },
  },
});


const TopBar = props => (
  <AppBar className={props.classes.appBar}>
    <Toolbar>
      <Typography type="title">
        {props.title}
      </Typography>
    </Toolbar>
  </AppBar>
);


TopBar.propTypes = {
  title: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    appBar: PropTypes.string.isRequired,
  }).isRequired,
};


export default withStyles(styles)(TopBar);
