var raster = new ol.layer.Tile({
  source: new ol.source.TileJSON({
    url: 'http://api.tiles.mapbox.com/v3/mapbox.geography-class.jsonp'
  })
});

var data = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    properties: {
      name: 'Null Island',
      population: 4000,
      rainfall: 500
    },
    geometry: {
      type: 'Point',
      coordinates: [0, 0]
    }
  }]
};

var style = new ol.style.Style({
  symbolizers: [
    new ol.style.Icon({
      url: 'data/icon.png',
      yOffset: -22
    })
  ]
});

var vector = new ol.layer.Vector({
  source: new ol.source.Vector({
    parser: new ol.parser.GeoJSON(),
    data: data
  }),
  style: style
});

var map = new ol.Map({
  layers: [raster, vector],
  renderer: ol.RendererHint.CANVAS,
  target: 'map',
  view: new ol.View2D({
    center: [0, 0],
    zoom: 3
  })
});

var element = document.getElementById('popup');

var popup = new ol.Overlay({
  element: element
});
map.addOverlay(popup);


map.on('click', function(evt) {
  map.getFeatures({
    pixel: evt.getPixel(),
    layers: [vector],
    success: function(layerFeatures) {
      var feature = layerFeatures[0][0];
      if (feature) {
        var geometry = feature.getGeometry();
        var coord = geometry.getCoordinates();
        popup.setPosition(coord);
        $(element).popover({
          'placement': 'top',
          'html': true,
          'content': feature.get('name')
        });
        $(element).popover('show');
      } else {
        $(element).popover('destroy');
      }
    }
  });
});
