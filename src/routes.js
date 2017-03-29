'use strict';


import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/app';
import Dashboard from './containers/dashboard';
import Group from './containers/group';
import Lesson from './containers/lesson';
import Problem from './containers/problem';


export default <Route path="/" component={App}>
  <IndexRoute component={Dashboard} />
  <Route path="/groups/:groupid" component={Group} />
  <Route path="/groups/:groupid/lessons/:lessonid" component={Lesson} />
  <Route path="/groups/:groupid/lessons/:lessonid/problems/:problemid" component={Problem} />
</Route>
