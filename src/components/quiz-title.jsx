import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { FormattedMessage } from 'react-intl';


const styles = theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing.unit * 3,
    display: 'flex',
    alignItems: 'start',
    flexDirection: 'column',
    boxShadow: 'none',
    borderRadius: 'none',
  },
  body: {
    marginRight: theme.spacing.unit * 2,
  },
});


const QuizTitle = ({ classes }) => (
  <Paper className={classes.root}>
    <Typography variant="body1" className={classes.body}>
      <span style={{ marginLeft: 8 }}>Quiz</span>
    </Typography>
    <Typography variant="display1">
      <FormattedMessage id="quiz.title" />
    </Typography>
  </Paper>
);


QuizTitle.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
};


export default withStyles(styles)(QuizTitle);
