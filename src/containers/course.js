//
// Group page/container
//

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCourses } from '../actions';


const Lesson = (props) => {

  return (
    <li>{props.lesson.title}</li>
  );
};


const Unit = (props) => {

  const lessons = props.unit.lessons || [];

  return (
    <li>
      <h4>{props.unit.title}</h4>
      <ul>
      {lessons.map((lesson, i) =>
        <Lesson key={i} lesson={lesson} />
      )}
      </ul>
    </li>
  );
};


const Course = (props) => {

  if (!props.courses.hasLoaded) {
    props.fetchCourses();
    return null;
  }

  const courseid = props.params.courseid;
  const courses = props.courses.courses;
  const course = courses.filter(course => course._id === courseid).shift();

  console.log(course);

  return (
    <div>
      <h1>Curso: {course.title}</h1>
      <h2>Unidades</h2>
      <ul>
      {course.units.map((unit, i) =>
        <Unit key={i} unit={unit} />
      )}
      </ul>
    </div>
  );
};


const mapStateToProps = (state, ownProps) => ({
  courses: state.courses
});


const mapDispatchToProps = {
  fetchCourses
};


export default connect(mapStateToProps, mapDispatchToProps)(Course);
