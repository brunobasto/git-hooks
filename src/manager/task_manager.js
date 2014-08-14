'use strict';

var LogUtil = require('../util/log_util.js');
var NotificationUtil = require('../util/notification_util.js');
var nexpect = require('nexpect');
var Promise = require('promise');
var ModuleRegistry = require('../registry/registry.js');

var registry = ModuleRegistry.getSingleton();

var repoPath = '.';

function runTasks(callback) {
  var onTaskComplete = function(resolve, reject, err, output, exitCode) {
    if (err) {
      reject(err);
    }
    else {
      resolve(output);
    }

    NotificationUtil.showMessage(this.name, 'Task completed.');
  };

  registry.register({
    name: 'Git Status',
    task: {
      cmd: 'git',
      args: ['status'],
      cwd: ''
    }
  });

  var promises = [];

  registry.each(function(module) {
    promises.push(new Promise(function(resolve, reject) {
      NotificationUtil.showMessage(module.name, 'Task started.');

      nexpect.spawn(module.task.cmd, module.task.args, { cwd: repoPath + module.task.cwd })
      .run(onTaskComplete.bind(module, resolve, reject));
    }));
  });

  Promise.all(promises).then(function(res) {
    var gitOutput = res[0],
        errors = [];

    for (var i = 1; i < res.length; i++) {
      var output = LogUtil.processLog(gitOutput, res[i]);

      if (output && output.length) {
        errors.push(output);
      }
    }

    callback.apply(this, [errors]);

    process.exit(0);
  });
};

module.exports = {
  add: function(module) {
    registry.register(module);
  },
  setRepoPath: function(path) {
    repoPath = path;
  },
	run: function(callback) {
		runTasks(callback);
	}
};
