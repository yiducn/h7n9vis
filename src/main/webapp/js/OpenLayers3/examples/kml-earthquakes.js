var style = new ol.style.Style({
  symbolizers: [
    new ol.style.Shape({
      size: ol.expr.parse('5 + 20 * (magnitude - 5)'),
      fill: new ol.style.Fill({
        color: '#ff9900',
        opacity: 0.4
      }),
      stroke: new ol.style.Stroke({
        color: '#ffcc00',
        opacity: 0.2
      })
    })
  ]
});

var vector = new ol.layer.Vector({
  source: new ol.source.Vector({
    parser: new ol.parser.KML({dimension: 2}),
    url: 'data/kml/2012_Earthquakes_Mag5.kml'
  }),
  style: style
});

var raster = new ol.layer.Tile({
  source: new ol.source.Stamen({
    layer: 'toner'
  })
});

var map = new ol.Map({
  layers: [raster, vector],
  renderer: ol.RendererHint.CANVAS,
  target: 'map',
  view: new ol.View2D({
    center: [0, 0],
    zoom: 2
  })
});

var info = $('#info');
info.tooltip({
  animation: false,
  trigger: 'manual'
});
map.on(['click', 'mousemove'], function(evt) {
  var pixel = evt.getPixel();
  info.css({
    left: pixel[0] + 'px',
    top: (pixel[1] - 15) + 'px'
  });
  map.getFeatures({
    pixel: pixel,
    layers: [vector],
    success: function(layerFeatures) {
      var feature = layerFeatures[0][0];
      if (feature) {
        info.tooltip('hide')
            .attr('data-original-title', feature.get('name'))
            .tooltip('fixTitle')
            .tooltip('show');
      } else {
        info.tooltip('hide');
      }
    }
  });
});
