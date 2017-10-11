import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Card, { CardActions, CardContent } from 'material-ui/Card';
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


const UnitCard = props => (
  <Card className={props.classes.card}>
    <CardContent>
      <Typography type="subheading" component="h3">
        Unidad {props.idx + 1}: {props.unit.title}
      </Typography>
      <Typography
        paragraph
        component="p"
        dangerouslySetInnerHTML={{ __html: props.unit.description }}
      />
    </CardContent>
    <CardActions className={props.classes.cardActions}>
      <div className={props.classes.count}>
        <FolderIcon />
        <Typography className={props.classes.countText}>
          {Object.keys(props.unit.parts || {}).length} partes
        </Typography>
      </div>
      {props.stats && <div className={props.classes.count}>
        <ScheduleIcon />
        <Typography className={props.classes.countText}>
          Duración estimada: {props.stats}
        </Typography>
      </div>}
      <Button
        dense
        raised
        color="primary"
        to={`/cohorts/${props.cohort}/courses/${props.course}/${props.id}`}
        component={Link}
      >
        {props.progress ? 'Continuar' : 'Empezar'}
      </Button>
    </CardActions>
  </Card>
);


UnitCard.propTypes = {
  idx: PropTypes.number.isRequired,
  unit: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    parts: PropTypes.shape({}).isRequired,
  }).isRequired,
  progress: PropTypes.shape({}),
  stats: PropTypes.shape({}).isRequired,
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
  progress: undefined,
};


export default withStyles(styles)(UnitCard);
