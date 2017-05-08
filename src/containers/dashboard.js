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
    this.props.fetchGroups();
    this.props.fetchCourses();
    this.goToCourse = this.goToCourse.bind(this);
    this.state = { redirect: false };
  }

  goToCourse(course) {

    this.setState((prevState, props) => ({
      redirect: '/courses/' + encodeURIComponent(course._id)
    }))
  }

  goToGroup(group) {

    this.setState((prevState, props) => ({
      redirect: '/groups/' + encodeURIComponent(group._id)
    }))
  }

  render() {

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    const { courses, groups } = this.props;

    if (!courses.hasLoaded || !groups.hasLoaded) {
      return null;
    }

    return (
      <div>
        <h2>Cursos</h2>
        <CoursesList courses={courses.courses} goToCourse={this.goToCourse} />
        {/*<h2>Grupos matriculados</h2>*/}
        {/*<GroupsList groups={groups.groups} goToGroup={this.goToGroup} />*/}
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
