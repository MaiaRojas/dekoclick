'use strict';


const internals = {};


internals.createFn = str => {

  return new Function([
    str + ';;',
    'var args = Array.prototype.slice.call(arguments, 0);',
    'return main.apply(null, args);'
  ].join('\n'));
};


onmessage = e => {

  const fn = internals.createFn(e.data.code);
  const results = e.data.problem.testCases.map(testCase => {

    const returnValue = fn.apply(null, testCase[0]);

    return {
      returnValue,
      passed: returnValue === testCase[1]
    };
  });

  postMessage({ results });
  close();
};
