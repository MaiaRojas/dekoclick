import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import DoneIcon from 'material-ui-icons/Done';
import ErrorIcon from 'material-ui-icons/Error';
import red from 'material-ui/colors/red';
import green from 'material-ui/colors/green';


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
  }).isRequired,
};


const Suite = props => (
  <div>
    {props.suite.title &&
      <ListItem>
        <ListItemText primary={props.suite.title} />
      </ListItem>
    }
    {props.suite.tests && Object.keys(props.suite.tests).map(idx => (
      <Test
        key={props.suite.tests[idx].title}
        test={props.suite.tests[idx]}
        classes={props.classes}
      />
    ))}
    {props.suite.suites && Object.keys(props.suite.suites).map(idx => (
      <Suite
        key={props.suite.suites[idx].title}
        suite={props.suite.suites[idx]}
        classes={props.classes}
      />
    ))}
  </div>
);


Suite.propTypes = {
  suite: PropTypes.shape({
    title: PropTypes.string.isRequired,
    suites: PropTypes.shape({}),
    tests: PropTypes.shape({}),
  }).isRequired,
  classes: PropTypes.shape({
    greenAvatar: PropTypes.string.isRequired,
    redAvatar: PropTypes.string.isRequired,
  }).isRequired,
};


const failureSummaryLine = stats =>
  `${stats.failures} de ${stats.tests} tests fallaron `;


const successSummaryLine = stats => `${stats.passes} tests pasaron ;-) `;


const summaryLine = stats =>
  `${stats.failures ? failureSummaryLine(stats) : successSummaryLine(stats)} (${stats.duration}ms)`;


const Summary = ({ stats }) => (
  <ListItem>
    <ListItemText primary={summaryLine(stats)} />
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
