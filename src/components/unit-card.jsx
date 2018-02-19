import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Hidden from 'material-ui/Hidden';
import FolderIcon from 'material-ui-icons/FolderOpen';
import ScheduleIcon from 'material-ui-icons/Schedule';
import { FormattedMessage } from 'react-intl';
import Progress from './progress';


const styles = theme => ({
  card: {
    marginBottom: theme.spacing.unit * 4,
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


const UnitCard = props => (
  <Card className={props.classes.card}>
    <CardContent>
      <Typography variant="title">
        <FormattedMessage id="unit-card.unit" /> {props.idx + 1}: {props.unit.title}
      </Typography>
      <Typography
        paragraph
        component="p"
        dangerouslySetInnerHTML={{ __html: props.unit.description }}
      />
    </CardContent>
    <CardActions className={props.classes.cardActions}>
      {props.unit.stats && props.unit.stats.partCount && (
        <div className={props.classes.count}>
          <FolderIcon />
          <Typography className={props.classes.countText}>
            <FormattedMessage
              id="unit-card.parts"
              values={{ count: props.unit.stats.partCount }}
            />
          </Typography>
        </div>
      )}
      {props.unit.stats && props.unit.stats.durationString &&
        <div className={props.classes.count}>
          <ScheduleIcon />
          <Typography className={props.classes.countText}>
            <Hidden smDown><FormattedMessage id="unit-card.estimatedDuration" />: </Hidden>
            {props.unit.stats.durationString}
          </Typography>
        </div>
      }
      <Button
        size="small"
        variant="raised"
        color="primary"
        to={`/cohorts/${props.cohort}/courses/${props.course}/${props.id}`}
        component={Link}
      >
        <FormattedMessage id={`unit-card.${props.progress ? 'continue' : 'start'}`} />
      </Button>
      <Progress value={(props.progressStats || {}).percent || 0} />
    </CardActions>
  </Card>
);


UnitCard.propTypes = {
  idx: PropTypes.number.isRequired,
  unit: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    stats: PropTypes.shape({
      durationString: PropTypes.string.isRequired,
      partCount: PropTypes.number.isRequired,
    }),
  }).isRequired,
  progressStats: PropTypes.shape({}),
  cohort: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    cardActions: PropTypes.string.isRequired,
    count: PropTypes.string.isRequired,
    countText: PropTypes.string.isRequired,
  }).isRequired,
};


UnitCard.defaultProps = {
  progressStats: undefined,
};


export default withStyles(styles)(UnitCard);
