var $ = require('jquery');

function Image($el) {
    console.log('Image created', $el);
    this.$el = $el;

    this._bindEvents();
}

Image.prototype = {
    _bindEvents: function () {
        this.$el.one('click', function () {
            $(this).animate({
                width: '+=100px',
                height: '+=100px'
            });
        });
    }
};

module.exports = Image;
