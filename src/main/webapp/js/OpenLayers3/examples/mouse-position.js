var mousePositionControl = new ol.control.MousePosition({
  coordinateFormat: ol.coordinate.createStringXY(4),
  projection: 'EPSG:4326',
  // comment the following two lines to have the mouse position
  // be placed within the map.
  className: 'custom-mouse-position',
  target: document.getElementById('mouse-position'),
  undefinedHTML: '&nbsp;'
});

var map = new ol.Map({
  controls: ol.control.defaults().extend([mousePositionControl]),
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  renderers: ol.RendererHints.createFromQueryData(),
  target: 'map',
  view: new ol.View2D({
    center: [0, 0],
    zoom: 2
  })
});

var projectionSelect = new ol.dom.Input(document.getElementById('projection'));
projectionSelect.on('change:value', function() {
  mousePositionControl.setProjection(ol.proj.get(projectionSelect.getValue()));
});

var precisionInput = new ol.dom.Input(document.getElementById('precision'));
precisionInput.on('change:value', function() {
  var format = ol.coordinate.createStringXY(precisionInput.getValue());
  mousePositionControl.setCoordinateFormat(format);
});
