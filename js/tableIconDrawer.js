var TableIconDrawer = function(target, game) {
    TableDrawer.apply(this, arguments);
};

TableIconDrawer.prototype = Object.create(TableDrawer.prototype);

TableIconDrawer.prototype.drawCell = function(cell) {
    var $tr = $('tr:nth-child(' + (cell.x + 1) + ')', this.table);
    var $td = $('td:nth-child(' + (cell.y + 1) + ')', $tr);

    $td.empty();
    if (cell.isAlive()) {
        var tree = Math.random() > 0.5 ? 'deciduous' : 'conifer';
        var $i = $('<i>').addClass('glyphicon').addClass('glyphicon-tree-' + tree);
        $td.append($i);
    }
};
