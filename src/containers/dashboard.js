'use strict';


import React from 'react';
import { connect } from 'react-redux';
import { fetchGroups, fetchCourses } from '../actions';
import GroupsList from '../components/groups-list';
import CoursesList from '../components/courses-list';


class Dashboard extends React.Component {

  componentWillMount() {

    document.title = 'Dashboard';
    this.props.fetchGroups();
    this.props.fetchCourses();
  }

  render() {

    const groups = this.props.groups;
    const courses = this.props.courses;

    const goToCourse = (course) => {

      alert('go to course!');
      //this.props.router.push('/courses/' + encodeURIComponent(course._id));
    };

    const goToGroup = (group) => {

      //this.props.router.push('/groups/' + encodeURIComponent(group._id));
    };

    if (!groups.hasLoaded || !courses.hasLoaded) {
      return null;
    }

    return (
      <div>
        <h2>Cursos</h2>
        <CoursesList courses={courses.courses} goToCourse={goToCourse} />
        {/*<h2>Grupos matriculados</h2>*/}
        {/*<GroupsList groups={groups.groups} goToGroup={goToGroup} />*/}
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
