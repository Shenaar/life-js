var Hasher = {

    fromHash: function(hash, gameClass) {
        var parts = hash.replace('#', '').split(',');

        var width = parseInt(parts[0]);
        var height = parseInt(parts[1]);

        return new gameClass(width, height, parts[2]);
    },

    toHash: function(game) {
        var str = '';

        for (var i = 0; i < game.width; ++i) {
            for (var j = 0; j < game.height; ++j) {
                str += 1 * game.get(i, j);
            }
        }

        return [game.width, game.height, str].join(',');
    }
};
