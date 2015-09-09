var styleArray = [ 
    [new ol.style.Style({
		image : new ol.style.Icon({
			anchor : [ 0.5, 46 ],
			anchorXUnits : 'fraction',
			anchorYUnits : 'pixels',
			src : 'data/male.png'
		})
	})],
	[ new ol.style.Style({
		image : new ol.style.Icon({
			anchor : [ 0.5, 46 ],
			anchorXUnits : 'fraction',
			anchorYUnits : 'pixels',
			src : 'data/female.png'
		})
	})]
];


var layers = [];

layers.push(new ol.layer.Tile({
	source : new ol.source.TileWMS({
		url : 'http://vmap0.tiles.osgeo.org/wms/vmap0',
		params : {
			'VERSION' : '1.1.1',
			'LAYERS' : 'basic',
			'FORMAT' : 'image/jpeg'
		}
	})
}));

for(var i=0; i<H7N9.length;i++)
layers.push(new ol.layer.Vector({
	projection : 'EPSG:4326',
	source : new ol.source.GeoJSON(
	({
		projection : 'EPSG:4326',
		reprojectTo :'EPSG:4326',
		object : {
			'type' : 'FeatureCollection',
			'features' : [ {
				'type' : 'Feature',
				'properties' : {
					'name' :  H7N9[i].sex,
					'population' : 4000,
					'rainfall' : 500
				},
				'geometry' : {
					'type' : 'Point',
					'coordinates' : [ H7N9[i].lon, H7N9[i].lat ]
				}
			} ]
		}
	})),
	styleFunction : function(feature, resolution) {
		if(0 == feature.values_.name) return styleArray[1];
		if(1 == feature.values_.name) return styleArray[0];
	}
}));
var map = new ol.Map({
	layers : layers,
	renderer : ol.RendererHint.CANVAS,
	target : 'map',
	view : new ol.View2D({
		projection : 'EPSG:4326',
		center : [ 105.6670345, 38.0121105 ],
		zoom : 4
	})
});


var element = document.getElementById('popup');

var popup = new ol.Overlay({
	element : element,
	positioning : ol.OverlayPositioning.BOTTOM_CENTER,
	stopEvent : false
});
map.addOverlay(popup);

// display popup on click
map.on('singleclick', function(evt) {
	var feature = map.forEachFeatureAtPixel(evt.getPixel(), function(feature,
			layer) {
		return feature;
	});
	if (feature) {
		var geometry = feature.getGeometry();
		var coord = geometry.getCoordinates();
		popup.setPosition(coord);
		$(element).popover({
			'placement' : 'top',
			'html' : true,
			'content' :  '患者:' + H7N9[feature.values_.name].name + '<br/>区(县):'
			+ H7N9[feature.values_.name].county + '<br/>地址:'
			+ H7N9[feature.values_.name].addr
		});
		$(element).popover('show');
	} else {
		$(element).popover('destroy');
	}
});