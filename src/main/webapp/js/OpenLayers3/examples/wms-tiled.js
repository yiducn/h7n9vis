var layers = [
  new ol.layer.Tile({
    source: new ol.source.MapQuestOpenAerial()
  }),
  new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'http://demo.opengeo.org/geoserver/wms',
      params: {'LAYERS': 'topp:states', 'TILED': true},
      extent: [-13884991, 2870341, -7455066, 6338219]
    })
  })
];
var map = new ol.Map({
  renderer: ol.RendererHint.CANVAS,
  layers: layers,
  target: 'map',
  view: new ol.View2D({
    center: [-10997148, 4569099],
    zoom: 4
  })
});
