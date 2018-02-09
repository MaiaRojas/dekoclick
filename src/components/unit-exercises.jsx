import React from 'react';
import PropTypes from 'prop-types';
import ExercisesList from './exercises-list';
import Exercise from './exercise';


const decodeFilenameKeys = obj => Object.keys(obj || {}).reduce((memo, key) => {
  const decodedKey = Buffer.from(key, 'base64').toString('ascii');

  if (typeof obj[key] === 'string') {
    return Object.assign(memo, { [decodedKey]: obj[key] });
  }

  return Object.assign(memo, { [decodedKey]: decodeFilenameKeys(obj[key]) });
}, {});


const parseExercises = objs =>
  Object.keys(objs || {}).reduce((memo, key) => Object.assign(memo, {
    [key]: Object.assign({}, objs[key], {
      files: decodeFilenameKeys(objs[key].files),
    }),
  }), {});


const UnitExercises = ({
  part,
  progress,
  match,
  auth,
}) => {
  const id = match.params.exerciseid;
  const exercises = parseExercises(part.exercises);

  if (!id) {
    return (
      <ExercisesList
        exercises={exercises}
        progress={progress}
        match={match}
      />
    );
  }

  return (
    <Exercise
      id={id}
      exercise={exercises[id] || {}}
      progress={progress[id]}
      match={match}
      auth={auth}
    />
  );
};


UnitExercises.propTypes = {
  auth: PropTypes.shape({}).isRequired,
  part: PropTypes.shape({
    exercises: PropTypes.shape({}).isRequired,
  }).isRequired,
  progress: PropTypes.shape({}),
  match: PropTypes.shape({
    params: PropTypes.shape({
      exerciseid: PropTypes.string,
    }).isRequired,
  }).isRequired,
};


UnitExercises.defaultProps = {
  progress: undefined,
};


export default UnitExercises;
