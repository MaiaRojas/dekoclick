import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import FolderIcon from 'material-ui-icons/FolderOpen';
import ScheduleIcon from 'material-ui-icons/Schedule';


const styles = theme => ({
  card: {
    marginBottom: theme.spacing.unit * 4,
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
});


const unitCount = ({ stats, syllabus }) =>
  (stats && stats.unitCount) || Object.keys(syllabus).length;


const CourseCard = props => (
  <Card className={props.classes.card}>
    <CardContent>
      <Typography type="title">
        {props.course.title}
      </Typography>
    </CardContent>
    <CardActions className={props.classes.cardActions}>
      <div className={props.classes.count}>
        <FolderIcon />
        <Typography className={props.classes.countText}>
          {unitCount(props.course)} unidades
        </Typography>
      </div>
      {props.course.stats && props.course.stats.durationString &&
        <div className={props.classes.count}>
          <ScheduleIcon />
          <Typography className={props.classes.countText}>
            Duración estimada: {props.course.stats.durationString}
          </Typography>
        </div>
      }
      <Button
        raised
        dense
        color="primary"
        to={`/cohorts/${props.cohort}/courses/${props.course.id}`}
        component={Link}
      >
        Empezar
      </Button>
    </CardActions>
  </Card>
);


CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    syllabus: PropTypes.shape({}).isRequired,
    stats: PropTypes.shape({
      durationString: PropTypes.string.isRequired,
    }),
  }).isRequired,
  cohort: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    cardActions: PropTypes.string.isRequired,
    count: PropTypes.string.isRequired,
    countText: PropTypes.string.isRequired,
  }).isRequired,
};


export default withStyles(styles)(CourseCard);
