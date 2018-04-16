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
import { FormattedMessage } from 'react-intl';
import Progress from './progress';


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
    height: 120,
  },
  count: {
    display: 'flex',
    alignItems: 'center',
  },
  countText: {
    display: 'inline-block',
    marginLeft: 6,
  },
  cardContent: {
    backgroundColor: theme.palette.primary.main,
    minHeight: '60px',
  },
});


const CourseCard = props => (
  <Card className={props.classes.card}>
    <CardContent className={props.classes.cardContent}>
      <Typography variant="title">
        {props.course.title}
      </Typography>
    </CardContent>
    <Progress value={props.progress && props.progress.percent ? props.progress.percent : 0} />
    <CardActions className={props.classes.cardActions}>
      {props.course.stats && props.course.stats.unitCount && (
        <div className={props.classes.count}>
          <FolderIcon />
          <Typography className={props.classes.countText}>
            <FormattedMessage
              id="course-card.units"
              values={{ count: props.course.stats.unitCount }}
            />
          </Typography>
        </div>
      )}
      {props.course.stats && props.course.stats.durationString &&
        <div className={props.classes.count}>
          <ScheduleIcon />
          <Typography className={props.classes.countText}>
            <Hidden smDown><FormattedMessage id="course-card.estimatedDuration" />: </Hidden>
            {props.course.stats.durationString}
          </Typography>
        </div>
      }
      <Button
        variant="raised"
        size="small"
        color="primary"
        to={`/cohorts/${props.cohort}/courses/${props.course.id}`}
        component={Link}
      >
        <FormattedMessage id={`course-card.${props.progress ? 'continue' : 'start'}`} />
      </Button>
    </CardActions>
  </Card>
);


CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    stats: PropTypes.shape({
      durationString: PropTypes.string.isRequired,
      unitCount: PropTypes.number.isRequired,
    }),
  }).isRequired,
  cohort: PropTypes.string.isRequired,
  progress: PropTypes.shape({
    percent: PropTypes.number.isRequired,
  }),
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    cardActions: PropTypes.string.isRequired,
    count: PropTypes.string.isRequired,
    countText: PropTypes.string.isRequired,
    cardContent: PropTypes.string.isRequired,
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
    progress: firestore.data[`cohorts/${cohort}/users/${auth.uid}/progress`]
      ? firestore.data[`cohorts/${cohort}/users/${auth.uid}/progress`][course.id]
      : undefined,
  })),
  withStyles(styles),
)(CourseCard);
