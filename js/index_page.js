"use strict";
/**
 * Скрипты только для главной страницы сайта
 *
 * Created by Zatolokin Pavel on 30.11.2018.
 */

// Красиво распологает фотки портфолио на главной
window.onload = function () {
    new Masonry('.portfolio-grid', {
        itemSelector: '.portfolio-item',    // какие именно элементы обрабатывать
        columnWidth: '.portfolio-item'      // по первому найденному такому элементу установить ширину колонок
    });
};

window.onscroll = function() {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    document.getElementById('body').classList.toggle("scrolled", scrolled > 700);
};
