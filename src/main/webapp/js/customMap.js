//myMap.js
//javascript to create web map displaying Google base map
//with custom overlays from geoserver wms and kml
 
(function () {
  window.onload = function () {
 
    // Create a MapOptions object with the required properties for base map
    // Centered on Lincolnshire, UK
    var mapOptions = {
      zoom: 9, 
      center: new google.maps.LatLng(15, 115),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    // Create the base map
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
 
    //Define custom WMS layer for census output areas in WGS84
    var censusLayer =
     new google.maps.ImageMapType(
     {
       getTileUrl:
      function (coord, zoom) {
        // Compose URL for overlay tile
 
        var s = Math.pow(2, zoom); 
        var twidth = 256;
        var theight = 256;
 
        //latlng bounds of the 4 corners of the google tile
        //Note the coord passed in represents the top left hand (NW) corner of the tile.
        var gBl = map.getProjection().fromPointToLatLng(
          new google.maps.Point(coord.x * twidth / s, (coord.y + 1) * theight / s)); // bottom left / SW
        var gTr = map.getProjection().fromPointToLatLng(
          new google.maps.Point((coord.x + 1) * twidth / s, coord.y * theight / s)); // top right / NE
 
        // Bounding box coords for tile in WMS pre-1.3 format (x,y)
        var bbox = gBl.lng() + "," + gBl.lat() + "," + gTr.lng() + "," + gTr.lat();
 
        //base WMS URL
        var url = "http://mywebserver/geoserver/lincs/wms?";
 
        url += "&service=WMS";           //WMS service
        url += "&version=1.1.0";         //WMS version
        url += "&request=GetMap";        //WMS operation
        url += "&layers=census_oa_2001"; //WMS layers to draw
        url += "&styles=";               //use default style
        url += "&format=image/png";      //image format
        url += "&TRANSPARENT=TRUE";      //only draw areas where we have data
        url += "&srs=EPSG:4326";         //projection WGS84
        url += "&bbox=" + bbox;          //set bounding box for tile
        url += "&width=256";             //tile size used by google
        url += "&height=256";
        //url += "&tiled=true";
 
        return url;                 //return WMS URL for the tile 
      }, //getTileURL
 
      tileSize: new google.maps.Size(256, 256),
      opacity: 0.85,
      isPng: true
     });
 
    // add WMS layer to map
    // google maps will end up calling the getTileURL for each tile in the map view
    map.overlayMapTypes.push(censusLayer);
 
    // define kml layer
    // set base WMS URL for kml request
    var kmlUrl = "http://cybergis.cnic.cn/geoserver/lincs/wms/reflect?";
 
    kmlUrl += "&version=1.1.0";              //WMS version
    kmlUrl += "&layers=study_area_poly";     //WMS layers
    kmlUrl += "&viewparams=analysis_id:177"; //analysis_id parameter for query filter
    kmlUrl += "&styles=";
    kmlUrl += "&format=kml";
 
    var kmlOptions = {
      map: map,              // the map that the kml layer will be added to
      url: kmlUrl,           // the url for the kml data
      preserveViewport: true // do not adjust map location and zoom
    };
 
    // add the kml layer to the map
    studyLayer = new google.maps.KmlLayer(kmlOptions);
 
  };
 
})();