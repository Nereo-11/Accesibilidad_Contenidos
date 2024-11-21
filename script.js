document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("movieForm");
  const tableBody = document.querySelector("tbody");
  const alertContainer = document.getElementById("example");
  const alertTemplate = document.getElementById("alert-template").innerHTML;

  form.addEventListener("submit", (event) => {
      event.preventDefault(); // Evita el envío del formulario

      // Validar si todos los campos están completos
      const nombre = document.getElementById("nombre").value.trim();
      const status = document.getElementById("status").value.trim();
      const url = document.getElementById("url").value.trim();
      const stars = document.getElementById("stars").value.trim();

      if (nombre && status && url && stars) {
          // Crear nueva fila en la tabla
          const newRow = `
              <tr>
                  <td scope="row">${nombre}</td>
                  <td scope="row">${status}</td>
                  <td scope="row"><img src="${url}" alt="Imagen no disponible" style="width: 150px; height: auto;"></td>
                  <td scope="row">${stars}/5</td>
              </tr>
          `;
          tableBody.insertAdjacentHTML("beforeend", newRow); // Agrega la nueva fila

          // Mostrar el mensaje de alerta
          alertContainer.innerHTML = alertTemplate;
          alertContainer.style.display = "block";

          form.reset(); // Limpia el formulario
      } else {
          // Mostrar mensaje de error si hay campos vacíos
          alert("Por favor, completa todos los campos antes de agregar la película.");
      }
  });
});


'use strict';

var CarouselPreviousNext = function (node, options) {
  // merge passed options with defaults
  options = Object.assign(
    { moreaccessible: false, paused: false, norotate: false },
    options || {}
  );

  // a prefers-reduced-motion user setting must always override autoplay
  var hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (hasReducedMotion.matches) {
    options.paused = true;
  }

  /* DOM properties */
  this.domNode = node;

  this.carouselItemNodes = node.querySelectorAll('.carousel-item');

  this.containerNode = node.querySelector('.carousel-items');
  this.liveRegionNode = node.querySelector('.carousel-items');
  this.pausePlayButtonNode = null;
  this.previousButtonNode = null;
  this.nextButtonNode = null;

  this.playLabel = 'Start automatic slide show';
  this.pauseLabel = 'Stop automatic slide show';

  /* State properties */
  this.hasUserActivatedPlay = false; // set when the user activates the play/pause button
  this.isAutoRotationDisabled = options.norotate; // This property for disabling auto rotation
  this.isPlayingEnabled = !options.paused; // This property is also set in updatePlaying method
  this.timeInterval = 5000; // length of slide rotation in ms
  this.currentIndex = 0; // index of current slide
  this.slideTimeout = null; // save reference to setTimeout

  // Pause Button

  var elem = document.querySelector('.carousel .controls button.rotation');
  if (elem) {
    this.pausePlayButtonNode = elem;
    this.pausePlayButtonNode.addEventListener(
      'click',
      this.handlePausePlayButtonClick.bind(this)
    );
  }

  // Previous Button

  elem = document.querySelector('.carousel .controls button.previous');
  if (elem) {
    this.previousButtonNode = elem;
    this.previousButtonNode.addEventListener(
      'click',
      this.handlePreviousButtonClick.bind(this)
    );
    this.previousButtonNode.addEventListener(
      'focus',
      this.handleFocusIn.bind(this)
    );
    this.previousButtonNode.addEventListener(
      'blur',
      this.handleFocusOut.bind(this)
    );
  }

  // Next Button

  elem = document.querySelector('.carousel .controls button.next');
  if (elem) {
    this.nextButtonNode = elem;
    this.nextButtonNode.addEventListener(
      'click',
      this.handleNextButtonClick.bind(this)
    );
    this.nextButtonNode.addEventListener(
      'focus',
      this.handleFocusIn.bind(this)
    );
    this.nextButtonNode.addEventListener(
      'blur',
      this.handleFocusOut.bind(this)
    );
  }

  // Carousel item events

  for (var i = 0; i < this.carouselItemNodes.length; i++) {
    var carouselItemNode = this.carouselItemNodes[i];

    // support stopping rotation when any element receives focus in the tabpanel
    carouselItemNode.addEventListener('focusin', this.handleFocusIn.bind(this));
    carouselItemNode.addEventListener(
      'focusout',
      this.handleFocusOut.bind(this)
    );

    var imageLinkNode = carouselItemNode.querySelector('.carousel-image a');

    if (imageLinkNode) {
      imageLinkNode.addEventListener(
        'focus',
        this.handleImageLinkFocus.bind(this)
      );
      imageLinkNode.addEventListener(
        'blur',
        this.handleImageLinkBlur.bind(this)
      );
    }
  }

  // Handle hover events
  this.domNode.addEventListener('mouseover', this.handleMouseOver.bind(this));
  this.domNode.addEventListener('mouseout', this.handleMouseOut.bind(this));

  // initialize behavior based on options

  this.enableOrDisableAutoRotation(options.norotate);
  this.updatePlaying(!options.paused && !options.norotate);
  this.setAccessibleStyling(options.moreaccessible);
  this.rotateSlides();
};

/* Public function to disable/enable rotation and if false, hide pause/play button*/
CarouselPreviousNext.prototype.enableOrDisableAutoRotation = function (
  disable
) {
  this.isAutoRotationDisabled = disable;
  this.pausePlayButtonNode.hidden = disable;
};

/* Public function to update controls/caption styling */
CarouselPreviousNext.prototype.setAccessibleStyling = function (accessible) {
  if (accessible) {
    this.domNode.classList.add('carousel-moreaccessible');
  } else {
    this.domNode.classList.remove('carousel-moreaccessible');
  }
};

CarouselPreviousNext.prototype.showCarouselItem = function (index) {
  this.currentIndex = index;

  for (var i = 0; i < this.carouselItemNodes.length; i++) {
    var carouselItemNode = this.carouselItemNodes[i];
    if (index === i) {
      carouselItemNode.classList.add('active');
    } else {
      carouselItemNode.classList.remove('active');
    }
  }
};

CarouselPreviousNext.prototype.previousCarouselItem = function () {
  var nextIndex = this.currentIndex - 1;
  if (nextIndex < 0) {
    nextIndex = this.carouselItemNodes.length - 1;
  }
  this.showCarouselItem(nextIndex);
};

CarouselPreviousNext.prototype.nextCarouselItem = function () {
  var nextIndex = this.currentIndex + 1;
  if (nextIndex >= this.carouselItemNodes.length) {
    nextIndex = 0;
  }
  this.showCarouselItem(nextIndex);
};

CarouselPreviousNext.prototype.rotateSlides = function () {
  if (!this.isAutoRotationDisabled) {
    if (
      (!this.hasFocus && !this.hasHover && this.isPlayingEnabled) ||
      this.hasUserActivatedPlay
    ) {
      this.nextCarouselItem();
    }
  }

  this.slideTimeout = setTimeout(
    this.rotateSlides.bind(this),
    this.timeInterval
  );
};

CarouselPreviousNext.prototype.updatePlaying = function (play) {
  this.isPlayingEnabled = play;

  if (play) {
    this.pausePlayButtonNode.setAttribute('aria-label', this.pauseLabel);
    this.pausePlayButtonNode.classList.remove('play');
    this.pausePlayButtonNode.classList.add('pause');
    this.liveRegionNode.setAttribute('aria-live', 'off');
  } else {
    this.pausePlayButtonNode.setAttribute('aria-label', this.playLabel);
    this.pausePlayButtonNode.classList.remove('pause');
    this.pausePlayButtonNode.classList.add('play');
    this.liveRegionNode.setAttribute('aria-live', 'polite');
  }
};

/* Event Handlers */

CarouselPreviousNext.prototype.handleImageLinkFocus = function () {
  this.liveRegionNode.classList.add('focus');
};

CarouselPreviousNext.prototype.handleImageLinkBlur = function () {
  this.liveRegionNode.classList.remove('focus');
};

CarouselPreviousNext.prototype.handleMouseOver = function (event) {
  if (!this.pausePlayButtonNode.contains(event.target)) {
    this.hasHover = true;
  }
};

CarouselPreviousNext.prototype.handleMouseOut = function () {
  this.hasHover = false;
};

/* EVENT HANDLERS */

CarouselPreviousNext.prototype.handlePausePlayButtonClick = function () {
  this.hasUserActivatedPlay = !this.isPlayingEnabled;
  this.updatePlaying(!this.isPlayingEnabled);
};

CarouselPreviousNext.prototype.handlePreviousButtonClick = function () {
  this.previousCarouselItem();
};

CarouselPreviousNext.prototype.handleNextButtonClick = function () {
  this.nextCarouselItem();
};

/* Event Handlers for carousel items*/

CarouselPreviousNext.prototype.handleFocusIn = function () {
  this.liveRegionNode.setAttribute('aria-live', 'polite');
  this.hasFocus = true;
};

CarouselPreviousNext.prototype.handleFocusOut = function () {
  if (this.isPlayingEnabled) {
    this.liveRegionNode.setAttribute('aria-live', 'off');
  }
  this.hasFocus = false;
};

/* Initialize Carousel and options */

window.addEventListener(
  'load',
  function () {
    var carouselEls = document.querySelectorAll('.carousel');
    var carousels = [];

    // set example behavior based on
    // default setting of the checkboxes and the parameters in the URL
    // update checkboxes based on any corresponding URL parameters
    var checkboxes = document.querySelectorAll(
      '.carousel-options input[type=checkbox]'
    );
    var urlParams = new URLSearchParams(location.search);
    var carouselOptions = {};

    // initialize example features based on
    // default setting of the checkboxes and the parameters in the URL
    // update checkboxes based on any corresponding URL parameters
    checkboxes.forEach(function (checkbox) {
      var checked = checkbox.checked;

      if (urlParams.has(checkbox.value)) {
        var urlParam = urlParams.get(checkbox.value);
        if (typeof urlParam === 'string') {
          checked = urlParam === 'true';
          checkbox.checked = checked;
        }
      }

      carouselOptions[checkbox.value] = checkbox.checked;
    });

    carouselEls.forEach(function (node) {
      carousels.push(new CarouselPreviousNext(node, carouselOptions));
    });

    // add change event to checkboxes
    checkboxes.forEach(function (checkbox) {
      var updateEvent;
      switch (checkbox.value) {
        case 'moreaccessible':
          updateEvent = 'setAccessibleStyling';
          break;
        case 'norotate':
          updateEvent = 'enableOrDisableAutoRotation';
          break;
      }

      // update the carousel behavior and URL when a checkbox state changes
      checkbox.addEventListener('change', function (event) {
        urlParams.set(event.target.value, event.target.checked + '');
        window.history.replaceState(
          null,
          '',
          window.location.pathname + '?' + urlParams
        );

        if (updateEvent) {
          carousels.forEach(function (carousel) {
            carousel[updateEvent](event.target.checked);
          });
        }
      });
    });
  },
  false
);


'use strict';
var Meter = function (element) {
  this.rootEl = element;
  this.fillEl = element.querySelector('.fill');

  // set up min, max, and current value
  var min = element.getAttribute('aria-valuemin');
  var max = element.getAttribute('aria-valuemax');
  var value = element.getAttribute('aria-valuenow');
  this._update(parseFloat(min), parseFloat(max), parseFloat(value));
};

/* Private methods */

// returns a number representing a percentage between 0 - 100
Meter.prototype._calculatePercentFill = function (min, max, value) {
  if (
    typeof min !== 'number' ||
    typeof max !== 'number' ||
    typeof value !== 'number'
  ) {
    return 0;
  }

  return (100 * (value - min)) / (max - min);
};

// returns an hsl color string between red and green
Meter.prototype._getColorValue = function (percent) {
  // red is 0deg, green is 120deg in hsl
  // if percent is 100, hue should be red, and if percent is 0, hue should be green
  var hue = (percent / 100) * (0 - 120) + 120;

  return 'hsl(' + hue + ', 100%, 40%)';
};

// no return value; updates the meter element
Meter.prototype._update = function (min, max, value) {
  // update fill width
  if (min !== this.min || max !== this.max || value !== this.value) {
    var percentFill = this._calculatePercentFill(min, max, value);
    this.fillEl.style.width = percentFill + '%';
    this.fillEl.style.color = this._getColorValue(percentFill);
  }

  // update aria attributes
  if (min !== this.min) {
    this.min = min;
    this.rootEl.setAttribute('aria-valuemin', min + '');
  }

  if (max !== this.max) {
    this.max = max;
    this.rootEl.setAttribute('aria-valuemax', max + '');
  }

  if (value !== this.value) {
    this.value = value;
    this.rootEl.setAttribute('aria-valuenow', value + '');
  }
};

/* Public methods */

// no return value; modifies the meter element based on a new value
Meter.prototype.setValue = function (value) {
  if (typeof value !== 'number') {
    value = parseFloat(value);
  }

  if (!isNaN(value)) {
    this._update(this.min, this.max, value);
  }
};

/* Code for example page */

window.addEventListener('load', function () {
  // init meters
  var meterEls = document.querySelectorAll('[role=meter]');
  var meters = [];
  Array.prototype.slice.call(meterEls).forEach(function (meterEl) {
    meters.push(new Meter(meterEl));
  });

  // randomly update meter values

  // returns an id for setInterval
  function playMeters() {
    return window.setInterval(function () {
      meters.forEach(function (meter) {
        meter.setValue(Math.random() * 100);
      });
    }, 5000);
  }

  // start meters
  var updateInterval = playMeters();

  // play/pause meter updates
  var playButton = document.querySelector('.play-meters');
  playButton.addEventListener('click', function () {
    var isPaused = playButton.classList.contains('paused');

    if (isPaused) {
      updateInterval = playMeters();
      playButton.classList.remove('paused');
      playButton.innerHTML = 'Pause Updates';
    } else {
      clearInterval(updateInterval);
      playButton.classList.add('paused');
      playButton.innerHTML = 'Start Updates';
    }
  });
});


//<td><img src="${document.getElementById("url").value}" alt="Imagen de ${document.getElementById("nombre").value}" style="width: 150px; height: auto;"></td>