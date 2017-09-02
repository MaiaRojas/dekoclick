'use strict';


self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/mocha/3.5.0/mocha.min.js');


const internals = {};


internals.createFn = str => {
  return new Function([
    'var module = { exports: {} };',
    str + ';;',
    'var args = Array.prototype.slice.call(arguments, 0);',
    'return module.exports.apply(null, args);'
  ].join('\n'));
};


onmessage = e => {
  Object.keys(e.data.tests).forEach(test => {
    console.log(e.data.tests[test]);
  });

  //const fn = internals.createFn(e.data.code);
  //console.log(fn.toString());
  // const results = e.data.problem.testCases.map(testCase => {
  //   const returnValue = fn.apply(null, testCase[0]);
  //   return {
  //     returnValue,
  //     passed: returnValue === testCase[1]
  //   };
  // });
  //
  // postMessage({ results });
  close();
};
