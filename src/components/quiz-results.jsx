import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import green from 'material-ui/colors/green';
import yellow from 'material-ui/colors/yellow';
import red from 'material-ui/colors/red';


const styles = {
  root: {
    marginBottom: 30,
    padding: 20,
  },
  green: {
    backgroundColor: green[500],
    color: '#ffffff',
  },
  yellow: {
    backgroundColor: yellow[500],
    color: '#333333',
  },
  red: {
    backgroundColor: red[500],
    color: '#ffffff',
  },
};


const QuizResults = ({ results, classes }) => {
  const percent = Math.floor((results.passes / results.total) * 100);

  let colorClass = classes.red;
  if (percent > 79) {
    colorClass = classes.green;
  } else if (percent > 69) {
    colorClass = classes.yellow;
  }

  return (
    <Paper className={`${classes.root} ${colorClass}`}>
      <Typography type="display1" className={colorClass}>
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
