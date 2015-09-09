var raster = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: 'http://vmap0.tiles.osgeo.org/wms/vmap0',
    crossOrigin: null,
    params: {
      'LAYERS': 'basic',
      'VERSION': '1.1.1',
      'FORMAT': 'image/jpeg'
    }
  })
});

var vector = new ol.layer.Vector({
  source: new ol.source.Vector({
    parser: new ol.parser.KML({
      maxDepth: 1, dimension: 2, extractStyles: true, extractAttributes: true
    }),
    url: 'data/kml/lines.kml'
  })
});

var map = new ol.Map({
  layers: [raster, vector],
  renderer: ol.RendererHint.CANVAS,
  target: 'map',
  view: new ol.View2D({
    projection: 'EPSG:4326',
    center: [-112.169, 36.099],
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
        info.push(features[i].get('name'));
      }
      document.getElementById('info').innerHTML = info.join(', ') || '&nbsp';
    }
  });
});
