var TableColorDrawer = function(target, game) {
    TableDrawer.apply(this, arguments);
};

TableColorDrawer.prototype = Object.create(TableDrawer.prototype);

TableColorDrawer.prototype.drawCell = function(cell) {
    var $tr = $('tr:nth-child(' + (cell.x + 1) + ')', this.table);
    var $td = $('td:nth-child(' + (cell.y + 1) + ')', $tr);

    $td.removeClass('doomed').removeClass('viable');

    if (cell.isAlive()) {
        $td.addClass('alive');
    } else {
        $td.removeClass('alive');
    }
};
