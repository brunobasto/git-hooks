'use strict';

var path = require('path');

module.exports = {
	extractLineInfo: function(line) {
		var match = /([\.\w\-\_+\/]+\.\w+)(\s(\d+))?/.exec(line),
			info = {};

		if (match && match.length) {
			info.file = path.normalize(match[1]);
			info.line = match[2];
		}

		return info;
	},

	processLog: function(changedFiles, processedFiles, callback) {
		var instance = this,
			output = [];

		for (var i = 0; i < processedFiles.length; i++) {
			var processedLine = processedFiles[i];

			var processedLineInfo = instance.extractLineInfo(processedLine);

			for (var j = 0; j < changedFiles.length; j++) {
				var changedLine = changedFiles[j];

				var changedLineInfo = instance.extractLineInfo(changedLine);

				if (processedLineInfo.file && changedLineInfo.file &&
					(processedLineInfo.file.indexOf(changedLineInfo.file) > -1 ||
					 changedLineInfo.file.indexOf(processedLineInfo.file) > -1)) {

					output.push(processedLineInfo);

					break;
				}
			}
		}

		return output;
	}
};
