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


const Exercise = props => (
	<div>
	  <h2>{props.exercise.title}</h2>
		<div dangerouslySetInnerHTML={{ __html: props.exercise.description }} />
		<AceEditor
      name={props.id}
      mode="javascript"
      theme="github"
      readOnly={true}
      editorProps={{}}
      value={getBoilerplate(props.exercise.files, props.id)}
      onChange={() => console.log('code chaned!')}
    />
	</div>
);


Exercise.propTypes = {
  exercise: PropTypes.object,
};


export default Exercise;
