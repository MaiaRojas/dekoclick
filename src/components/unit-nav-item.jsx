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
import TimerIcon from 'material-ui-icons/Timer';


const propsToRoutePath = ({ partid, match }) =>
  `/cohorts/${match.params.cohortid}/courses/${match.params.courseid}` +
  `/${match.params.unitid}/${partid}`;


const styles = {
  active: {
    backgroundColor: '#ffc107',
  },
  read: {
    fontWeight: 400,
  },
  unread: {
    fontWeight: 700,
  },
};


const partTypeToIcon = (type) => {
  if (type === 'quiz') {
    return <PollIcon />;
  }
  if (type === 'seminario') {
    return <SchoolIcon />;
  }
  if (type === 'practice') {
    return <CodeIcon />;
  }
  if (type === 'taller') {
    return <BuildIcon />;
  }
  return <SubjectIcon />;
};


const progressToIcon = (part, progress) => {
  if (part.type === 'lectura') {
    if (progress && progress.readAt) {
      return <DoneIcon />;
    }
  } else if (part.type === 'quiz') {
    if (progress && progress.results) {
      return <DoneIcon />;
    } else if (progress) {
      return <TimerIcon />;
    }
    return null;
  } else if (part.type === 'practice' && part.exercises) {
    const stats = Object.keys(part.exercises).reduce((memo, key) => {
      if (progress && progress[key] && progress[key].testResults) {
        if (progress[key].testResults.failures) {
          return { ...memo, incomplete: memo.incomplete + 1 };
        }
        return { ...memo, complete: memo.complete + 1 };
      }
      return { ...memo, pending: memo.pending + 1 };
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
    <ListItemText
      classes={{
        text: (props.progress || {}).openedAt ? props.classes.read : props.classes.unread,
      }}
      primary={`${props.order}. ${props.part.title}`}
    />
    <ListItemSecondaryAction>
      <IconButton disabled>
        {progressToIcon(props.part, props.progress)}
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);


UnitNavItem.propTypes = {
  partid: PropTypes.string.isRequired,
  part: PropTypes.shape({
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  progress: PropTypes.shape({}),
  classes: PropTypes.shape({
    active: PropTypes.string.isRequired,
    read: PropTypes.string.isRequired,
    unread: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      partid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  order: PropTypes.number.isRequired,
};


UnitNavItem.defaultProps = {
  progress: undefined,
};


export default withStyles(styles)(UnitNavItem);
