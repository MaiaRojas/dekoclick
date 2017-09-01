'use strict';


import React from 'react';
import PropTypes from 'prop-types';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/github';


const idToFilename = id => `${id.replace(/\d{2}\-/, '')}.js`;


const getBoilerplate = (files, id) =>
  (files.boilerplate && files.boilerplate[idToFilename(id)]) || '';


const Exercise = ({ id, exercise }) => console.log(exercise) || (
	<div>
	  <h2>{exercise.title}</h2>
		<div dangerouslySetInnerHTML={{ __html: exercise.body }} />
		<AceEditor
      name={id}
      mode="javascript"
      theme="github"
      readOnly={true}
      editorProps={{}}
      value={getBoilerplate(exercise.files, id)}
      onChange={() => console.log('code chaned!')}
    />
	</div>
);


Exercise.propTypes = {
  id: PropTypes.string.isRequired,
  exercise: PropTypes.object.isRequired,
};


export default Exercise;
