import React from 'react';
import PropTypes from 'prop-types';
import ExerciseCard from './exercise-card';


const ExercisesList = props => (
  <div>
    {Object.keys(props.exercises).sort().map(key =>
      (<ExerciseCard
        key={key}
        id={key}
        exercise={props.exercises[key]}
        progress={props.progress[key]}
        match={props.match}
      />))}
  </div>
);


ExercisesList.propTypes = {
  exercises: PropTypes.shape({}).isRequired,
  progress: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
};


export default ExercisesList;
