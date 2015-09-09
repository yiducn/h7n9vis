goog.provide('ol.layer.Layer');

goog.require('goog.asserts');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.object');
goog.require('ol.layer.Base');
goog.require('ol.source.Source');



/**
 * @constructor
 * @extends {ol.layer.Base}
 * @param {ol.layer.LayerOptions} options Layer options.
 */
ol.layer.Layer = function(options) {

  var baseOptions = /** @type {ol.layer.LayerOptions} */
      (goog.object.clone(options));
  delete baseOptions.source;

  goog.base(this, baseOptions);

  /**
   * @private
   * @type {ol.source.Source}
   */
  this.source_ = options.source;

  goog.events.listen(this.source_, goog.events.EventType.CHANGE,
      this.handleSourceChange_, false, this);

};
goog.inherits(ol.layer.Layer, ol.layer.Base);


/**
 * @inheritDoc
 */
ol.layer.Layer.prototype.getLayersArray = function(opt_array) {
  var array = (goog.isDef(opt_array)) ? opt_array : [];
  array.push(this);
  return array;
};


/**
 * @inheritDoc
 */
ol.layer.Layer.prototype.getLayerStatesArray = function(opt_obj) {
  var obj = (goog.isDef(opt_obj)) ? opt_obj : {
    layers: [],
    layerStates: []
  };
  goog.asserts.assert(obj.layers.length === obj.layerStates.length);
  obj.layers.push(this);
  obj.layerStates.push(this.getLayerState());
  return obj;
};


/**
 * @return {ol.source.Source} Source.
 */
ol.layer.Layer.prototype.getSource = function() {
  return this.source_;
};


/**
 * @private
 */
ol.layer.Layer.prototype.handleSourceChange_ = function() {
  this.dispatchChangeEvent();
};


/**
 * @inheritDoc
 */
ol.layer.Layer.prototype.isReady = function() {
  return this.getSource().isReady();
};
