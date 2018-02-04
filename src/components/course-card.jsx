import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Hidden from 'material-ui/Hidden';
import FolderIcon from 'material-ui-icons/FolderOpen';
import ScheduleIcon from 'material-ui-icons/Schedule';
import Progress from './progress';
import { computeCourseProgressStats } from '../util/progress';


const styles = theme => ({
  card: {
    width: '49%',
    marginBottom: theme.spacing.unit * 4,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  cardActions: {
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    height: 72,
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
            <Hidden smDown>Duración estimada: </Hidden>{props.course.stats.durationString}
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
        {props.progress ? 'Continuar' : 'Empezar'}
      </Button>
      <Progress value={computeCourseProgressStats(props.progress, props.course).percent} />
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
  progress: PropTypes.shape({}),
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    cardActions: PropTypes.string.isRequired,
    count: PropTypes.string.isRequired,
    countText: PropTypes.string.isRequired,
  }).isRequired,
};


CourseCard.defaultProps = {
  progress: undefined,
};


export default compose(
  firestoreConnect(props => [{
    collection: `cohorts/${props.cohort}/users/${props.auth.uid}/progress`,
    doc: props.course.id,
  }]),
  connect(({ firestore }, { cohort, auth, course }) => ({
    progress: (firestore.data[`cohorts/${cohort}/users/${auth.uid}/progress`] || {})[course.id],
  })),
  withStyles(styles),
)(CourseCard);
