'use strict';


import React from 'react';
import { connect } from 'react-redux';
import Remarkable from 'remarkable';
import CodeMirror from 'react-codemirror';
import JSMode from 'codemirror/mode/javascript/javascript';
import { setTitle, fetchProblems, updateProblemResults, updateProblemCode } from '../actions';


const Editor = (props) => {

  var options = {
    mode: 'javascript',
    theme: 'default',
    indentUnit: 2,
    tabSize: 2,
    indentWithTabs: false,
    lineNumbers: true
  };

  return (
    <CodeMirror
      value={props.code}
      onChange={props.update}
      options={options}
    />
  );
};


const TestCase = (props) => {

  const testCase = props.testCase;
  const result = props.result || {};
  let returnValue;

  if (typeof result.returnValue === 'undefined') {
    returnValue = 'undefined';
  }
  else if (typeof result.returnValue === 'string') {
    returnValue = result.returnValue;
  }
  else {
    returnValue = JSON.stringify(result.returnValue, null, 2);
  }

  let statusIconName = 'schedule';
  let statusIconStyle = {};

  if (result.hasOwnProperty('passed')) { // tests pending
    if (result.passed === true) {
      statusIconName = 'check_circle';
      statusIconStyle = {color: 'green'};
    }
    else {
      statusIconName = 'error';
      statusIconStyle = {color: 'red'};
    }
  }

  return (
    <li>
      <Icon name={statusIconName} style={statusIconStyle} />
      <div>Input: <code>{testCase[0]}</code></div>
      <div>Expected Output: <pre>{testCase[1]}</pre></div>
      <div>Actual Output: <pre>{returnValue}</pre></div>
    </li>
  );
};


const TestCases = (props) => {

  return (
    <div>
      <h2>Test cases</h2>
      <ol>
        {props.testCases.map((testCase, i) => (
          <TestCase key={i} testCase={testCase} result={props.results[i]} />
        ))}
      </ol>
    </div>
  );
};


class Problem extends React.Component {

  constructor(props) {

    super(props);
    this.updateCode = this.updateCode.bind(this);
    this.runCode = this.runCode.bind(this);
  }

  componentWillMount() {

    this.props.fetchProblems();
    this.props.setTitle('Problema: ' + this.props.params.problemid);
  }

  processDescription(problem) {

    var md = new Remarkable();
    return { __html: md.render(problem.description) };
  }

  updateCode(code) {

    this.props.updateProblemCode(code);
  }

  runCode(problem) {

    var worker = new Worker('/worker.js');

    worker.onmessage = (e) => {

      this.props.updateProblemResults(e.data.results);
      worker.terminate();
    };

    worker.postMessage({
      code: this.props.code || this.buildSnippet(problem),
      problem: problem
    });
  }

  buildSnippet(problem) {

    const args = problem.arguments.reduce((memo, arg) => {

      if (memo) {
        memo += ', ';
      }

      return memo += arg.name;
    }, '');

    return 'function main(' + args + ') {\n  \n}';
  }

  render() {

    if (!this.props.hasLoaded) {
      return null;
    }

    const problem = this.props.problems
      .filter(problem => problem._id === this.props.params.problemid)
      .shift();

    const description = this.processDescription(problem);
    const code = this.props.code || this.buildSnippet(problem);

    return (
      <Grid>
        <Cell col={12}>
          <FABButton style={{float: 'right'}}>
            <Icon name="mode_edit" />
          </FABButton>
          <h1>{problem.name}</h1>
          <div
            className="description"
            dangerouslySetInnerHTML={description}
          />
        </Cell>
        <Cell col={6}>
          <h2>Implementation</h2>
          <Editor update={this.updateCode} code={code} />
          <FABButton>
            <Icon name="save" />
          </FABButton>
          <FABButton onClick={this.runCode.bind(null, problem)}>
            <Icon name="play_arrow" />
          </FABButton>
        </Cell>
        <Cell col={6}>
          <TestCases testCases={problem.testCases} results={this.props.results} />
        </Cell>
      </Grid>
    );
  }
}


const mapStateToProps = (state, ownProps) => ({
  hasLoaded: state.problems.hasLoaded,
  isLoading: state.problems.isLoading,
  problems: state.problems.problems,
  code: state.problems.code,
  results: state.problems.results
});


const mapDispatchToProps = {
  setTitle,
  fetchProblems,
  updateProblemResults,
  updateProblemCode
};


export default connect(mapStateToProps, mapDispatchToProps)(Problem);
