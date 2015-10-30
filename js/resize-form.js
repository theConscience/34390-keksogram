'use strict';

(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

  var xDisplacement = resizeForm.elements['resize-x'];
  var yDisplacement = resizeForm.elements['resize-y'];
  var sideSize = resizeForm.elements['resize-size'];

  xDisplacement.value = 0;
  yDisplacement.value = 0;
  sideSize.value = 100;

  xDisplacement.min = 0;
  yDisplacement.min = 0;
  sideSize.min = 1;

  // resize
  function setDisplacement() {
    console.log('here setDisplacement');
    xDisplacement.max = Math.max(previewImage.width - sideSize.value, 0);
    yDisplacement.max = Math.max(previewImage.height - sideSize.value, 0);
    if (xDisplacement.value > xDisplacement.max) {
      xDisplacement.value = xDisplacement.max;
      console.log('xDisplacement = ' + xDisplacement.value);
    }
    if (yDisplacement.value > yDisplacement.max) {
      yDisplacement.value = yDisplacement.max;
      console.log('yDisplacement = ' + yDisplacement.value);
    }
  }
  function setSideSize() {
    console.log('here setSideSize');
    sideSize.max = Math.min(
        previewImage.width - xDisplacement.value,
        previewImage.height - yDisplacement.value
    );
    if (sideSize.value > sideSize.max) {
      xDisplacement.value = Math.max(sideSize.max, sideSize.min);
    }
  }

  // resize validation
  function displacementIsValid() {
    console.log('here displacementIsValid');
    if (!xDisplacement.max || !yDisplacement.max) {
      setDisplacement();
    }
    return xDisplacement.value <= xDisplacement.max && yDisplacement.value <= yDisplacement.max;
  }

  function sideSizeIsValid() {
    console.log('here sideSizeIsValid');
    if (!sideSize.max) {
      setSideSize();
    }
    return sideSize.value <= sideSize.max;
  }

  // resize buttons callbacks
  xDisplacement.onchange = function() {
    if (!xDisplacement.max) {
      setDisplacement();
    }
    setSideSize();
  };

  yDisplacement.onchange = function() {
    if (!yDisplacement.max) {
      setDisplacement();
    }
    setSideSize();
  };

  sideSize.onchange = function() {
    if (!sideSize.max) {
      setSideSize();
    }
    setDisplacement();
  };


  prevButton.onclick = function(evt) {
    evt.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();
    if (displacementIsValid() && sideSizeIsValid()) {
      filterForm.elements['filter-image-src'] = previewImage.src;
      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  };
})();
