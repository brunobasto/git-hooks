'use strict';

var Notification = require('node-notifier');

var notifier = new Notification();

module.exports = {
	showMessage: function(title, message) {
		notifier.notify({
			group: title,
			message: message,
			subtitle: 'pre-commit hook',
			title: title
		});
	}
};
