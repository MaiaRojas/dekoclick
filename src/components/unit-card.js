'use strict';


import React from 'react';
import { Link } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';


const UnitCard = props => (
  <Card>
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


export default UnitCard;
