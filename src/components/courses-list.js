'use strict';


import React from 'react';


const CourseCard = (props) => {

  const { course } = props;
  const goToCourse = props.goToCourse.bind(null, course);

  const style = {
    card: {
      flex: 1
    },
    header: {

    },
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
          <li style={style.infoListItem}>Duración: {course.duration}</li>
          <li style={style.infoListItem}>Track: <span className="chip">{course.track}</span></li>
          {course.dependencies &&
            <li style={style.infoListItem}>
              Requisitos: {course.dependencies.map(dep =>
                <span key={dep} className="chip">{dep}</span>
              )}
            </li>
          }
        </ul>
      </div>
      <div className="card-body" onClick={goToCourse} style={style.body}>
        {course.description}
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
