var map;
var mychart;

function init() {

	var mapStyle = document.getElementById('map').style;
	mapStyle.width = (window.innerWidth - 50) + 'px';
	mapStyle.height = (500) + 'px';
	// if this is just a coverage or a group of them, disable a few items,
	// and default to jpeg format

	/*
	 * var options = { controls: [], maxExtent: bounds, maxResolution:
	 * 0.2394056289062496, projection: new OpenLayers.Projection('EPSG:4326'),
	 * units: 'degrees', resolutions : resolutions };
	 */
	map = new OpenLayers.Map('map');

	map.addControl(new OpenLayers.Control.LayerSwitcher());

	var gmap = new OpenLayers.Layer.Google("Google Streets", // the default
	{
		numZoomLevels : 20,
		visibility : true
	});
	// map.addLayers([base,bj_road,bj_vertices,bj_subway_line,bj_subway_point,bj_firstaid_0,bj_firstaid_1]);
	map.addLayers([ gmap ]);

	var markers = new OpenLayers.Layer.Markers("禽流感人群", {
		visibility : true
	});
	map.addLayer(markers);
	var vector = new OpenLayers.Layer.Vector("Editable Vectors");

	map.addLayers([ vector ]);

	map.addControl(new OpenLayers.Control.EditingToolbar(vector));

	selectControl = new OpenLayers.Control.SelectFeature([ vector ], {

		clickout : true,
		toggle : false,
		multiple : false,
		hover : false,
		toggleKey : "ctrlKey", // ctrl key removes from selection
		multipleKey : "shiftKey" // shift key adds to selection
	}

	);

	map.addControl(selectControl);

	selectControl.activate();
	var j = 0;
	var size = new OpenLayers.Size(21, 25);
	var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
	var icon = new OpenLayers.Icon(
			'http://www.openlayers.org/dev/img/marker.png', size, offset);
	icon.url = 'http://labs.google.com/ridefinder/images/mm_20_yellow.png';

	for (i in H7N9) {
		marker = new OpenLayers.Marker(new OpenLayers.LonLat(H7N9[i].lon,
				H7N9[i].lat).transform(new OpenLayers.Projection("EPSG:4326"),
				map.getProjectionObject()), icon.clone());
		marker.setOpacity(1);
		marker.value = i;
		marker.id = j;
		j++;
		marker.events
				.register(
						'click',
						marker,
						function(evt) {
							icon.url = 'http://labs.google.com/ridefinder/images/mm_20_yellow.png';
						});
		markers.addMarker(marker);
	}

	map.addControl(new OpenLayers.Control.MousePosition({
		prefix : '<a></a>经纬度: ',
		separator : ' | ',
		numDigits : 2
	}));
	map.setCenter(new OpenLayers.LonLat(105.6670345, 38.0121105).transform(
			new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()),
			0);

	// build up all controls
	map.addControl(new OpenLayers.Control.Zoom());
	map.addControl(new OpenLayers.Control.Navigation());

}