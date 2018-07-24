import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withStyles } from 'material-ui/styles';
import { withFirestore } from 'react-redux-firebase';
import {
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import FolderIcon from 'material-ui-icons/Folder';
import DeleteIcon from 'material-ui-icons/Delete';


const styles = theme => ({
  secondary: {
    color: theme.palette.text.primary,
  },
});

const ProjectCourse = ({
  projectid,
  courseid,
  course,
  history,
  firestore,
  classes,
}) => (
  <ListItem
    button
    onClick={() => {
      history.push(`/projects/${projectid}/courses/${courseid}`);
    }}
  >
    <ListItemAvatar>
      <Avatar>
        <FolderIcon />
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      classes={{ secondary: classes.secondary }}
      primary={course.title}
      secondary={course.stats.durationString}
    />
    <ListItemSecondaryAction>
      <IconButton
        aria-label="Delete"
        onClick={() =>
          window.confirm(`Estás segura de que quieres quitar el curso "${courseid}" del cohort "${cohortid}"?`) &&
            firestore.delete({
              collection: `cohorts/${cohortid}/courses`,
              doc: courseid,
            }).catch(console.error)
        }
      >
        <DeleteIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);


ProjectCourse.propTypes = {
  // cohortid: PropTypes.string.isRequired,
  // courseid: PropTypes.string.isRequired,
  // course: PropTypes.shape({
  //   title: PropTypes.string.isRequired,
  //   stats: PropTypes.shape({
  //     durationString: PropTypes.string.isRequired,
  //   }).isRequired,
  // }).isRequired,
  // history: PropTypes.shape({
  //   push: PropTypes.func.isRequired,
  // }).isRequired,
  // firestore: PropTypes.shape({
  //   delete: PropTypes.func.isRequired,
  // }).isRequired,
  // classes: PropTypes.shape({
  //   secondary: PropTypes.string.isRequired,
  // }).isRequired,
};


export default compose(
  withStyles(styles),
  withFirestore,
)(ProjectCourse);
