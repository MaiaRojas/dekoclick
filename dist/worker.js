'use strict';


self.importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/mocha/3.5.0/mocha.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/chai/4.1.2/chai.min.js'
);


mocha.setup({
  ui: 'bdd',
  reporter: function UnReporter(runner) {
    Mocha.reporters.Base.call(this, runner);
  },
});


const wrapSubmission = str => (new Function([
  'var module = { exports: {} };',
  str + ';;',
  'var args = Array.prototype.slice.call(arguments, 0);',
  'return module.exports.apply(null, args);'
].join('\n')));


const wrapTests = str => (new Function('requires', [
  'var require = name => requires[name];',
  'var expect = chai.expect;',
  str + ';;'
].join('\n')));


const loadTests = (tests, Submission) => Object.keys(tests).forEach(key => {
  wrapTests(tests[key])({
    chai,
    '../solution/discount': Submission
  });
});


const testToJSON = test => ({
  title: test.title,
  fullTitle: test.fullTitle(),
  async: test.async,
  duration: test.duration,
  pending: test.pending,
  speed: test.speed,
  state: test.state,
  sync: test.sync,
  timedOut: test.timedOut,
});


const suiteToJSON = suite => ({
  title: suite.title,
  fullTitle: suite.fullTitle(),
  delayed: suite.delayed,
  pending: suite.pending,
  root: suite.root,
  suites: suite.suites.map(suiteToJSON),
  tests: suite.tests.map(testToJSON),
});


onmessage = e => {
  loadTests(e.data.tests, wrapSubmission(e.data.code));

  const runResults = mocha.run();

  runResults.on('end', () => {
    const { failures, stats, total, suite } = runResults;
    self.postMessage({ failures, stats, total, suite: suiteToJSON(suite) });
    //close();
  });
};
