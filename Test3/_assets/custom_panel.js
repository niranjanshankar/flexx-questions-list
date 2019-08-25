function initPanel() {
    $('div.panel').each(function () {
        // Find the panel heading
        var panel = $(this);
        $(this).find('div.panel-heading').each(function () {
            $(this).find('div.pull-left').each(function () {
                // Check if they have a glyphicon to allow them to be expanded or collapsed
                $(this).find('span.glyphicon').each(function () {
                    $(this).bind('click', {panel: panel}, function (event) {
                        updatePanel($(this), panel, 0);
                    });
                    setPanel($(this), panel, 0);
                });
            });
        });
    });
}

function setPanel(glyphiconSpan, panel, duration) {
    glyphiconSpan.css('cursor', 'pointer');
    if (panel.hasClass('panel-primary')) {
        glyphiconSpan.addClass('glyphicon-chevron-down');
    } else {
        updatePanel(glyphiconSpan, panel, duration);
    }
}

function updatePanel(glyphiconSpan, panel, duration) {
    glyphiconSpan.css('cursor', 'pointer');
    if (glyphiconSpan.hasClass('glyphicon-chevron-right')) {
        panel.find('div.panel-body').each(function () {
            $(this).fadeIn(duration);
        });
        glyphiconSpan.removeClass('glyphicon-chevron-right');
        glyphiconSpan.addClass('glyphicon-chevron-down');
    } else {
        panel.find('div.panel-body').each(function () {
            $(this).fadeOut(duration);
        });
        glyphiconSpan.removeClass('glyphicon-chevron-down');
        glyphiconSpan.addClass('glyphicon-chevron-right');
    }
}