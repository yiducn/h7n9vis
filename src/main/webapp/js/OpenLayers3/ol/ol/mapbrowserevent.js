goog.provide('ol.MapBrowserEvent');
goog.provide('ol.MapBrowserEvent.EventType');
goog.provide('ol.MapBrowserEventHandler');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.style');
goog.require('ol.BrowserFeature');
goog.require('ol.Coordinate');
goog.require('ol.FrameState');
goog.require('ol.MapEvent');
goog.require('ol.Pixel');



/**
 * @constructor
 * @extends {ol.MapEvent}
 * @param {string} type Event type.
 * @param {ol.Map} map Map.
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @param {?ol.FrameState=} opt_frameState Frame state.
 */
ol.MapBrowserEvent = function(type, map, browserEvent, opt_frameState) {

  goog.base(this, type, map, opt_frameState);

  /**
   * @type {goog.events.BrowserEvent}
   */
  this.browserEvent = browserEvent;

  /**
   * @private
   * @type {ol.Coordinate}
   */
  this.coordinate_ = null;

  /**
   * @private
   * @type {ol.Pixel}
   */
  this.pixel_ = null;

};
goog.inherits(ol.MapBrowserEvent, ol.MapEvent);


/**
 * @return {ol.Coordinate} Coordinate.
 */
ol.MapBrowserEvent.prototype.getCoordinate = function() {
  if (goog.isNull(this.coordinate_)) {
    this.coordinate_ = this.map.getCoordinateFromPixel(this.getPixel());
  }
  return this.coordinate_;
};


/**
 * Get pixel offset of the event from the top-left corner of the map viewport.
 * @return {ol.Pixel} Pixel offset.
 */
ol.MapBrowserEvent.prototype.getPixel = function() {
  if (goog.isNull(this.pixel_)) {
    var eventPosition = goog.style.getRelativePosition(
        this.browserEvent, this.map.getViewport());
    this.pixel_ = [eventPosition.x, eventPosition.y];
  }
  return this.pixel_;
};


/**
 * @return {boolean} Do we have a left click?
 */
ol.MapBrowserEvent.prototype.isMouseActionButton = function() {
  // always assume a left-click on touch devices
  return ol.BrowserFeature.HAS_TOUCH ||
      this.browserEvent.isMouseActionButton();
};


/**
 * Prevents the default browser action.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/event.preventDefault
 * @override
 */
ol.MapBrowserEvent.prototype.preventDefault = function() {
  goog.base(this, 'preventDefault');
  this.browserEvent.preventDefault();
};


/**
 * Prevents further propagation of the current event.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/event.stopPropagation
 * @override
 */
ol.MapBrowserEvent.prototype.stopPropagation = function() {
  goog.base(this, 'stopPropagation');
  this.browserEvent.stopPropagation();
};



/**
 * @param {ol.Map} map The map with the viewport to listen to events on.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ol.MapBrowserEventHandler = function(map) {

  goog.base(this);

  /**
   * This is the element that we will listen to the real events on.
   * @type {ol.Map}
   * @private
   */
  this.map_ = map;

  /**
   * @type {boolean}
   * @private
   */
  this.dragged_ = false;

  /**
   * Timestamp for the first click of a double click. Will be set back to 0
   * as soon as a double click is detected.
   * @type {?number}
   * @private
   */
  this.timestamp_ = null;

  /**
   * @type {Array.<number>}
   * @private
   */
  this.listenerKeys_ = null;

  /**
   * @type {Array.<number>}
   * @private
   */
  this.dragListenerKeys_ = null;

  /**
   * @type {Array.<number>}
   * @private
   */
  this.touchListenerKeys_ = null;

  /**
   * @type {goog.events.BrowserEvent}
   * @private
   */
  this.down_ = null;

  var element = this.map_.getViewport();
  this.listenerKeys_ = [
    goog.events.listen(element,
        [goog.events.EventType.CLICK, goog.events.EventType.DBLCLICK],
        this.click_, false, this),
    goog.events.listen(element,
        goog.events.EventType.MOUSEDOWN,
        this.handleMouseDown_, false, this),
    goog.events.listen(element,
        goog.events.EventType.MOUSEMOVE,
        this.relayEvent_, false, this),
    goog.events.listen(element,
        goog.events.EventType.MOUSEOUT,
        this.relayEvent_, false, this),
    goog.events.listen(element,
        goog.events.EventType.CONTEXTMENU,
        this.relayEvent_, false, this)
  ];
  // touch events
  this.touchListenerKeys_ = [
    goog.events.listen(element, [
      goog.events.EventType.TOUCHSTART,
      goog.events.EventType.MSPOINTERDOWN
    ], this.handleTouchStart_, false, this),
    goog.events.listen(goog.global.document, [
      goog.events.EventType.TOUCHMOVE,
      goog.events.EventType.MSPOINTERMOVE
    ], this.handleTouchMove_, false, this),
    goog.events.listen(goog.global.document, [
      goog.events.EventType.TOUCHEND,
      goog.events.EventType.MSPOINTERUP
    ], this.handleTouchEnd_, false, this)
  ];

};
goog.inherits(ol.MapBrowserEventHandler, goog.events.EventTarget);


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.MapBrowserEventHandler.prototype.click_ = function(browserEvent) {
  if (!this.dragged_) {
    var newEvent;
    var type = browserEvent.type;
    if (this.timestamp_ === 0 || type == goog.events.EventType.DBLCLICK) {
      newEvent = new ol.MapBrowserEvent(
          ol.MapBrowserEvent.EventType.DBLCLICK, this.map_, browserEvent);
      this.dispatchEvent(newEvent);
    } else {
      newEvent = new ol.MapBrowserEvent(
          ol.MapBrowserEvent.EventType.CLICK, this.map_, browserEvent);
      this.dispatchEvent(newEvent);
    }
  }
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.MapBrowserEventHandler.prototype.handleMouseUp_ = function(browserEvent) {
  if (this.down_) {
    this.down_ = null;
    goog.array.forEach(this.dragListenerKeys_, goog.events.unlistenByKey);
    this.dragListenerKeys_ = null;
    if (this.dragged_) {
      var newEvent = new ol.MapBrowserEvent(
          ol.MapBrowserEvent.EventType.DRAGEND, this.map_, browserEvent);
      this.dispatchEvent(newEvent);
    }
  }
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.MapBrowserEventHandler.prototype.handleMouseDown_ = function(browserEvent) {
  var newEvent = new ol.MapBrowserEvent(
      ol.MapBrowserEvent.EventType.DOWN, this.map_, browserEvent);
  this.dispatchEvent(newEvent);
  if (!this.down_) {
    this.down_ = browserEvent;
    this.dragged_ = false;
    this.dragListenerKeys_ = [
      goog.events.listen(goog.global.document, goog.events.EventType.MOUSEMOVE,
          this.handleMouseMove_, false, this),
      goog.events.listen(goog.global.document, goog.events.EventType.MOUSEUP,
          this.handleMouseUp_, false, this)
    ];
    // prevent browser image dragging with the dom renderer
    browserEvent.preventDefault();
  }
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.MapBrowserEventHandler.prototype.handleMouseMove_ = function(browserEvent) {
  var newEvent;
  if (!this.dragged_) {
    this.dragged_ = true;
    newEvent = new ol.MapBrowserEvent(
        ol.MapBrowserEvent.EventType.DRAGSTART, this.map_, this.down_);
    this.dispatchEvent(newEvent);
  }
  newEvent = new ol.MapBrowserEvent(
      ol.MapBrowserEvent.EventType.DRAG, this.map_, browserEvent);
  this.dispatchEvent(newEvent);
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.MapBrowserEventHandler.prototype.relayEvent_ = function(browserEvent) {
  this.dispatchEvent(new ol.MapBrowserEvent(
      browserEvent.type, this.map_, browserEvent));
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.MapBrowserEventHandler.prototype.handleTouchStart_ = function(browserEvent) {
  // prevent context menu
  // When the IE pointer events are used, this prevents a
  // 'mousedown' from being fired after this event for the primary
  // contact (first finger on the screen or mouse)
  browserEvent.preventDefault();
  this.down_ = browserEvent;
  this.dragged_ = false;
  var newEvent = new ol.MapBrowserEvent(
      ol.MapBrowserEvent.EventType.TOUCHSTART, this.map_, browserEvent);
  this.dispatchEvent(newEvent);
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.MapBrowserEventHandler.prototype.handleTouchMove_ = function(browserEvent) {
  if (this.down_) {
    // 'touchmove' events are dispatched only when this.down_ is set
    // (set after a touch start) to prevent unwanted events when the
    // mouse hover the page. This only happens with the IE pointer
    // event system.
    this.dragged_ = true;
    var newEvent = new ol.MapBrowserEvent(
        ol.MapBrowserEvent.EventType.TOUCHMOVE, this.map_, browserEvent);
    this.dispatchEvent(newEvent);
  }
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.MapBrowserEventHandler.prototype.handleTouchEnd_ = function(browserEvent) {
  var newEvent = new ol.MapBrowserEvent(
      ol.MapBrowserEvent.EventType.TOUCHEND, this.map_, browserEvent);
  this.dispatchEvent(newEvent);
  if (!this.dragged_) {
    var now = goog.now();
    if (!this.timestamp_ || now - this.timestamp_ > 250) {
      this.timestamp_ = now;
    } else {
      this.timestamp_ = 0;
    }
    if (!goog.isNull(this.down_)) {
      this.click_(this.down_);
    }
  }
  this.down_ = null;
};


/**
 * FIXME empty description for jsdoc
 */
ol.MapBrowserEventHandler.prototype.disposeInternal = function() {
  if (!goog.isNull(this.listenerKeys_)) {
    goog.array.forEach(this.listenerKeys_, goog.events.unlistenByKey);
    this.listenerKeys_ = null;
  }
  if (!goog.isNull(this.dragListenerKeys_)) {
    goog.array.forEach(this.dragListenerKeys_, goog.events.unlistenByKey);
    this.dragListenerKeys_ = null;
  }
  if (!goog.isNull(this.touchListenerKeys_)) {
    goog.array.forEach(this.touchListenerKeys_, goog.events.unlistenByKey);
    this.touchListenerKeys_ = null;
  }
  goog.base(this, 'disposeInternal');
};


/**
 * Constants for event names.
 * @enum {string}
 */
ol.MapBrowserEvent.EventType = {
  CLICK: goog.events.EventType.CLICK,
  DBLCLICK: goog.events.EventType.DBLCLICK,
  DOWN: 'down',
  DRAGSTART: 'dragstart',
  DRAG: 'drag',
  DRAGEND: 'dragend',
  TOUCHSTART: goog.events.EventType.TOUCHSTART,
  TOUCHMOVE: goog.events.EventType.TOUCHMOVE,
  TOUCHEND: goog.events.EventType.TOUCHEND,
  MOUSEMOVE: goog.events.EventType.MOUSEMOVE,
  MOUSEOUT: goog.events.EventType.MOUSEOUT,
  CONTEXTMENU: goog.events.EventType.CONTEXTMENU
};
