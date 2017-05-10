'use strict';


import React from 'react';
import { Link } from 'react-router-dom';


const CourseCard = (props) => {

  const { course, redirect } = props;

  const style = {
    card: {
      flex: 1
    },
    header: {},
    infoList: {
      listStyle: 'none'
    },
    infoListItem: {
      paddingBottom: '8px'
    },
    body: {}
  };

  return (
    <div className="card" style={style.card}>
      <div className="card-header" style={style.header}>
        <h3 className="card-title">{course.title}</h3>
        <ul style={style.infoList}>
          <li style={style.infoListItem}>
            Duración: {course.duration}
          </li>
          <li style={style.infoListItem}>
            Track: <span className="chip">{course.track}</span>
          </li>
          {course.dependencies && <li style={style.infoListItem}>
            Requisitos: {course.dependencies.map(dep =>
              <span key={dep} className="chip">{dep}</span>
            )}
          </li>}
        </ul>
      </div>
      <div className="card-body" style={style.body}>
        <p>{course.description}</p>
        <Link to={`/courses/${course._id}`}>
          Ver más
        </Link>
      </div>
    </div>
  );
}


const CoursesList = (props) => {

  return (
    <div className="card-grid">
      {props.courses.map(course =>
        <CourseCard key={course._id} course={course} />
      )}
    </div>
  );
};


export default CoursesList;
