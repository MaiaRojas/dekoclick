'use strict';


import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';


const styles = theme => ({
  card: {
    marginBottom: 16
  },
});


const CourseCard = props => (
  <Card className={props.classes.card}>
    <CardContent>
      <Typography type="subheading" component="h3">
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


export default withStyles(styles)(CourseCard);
