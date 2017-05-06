'use strict';


import React from 'react';


const CourseCard = (props) => {

  const goToCourse = props.goToCourse.bind(null, props.course);

  const cardStyle = {
    flex: 1
  };

  const headerStyle = {};
  const bodyStyle = {};

  return (
    <div className="card" style={cardStyle}>
      <div className="card-header">
        <h3 className="card-title">{props.course.title}</h3>
      </div>
      <div className="card-body" onClick={goToCourse}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Mauris sagittis pellentesque lacus eleifend lacinia...
      </div>
    </div>
  );
}


const CoursesList = (props) => {

  return (
    <div className="card-grid">
      {props.courses.map(course =>
        <CourseCard key={course._id} course={course} goToCourse={props.goToCourse} />
      )}
    </div>
  );
};


export default CoursesList;
