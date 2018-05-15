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
import UnitCardLock from './unit-card-lock';
import UnitCardAdmin from './unit-card-admin';


const styles = theme => ({
  card: {
    marginBottom: theme.spacing.unit * 4,
    boxShadow: theme.shadow,
  },
  cardContent: {
    position: 'relative',
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


const checkDependencies = (unitid, unitSettings, courseProgressStats) =>
  Object.keys(unitSettings.dependencies || {}).sort().reduce((memo, depPath) => {
    const [unitid, partid, formid] = depPath.split('/');
    const unitProgressStats = courseProgressStats.units[unitid] || { parts: {} };
    const partProgressStats = unitProgressStats.parts[partid] || {};
    const dep = unitSettings.dependencies[depPath] || {};
    const progress = (formid)
      ? (partProgressStats.forms || {})[formid]
      : partProgressStats;

    let ok = true;
    let completed = true;
    let score = true;

    if (dep.percent && (!progress || !progress.percent)) {
      ok = false;
      completed = false;
    }

    if (dep.completed && (!progress || !progress.completed)) {
      ok = false;
      completed = false;
    }

    if (dep.score) { // a specific minimum or maximum score is required!
      if (!progress || (dep.score.operator === '<' && dep.score.value < progress.score)) {
        ok = false;
        score = false;
      }
      if (!progress || (dep.score.operator === '>' && dep.score.value > progress.score)) {
        ok = false;
        score = false;
      }
    }

    return {
      ...memo,
      ok: memo.ok && ok,
      results: {
        ...memo.results,
        [depPath]: { dep, progress, ok },
      },
      completed: memo.completed && completed,
      score: memo.score && score,
    };
  }, {
    ok: true, results: {}, completed: true, score: true,
  });


const UnitCard = (props) => {
  const courseSettings = props.courseSettings || { units: {} };
  const unitSettings = courseSettings.units[props.unit.id] || {};
  const courseProgressStats = props.courseProgressStats || { units: {} };
  const unitProgressStats = courseProgressStats.units[props.unit.id];
  const depsCheck = checkDependencies(props.unit.id, unitSettings, courseProgressStats);

  return (
    <Card
      // to={`/cohorts/${props.cohort}/courses/${props.course}/${props.unit.id}`}
      // component={Link}
      // disabled={!depsCheck.ok}
      style={!depsCheck.ok ? { position: 'relative' } : {}}
      className={props.classes.card}>
      {!depsCheck.ok && (<UnitCardLock depsCheck={depsCheck} syllabus={props.syllabus} />)}
      <CardContent
        style={!depsCheck.ok ? { opacity: 0.2 } : {}}
        className={props.classes.cardContent}
      >
        {props.canManageCourse &&
          <UnitCardAdmin
            unit={props.unit}
            cohort={props.cohort}
            course={props.course}
            courseSettings={props.courseSettings}
            syllabus={props.syllabus}
            courseProgressStats={props.courseProgressStats}
            style={{position:'relative'}}
          />
        }
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
            {/* <FolderIcon /> */}
            <Typography className={props.classes.countText}>
              <FormattedMessage
                id="unit-card.parts"
                values={{ count: props.unit.stats.partCount }}
              />
            </Typography>
          </div>
        )}
        <div className={props.classes.count}>
          <Typography className={props.classes.countText}>
            |
          </Typography>
        </div>
        {props.unit.stats && props.unit.stats.durationString &&
          <div className={props.classes.count}>
            {/* <ScheduleIcon /> */}
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
          to={`/cohorts/${props.cohort}/courses/${props.course}/${props.unit.id}`}
          component={Link}
          disabled={!depsCheck.ok}
        >
          <FormattedMessage id={`unit-card.${unitProgressStats ? 'continue' : 'start'}`} />
        </Button>
        <Progress value={(unitProgressStats || {}).percent || 0} />
      </CardActions>
    </Card>
  );
};


UnitCard.propTypes = {
  idx: PropTypes.number.isRequired,
  unit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    stats: PropTypes.shape({
      durationString: PropTypes.string.isRequired,
      partCount: PropTypes.number.isRequired,
    }),
  }).isRequired,
  courseProgressStats: PropTypes.shape({}),
  cohort: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
  courseSettings: PropTypes.shape({}),
  canManageCourse: PropTypes.bool,
  syllabus: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    cardActions: PropTypes.string.isRequired,
    cardContent: PropTypes.string.isRequired,
    count: PropTypes.string.isRequired,
    countText: PropTypes.string.isRequired,
  }).isRequired,
};


UnitCard.defaultProps = {
  courseProgressStats: undefined,
  courseSettings: undefined,
  canManageCourse: false,
};


export default withStyles(styles)(UnitCard);
