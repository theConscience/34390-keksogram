'use strict';

(function() {

  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECIEVED': 2,
    'LOADING': 3,
    'DONE': 4,
  }

  var REQUEST_FAILURE_TIMEOUT = 10000;

  var filtersMenu = document.querySelector('.filters');
  filtersMenu.classList.add('hidden');

  var picturesContainer = document.getElementsByClassName('pictures')[0];
  var pictures;

  function supportsTemplate() {
    return 'content' in document.createElement('template');
  }

  function renderPictures(pictures) {
    var pictureTemplate = document.getElementById('picture-template');
    var picturesFragment = document.createDocumentFragment();
    pictures.forEach(function (picture, i) {
      //console.log(picture, i);
      if (supportsTemplate()) {
        var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);
        newPictureElement.querySelector('.picture-likes').textContent = picture['likes'];
        newPictureElement.querySelector('.picture-comments').textContent = picture['comments'];
        newPictureElement.querySelector('.picture img').src = picture['url'];
      } else {
        var newPictureElement = pictureTemplate.innerHTML;
        // дописать код для старых браузеров
      }

      picturesFragment.appendChild(newPictureElement);

      var newPicture = new Image();
      newPicture.src = picture['url'];

      var imageLoadTimeout = setTimeout(function () {
        newPictureElement.classList.add('picture-load-failure');
      }, REQUEST_FAILURE_TIMEOUT)

      newPicture.onload = function () {
        newPicture.style.height = '182px';
        newPicture.style.width = '182px';
        var oldPicture = newPictureElement.querySelector('.picture img');
        clearTimeout(imageLoadTimeout);
        newPictureElement.replaceChild(newPicture, oldPicture);
      }

      newPicture.onerror = function () {
        newPictureElement.classList.add('picture-load-failure');
      }

    });

    picturesContainer.appendChild(picturesFragment);
    filtersMenu.classList.remove('hidden');
  }

  function showLoadFailure() {
    picturesContainer.classList.add('pictures-failure');
  }

  function loadPictures(callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('get','data/pictures.json');
    xhr.send();

    xhr.onreadystatechange = function(evt) {
      var loadedXhr = evt.target;

      switch (loadedXhr.readyState) {
        case ReadyState.OPENED:
        case ReadyState.HEADERS_RECIEVED:
        case ReadyState.LOADING:
          picturesContainer.classList.add('pictures-loading');
          break;
        case ReadyState.DONE:
        default:
          if (loadedXhr.status === 200) {
            var data = loadedXhr.response;
            picturesContainer.classList.remove('pictures-loading');
            callback(JSON.parse(data));
          }

          if (loadedXhr.status > 400) {
            showLoadFailure();
          }
      }
    }

    xhr.ontimeout = function() {
      showLoadFailure();
    }
  }

  loadPictures(function(loadedPictures){
    pictures = loadedPictures;
    renderPictures(loadedPictures);
  });

})();
