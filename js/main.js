(function preparePhotoSwipeGallery() {
    var allGallerys = document.getElementsByClassName('pswp__gallery');
    for (var i=0; i < allGallerys.length; i++) {
        allGallerys[i].addEventListener('click', function (evt) {
            if (evt.target.tagName === 'IMG') {
                var gallery = evt.currentTarget;
                var currentImage = evt.target;
                var allImages = gallery.getElementsByTagName('IMG');
                openPhotoSwipeGallery(allImages, currentImage);
            }
        });
    }
})();

/**
 * При прокрутке добавляет к body класс "scrolled", который помогает
 * менять фон для верхней части страницы и футера.
 */
change_page_background();
document.addEventListener('scroll', change_page_background);
function change_page_background() {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    document.getElementById('body').classList.toggle("scrolled", scrolled > 700);
}



/**
 * Подключение просмотрщика фотографий к галереям фото.
 */
var initPhotoSwipeGallery = function(gallerySelector) {

    var _init = function () {
        var galleryElements = document.querySelectorAll(gallerySelector);
        for (var i=0; i < galleryElements.length; i++) {
            galleryElements[i].addEventListener('click', clickOnPhotoSwipeGallery);
        }
    };

    var clickOnPhotoSwipeGallery = function (evt) {
        evt = evt || window.event;
        evt.preventDefault ? evt.preventDefault() : evt.returnValue = false;
        var evtTarget = evt.target || evt.srcElement;
        var currItem = closestByTagName(evtTarget, 'A');    // ищем выбранный элемент галереи, вида <a href="" data-size=""><img src=""></a>
        if (currItem) {
            var gallery = closestByClassName(currItem, 'pswp__gallery');
            var images = gallery.getElementsByTagName('IMG');
            var currImage = currItem.children[0];
            openPhotoSwipeGallery(images, currImage);
        }
    };

    var openPhotoSwipeGallery = function (images, currImage) {
        var pswpElement = document.getElementById('photoswipe');
        var items = [], firstSlide = 0;
        for (var i=0; i < images.length; i++) {
            if (images[i] === currImage) firstSlide = i;
            var link = images[i].parentNode;
            var size = link.getAttribute('data-size').split('x');
            items.push({
                src: link.getAttribute('href'),
                msrc: images[i].getAttribute('src'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10),
                el: images[i]
            });
        }
        var options = {
            index: firstSlide,      // start at first slide
            loop: false,
            getThumbBoundsFn: function(index) {
                var thumbnail = items[index].el,
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(),
                    style = window.getComputedStyle(thumbnail, null),
                    borderTop = parseInt(style.getPropertyValue('border-top-width'), 10),
                    borderRight = parseInt(style.getPropertyValue('border-right-width'), 10),
                    borderLeft = parseInt(style.getPropertyValue('border-left-width'), 10);
                return {x: rect.left + borderLeft, y: rect.top + borderTop + pageYScroll, w: rect.width - borderRight - borderLeft};
            }
        };
        var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    var closestByTagName = function (node, tagName) {
        while (node) {
            if (node.tagName && node.tagName.toUpperCase() === tagName) return node;
            else node = node.parentElement;
        }
        return null;
    };

    var closestByClassName = function (node, className) {
        while (node) {
            if (node.classList.contains(className)) return node;
            else node = node.parentElement;
        }
        return null;
    };

    _init();
};
initPhotoSwipeGallery('.pswp__gallery');
