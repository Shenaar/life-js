
var GameController = function (gameClass, drawerClass) {
    var that = this;

    this.delay = CONFIG.DELAY;

    this.gameClass = gameClass;
    this.drawerClass = drawerClass;

    this.game = null;
    this.drawer = null;

    this.autoplay = false;

    $(document).off('click', '.reset-game');
    $(document).on('click', '.reset-game', function () {
        that.reset.call(that);
        return false;
    });

    $(document).off('click', '.step-game');
    $(document).on('click', '.step-game', function () {
        that.step.call(that);
        return false;
    });

    $(document).off('click', '#game-field tr td');
    $(document).on('click', '#game-field tr td', function () {
        that.toggleCell.call(that, this);
        return false;
    });

    $(document).off('click', '.pause-game');
    $(document).on('click', '.pause-game', function () {
        that.pause.call(that);
        return false;
    });

    $(document).off('click', '.play-game');
    $(document).on('click', '.play-game', function () {
        that.play.call(that);
        return false;
    });

    $(document).off('click', '.hash-game');
    $(document).on('click', '.hash-game', function () {
        that.hash.call(that);
        return false;
    });

    $(document).off('click', '.toggle-view');
    $(document).on('click', '.toggle-view', function(){
        if (that.drawerClass === TableColorDrawer) {
            that.setDrawerClass(TableIconDrawer);
        } else {
            that.setDrawerClass(TableColorDrawer);
        }
    });

    if (location.hash.length > 1) {
        this.fromHash(location.hash);
    } else {
        parseInt($('[name="width"]').val(CONFIG.WIDTH));
        parseInt($('[name="height"]').val(CONFIG.HEIGHT));

        this.reset();
    }

    $(window).resize(function() {
        that.drawer.redraw();
    });

};

GameController.prototype = {
    reset: function () {
        this.pause();

        var width = parseInt($('[name="width"]').val());
        var height = parseInt($('[name="height"]').val());

        if (width < 1 || height < 1) {
            alert('Длина и ширина должны быть больше нуля!');
            return;
        }

        var $reset = $('.reset-game');

        $reset.attr('disabled', true);

        this.game = new this.gameClass(width, height);
        this.drawNewField();
        location.hash = '';
        $('.block-on-extinction').removeAttr('disabled');
        $reset.attr('disabled', false);

        return false;
    },

    fromHash: function(hash) {
        this.game = Hasher.fromHash(hash, this.gameClass);

        $('[name="width"]').val(this.game.width);
        $('[name="height"]').val(this.game.height);

        this.drawNewField();
        $('.block-on-extinction').removeAttr('disabled');
        $('.reset-game').attr('disabled', false);
        return false;
    },

    step: function () {
        var that = this;

        if (!this.game) {
            return false;
        }

        var start = new Date().getTime();
        this.game.step();

        if (this.updateState() && this.autoplay) {
            var end = new Date().getTime();

            this.autoplay = setTimeout(function(){
                that.step();
            }, Math.max(this.delay - (end - start), 10));
        }

        return false;
    },

    drawNewField: function () {
        this.drawer = new this.drawerClass($('#game-field'), this.game);
        this.updateState();
    },

    updateState: function () {
        this.drawer.redraw();

        $('#days-counter').text(this.game.day);
        $('#alive-counter').text(this.game.alive);

        if (!this.game.alive && this.game.day > 1) {
            this.pause();
            $('.block-on-extinction').attr('disabled', true);
            $('body').removeClass('running');
            alert('Все умерли =(');

            return false;
        }

        if (this.game.isStable()) {
            alert('Система стабильна!');
            this.pause();
        } else if (!this.autoplay) {
            $('.block-on-extinction').attr('disabled', false);
        }

        return true;
    },

    toggleCell: function (cell) {
        if (!this.game || this.autoplay) {
            return;
        }

        this.game.toggle(parseInt($(cell).attr('x')), parseInt($(cell).attr('y')));
        this.updateState();
    },

    play: function () {
        this.autoplay = true;
        $('.play-game').hide();
        $('.pause-game').show();
        $('.step-game').attr('disabled', true);
        $('body').addClass('running');

        this.step();
    },

    pause: function () {

        clearTimeout(this.autoplay);
        this.autoplay = false;
        $('.pause-game').hide();
        $('.play-game').show();
        $('.step-game').attr('disabled', false);
        $('body').removeClass('running');
    },

    hash: function() {
        location.hash = Hasher.toHash(this.game);
    },

    setDrawerClass: function(drawerClass) {
        this.drawerClass = drawerClass;
        this.drawer = new this.drawerClass($('#game-field'), this.game);
    }
};

$(function () {
    try {
        window.gameController = new GameController(CONFIG.GAME_CLASS, CONFIG.DRAWER_CLASS);
    } catch (e) {
        alert(e);
        console.error(e);
    }
});