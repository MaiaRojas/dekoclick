'use strict';


import React from 'react';
import PropTypes from 'prop-types';
import ExercisesList from './exercises-list';
import Exercise from './exercise';


const decodeFilenameKeys = obj => Object.keys(obj).reduce((memo, key) => {
	const decodedKey = Buffer.from(key, 'base64').toString('ascii');

	if (typeof obj[key] === 'string') {
		memo[decodedKey] = obj[key];
	}
	else {
		memo[decodedKey] = decodeFilenameKeys(obj[key]);
	}

	return memo;
}, {});


const parseExercises = objs => Object.keys(objs || {}).reduce((memo, key) => {
	memo[key] = Object.assign({}, objs[key], {
		files: decodeFilenameKeys(objs[key].files)
	});
	return memo;
}, {});


const UnitExercises = ({ part, match }) => {
	const exerciseid = match.params.exerciseid;
	const exercises = parseExercises(part.exercises);

	if (exerciseid) {
		return <Exercise id={exerciseid} exercise={exercises[exerciseid]} />
	}

	return <ExercisesList exercises={exercises} match={match} />;
};


UnitExercises.propTypes = {
  part: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired
};


export default UnitExercises;