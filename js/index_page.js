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

/**
 * Помогает хотя бы частично победить косяки с фиксированным фоном на iPad.
 * Если я ставлю background:fixed через body::before{position:fixed}, то на айпаде при черезмерной прокрутке
 * вверх или вниз, страница сдвигается настолько, что становится виден фон. Там где он не нужен. Внизу этот
 * косяк я победить не смог. Но вверху смог. Для этого обычно фон занимает не больше 350px по высоте и
 * располагается снизу. Но когда страница прокручивается вниз, то высота фона становится 100%, и он хорошо
 * отображается под блоком .sec-main-services
 */
function resize_footer_bg() {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    document.getElementById('body').classList.toggle("scrolled", scrolled > 700);
}
resize_footer_bg();
document.addEventListener('scroll', resize_footer_bg);
