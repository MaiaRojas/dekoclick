'use strict';


import React from 'react';


const CourseCard = (props) => {

  const goToCourse = props.goToCourse.bind(null, props.course);

  return (
    <div className="card">
      <div className="card-title">{props.course.title}</div>
      <div className="card-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Mauris sagittis pellentesque lacus eleifend lacinia...
      </div>
      <div className="card-actions">
        <button onClick={goToCourse}>Ver curso</button>
      </div>
    </div>
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
