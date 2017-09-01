'use strict';


import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';


const matchParamsToURL = ({ cohortid, courseid, unitid, partid }, id) =>
	`/cohorts/${cohortid}/courses/${courseid}/${unitid}/${partid}/${id}`;


const ExerciseCard = props => (
	<Card>
	  <CardHeader
		  avatar={<Avatar aria-label="Exercise">JS</Avatar>}
			title={<Link to={matchParamsToURL(props.match.params, props.id)}>
			  {props.exercise.title}
			</Link>}
			subheader="September 14, 2016"
		/>
	</Card>
);


ExerciseCard.propTypes = {
	id: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
	exercise: PropTypes.object.isRequired,
};


export default ExerciseCard;
