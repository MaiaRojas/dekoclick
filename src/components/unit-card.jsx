import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';


const styles = {
  card: {
    marginBottom: 32,
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
    <CardActions>
      <Button
        dense
        to={`/cohorts/${props.cohort}/courses/${props.course}/${props.id}`}
        component={Link}
      >
        Empezar
      </Button>
    </CardActions>
  </Card>
);


UnitCard.propTypes = {
  idx: PropTypes.number.isRequired,
  unit: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  cohort: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
  }).isRequired,
};


export default withStyles(styles)(UnitCard);
