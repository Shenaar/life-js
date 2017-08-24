var Game = function (width, height, seed) {
    this.day = 1;
    this.width = width;
    this.height = height;
    this.array = new Array(this.width);
    this.alive = 0;
    this.changed = new Array();

    var c = 0;

    for (var i = 0; i < this.width; ++i) {
        this.array[i] = new Array(this.height);

        for (var j = 0; j < this.height; ++j) {
            if (!seed) {

                var cell = new Cell(i, j, parseInt((Math.random() * 100)) <= CONFIG.PROBABILITY);
                this.array[i][j] = cell;

            } else if (c < seed.length){

                this.array[i][j] = new Cell(i, j, parseInt(seed[c]));
                ++c;

            } else {
                this.array[i][j] = new Cell(i, j, 0);
            }

            if (this.array[i][j].isAlive()) {
                ++this.alive;
                this.changed.push(this.array[i][j]);
            }
        }
    }

    this.updateNeighbours();
};

Game.prototype = {
    CELL_DEAD:  0,
    CELL_ALIVE: 1,
    CELL_DOOMED: 2,

    get: function (x, y) {
        return this.array[x][y];
    },

    step: function () {
        var start = new Date().getTime();

        ++this.day;
        this.alive = 0;
        this.changed = new Array();
        var newState = new Array(this.width);

        for (var i = 0; i < this.width; ++i) {
            newState[i] = new Array(this.height);

            for (var j = 0; j < this.height; ++j) {

                var cell = this.get(i, j);
                var newCell = null;

                if (cell.isDoomed()) {
                    newCell = new Cell(i, j, 0);
                } else if (cell.isViable()) {
                    newCell = new Cell(i, j, 1);
                } else {
                    newCell = new Cell(i, j, cell.state);
                }

                newState[i][j] = newCell;

                if (newCell.isAlive()) {
                    ++this.alive;
                }

                if (newCell.state != cell.state) {
                    this.changed.push(newCell);
                }
            }
        }

        this.array = newState;
        this.updateNeighbours();

        //console.log('Step: ' + (new Date().getTime() - start));
    },

    neighbours: function(cell, change) {
        var c = 0;
        var x = cell.x;
        var y = cell.y;

        for (var i = Math.max(0, x - 1); i <= Math.min(this.width - 1, x + 1); ++i) {
            for (var j = Math.max(0, y - 1); j <= Math.min(this.height - 1, y + 1); ++j) {
                if (x == i && y == j) {
                    continue;
                }

                if (change !== undefined) {
                    this.get(i, j).neighbours += change;
                } else if (cell.isAlive()) {
                    ++this.get(i, j).neighbours;
                }
            }
        }

        return c;
    },

    toggle: function(x, y) {
        var cell = this.get(x, y);
        this.array[x][y].state = 1 - this.array[x][y].state;
        if (this.array[x][y].isAlive()) {
            ++this.alive;
            this.neighbours(cell, 1);
        } else {
            --this.alive;
            this.neighbours(cell, -1);
        }

        this.changed = [cell];
    },

    updateNeighbours: function () {
        for (var i = 0; i < this.width; ++i) {
            for (var j = 0; j < this.height; ++j) {

                var cell = this.get(i, j);

                this.neighbours(cell);
            }
        }
    }

};