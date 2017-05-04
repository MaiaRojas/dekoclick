//
// Group page/container
//

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { setTitle, fetchTracks } from '../actions';


const LessonSummary = (props) => {

  return (
    <Card>
      <CardTitle>{props.lesson}</CardTitle>
      <CardText>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Mauris sagittis pellentesque lacus eleifend lacinia...
      </CardText>
      <CardActions border>
        <Button raised colored onClick={props.goToLesson.bind(null ,props.lesson)}>
          Ver lección
        </Button>
      </CardActions>
    </Card>
  );
};


const UnitSummary = (props) => {

  return (
    <div>
      <h3>{props.unit.name}</h3>
      {props.unit.lessons.map((lesson, i) =>
        <LessonSummary key={i} lesson={lesson} goToLesson={props.goToLesson} />
      )}
    </div>
  );
};

const ModuleSummary = (props) => {

  return (
    <div>
      <h2>{props.mod.name}</h2>
      {props.mod.units.map((unit, i) =>
        <UnitSummary key={i} unit={unit} goToLesson={props.goToLesson} />
      )}
    </div>
  );
};


const TrackSummary = (props) => {

  return (
    <div>
      {props.track.modules.map((mod, i) =>
        <ModuleSummary key={i} mod={mod} goToLesson={props.goToLesson} />
      )}
    </div>
  );
};


class Group extends React.Component {

  componentWillMount() {

    this.props.setTitle('Grupo: ' + this.props.params.groupid);
    this.props.fetchTracks();
  }

  goToLesson(id) {

    const groupid = encodeURIComponent(this.props.params.groupid);
    const lessonid = encodeURIComponent(id);
    this.props.router.push('/groups/' + groupid + '/lessons/' + lessonid);
  }

  render() {

    if (!this.props.hasLoaded) {
      return null;
    }

    const parts = this.props.params.groupid.split('/');
    const track = this.props.tracks.filter(track => track._id === parts[1]).shift();

    return (
      <TrackSummary
        group={this.props.params.groupid}
        track={track}
        goToLesson={this.goToLesson.bind(this)}
      />
    );
  }
}


const mapStateToProps = (state, ownProps) => ({
  hasLoaded: state.tracks.hasLoaded,
  tracks: state.tracks.tracks
});


const mapDispatchToProps = {
  setTitle,
  fetchTracks
};


export default connect(mapStateToProps, mapDispatchToProps)(Group);
