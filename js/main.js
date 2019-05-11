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
            getThumbBoundsFn: function(index) {
                var thumbnail = items[index].el,
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();
                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
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
