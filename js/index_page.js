"use strict";
/**
 * Скрипты только для главной страницы сайта
 *
 * Created by Zatolokin Pavel on 30.11.2018.
 */


const portfolioOnMainPage = function () {
    const form = document.forms['main_portfolio'];
    let masonry;

    const _init = function () {
        form.addEventListener('change', changeSets);
        const radioBtns = form.elements['switch'];
        const random = randomInt(radioBtns.length - 1);
        radioBtns[random].checked = true;
        changeSets(radioBtns[random]);
    };

    const changeSets = function (evt) {
        const radio = evt.target || evt;
        const items = document.getElementsByClassName('portfolio-item');
        for (let i=0; i < items.length; i++) {
            if (items[i].classList.contains(radio.value)) {
                items[i].style.display = '';
            } else {
                items[i].style.display = 'none';
            }
        }
        masonry && masonry.destroy();
        masonry = new Masonry('.portfolio-grid', {          // Красиво располагает фотки портфолио на главной
            itemSelector: '.portfolio-item.'+radio.value,   // какие именно элементы обрабатывать
            columnWidth: '.portfolio-item.'+radio.value     // по первому найденному такому элементу установить ширину колонок
        });
    };

    const randomInt = function (max) {
        let rand = Math.random() * (max + 1);
        rand = Math.floor(rand);
        return rand;
    };

    form && _init();
};
window.addEventListener("load", portfolioOnMainPage);
