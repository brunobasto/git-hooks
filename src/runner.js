'use strict';

var TaskManager = require('./manager/task_manager.js');

TaskManager.setRepoPath('/Users/brunobasto/Projects/liferay-portal');

TaskManager.add({
  name: 'Source Formatter',
  task: {
    cmd: 'ant',
    args: ['format-source'],
    cwd: '/portal-impl'
  }
});

TaskManager.add({
  name: 'JS Formatter',
  task: {
    cmd: 'ant',
    args: ['format-js'],
    cwd: '/portal-web'
  }
});

TaskManager.run(function(errors) {
  console.log(errors);
});
