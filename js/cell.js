var Cell = function (x, y, state) {
    this.x = x;
    this.y = y;
    this.state = state;
    this.neighbours = 0;
};

Cell.prototype = {
    isAlive: function () {
        return this.state;
    },

    isDead: function () {
        return !this.state;
    },

    isDoomed: function () {
        return this.isAlive() &&
            (this.neighbours < 2 || this.neighbours > 3);
    },

    isViable: function () {
        return this.isDead() &&
            this.neighbours === 3;
    }
};
