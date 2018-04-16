import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import green from 'material-ui/colors/green';
import yellow from 'material-ui/colors/yellow';
import { FormattedMessage } from 'react-intl';


const styles = theme => ({
  root: {
    // marginBottom: theme.spacing.unit * 4,
    padding: theme.spacing.unit * 3,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  body: {
    marginRight: theme.spacing.unit * 2,
  },
  green: {
    backgroundColor: green[500],
    color: theme.palette.text.secondary,
  },
  yellow: {
    backgroundColor: yellow[500],
    color: '#333333',
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

  const colorClass = classes.grey;
  // if (percent > 79) {
  //   colorClass = classes.green;
  // } else if (percent > 69) {
  //   colorClass = classes.yellow;
  // }

  return (
    <Paper className={`${classes.root} ${colorClass}`}>
      <Typography variant="body1" className={`${classes.body} ${colorClass}`}>
        <FormattedMessage id="quiz-results.score" />
      </Typography>
      <Typography variant="display1" className={colorClass}>
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
