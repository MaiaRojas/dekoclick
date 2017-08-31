'use strict';


import React from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'react-codemirror';
import JSMode from 'codemirror/mode/javascript/javascript';


const Editor = props => (
  <CodeMirror
    value={props.code}
    onChange={props.update}
    options={{
      mode: 'javascript',
      theme: 'default',
      indentUnit: 2,
      tabSize: 2,
      indentWithTabs: false,
      lineNumbers: true
    }}
  />
);


Editor.propTypes = {
  code: PropTypes.string,
	update: PropTypes.func,
};


const idToFilename = id => `${id.replace(/\d{2}\-/, '')}.js`;


const getBoilerplate = (files, id) =>
  (files.boilerplate && files.boilerplate[idToFilename(id)]) || '';


const Exercise = props => (
	<div>
	  <h2>{props.exercise.title}</h2>
		<div dangerouslySetInnerHTML={{ __html: props.exercise.description }} />
		<Editor
      code={getBoilerplate(props.exercise.files, props.id)}
      update={() => console.log('code chaned!')}
    />
	</div>
);


Exercise.propTypes = {
  exercise: PropTypes.object,
};


export default Exercise;
