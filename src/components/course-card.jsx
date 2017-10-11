import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import FolderIcon from 'material-ui-icons/FolderOpen';
import ScheduleIcon from 'material-ui-icons/Schedule';


const styles = {
  card: {
    marginBottom: 32,
  },
  cardActions: {
    justifyContent: 'space-between',
  },
  count: {
    display: 'flex',
    alignItems: 'center',
  },
  countText: {
    display: 'inline-block',
    marginLeft: 6,
  },
};


const CourseCard = props => (
  <Card className={props.classes.card}>
    <CardContent>
      <Typography type="subheading" component="h3">
        {props.course.title}
      </Typography>
    </CardContent>
    <CardActions className={props.classes.cardActions}>
      <div className={props.classes.count}>
        <FolderIcon />
        <Typography className={props.classes.countText}>
          {Object.keys(props.course.syllabus).length} unidades
        </Typography>
      </div>
      <div className={props.classes.count}>
        <ScheduleIcon />
        <Typography className={props.classes.countText}>
          Duración estimada: {props.courseStats.duration}
        </Typography>
      </div>
      <Button
        raised
        dense
        color="primary"
        to={`/cohorts/${props.cohort}/courses/${props.id}`}
        component={Link}
      >
        Empezar
      </Button>
    </CardActions>
  </Card>
);


CourseCard.propTypes = {
  course: PropTypes.shape({
    title: PropTypes.string.isRequired,
    syllabus: PropTypes.shape({}).isRequired,
  }).isRequired,
  courseStats: PropTypes.shape({
    duration: PropTypes.number.isRequired,
  }).isRequired,
  cohort: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    cardActions: PropTypes.string.isRequired,
    count: PropTypes.string.isRequired,
    countText: PropTypes.string.isRequired,
  }).isRequired,
};


export default withStyles(styles)(CourseCard);
