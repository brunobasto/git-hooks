var nexpect = require('nexpect');
var Notification = require('node-notifier');

var getFilePath = function(line) {
	var fileRegex = /[\w\-\_+\/]+(?:\.([^.]+))?$/;

	var filePath = fileRegex.exec(line);

	if (filePath && filePath.length) {
		return filePath[0];
	}
};

var notifier = new Notification();

var showMessage = function(title, message) {
	notifier.notify({
		group: title,
		message: message,
		subtitle: 'pre-commit hook',
		title: title
	});
};

var liferayPortalPath = '/Users/brunobasto/Projects/liferay-portal';

nexpect.spawn('git', ['status'], { cwd: liferayPortalPath })
.run(function (gitErr, gitStdOut, gitExitCode) {
	// portal-impl: ant format-source
	showMessage('Source Formatter', 'Running source formatter...');

	nexpect.spawn('ant', ['format-source'], { cwd: liferayPortalPath + '/portal-impl/' })
	.run(function (antErr, antStdOut, antExitCode) {
		if (antErr) {
			console.log(antErr);

			process.exit(1);
		}

		for (var i = 0; i < antStdOut.length; i++) {
			var antLine = antStdOut[i];

			var antFilePath = getFilePath(antLine);

			if (!antFilePath) {
				continue;
			}

			for (var j = 0; j < gitStdOut.length; j++) {
				var gitLine = gitStdOut[j];

				var gitFilePath = getFilePath(gitLine);

				if (!gitFilePath) {
					continue;
				}

				if (antFilePath.length && antFilePath.indexOf(gitFilePath) > -1) {
					showMessage('Source Formatter', antLine);

					break;
				}
			}
		}

		showMessage('Source Formatter', 'Done.');
	});

	// portal-web: ant format-js
	showMessage('JS Formatter', 'Running JavaScript formatter...');

	nexpect.spawn('ant', ['format-js'], { cwd: liferayPortalPath + '/portal-web/' })
	.run(function (antErr, antStdOut, antExitCode) {
		if (antErr) {
			console.log(antErr);

			process.exit(1);
		}

		for (var i = 0; i < antStdOut.length; i++) {
			var antLine = antStdOut[i];

			var antFilePath = getFilePath(antLine);

			if (!antFilePath) {
				continue;
			}

			for (var j = 0; j < gitStdOut.length; j++) {
				var gitLine = gitStdOut[j];

				var gitFilePath = getFilePath(gitLine);

				if (!gitFilePath) {
					continue;
				}

				if (antFilePath.length && antFilePath.indexOf(gitFilePath) > -1) {
					showMessage('JS Formatter', antLine);

					break;
				}
			}
		}

		showMessage('JS Formatter', 'Done.');
	});
});