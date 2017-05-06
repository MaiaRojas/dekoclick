//
// Lesson page/container
//

import React from 'react';
import { connect } from 'react-redux';
import { fetchLessons } from '../actions';


const Problem = (props) => {

  return (
    <ListItem twoLine>
      <ListItemContent avatar="person" subtitle="Blah blah blah">
        <a href="#" onClick={props.goToProblem.bind(null, props.problem.id)}>
          {props.problem.id}
        </a>
      </ListItemContent>
      <ListItemAction>
        <a href="#"><Icon name="star" /></a>
      </ListItemAction>
    </ListItem>
  );
};


const ProblemsList = (props) => {

  return (
    <div>
    <List>
      {props.problems.map((problem, i) =>
        <Problem key={i} problem={problem} goToProblem={props.goToProblem} />
      )}
    </List>
    </div>
  );
};


class Lesson extends React.Component {

  componentWillMount() {

    document.title = 'Lección: ' + this.props.params.lessonid;
    this.props.fetchLessons();
  }

  goToProblem(id, e) {

    e.preventDefault();

    const pathname = [
      '/groups', encodeURIComponent(this.props.params.groupid),
      'lessons', encodeURIComponent(this.props.params.lessonid),
      'problems', encodeURIComponent(id)
    ].join('/');

    this.props.router.push(pathname);

    return false;
  }

  render() {

    if (!this.props.hasLoaded) {
      return null;
    }

    const lessons = this.props.lessons;
    const lessonid = this.props.params.lessonid;
    const lesson = lessons.filter(lesson => lesson._id === lessonid).shift();
    const goToProblem = this.goToProblem.bind(this);
    //console.log(lesson);

    return (
      <div>
        <h1>{lesson.name}</h1>
        <div>{lesson.description}</div>
        <ProblemsList problems={lesson.problems} goToProblem={goToProblem} />
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => ({
  hasLoaded: state.lessons.hasLoaded,
  lessons: state.lessons.lessons
});


const mapDispatchToProps = {
  fetchLessons
};


export default connect(mapStateToProps, mapDispatchToProps)(Lesson);
