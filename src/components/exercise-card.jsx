import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card, { CardHeader } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';


const matchParamsToURL = ({ cohortid, courseid, unitid, partid }, id) =>
  `/cohorts/${cohortid}/courses/${courseid}/${unitid}/${partid}/${id}`;


const progressToString = (progress) => {
  if (!progress.testResults) {
    return 'Pendiente';
  } else if (progress.testResults.failures === 0) {
    return 'Completado';
  } else if (progress.testResults.failures > 0) {
    return 'Incompleto';
  }
  return '';
};


const ExerciseCard = props => (
  <Card>
    <CardHeader
      avatar={<Avatar aria-label="Exercise">JS</Avatar>}
      title={<Link to={matchParamsToURL(props.match.params, props.id)}>
        {props.exercise.title}
      </Link>}
      subheader={progressToString(props.progress)}
    />
  </Card>
);


ExerciseCard.propTypes = {
  id: PropTypes.string.isRequired,
  exercise: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  progress: PropTypes.shape({
    testResults: PropTypes.shape({
      failures: PropTypes.number,
    }),
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      cohortid: PropTypes.string.isRequired,
      courseid: PropTypes.string.isRequired,
      unitid: PropTypes.string.isRequired,
      partid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};


ExerciseCard.defaultProps = {
  progress: {},
};


export default ExerciseCard;
