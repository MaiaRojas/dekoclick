import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import SubjectIcon from 'material-ui-icons/Subject';
import PollIcon from 'material-ui-icons/Poll';
import SchoolIcon from 'material-ui-icons/School';
import CodeIcon from 'material-ui-icons/Code';
import BuildIcon from 'material-ui-icons/Build';
import DoneIcon from 'material-ui-icons/Done';
import WarningIcon from 'material-ui-icons/Warning';


const propsToRoutePath = ({ partid, match }) =>
  `/cohorts/${match.params.cohortid}/courses/${match.params.courseid}` +
  `/${match.params.unitid}/${partid}`;


const styles = {
  active: {
    backgroundColor: '#ffc107',
  },
};


const partTypeToIcon = type => {
  if (type === 'quiz') {
    return <PollIcon />;
  } else if (type === 'seminario') {
    return <SchoolIcon />;
  } else if (type === 'practice') {
    return <CodeIcon />;
  } else if (type === 'taller') {
    return <BuildIcon />;
  } else {
    return <SubjectIcon />;
  }
};


const progressToIcon = (part, progress) => {
  if (part.type === 'quiz') {
    if (progress && progress.results) {
      return <DoneIcon />;
    } else {
      return null;
    }
  } else if (part.type === 'practice') {
    const stats = Object.keys(part.exercises).reduce((memo, key) => {
      if (progress && progress[key] && progress[key].testResults) {
        if (progress[key].testResults.failures) {
          memo.incomplete += 1;
        } else {
          memo.complete += 1;
        }
      } else {
        memo.pending += 1;
      }
      return memo;
    }, { pending: 0, incomplete: 0, complete: 0 });
    if (!stats.pending && !stats.incomplete) {
      return <DoneIcon />;
    } else if (stats.incomplete) {
      return <WarningIcon />;
    }
  }

  return null;
};


const UnitNavItem = props => (
  <ListItem
    button
    onClick={() => props.history.push(propsToRoutePath(props))}
    className={props.partid === props.match.params.partid ? props.classes.active : ''}
  >
    <ListItemIcon>
      {partTypeToIcon(props.part.type)}
    </ListItemIcon>
    <ListItemText primary={`${props.order}. ${props.part.title}`} />
    <ListItemSecondaryAction>
      <IconButton disabled={true}>
        {progressToIcon(props.part, props.progress)}
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);


UnitNavItem.propTypes = {
  part: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  order: PropTypes.number.isRequired,
};


export default withStyles(styles)(UnitNavItem);
