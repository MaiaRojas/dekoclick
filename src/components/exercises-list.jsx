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
        progress={props.progress.find(item => item.exerciseid === key)}
        match={props.match}
      />))}
  </div>
);


ExercisesList.propTypes = {
  exercises: PropTypes.shape({}).isRequired,
  progress: PropTypes.arrayOf(PropTypes.shape({})),
  match: PropTypes.shape({}).isRequired,
};


ExercisesList.defaultProps = {
  progress: undefined,
};


export default ExercisesList;
