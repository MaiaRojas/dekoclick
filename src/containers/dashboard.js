'use strict';


import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { fetchGroups, fetchCourses } from '../actions';
import GroupsList from '../components/groups-list';
import CoursesList from '../components/courses-list';


class Dashboard extends React.Component {

  componentWillMount() {

    document.title = 'Dashboard';
    //this.props.fetchGroups();
    this.props.fetchCourses();
  }

  render() {

    const { courses, groups } = this.props;

    if (!courses.hasLoaded/* || !groups.hasLoaded*/) {
      return null;
    }

    return (
      <div>
        <h2>Cursos</h2>
        <CoursesList courses={courses.courses} />
        {/*<h2>Grupos matriculados</h2>*/}
        {/*<GroupsList groups={groups.groups} />*/}
      </div>
    );
  }

}


const mapStateToProps = (state, ownProps) => ({
  userCtx: state.session.userCtx,
  groups: state.groups,
  courses: state.courses
});


const mapDispatchToProps = {
  fetchGroups,
  fetchCourses
};


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
