'use strict';


import React from 'react';
import { Link } from 'react-router-dom';
import Card, { CardActions, CardContent } from 'material-ui/Card';


const ExerciseCard = props => {
	const { cohortid, courseid, unitid, partid } = props.match.params;
	return (
		<Card>
		  <CardContent>
			  <Link to={`/cohorts/${cohortid}/courses/${courseid}/${unitid}/${partid}/${props.id}`}>
				  {props.exercise.title}
				</Link>
			</CardContent>
		</Card>
	);
};


export default ExerciseCard;
