import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import DoneIcon from 'material-ui-icons/Done';
import ErrorIcon from 'material-ui-icons/Error';
import red from 'material-ui/colors/red';
import green from 'material-ui/colors/green';
import { FormattedMessage } from 'react-intl';


const styles = theme => ({
  list: {
    marginTop: theme.spacing.unit * 3,
  },
  greenAvatar: {
    color: '#fff',
    backgroundColor: green[500],
  },
  redAvatar: {
    color: '#fff',
    backgroundColor: red[500],
  },
  secondary: {
    color: theme.palette.text.primary,
  },
});


const Test = props => (
  <ListItem>
    {props.test.state === 'passed' &&
      <Avatar className={props.classes.greenAvatar}><DoneIcon /></Avatar>
    }
    {props.test.state === 'failed' &&
      <Avatar className={props.classes.redAvatar}><ErrorIcon /></Avatar>
    }
    <ListItemText
      classes={{ secondary: props.classes.secondary }}
      primary={props.test.title}
      secondary={props.test.err ? props.test.err : 'ok'}
    />
  </ListItem>
);


Test.propTypes = {
  test: PropTypes.shape({
    state: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    err: PropTypes.string,
  }).isRequired,
  classes: PropTypes.shape({
    greenAvatar: PropTypes.string.isRequired,
    redAvatar: PropTypes.string.isRequired,
    secondary: PropTypes.string.isRequired,
  }).isRequired,
};


const Suite = props => (
  <div>
    {props.suite.title &&
      <ListItem>
        <ListItemText primary={props.suite.title} />
      </ListItem>
    }
    {props.suite.tests && props.suite.tests.map(test => (
      <Test
        key={test.title}
        test={test}
        classes={props.classes}
      />
    ))}
    {props.suite.suites && props.suite.suites.map(suite => (
      <Suite
        key={suite.title}
        suite={suite}
        classes={props.classes}
      />
    ))}
  </div>
);


Suite.propTypes = {
  suite: PropTypes.shape({
    title: PropTypes.string.isRequired,
    suites: PropTypes.arrayOf(PropTypes.shape({})),
    tests: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  classes: PropTypes.shape({
    greenAvatar: PropTypes.string.isRequired,
    redAvatar: PropTypes.string.isRequired,
  }).isRequired,
};


const Summary = ({ stats }) => (
  <ListItem>
    <ListItemText
      primary={
        stats.failures
          ? <FormattedMessage
            id="exercise-test-results.failures"
            values={{ failures: stats.failures, tests: stats.tests }}
          />
          : <FormattedMessage
            id="exercise-test-results.passes"
            values={{ passes: stats.passes }}
          />
      }
      secondary={`(${stats.duration}ms)`}
    />
  </ListItem>
);


Summary.propTypes = {
  stats: PropTypes.shape({
    tests: PropTypes.number,
    failures: PropTypes.number,
    passes: PropTypes.number,
    duration: PropTypes.number,
  }).isRequired,
};


const ExerciseTestResults = props => (
  <div>
    <List className={props.classes.list}>
      <Suite suite={props.testResults.suite} classes={props.classes} />
      <Summary stats={props.testResults.stats} />
    </List>
  </div>
);


ExerciseTestResults.propTypes = {
  classes: PropTypes.shape({
    list: PropTypes.string.isRequired,
  }).isRequired,
  testResults: PropTypes.shape({
    suite: PropTypes.shape({}).isRequired,
    stats: PropTypes.shape({}).isRequired,
  }).isRequired,
};


export default withStyles(styles)(ExerciseTestResults);
