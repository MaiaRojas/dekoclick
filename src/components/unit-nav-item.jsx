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


const styles = theme => ({
  active: {
    backgroundColor: theme.palette.primary[500],
  },
  read: {
    fontWeight: 300,
  },
  unread: {
    fontWeight: 700,
  },
});


const partTypeToIcon = (type) => {
  if (type === 'quiz') {
    return <PollIcon />;
  }
  if (type === 'seminar') {
    return <SchoolIcon />;
  }
  if (type === 'practice') {
    return <CodeIcon />;
  }
  if (type === 'workshop') {
    return <BuildIcon />;
  }
  return <SubjectIcon />;
};


const progressToIcon = (part, partProgress, partProgressStats) => {
  if (partProgressStats && partProgressStats.completed === 1) {
    return <DoneIcon />;
  } else if (part.type === 'quiz' && partProgress && partProgress.startedAt && !partProgress.results) {
    return <TimerIcon />;
  } else if (part.type === 'practice' && part.exercises && partProgressStats && partProgressStats && partProgressStats.completed) {
    return <WarningIcon />;
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
        root: (props.partProgress || {}).openedAt ? props.classes.read : props.classes.unread,
      }}
      primary={`${props.order}. ${props.part.title}`}
    />
    <ListItemSecondaryAction>
      <IconButton disabled>
        {progressToIcon(props.part, props.partProgress, props.partProgressStats)}
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
  partProgress: PropTypes.shape({}),
  partProgressStats: PropTypes.shape({}),
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
  partProgress: undefined,
  partProgressStats: undefined,
};


export default withStyles(styles)(UnitNavItem);
