/**
 * Скрипт калькулятора стоимости фотокниг.
 */

// Запуск расчёта после загрузки страницы
(function startCalc() {
    if (typeof photobook_params !== 'undefined') {
        var pb_type = document.getElementById('pbook_type');
        var objSel = document.getElementById('pbook_type');
        for (var key in photobook_params) {
            objSel.options[objSel.options.length] = new Option(photobook_params[key].pb_name, key);
        }
        changeType(pb_type);
        pb_type.addEventListener('change', changeType);
    }
})();

// Смена типа фотокниги, перерисовка всех полей параметров и пересчёт цены
function changeType(pb_type) {
    var type = pb_type.value || this.value;
    var params = photobook_params[type];
    setParams(Object.keys(params.pb_size), 'sizes');
    setParams(params.pb_pages, 'pages');
    setParams(params.pb_matte, 'matte');
    setParams(params.pb_paper, 'paper');
    resultPrice();
}

// Перерисовка одного параметра фотокниги.
// Используется при смене типа фотокниги.
function setParams(params, id) {
    var block = document.getElementById('photobook_' + id);
    var objSel = document.getElementById('pbook_' + id);
    objSel.options.length = 0;              // удаляем из поля все элементы
    if (params === undefined) {
        block.style.display = "none";       // скрываем поле, если такой параметр не указан для данного типа фотокниги
    } else {
        block.style.display = "";           // отображаем поле, если такой параметр нужен для данного типа фотокниги
        for (var i = 0; i < params.length; i++) {
            objSel.options[objSel.options.length] = new Option(params[i], params[i]);
        }
        objSel.addEventListener('change', resultPrice);     // Вешаем лисенер на смену этого параметра
    }
}

// Рассчёт и отрисовка цены фотокниги на основе выбранных параметров
function resultPrice() {
    var type = document.getElementById('pbook_type');
    var sizes = document.getElementById('pbook_sizes');
    var pages = document.getElementById('pbook_pages');
    type = type.value;
    sizes = sizes.value;
    pages = pages.value;
    var price = photobook_params[type].pb_size[sizes] * pages;
    document.getElementById('pbook_result').innerHTML = price.toString();
    document.getElementById('photo_book_format').src = "/img/photo_book_formats/photo_book_" + sizes + ".png";
}



// Листает фотокнигу
const pageFlip = function (page) {
    const flipped = page.classList.contains('flip');
    const isCover = page.classList.contains('page-flip-cover');
    let zIndex = 0;
    const prev = page.previousElementSibling;
    let sib = page.nextElementSibling;
    while (sib) {
        zIndex += 1;
        sib = sib.nextElementSibling;
    }
    if (isCover && zIndex === 0 && flipped) {
        // закрываем переднюю обложку
        let interior = prev;
        while (interior) {
            interior.style.zIndex = '0';
            interior.classList.toggle('flip', !flipped);
            interior = interior.previousElementSibling;
        }
    } else if (isCover && zIndex > 0 && !flipped) {
        // закрываем заднюю обложку
        let interior = page.nextElementSibling;
        let sibZ = zIndex;
        while (interior) {
            sibZ -= 1;
            interior.style.zIndex = sibZ.toString();
            interior.classList.toggle('flip', !flipped);
            interior = interior.nextElementSibling;
        }
    }
    if (isCover && zIndex > 0 && flipped) { zIndex -= 1; } // чтобы тень посередине разворота была не столь тёмная
    page.style.zIndex = zIndex.toString();
    page.classList.toggle('flip', !flipped);
    flipped
        ? prev.style.zIndex = '0'
        : setTimeout(function(){
            const incr = prev.classList.contains('page-flip-cover') ? 0 : 1; // чтобы тень посередине разворота была не столь тёмная
            prev.style.zIndex = (zIndex + incr).toString();
        },350);
};
