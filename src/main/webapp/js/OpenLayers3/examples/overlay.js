var layer = new ol.layer.Tile({
  source: new ol.source.MapQuestOpenAerial()
});

var map = new ol.Map({
  layers: [layer],
  renderers: ol.RendererHints.createFromQueryData(),
  target: 'map',
  view: new ol.View2D({
    center: [0, 0],
    zoom: 2
  })
});

// Vienna label
var vienna = new ol.Overlay({
  position: ol.proj.transform(
      [16.3725, 48.208889], 'EPSG:4326', 'EPSG:3857'),
  element: document.getElementById('vienna')
});
map.addOverlay(vienna);

// Popup showing the position the user clicked
var popup = new ol.Overlay({
  element: document.getElementById('popup')
});
map.addOverlay(popup);

map.on('click', function(evt) {
  var element = popup.getElement();
  var coordinate = evt.getCoordinate();
  var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
      coordinate, 'EPSG:3857', 'EPSG:4326'));

  $(element).popover('destroy');
  popup.setPosition(coordinate);
  // the keys are quoted to prevent renaming in ADVANCED_OPTIMIZATIONS mode.
  $(element).popover({
    'placement': 'top',
    'animation': false,
    'html': true,
    'content': '<p>The location you clicked was:</p><code>' + hdms + '</code>'
  });
  $(element).popover('show');
});
