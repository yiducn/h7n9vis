var styles = ['Road', 'Aerial', 'AerialWithLabels'];
var layers = [];
for (var i = 0; i < styles.length; ++i) {
  layers.push(new ol.layer.Tile({
    visible: false,
    preload: Infinity,
    source: new ol.source.BingMaps({
      key: 'Ar33pRUvQOdESG8m_T15MUmNz__E1twPo42bFx9jvdDePhX0PNgAcEm44OVTS7tt',
      style: styles[i]
    })
  }));
}
var map = new ol.Map({
  layers: layers,
  renderers: ol.RendererHints.createFromQueryData(),
  target: 'map',
  view: new ol.View2D({
    center: ol.proj.transform([-123.1, 49.25], 'EPSG:4326', 'EPSG:3857'),
    zoom: 8
  })
});

$('#layer-select').change(function() {
  var style = $(this).find(':selected').val();
  for (var i = 0; i < layers.length; ++i) {
    layers[i].setVisible(styles[i] == style);
  }
});
$('#layer-select').trigger('change');
