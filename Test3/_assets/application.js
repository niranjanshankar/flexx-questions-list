// This is a manifest file that'll be compiled into application.js.
//
// Any JavaScript file within this directory can be referenced here using a relative path.
//
// You're free to add application-wide JavaScript to this file, but it's generally better 
// to create separate JavaScript files as needed.
//
//= require jquery.min
//= require moment.min
//= require_tree .
//= require_self
//= require fullcalender
//= require bootstrap
//= require bootstrap-datepicker
//= require bootstrap-datetimepicker
//= require custom_calendar
//= require custom_datatables
//= require custom_datepicker
//= require custom_flexxource
//= require custom_panel
//= require custom_treeview
//= require jquery.dataTables
//= require select2.ful.js

if (typeof jQuery !== 'undefined') {
	(function($) {
		$('#spinner').ajaxStart(function() {
			$(this).fadeIn();
		}).ajaxStop(function() {
			$(this).fadeOut();
		});


	})(jQuery);
}

