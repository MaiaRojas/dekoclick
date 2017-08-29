'use strict';


import React from 'react';
import { Link } from 'react-router-dom';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';


const CourseCard = props => (
  <Card>
    <CardContent>
      <Typography type="headline" component="h2">
        {props.course.title}
      </Typography>
    </CardContent>
    <CardActions>
      <Button
        dense
        to={`/cohorts/${props.cohort}/courses/${props.id}`}
        component={Link}
      >
        Empezar
      </Button>
    </CardActions>
  </Card>
);


export default CourseCard;
