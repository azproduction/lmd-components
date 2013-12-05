/*!
 * Ленивый инициализатор компонент
 * @type {exports|*}
 */

var $ = require('jquery');

var reName = /^components\/(.+)$/;

// Получаем все имена компонент, которые на данный момент включены в сборку
var componentNames = $.map(require.names(reName), function (value) {
    return value.match(reName)[1];
});

/**
 * Инициализирует компонент на элементах
 *
 * @param {jQuery} $elements
 * @param {String} componentName
 */
function initializeComponentOn($elements, componentName) {
    // Конструктор компонента
    var Component = require('components/' + componentName);

    // Это не конструктор
    if (typeof Component !== 'function') {
        return;
    }

    // Инициализируем каждый такой блок
    $.each($elements, function () {
        var $element = $(this);
        // Пропускаем инициализированные блоки
        if ($element.data('instance')) {
            return;
        }

        // Связываем блок и инстанс
        // TODO Возможно это можно привести к утечнам памяти в старых IE
        // TODO но для многостраничных приложений это может быть не важно
        $element.data('instance', new Component($element));
    });
}

/**
 * Декларативно инициализирует компоненты на странице
 *
 * @param {jQuery|HTMLElement} root
 */
function init(root) {
    if (!componentNames.length) {
        return;
    }

    var $root = $(root || document);

    $.each(componentNames, function (i, componentName) {
        // Элементы связанные с данным компонентом
        var elementSelector = '.' + componentName,
            $elements = $root.find(elementSelector);

        // Корень так же может попасть под elementSelector
        if ($root.is(elementSelector)) {
            $elements = $elements.add($root);
        }

        // Если нашлись такие блоки
        if (!$elements.length) {
            return;
        }
        initializeComponentOn($elements, componentName);
    });
}

module.exports = init;
