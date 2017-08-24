var TableDrawer = function(target, game) {
    this.table = target;
    this.game = game;

    this.table.empty();
    var width = Math.min(this.table.parent().width() / this.game.width, 50);

    for (var i = 0; i < this.game.width; ++i) {
        var $tr = $('<tr>');
        for (var j = 0; j < this.game.height; ++j) {
            var $td = $('<td>').attr('x', i).attr('y', j).css({
                width: width,
                height: width
            });

            $tr.append($td);
        }
        this.table.append($tr);
    }

    this.redraw();

};

TableDrawer.prototype = {
    redraw: function() {
        for (var i = 0; i < this.game.changed.length; ++i) {
            var cell = this.game.changed[i];
            this.drawCell(cell);
        }

        return;

        for (var i = 0; i < this.game.width; ++i) {
            for (var j = 0; j < this.game.height; ++j) {
                this.drawCell(this.game.get(i, j));
            }
        }
    },

    drawCell: function(cell) {
        throw 'The method "drawCell" is abstract';
    }
};
