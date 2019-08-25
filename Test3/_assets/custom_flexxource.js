if (typeof jQuery !== 'undefined') {
    (function ($) {
        $(document).ready(function () {
            $('.combobox').select2({
                selectOnBlur: true,
                tags:true
            });

            initDatePickers();
            initialiseDataTables();
            initCalendars();

            initPanel();
            initTreeView();

            // Javascript to enable link to tab
            var prefix = 'tab_';
            var hash = document.location.hash;
            if (hash) {
                $('.nav-tabs a[href='+hash.replace(prefix,"")+']').tab('show');
            }

            // Change hash for page-reload
            $('.nav-tabs a').on('shown', function (e) {
                window.location.hash = e.target.hash.replace("#", "#" + prefix);
            })
        });
    })(jQuery);
}

function toggleClass(event, toogleClass) {
    event.preventDefault();
    $('.' + toogleClass).toggle();
}

$(function () {
    var nua = navigator.userAgent;
    var isAndroid = (nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1 && nua.indexOf('Chrome') === -1);
    if (isAndroid) {
        $('select.form-control').removeClass('form-control').css('width', '100%');
    }
});
