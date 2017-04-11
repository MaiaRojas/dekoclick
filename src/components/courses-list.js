import React from 'react';
import { Card, CardTitle, CardText, CardActions, CardMenu, Button, IconButton } from 'react-mdl';


const CourseCard = (props) => {

  const goToCourse = props.goToCourse.bind(null, props.course);

  return (
    <Card shadow={0}>
      <CardTitle>{props.course.title}</CardTitle>
      <CardText>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Mauris sagittis pellentesque lacus eleifend lacinia...
      </CardText>
      <CardActions border>
        <Button raised colored onClick={goToCourse}>Ver curso</Button>
      </CardActions>
    </Card>
  );
}

const CoursesList = (props) => {

  return (
    <div>
      {props.courses.map(course =>
        <CourseCard key={course._id} course={course} goToCourse={props.goToCourse} />
      )}
    </div>
  );
};


export default CoursesList;
