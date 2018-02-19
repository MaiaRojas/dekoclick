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
  unitProgress,
  part,
  match,
  auth,
}) => {
  const id = match.params.exerciseid;
  const exercises = parseExercises(part.exercises);
  const exercisesProgress = unitProgress.filter(
    item => item.partid === part.id && item.type === 'exercise',
  );

  if (!id) {
    return (
      <ExercisesList
        exercises={exercises}
        progress={exercisesProgress}
        match={match}
      />
    );
  }

  return (
    <Exercise
      id={id}
      exercise={exercises[id] || {}}
      progress={exercisesProgress.find(item => item.exerciseid === id)}
      match={match}
      auth={auth}
    />
  );
};


UnitExercises.propTypes = {
  unitProgress: PropTypes.arrayOf(PropTypes.shape({})),
  auth: PropTypes.shape({}).isRequired,
  part: PropTypes.shape({
    exercises: PropTypes.shape({}).isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      exerciseid: PropTypes.string,
    }).isRequired,
  }).isRequired,
};


UnitExercises.defaultProps = {
  unitProgress: undefined,
};


export default UnitExercises;
