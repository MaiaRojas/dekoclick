'use strict';


self.importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/mocha/3.5.0/mocha.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/chai/4.1.2/chai.min.js'
);


mocha.setup({
  ui: 'bdd',
  reporter: MyReporter,
});


function MyReporter(runner) {
  Mocha.reporters.Base.call(this, runner);

  // runner.on('start', console.log.bind(null, 'start'));
  // runner.on('end', console.log.bind(null, 'end'));
  // runner.on('suite', console.log.bind(null, 'suite'));
  // runner.on('suite end', console.log.bind(null, 'suite end'));
  // runner.on('test', console.log.bind(null, 'test'));
  // runner.on('test end', console.log.bind(null, 'test end'));
  // runner.on('hook', console.log.bind(null, 'hook'));
  // runner.on('hook end', console.log.bind(null, 'hook end'));
  // runner.on('pass', console.log.bind(null, 'pass'));
  // runner.on('fail', console.log.bind(null, 'fail'));
  // runner.on('pending', console.log.bind(null, 'pending'));

  var passes = 0;
  var failures = 0;

  runner.on('pass', function(test){
    passes++;
    console.log('pass: %s', test.fullTitle());
  });

  runner.on('fail', function(test, err){
    failures++;
    console.log('fail: %s -- error: %s', test.fullTitle(), err.message);
  });

  runner.on('end', function(){
    console.log('end: %d/%d', passes, passes + failures);
    process.exit(failures);
  });
}


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


onmessage = e => {
  const Submission = wrapSubmission(e.data.code);

  loadTests(e.data.tests, Submission);

  const runResults = mocha.run(failures => {
    //console.log('run failures', failures);
  });

  runResults.on('suite', (suite) => {
    console.log('DAA SUITEE', suite);
  })

  runResults.on('end', () => {
    console.log(`${runResults.failures} out of ${runResults.total} failures.`);
    // postMessage({ results });
    //close();
  });
};
