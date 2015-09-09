var raster = new ol.layer.Tile({
  source: new ol.source.OSM()
});

var vector = new ol.layer.Vector({
  source: new ol.source.Vector({
    parser: new ol.parser.GPX(),
    url: 'data/gpx/yahoo.xml'
  })
});

var map = new ol.Map({
  layers: [raster, vector],
  renderer: ol.RendererHint.CANVAS,
  target: 'map',
  view: new ol.View2D({
    center: [-7916461.9312699, 5226343.9091441],
    zoom: 11
  })
});

map.on(['click', 'mousemove'], function(evt) {
  map.getFeatures({
    pixel: evt.getPixel(),
    layers: [vector],
    success: function(featuresByLayer) {
      var features = featuresByLayer[0];
      var info = [];
      for (var i = 0, ii = features.length; i < ii; ++i) {
        info.push(features[i].get('name') + ': ' + features[i].get('type'));
      }
      document.getElementById('info').innerHTML = info.join(', ') || '&nbsp;';
    }
  });
});
