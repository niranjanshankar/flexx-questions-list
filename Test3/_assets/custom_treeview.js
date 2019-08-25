function initTreeView() {
    var table = $('.table-tree-view');
    if ('taskAssignmentTable' === table.prop('id')) {
        initSpecificTreeView(table, 'assignment');
    } else {
        initSpecificTreeView(table, '');
    }
}
function initSpecificTreeView(table, leafCode) {
    // Loop over all the rows in the table
    var tableRows = table.find('tr');
    tableRows.each(function () {
        var row = $(this);
        var rowId = row.prop('id');
        if (rowId.length > 0) {
            var rowCode = getRowCode(rowId);
            // Only process rows for tasks
            if (leafCode !== rowCode) {
                // Work out if this row has dependent rows, i.e. it should have a +/- icon
                var hasDependentRows = false;
                $('.' + rowId).each(function () {
                    if (leafCode !== getRowCode($(this).prop('id'))) {
                        hasDependentRows = true;
                    }
                });
                if (hasDependentRows) {
                    // Add the javascript events first locating the td's where the sub +/- icon will be displayed
                    row.find('td.task span.glyphicon, td.assignment span.glyphicon').each(function () {
                        $(this).bind('click', {row: row}, function (event) {
                            updateAssignments(row, $(this), 0);
                            $(this).css('cursor', 'pointer');
                        });
                        if (hasStatus(row)) {
                            // We don't want to show the sub +/- icon
                            $(this).removeClass('glyphicon-plus-sign')
                        } else {
                            if (!$(this).hasClass('glyphicon-plus-sign')) {
                                $(this).addClass('glyphicon-minus-sign')
                            }
                        }
                        updateAssignments(row, $(this), 0);
                    });

                    // The id of each row is replicated in the class of associated rows e.g. rowId = task-1 and rows
                    // for tasks belonging to task-1 have it as a class
                    row.find('td:nth-child(1) span.glyphicon, td:nth-child(2) span.glyphicon').each(function () {
                        // Add the javascript event for +/- on the row
                        $(this).bind('click', {leafCode: leafCode, row: row}, function (event) {
                            updateTreeViewRows(leafCode, row, $(this), 0);
                        });
                        updateTreeViewRows(leafCode, row, $(this), 0);
                    });
                }
            }
        }
    });

    if (table.is(":visible")) {
        // Find any rows which are "selected" e.g. info or danger and expand the sections of the tree with them in
        tableRows.each(function () {
            if ($(this).hasClass("active")) {
                var row = $(this);
                showRowAndParents(leafCode, row);
                $('html, body').animate({
                    scrollTop: row.offset().top - 50
                }, 1000);
            }
        });
    }
}

function updateTreeViewRows(leafCode, row, glyphiconSpan, duration) {
    var rowId = row.prop('id');
    var dependentRows = $('.' + rowId);
    if (glyphiconSpan.hasClass('glyphicon-plus')) {
        // Show the dependant rows and change the icon to a minus
        dependentRows.each(function () {
            var dependentRow = $(this);
            if ((leafCode !== getRowCode(dependentRow.prop('id')))) {
                dependentRow.fadeIn(duration);
                // Show any dependent assignments which would normally be shown i.e. ones which are not hidden
                dependentRow.find('td.task span.glyphicon').each(function () {
                    if ($(this).parent().hasClass('hidden')) {
                        updateRowSpans(dependentRow, showDependentAssignments(dependentRow, duration, false));
                    }
                });
            }
        });
        glyphiconSpan.removeClass('glyphicon-plus');
        glyphiconSpan.addClass('glyphicon-minus');

    } else {
        // Hide the dependant rows and change the icon to a plus
        dependentRows.each(function () {
            var dependentRow = $(this);
            if ((leafCode !== getRowCode(dependentRow.prop('id')))) {
                dependentRow.find('td:nth-child(1) span.glyphicon, td:nth-child(2) span.glyphicon').each(function () {
                    if ($(this).prop('class') == 'glyphicon glyphicon-minus') {
                        $(this).click();
                    }
                });
                // Hide any dependent assignments
                updateRowSpans(dependentRow, hideDependentAssignments(dependentRow, duration, false));
                dependentRow.fadeOut(duration);
            }
        });
        glyphiconSpan.removeClass('glyphicon-minus');
        glyphiconSpan.addClass('glyphicon-plus');
    }
    glyphiconSpan.css('cursor', 'pointer');
}

function updateAssignments(row, glyphiconSpan, duration) {
    if (!hasStatus(row)) {
        if (glyphiconSpan.hasClass('glyphicon-plus-sign')) {
            row.find('.task').each(function () {
                $(this).addClass('hidden')
            });
            row.find('.assignment').each(function () {
                $(this).removeClass('hidden')
            });
            updateRowSpans(row, showDependentAssignments(row, duration, true));
        } else {
            row.find('.assignment').each(function () {
                $(this).addClass('hidden')
            });
            row.find('.task').each(function () {
                $(this).removeClass('hidden');
            });
            updateRowSpans(row, hideDependentAssignments(row, duration, true));
        }
    }
}

function showDependentAssignments(row, duration, showAssignment) {
    var count = 1;
    var dependentRows = $('.' + row.prop('id'));
    dependentRows.each(function () {
        if ($(this).prop('id').indexOf('assignment-') > -1) {
            if (showAssignment) {
                // Also mark the td containing the icon as visible so we can keep track of its state if a
                // tree element is opened and closed
                $(this).find('.assignment').each(function () {
                    $(this).removeClass('hidden')
                });
            }
            $(this).fadeIn(duration);
            count++;
        }
    });
    return count;
}

function hideDependentAssignments(row, duration, hideAssignment) {
    var dependentRows = $('.' + row.prop('id'));
    dependentRows.each(function () {
        if ($(this).prop('id').indexOf('assignment-') > -1) {
            if (hideAssignment) {
                // Also mark the td containing the icon as hidden so we can keep track of its state if a
                // tree element is opened and closed
                $(this).find('.assignment').each(function () {
                    $(this).addClass('hidden')
                });
            }
            $(this).fadeOut(duration);
        }
    });
    return 1;
}

function showRowAndParents(leafCode, row) {
    var classStr = row.prop('class');
    if (typeof classStr !== 'undefined') {
        var classList = classStr.split(/\s+/);
        $.each(classList, function (index, item) {
            // Retrieve the row with this class name, find the icon and click it
            var parentRow = $('#' + item);
            if (parentRow) {
                parentRow.find('td:nth-child(1) span.glyphicon, td:nth-child(2) span.glyphicon').each(function () {
                    if ($(this).hasClass('glyphicon-plus')) {
                        $(this).click();
                    }
                });
                showRowAndParents(leafCode, parentRow);
            }
        });
    }
}

function updateRowSpans(row, count) {
    var cells = row.find('td');
    cells.eq(0).prop('rowspan', count);
    cells.eq(1).prop('rowspan', count);
    cells.eq(2).prop('rowspan', count);
    cells.eq(3).prop('rowspan', count);
    cells.eq(4).prop('rowspan', count);
}


function getRowCode(rowId) {
    return rowId.substr(0, rowId.indexOf('-'));
}

function hasStatus(row) {
    return row.hasClass('info') || row.hasClass('success') || row.hasClass('danger');
}
