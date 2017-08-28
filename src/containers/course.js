//
// Group page/container
//

import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import { Link } from 'react-router-dom';


const Lesson = (props) => {

  return (
    <li>{props.lesson.title}</li>
  );
};


const Unit = props => {
  console.log(props);
  return null;

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


const Course = props => {
  if (!isLoaded(props.course)) {
    return (<div>Loading...</div>);
  }

  if (isEmpty(props.course)) {
    return (<div>No course :-(</div>);
  }

  return (
    <div className="main">
      <h1>Curso: {props.course.title}</h1>
      <h2>Syllabus</h2>
      <ul>
      {Object.keys(props.course.syllabus).map((key) =>
        <Unit key={key} id={key} unit={props.course.syllabus[key]} />
      )}
      </ul>
    </div>
  );
};


const mapStateToProps = ({ firebase }, { match }) => ({
  course: dataToJS(
    firebase,
    `cohortCourses/${match.params.cohortid}/${match.params.courseid}`
  )
});


const mapDispatchToProps = {};


export default connect(mapStateToProps, mapDispatchToProps)(Course);
