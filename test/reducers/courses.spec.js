'use strict';


import CoursesReducer from '../../src/reducers/courses';


describe('courses reducer', () => {

  it('should...', () => {

    expect(CoursesReducer(undefined, { type: 'foo' })).toEqual({
      hasLoaded: false,
      courses: []
    });
  });

});
