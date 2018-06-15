import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { FormattedMessage } from 'react-intl';


const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  body: {
    marginRight: theme.spacing.unit * 2,
  },
  grey: {
    backgroundColor: '#bdbdbd',
    color: theme.palette.text.primary,
    boxShadow: 'none',
    borderRadius: 'none',
  },
});


const QuizResults = ({ results, classes }) => {
  const percent = Math.floor((results.passes / results.total) * 100);

  return (
    <Paper className={`${classes.root} ${classes.grey}`}>
      <Typography variant="body1" className={`${classes.body} ${classes.grey}`}>
        <FormattedMessage id="quiz-results.score" />
      </Typography>
      <Typography variant="display1" className={classes.grey}>
        {`${percent}%`}
      </Typography>
    </Paper>
  );
};


QuizResults.propTypes = {
  results: PropTypes.shape({
    passes: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
  }).isRequired,
};


export default withStyles(styles)(QuizResults);
