'use strict';

var YUI = require('yui').YUI;

var Y = YUI({
	useSync: true
}).use('base');

var gui = require('nw.gui');;

var DEFAULT_HEIGHT = 500;
var DEFAULT_WIDTH = 500;

Y.namespace('Reports');

function hideReportsWindow() {
	Y.Reports.Window.hide();
};

function showReportsWindow(callback) {
	var win = gui.Window.open(
		'reports/reports.html',
		{
			'always-on-top': true,
			frame: true,
			height: DEFAULT_HEIGHT,
			resizable: false,
			show: false,
			toolbar: false,
			width: DEFAULT_WIDTH
		}
	);

	win.on('loaded', function() {
		var YDom = YUI({
			doc: win.window.document,
			useSync: true,
			win: win.window
		}).use('node');

		Y.Reports.Dom = YDom;
		Y.Reports.Window = win;

		Y.Reports.Window.show();

		if (callback) {
			callback.apply(this, arguments);
		}
	});
};

window.Reports = {
	createReport: function(title, errors) {
		var container = Y.Reports.Dom.one('#template').cloneNode(true);

		var headerNode = container.one('.header');
		var bodyNode = container.one('.body');

		headerNode.setContent(title);

		Y.Array.each(errors, function(error, index) {
			bodyNode.append(error.file);

			if (error.line) {
				bodyNode.append('#' + error.line);
			}

			bodyNode.append('<br/>');
		});

		container.removeClass('hide');
		container.appendTo('#reports');
	},
	hide: function() {
		hideReportsWindow();
	},
	show: function(callback) {
		showReportsWindow(callback);
	}
};
