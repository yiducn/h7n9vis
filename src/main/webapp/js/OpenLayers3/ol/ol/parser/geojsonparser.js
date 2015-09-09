goog.provide('ol.parser.GeoJSON');

goog.require('goog.asserts');
goog.require('goog.object');
goog.require('ol.Feature');
goog.require('ol.geom.Geometry');
goog.require('ol.geom.GeometryCollection');
goog.require('ol.geom.GeometryType');
goog.require('ol.geom.LineString');
goog.require('ol.geom.MultiLineString');
goog.require('ol.geom.MultiPoint');
goog.require('ol.geom.MultiPolygon');
goog.require('ol.geom.Point');
goog.require('ol.geom.Polygon');
goog.require('ol.geom.SharedVertices');
goog.require('ol.parser.Parser');
goog.require('ol.parser.ReadFeaturesOptions');
goog.require('ol.parser.ReadFeaturesResult');
goog.require('ol.parser.StringFeatureParser');



/**
 * Read and write [GeoJSON](http://geojson.org/)
 *
 * @constructor
 * @implements {ol.parser.StringFeatureParser}
 * @extends {ol.parser.Parser}
 */
ol.parser.GeoJSON = function() {};
goog.inherits(ol.parser.GeoJSON, ol.parser.Parser);
goog.addSingletonGetter(ol.parser.GeoJSON);


/**
 * Parse a GeoJSON string.
 * @param {string} str GeoJSON string.
 * @return {ol.Feature|Array.<ol.Feature>|
 *    ol.geom.Geometry|Array.<ol.geom.Geometry>} Parsed geometry or array
 *    of geometries.
 */
ol.parser.GeoJSON.prototype.read = function(str) {
  var json = /** @type {GeoJSONObject} */ (JSON.parse(str));
  return this.parse_(json);
};


/**
 * Parse a GeoJSON string.
 * @param {string} str GeoJSON string.
 * @return {ol.Feature|Array.<ol.Feature>|
 *    ol.geom.Geometry|Array.<ol.geom.Geometry>} Parsed geometry or array
 *    of geometries.
 */
ol.parser.GeoJSON.read = function(str) {
  return ol.parser.GeoJSON.getInstance().read(str);
};


/**
 * Parse a GeoJSON feature collection.
 * @param {string} str GeoJSON feature collection.
 * @param {ol.parser.ReadFeaturesOptions=} opt_options Reader options.
 * @return {ol.parser.ReadFeaturesResult} Features and metadata.
 */
ol.parser.GeoJSON.prototype.readFeaturesFromString =
    function(str, opt_options) {
  var json = /** @type {GeoJSONFeatureCollection} */ (JSON.parse(str));
  return this.parseAsFeatureCollection_(json, opt_options);
};


/**
 * Parse a GeoJSON feature collection from decoded JSON.
 * @param {GeoJSONFeatureCollection} object GeoJSON feature collection decoded
 *     from JSON.
 * @param {ol.parser.ReadFeaturesOptions=} opt_options Reader options.
 * @return {ol.parser.ReadFeaturesResult} Features and metadata.
 */
ol.parser.GeoJSON.prototype.readFeaturesFromObject =
    function(object, opt_options) {
  return this.parseAsFeatureCollection_(object, opt_options);
};


/**
 * Parse any GeoJSON object.  Note that this method should not be called
 * recursively due to the shared vertex creation.
 *
 * @param {GeoJSONObject} json GeoJSON object.
 * @param {ol.parser.ReadFeaturesOptions=} opt_options Reader options.
 * @return {ol.Feature|Array.<ol.Feature>|
 *    ol.geom.Geometry|Array.<ol.geom.Geometry>} Parsed geometry or array
 *    of geometries.
 * @private
 */
ol.parser.GeoJSON.prototype.parse_ = function(json, opt_options) {
  var result;
  if (json.type === 'FeatureCollection') {
    result = this.parseFeatureCollection_(
        /** @type {GeoJSONFeatureCollection} */ (json), opt_options);
  } else if (json.type === 'Feature') {
    result = this.parseFeature_(
        /** @type {GeoJSONFeature} */ (json), opt_options);
  } else if (json.type === 'GeometryCollection') {
    result = this.parseGeometryCollection_(
        /** @type {GeoJSONGeometryCollection} */ (json), opt_options);
  } else {
    // we've been called with a geometry or an unknown object
    // create a feature to get shared vertices handling
    var feature = this.parseFeature_(
        /** @type {GeoJSONFeature} */ ({type: 'Feature', geometry: json}),
        opt_options);
    result = feature.getGeometry();
  }
  return result;
};


/**
 * @param {GeoJSONObject} json GeoJSON object.
 * @param {ol.parser.ReadFeaturesOptions=} opt_options Reader options.
 * @return {ol.parser.ReadFeaturesResult} Parsed object coerced into array of
 *     features.
 * @private
 */
ol.parser.GeoJSON.prototype.parseAsFeatureCollection_ = function(json,
    opt_options) {
  var obj = this.parse_(json, opt_options);
  var features = [];
  var feature;
  if (obj instanceof ol.Feature) {
    features = [obj];
  } else if (obj instanceof ol.geom.Geometry) {
    feature = new ol.Feature();
    feature.setGeometry(obj);
    features = [feature];
  } else if (goog.isArray(obj)) {
    var item, geomArray;
    for (var i = 0, ii = obj.length; i < ii; ++i) {
      item = obj[i];
      geomArray = geomArray || (item instanceof ol.geom.Geometry);
      if (!geomArray) {
        goog.asserts.assert(item instanceof ol.Feature, 'expected feature');
        features = obj;
        break;
      } else {
        feature = new ol.Feature();
        feature.setGeometry(item);
        features[i] = feature;
      }
    }
  }
  var projection = 'EPSG:4326';
  if (goog.isDefAndNotNull(json.crs)) {
    var crs = json.crs;
    if (crs.type === 'name') {
      projection = (/** GeoJSONCRSName */ (crs.properties)).name;
    }
  }
  return {features: features, metadata: {projection: projection}};
};


/**
 * @param {GeoJSONFeature} json GeoJSON feature.
 * @param {ol.parser.ReadFeaturesOptions=} opt_options Read options.
 * @return {ol.Feature} Parsed feature.
 * @private
 */
ol.parser.GeoJSON.prototype.parseFeature_ = function(json, opt_options) {
  var geomJson = json.geometry,
      geometry = null,
      options = opt_options || {};
  var feature = new ol.Feature(json.properties);
  if (goog.isDef(json.id)) {
    feature.setId(json.id);
  }
  if (geomJson) {
    var type = geomJson.type;
    var callback = options.callback;
    var sharedVertices;
    if (callback) {
      goog.asserts.assert(type in ol.parser.GeoJSON.GeometryType,
          'Bad geometry type: ' + type);
      sharedVertices = callback(feature, ol.parser.GeoJSON.GeometryType[type]);
    }
    switch (type) {
      case 'Point':
        geometry = this.parsePoint_(geomJson, sharedVertices);
        break;
      case 'LineString':
        geometry = this.parseLineString_(geomJson, sharedVertices);
        break;
      case 'Polygon':
        geometry = this.parsePolygon_(geomJson, sharedVertices);
        break;
      case 'MultiPoint':
        geometry = this.parseMultiPoint_(geomJson, sharedVertices);
        break;
      case 'MultiLineString':
        geometry = this.parseMultiLineString_(geomJson, sharedVertices);
        break;
      case 'MultiPolygon':
        geometry = this.parseMultiPolygon_(geomJson, sharedVertices);
        break;
      default:
        throw new Error('Bad geometry type: ' + type);
    }
    feature.setGeometry(geometry);
  }
  return feature;
};


/**
 * @param {GeoJSONFeatureCollection} json GeoJSON feature collection.
 * @param {ol.parser.ReadFeaturesOptions=} opt_options Read options.
 * @return {Array.<ol.Feature>} Parsed array of features.
 * @private
 */
ol.parser.GeoJSON.prototype.parseFeatureCollection_ = function(
    json, opt_options) {
  var features = json.features,
      len = features.length,
      result = new Array(len),
      i;

  for (i = 0; i < len; ++i) {
    result[i] = this.parseFeature_(
        /** @type {GeoJSONFeature} */ (features[i]), opt_options);
  }
  return result;
};


/**
 * @param {GeoJSONGeometryCollection} json GeoJSON geometry collection.
 * @param {ol.parser.ReadFeaturesOptions=} opt_options Read options.
 * @return {Array.<ol.geom.Geometry>} Parsed array of geometries.
 * @private
 */
ol.parser.GeoJSON.prototype.parseGeometryCollection_ = function(json,
    opt_options) {
  var geometries = json.geometries,
      len = geometries.length,
      result = new Array(len),
      i;

  for (i = 0; i < len; ++i) {
    result[i] = this.parse_(/** @type {GeoJSONGeometry} */ (geometries[i]),
        opt_options);
  }
  return result;
};


/**
 * @param {GeoJSONGeometry} json GeoJSON linestring.
 * @param {ol.geom.SharedVertices=} opt_vertices Shared vertices.
 * @return {ol.geom.LineString} Parsed linestring.
 * @private
 */
ol.parser.GeoJSON.prototype.parseLineString_ = function(json, opt_vertices) {
  return new ol.geom.LineString(json.coordinates, opt_vertices);
};


/**
 * @param {GeoJSONGeometry} json GeoJSON multi-linestring.
 * @param {ol.geom.SharedVertices=} opt_vertices Shared vertices.
 * @return {ol.geom.MultiLineString} Parsed multi-linestring.
 * @private
 */
ol.parser.GeoJSON.prototype.parseMultiLineString_ = function(
    json, opt_vertices) {
  return new ol.geom.MultiLineString(json.coordinates, opt_vertices);
};


/**
 * @param {GeoJSONGeometry} json GeoJSON multi-point.
 * @param {ol.geom.SharedVertices=} opt_vertices Shared vertices.
 * @return {ol.geom.MultiPoint} Parsed multi-point.
 * @private
 */
ol.parser.GeoJSON.prototype.parseMultiPoint_ = function(json, opt_vertices) {
  return new ol.geom.MultiPoint(json.coordinates, opt_vertices);
};


/**
 * @param {GeoJSONGeometry} json GeoJSON multi-polygon.
 * @param {ol.geom.SharedVertices=} opt_vertices Shared vertices.
 * @return {ol.geom.MultiPolygon} Parsed multi-polygon.
 * @private
 */
ol.parser.GeoJSON.prototype.parseMultiPolygon_ = function(json, opt_vertices) {
  return new ol.geom.MultiPolygon(json.coordinates, opt_vertices);
};


/**
 * @param {GeoJSONGeometry} json GeoJSON point.
 * @param {ol.geom.SharedVertices=} opt_vertices Shared vertices.
 * @return {ol.geom.Point} Parsed point.
 * @private
 */
ol.parser.GeoJSON.prototype.parsePoint_ = function(json, opt_vertices) {
  return new ol.geom.Point(json.coordinates, opt_vertices);
};


/**
 * @param {GeoJSONGeometry} json GeoJSON polygon.
 * @param {ol.geom.SharedVertices=} opt_vertices Shared vertices.
 * @return {ol.geom.Polygon} Parsed polygon.
 * @private
 */
ol.parser.GeoJSON.prototype.parsePolygon_ = function(json, opt_vertices) {
  return new ol.geom.Polygon(json.coordinates, opt_vertices);
};


/**
 * @param {ol.geom.Geometry} geometry Geometry to encode.
 * @return {GeoJSONGeometry} GeoJSON geometry.
 * @private
 */
ol.parser.GeoJSON.prototype.encodeGeometry_ = function(geometry) {
  var type = geometry.getType();
  return /** @type {GeoJSONGeometry} */({
    type: goog.object.findKey(ol.parser.GeoJSON.GeometryType,
        function(value, key) {
          return value === type;
        }
    ),
    coordinates: geometry.getCoordinates()
  });
};


/**
 * @param {ol.geom.GeometryCollection} collection Geometry collection to
 *     encode.
 * @return {GeoJSONGeometryCollection} GeoJSON geometry collection.
 * @private
 */
ol.parser.GeoJSON.prototype.encodeGeometryCollection_ = function(collection) {
  var geometries = [];
  for (var i = 0, ii = collection.components.length; i < ii; ++i) {
    geometries.push(this.encodeGeometry_(collection.components[i]));
  }
  return /** @type {GeoJSONGeometryCollection} */({
    type: 'GeometryCollection',
    geometries: geometries
  });
};


/**
 * @param {Array.<ol.Feature>} collection Feature collection to encode.
 * @return {GeoJSONFeatureCollection} GeoJSON feature collection.
 * @private
 */
ol.parser.GeoJSON.prototype.encodeFeatureCollection_ = function(collection) {
  var features = [];
  for (var i = 0, ii = collection.length; i < ii; ++i) {
    features.push(this.encodeFeature_(collection[i]));
  }
  return /** @type {GeoJSONFeatureCollection} */({
    type: 'FeatureCollection',
    features: features
  });
};


/**
 * @param {ol.Feature} feature Feature to encode.
 * @return {GeoJSONFeature} GeoJSON feature.
 * @private
 */
ol.parser.GeoJSON.prototype.encodeFeature_ = function(feature) {
  var geometry = feature.getGeometry(),
      attributes = feature.getAttributes();
  var properties = goog.object.filter(attributes,
      function(element, index, array) {
        return !(element instanceof ol.geom.Geometry);
      });
  return /** @type {GeoJSONFeature} */({
    type: 'Feature',
    properties: properties,
    geometry: this.encodeGeometry_(geometry)
  });
};


/**
 * @param {ol.geom.GeometryCollection|ol.geom.Geometry|Array.<ol.Feature>|
 *     ol.Feature} obj The object to encode.
 * @return {string} The GeoJSON as string.
 * @private
 */
ol.parser.GeoJSON.prototype.encode_ = function(obj) {
  var result;
  if (obj instanceof ol.geom.GeometryCollection) {
    result = this.encodeGeometryCollection_(obj);
  } else if (obj instanceof ol.geom.Geometry) {
    result = this.encodeGeometry_(obj);
  } else if (obj instanceof ol.Feature) {
    result = this.encodeFeature_(obj);
  } else if (goog.isArray(obj)) {
    result = this.encodeFeatureCollection_(obj);
  }
  return JSON.stringify(result);
};


/**
 * Write out a geometry, geometry collection, feature or an array of features
 *     as a GeoJSON string.
 * @param {ol.geom.Geometry|ol.geom.GeometryCollection|ol.Feature|
 *     Array.<ol.Feature>} obj The object to encode.
 * @return {string} GeoJSON for the geometry.
 */
ol.parser.GeoJSON.write = function(obj) {
  return ol.parser.GeoJSON.getInstance().write(obj);
};


/**
 * Write out a geometry, geometry collection, feature or an array of features
 *     as a GeoJSON string.
 * @param {ol.geom.Geometry|ol.geom.GeometryCollection|ol.Feature|
 *     Array.<ol.Feature>} obj The object to encode.
 * @return {string} GeoJSON for the geometry.
 */
ol.parser.GeoJSON.prototype.write = function(obj) {
  return this.encode_(obj);
};


/**
 * @enum {ol.geom.GeometryType}
 */
ol.parser.GeoJSON.GeometryType = {
  'Point': ol.geom.GeometryType.POINT,
  'LineString': ol.geom.GeometryType.LINESTRING,
  'Polygon': ol.geom.GeometryType.POLYGON,
  'MultiPoint': ol.geom.GeometryType.MULTIPOINT,
  'MultiLineString': ol.geom.GeometryType.MULTILINESTRING,
  'MultiPolygon': ol.geom.GeometryType.MULTIPOLYGON,
  'GeometryCollection': ol.geom.GeometryType.GEOMETRYCOLLECTION
};
