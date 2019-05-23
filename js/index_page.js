"use strict";
/**
 * Скрипты только для главной страницы сайта
 *
 * Created by Zatolokin Pavel on 30.11.2018.
 */


var portfolioOnMainPage = function () {
    var masonry;

    var _init = function () {
        document.forms['main_portfolio'].addEventListener('change', changeSets);
        var radioBtns = document.forms['main_portfolio'].elements['switch'];
        var random = randomInt(radioBtns.length - 1);
        radioBtns[random].checked = true;
        changeSets(radioBtns[random]);
    };

    var changeSets = function (evt) {
        var radio = evt.target || evt;
        var items = document.getElementsByClassName('portfolio-item');
        for (var i=0; i < items.length; i++) {
            if (items[i].classList.contains(radio.value)) {
                items[i].style.display = '';
            } else {
                items[i].style.display = 'none';
            }
        }
        masonry && masonry.destroy();
        masonry = new Masonry('.portfolio-grid', {          // Красиво распологает фотки портфолио на главной
            itemSelector: '.portfolio-item.'+radio.value,   // какие именно элементы обрабатывать
            columnWidth: '.portfolio-item.'+radio.value     // по первому найденному такому элементу установить ширину колонок
        });
    };

    var randomInt = function (max) {
        var rand = Math.random() * (max + 1);
        rand = Math.floor(rand);
        return rand;
    };

    _init();
};
window.addEventListener("load", portfolioOnMainPage);
