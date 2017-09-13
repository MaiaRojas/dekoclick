import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import DoneIcon from 'material-ui-icons/Done';
import ErrorIcon from 'material-ui-icons/Error';
import red from 'material-ui/colors/red';
import green from 'material-ui/colors/green';


const styles = {
  list: {
    marginTop: 30,
  },
  greenAvatar: {
    color: '#fff',
    backgroundColor: green[500],
  },
  redAvatar: {
    color: '#fff',
    backgroundColor: red[500],
  },
};


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


const Suite = props => (
  <div>
    {props.suite.title &&
      <ListItem>
        <ListItemText primary={props.suite.title} />
      </ListItem>
    }
    {props.suite.suites && props.suite.suites.map((suite, idx) =>
      <Suite key={idx} suite={suite} classes={props.classes} />
    )}
    {props.suite.tests && props.suite.tests.map((test, idx) =>
      <Test key={idx} test={test} classes={props.classes} />
    )}
  </div>
);


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


const ExerciseTestResults = props => (
  <div>
    <List className={props.classes.list}>
      <Suite suite={props.testResults.suite} classes={props.classes} />
      <Summary stats={props.testResults.stats} />
    </List>
  </div>
);


ExerciseTestResults.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  testResults: PropTypes.shape({
    suite: PropTypes.shape({}).isRequired,
    stats: PropTypes.shape({}).isRequired,
  }).isRequired,
};


export default withStyles(styles)(ExerciseTestResults);
