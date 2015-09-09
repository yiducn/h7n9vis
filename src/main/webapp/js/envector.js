Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
/////////
var dataPc = [];

var genderMapping = {
	1: 'Male', 
	2: 'Female',
	3: 'Unknown'
};
//var genderMappingLan ={'Male':'male','Female':'female','Unknown':'unknown'};

var statusMapping = {
		"1":	"Dead",
		"2":	"Very Heavy",
		"3":	"Heavy",
		"4":	"Light",
		"5":	"Good",
		"6":    "Unknown",
};

var  gender = { 
	1: 'male', 
	2: 'female',
	3: 'unknown'
};

var ageRange = {
		1: '1',
		2: '2',
		3:	'3',
		4:	'4',
		5:	'5',
		6:	'6',
		7:	'7',
		8:	'8',
		9:	'9',
};

var statusRange = {
		1:	"dead",
		2:	"veryheavy",
		3:	"heavy",
		4:	"light",
		5:	"good",
		6:"unknown",
};

// var birdfluen = [];

var currentLengad;

//时间范围
	var dateRange = ["2013-01-09", new Date().Format("yyyy-MM-dd")];

var symbolizers_lookup = {
	'male': {  
		    'cursor':'pointer',
		    'graphicName': 'circle',
            'pointRadius': '5',
            'strokeColor': '#C8C8C8',
            'strokeWidth': '1',
            'fillColor': 'RGB(91,192,222)',
            'fillOpacity': '1'
	},
	'female': {  
		   'cursor':'pointer',
           'graphicName': 'circle',
            'pointRadius': '5',
            'strokeColor': '#C8C8C8',
            'strokeWidth': '1',
           'fillColor': 'RGB(217,83,79)',
            'fillOpacity': '1'
   }
};


var symbolizers_lookup_age = {
	'1': {  
		    'cursor':'pointer',
		    'graphicName': 'circle',
            'pointRadius': '5',
            'strokeColor': '#C8C8C8',
            'strokeWidth': '1',
           'fillColor': 'RGB(153,153,153)',
            'fillOpacity': '1'
	},
	'2': {  
		   'cursor':'pointer',
           'graphicName': 'circle',
            'pointRadius': '5',
            'strokeColor': '#C8C8C8',
            'strokeWidth': '1',
            'fillColor': 'RGB(153,153,153)',
            'fillOpacity': '1'
   },
	'3': {  
		   'cursor':'pointer',
        'graphicName': 'circle',
         'pointRadius': '5',
         'strokeColor': '#C8C8C8',
         'strokeWidth': '1',
        'fillColor': 'RGB(66,139,202)',
         'fillOpacity': '1'
},
	'4': {  
		   'cursor':'pointer',
        'graphicName': 'circle',
         'pointRadius': '5',
         'strokeColor': '#C8C8C8',
         'strokeWidth': '1',
        'fillColor': 'RGB(66,139,202)',
         'fillOpacity': '1'
},
	'5': {  
		   'cursor':'pointer',
        'graphicName': 'circle',
         'pointRadius': '5',
         'strokeColor': '#C8C8C8',
         'strokeWidth': '1',
        'fillColor': 'RGB(92,184,92)',
         'fillOpacity': '1'
},
	'6': {  
		   'cursor':'pointer',
        'graphicName': 'circle',
         'pointRadius': '5',
         'strokeColor': '#C8C8C8',
         'strokeWidth': '1',
        'fillColor': 'RGB(92,184,92)',
         'fillOpacity': '1'
},
	'7': {  
		   'cursor':'pointer',
        'graphicName': 'circle',
         'pointRadius': '5',
         'strokeColor': '#C8C8C8',
         'strokeWidth': '1',
        'fillColor': 'RGB(91,192,222)',
         'fillOpacity': '1'
},
	'8': {  
		   'cursor':'pointer',
        'graphicName': 'circle',
         'pointRadius': '5',
         'strokeColor': '#C8C8C8',
         'strokeWidth': '1',
        'fillColor': 'RGB(91,192,222)',
         'fillOpacity': '1'
},
'8': {  
	   'cursor':'pointer',
 'graphicName': 'circle',
  'pointRadius': '5',
  'strokeColor': '#C8C8C8',
  'strokeWidth': '1',
 'fillColor': 'RGB(240,173,78)',
  'fillOpacity': '1'
}
};

var symbolizers_lookup_status = {
		'dead': {  
			    'cursor':'pointer',
			    'graphicName': 'circle',
	            'pointRadius': '5',
	            'strokeColor': '#C8C8C8',
	            'strokeWidth': '1',
	           'fillColor': 'RGB(217,83,79)',
	            'fillOpacity': '1'
		},
		'veryheavy': {  
			   'cursor':'pointer',
	           'graphicName': 'circle',
	            'pointRadius': '5',
	            'strokeColor': '#C8C8C8',
	            'strokeWidth': '1',
	           'fillColor': 'RGB(240,173,78)',
	            'fillOpacity': '1'
	   },
		'heavy': {  
			   'cursor':'pointer',
	        'graphicName': 'circle',
	         'pointRadius': '5',
	         'strokeColor': '#C8C8C8',
	         'strokeWidth': '1',
	        'fillColor': 'RGB(240,173,78)',
	         'fillOpacity': '1'
	},
	'light': {  
		   'cursor':'pointer',
     'graphicName': 'circle',
      'pointRadius': '5',
      'strokeColor': '#C8C8C8',
      'strokeWidth': '1',
     'fillColor': 'RGB(91,192,222)',
      'fillOpacity': '1'
},
	'good': {  
		   'cursor':'pointer',
     'graphicName': 'circle',
      'pointRadius': '5',
      'strokeColor': '#C8C8C8',
      'strokeWidth': '1',
     'fillColor': 'RGB(92,184,92)',
      'fillOpacity': '1'
}
};

var map, selectControl,epsg4326,projectTo,patientsLayer,heatmap;

var baselayerName = "Google Streets";
var heatmapData={
		max: 1,
		data: []
};

var c;

function bulidPatientsLayer(availableData){
	// patients layer
	if(patientsLayer)
		map.removeLayer(patientsLayer);
	patientsLayer = new OpenLayers.Layer.Vector('patients');
	var vector_style_map = new OpenLayers.StyleMap();
	vector_style_map.addUniqueValueRules('default', 'settlement_type',symbolizers_lookup);
	patientsLayer.styleMap = vector_style_map;
	
	selectControl = new OpenLayers.Control.SelectFeature(patientsLayer,  
		{ 
      multiple: false, 
      toggle: true,
      multipleKey: 'shiftKey',
		  hover:false,
		  clickout:true
    } );
	
	patientsLayer.addFeatures(createFeatures(availableData));
	patientsLayer.events.on({
		"featureselected" : function(e) {
			var px = map.getLayerPxFromLonLat(
					new OpenLayers.LonLat(116.172808, 40.0121105).transform(
							new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()));
			var px2 = map.getLayerPxFromLonLat(
					new OpenLayers.LonLat(e.feature.geometry.bounds.left,e.feature.geometry.bounds.bottom));
			var patient = availableData[e.feature.attributes.id];
			//console.log(e.feature.attributes);
			//console.log(patient.city);
			if(patient.city == null) patient.city = "";
			if(patient.county == null) patient.county = "";
			if(patient.detailLocation == null) patient.detailLocation = "";
			var context = 'Patient:' + patient.name + '<br/>Start time:'+new Date(patient.dateValue).Format("yyyy/MM/dd")+'<br/>Address:'
					+ patient.province +patient.city +patient.county
					+ patient.detailLocation
					+ '<br />Description:' + patient.desc
					+ '<br />Datasource:';
					if(patient.sourceLink == null){
						context +=  '<a href=javascript:void(0); onclick=window.open("'+"http://health.sohu.com/s2013/qlg/"+'")>' + "http://health.sohu.com/s2013/qlg/" +'</a><br />';
					}else{
			context +=  '<a href=javascript:void(0); onclick=window.open("'+patient.sourceLink+'")>' + patient.sourceLink +'</a><br />';
		}
           var wraper = document.createElement('div');
            wraper.id="wraper";
			wraper.style.left=(px2.x-30)+'px';
			wraper.style.top=(px2.y-110)+'px';
            wraper.style.position='absolute';
            wraper.style.overflow='hidden';
            wraper.style.zIndex='751';
			wraper.style.width='450px';
			wraper.style.display="none";

           var bubbleshtml='<div style="height:20px;"></div><div style="text-align: left;padding-left:20px"><div class="bubble"><div class="content"  id="content">'+context+"</div></div></div>'";
		 wraper.innerHTML=bubbleshtml;		
			var parentDom=document.getElementById('OpenLayers_Map_2_OpenLayers_Container');
            parentDom.appendChild(wraper);
			//关闭按钮
             var content=document.getElementById('content');
            var wraper_colse = document.createElement('div');
            wraper_colse.id='wraper_colse';
            wraper_colse.className = "olPopupCloseBox"; 
            wraper_colse.style.height='17px';
		    wraper_colse.style.position='absolute';
			wraper_colse.style.right="1px";
		    wraper_colse.style.top='2px';
		    wraper_colse.style.width='17px';
			wraper_colse.style.zIndex='1';
			content.appendChild(wraper_colse);
            $("#wraper").slideDown('slow');

		    OpenLayers.Event.stop(e);
		    // console.log("sel");
		},
	
		"featureunselected" : function(e) {		 
			// console.log("uns");
			 c = document.getElementById('wraper');			
			if(c)c.parentNode.removeChild(c);		
		}
	});

	map.addLayer(patientsLayer);
	map.addControl(selectControl);
	selectControl.activate();
}

function recreateFeatureByDateArray(d){
	var patients = [];
	var k = 0;
	for ( var i = 0; i < birdfluen.length; ++i) {
		for(var j = 0;j < d.length; ++j){
		if(birdfluen[i].age == d[j].age &&
			birdfluen[i].occupation == d[j].occupation &&
			birdfluen[i].dateValue == d[j].date.getTime() &&
			birdfluen[i].latitude == d[j].latitude &&
			birdfluen[i].longitude == d[j].longitude){
				patients[k] = birdfluen[i];
				k ++;
				continue;
			}
		}
	}	
	bulidPatientsLayer(patients);
	
}

function createFeatures(availableData) {
	var features = [];
	for ( var i = 0; i < availableData.length; ++i) {
		var patient = availableData[i];
		features.push(new OpenLayers.Feature.Vector(
				new OpenLayers.Geometry.Point(patient.longitude,patient.latitude).transform(new OpenLayers.Projection("EPSG:4326"),  map.getProjectionObject()),
			{  'settlement_type': gender[patient.sex], id: i }
				)
      );
	}
	return features;
}

/** 
 * TODO 与原始创建代码有重复
* 刷新feature
* @param start 起始时间
* @param end 终止时间
**/
function recreateFeature(start, end){
	var features = [];
	var patients = [];
	var j = 0;
	for ( var i = 0; i < birdfluen.length; ++i) {
		if(birdfluen[i].dateValue > start.getTime() & birdfluen[i].dateValue < end.getTime()){
			patients[j] = birdfluen[i];
			j ++;
		}
	}
	bulidPatientsLayer(patients);
}




function changeFeature() {
	var start, end;
	if (brushBar.extent()[0].getTime() == brushBar.extent()[1].getTime()) {
		start = new Date(dateRange[0].substring(0, 4), dateRange[0].substring(5, 7), dateRange[0].substring(8, 10));
		end = new Date(dateRange[1].substring(0, 4), dateRange[1].substring(5, 7), dateRange[1].substring(8, 10));
	} else {
		start = brushBar.extent()[0];
		end = brushBar.extent()[1];
	}
	var t1 = document.getElementById("changefeature").getAttribute('class').indexOf('active');
	if (t1 == -1) {
		recreateFeature(start, end);
		patientsLayer.setVisibility(true);
	} else {

		patientsLayer.setVisibility(false);
	}
}


function changeHM(){
			            	var start,end;
	            	if(brushBar.extent()[0].getTime() == brushBar.extent()[1].getTime()){
						start = new Date(dateRange[0].substring(0,4), dateRange[0].substring(5, 7), dateRange[0].substring(8,10));
						end = new Date(dateRange[1].substring(0,4), dateRange[1].substring(5, 7), dateRange[1].substring(8,10));
					}else{
						start = brushBar.extent()[0] ;
						end = brushBar.extent()[1];
					}
					var t1 = document.getElementById("changeHM").getAttribute('class').indexOf('active');
					if(t1 == -1){
						recreateHeatmap(start, end);		
heatmap.setVisibility(true);
					}else{
					heatmap.setVisibility(false);
					}	
}


/**
 * 创建Heatmap
 */
function createHeatmap(baseLayer){
	for(var i = 0; i < birdfluen.length; i ++){
		heatmapData.data.push({
			lat:birdfluen[i].latitude,
			lon:birdfluen[i].longitude,
			count: 1
		});
	}
	var transformedTestData = { max: heatmapData.max , data: [] },
	data = heatmapData.data,
	datalen = data.length,
	nudata = [];
	while(datalen--){
		nudata.push({
		lonlat: new OpenLayers.LonLat(data[datalen].lon, data[datalen].lat).
			transform(new OpenLayers.Projection("EPSG:4326"),  map.getProjectionObject()),
		count: data[datalen].count
	});
	}
	transformedTestData.data = nudata;
	
	heatmap = new OpenLayers.Layer.Heatmap( "heatmap", map, baseLayer, 
			{
				opacity:60,
				radius:20,
				gradient: {0.45: "rgb(0,0,255)", 0.55: "rgb(0,255,255)", 0.65: "rgb(0,255,0)", 0.95: "yellow", 1.0: "rgb(255,0,0)"} 
					//0: "rgb(255,0,0)", 1.0: "rgb(255,100,100)" }
			}, {
				visible: true,								
				isBaseLayer: false,
				alwaysInRange : true
			});
	
	heatmap.setDataSet(transformedTestData);
	map.addLayers([heatmap ]);
}

/**
 * TODO 与原始创建代码有重复
 * 刷新heatmap
 * @param start 起始时间
 * @param end 终止时间
 */
function recreateHeatmap(start, end){
	heatmapData.data.splice(0,heatmapData.data.length);  
	for(var i = 0; i < birdfluen.length; i ++){
		if(birdfluen[i].dateValue > start.getTime() & birdfluen[i].dateValue < end.getTime()){
			heatmapData.data.push({
				lat:birdfluen[i].latitude,
				lon:birdfluen[i].longitude,
				count: 1
			});
		}
	}	
	var transformedTestData = { max: heatmapData.max , data: [] },
	data = heatmapData.data,
	datalen = data.length,
	nudata = [];
	while(datalen--){
		nudata.push({
		lonlat: new OpenLayers.LonLat(data[datalen].lon, data[datalen].lat).
			transform(new OpenLayers.Projection("EPSG:4326"),  map.getProjectionObject()),
		count: data[datalen].count
	});
	}
	transformedTestData.data = nudata;
	
	heatmap.setDataSet(transformedTestData);
}
function init() {
	// $.ajax({
		// url : 'birdfluen/data.do',
		// data:{},
		// dataType:"json",
		// success:function(data){
			// birdfluen = data;
			//转换为时间类型
			for(var i = 0; i < birdfluen.length; i ++){
				var temp = birdfluen[i].date;
				birdfluen[i].date = new Date(temp.substring(0,4)+","+temp.substring(5,7)+","+temp.substring(8,10));
				dataPc[i] = {};
				dataPc[i].age = birdfluen[i].age;
				dataPc[i].sex = genderMapping[birdfluen[i].sex];
				dataPc[i].occupation = birdfluen[i].occupation;
				dataPc[i].status = statusMapping[birdfluen[i].status];
				dataPc[i].date = new Date(birdfluen[i].dateValue);	
				dataPc[i].province = birdfluen[i].province;
				dataPc[i].latitude = birdfluen[i].latitude;
				dataPc[i].longitude = birdfluen[i].longitude;						
			}
			//initData(birdfluen);
			//TODO 计算日期的范围	
			
			$('#map').css('height',$(window).height()-$('#pageheader').height());
			$('#map').css('top', $('#pageheader').height());
			
			$('#showLegeadStatus').click(function(){
				$('#legendSex').hide();
				$('#legendAge').hide();
				$('#legendStatus').show();
				
			});
			
			$('#showLegeadSex').click(function(){
				$('#legendStatus').hide();
				$('#legendAge').hide();
				$('#legendSex').show();
			});
			
			$('#showLegeadAge').click(function(){
				$('#legendSex').hide();
				$('#legendStatus').hide();
				$('#legendAge').show();
			});
			
			map = new OpenLayers.Map('map');
			// google streets map layer
			var baseLayer =  new OpenLayers.Layer.Google(baselayerName, // the default
			{
				minZoomLevel: 3, 
				maxZoomLevel: 12,
				visibility : true
			});
			map.addLayer(baseLayer);
			var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
			renderer = (renderer) ? [ renderer ] : OpenLayers.Layer.Vector.prototype.renderers;			
			bulidPatientsLayer(birdfluen);			
			map.setCenter(new OpenLayers.LonLat(105.6670345, 38.0121105).
					transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()),1);
			
			createHeatmap(baseLayer);
			
			createPC2();
			//initslider
			var r = dateRange;
			var option = {'class': 'datecontrol', 
				brush: function () {
					console.log("brush");
	            	var start,end;
	            	if(brushBar.extent()[0].getTime() == brushBar.extent()[1].getTime()){
						start = new Date(dateRange[0].substring(0,4), dateRange[0].substring(5, 7), dateRange[0].substring(8,10));
						end = new Date(dateRange[1].substring(0,4), dateRange[1].substring(5, 7), dateRange[1].substring(8,10));
					}else{
						start = brushBar.extent()[0] ;
						end = brushBar.extent()[1];
					}
					var t1 = document.getElementById("changefeature").getAttribute('class').indexOf('active');
					if(t1 == -1){
					}else{recreateFeature(start, end);		
					}	
					var t2 = document.getElementById("changeHM").getAttribute('class').indexOf('active');
					if(t2 == -1){					
					}else{recreateHeatmap(start, end);			
					}	
	            }, 
	            brushend: function () {
	            	console.log("brushed");
	            	var start,end;
	            	if(brushBar.extent()[0].getTime() == brushBar.extent()[1].getTime()){
						start = new Date(dateRange[0].substring(0,4), dateRange[0].substring(5, 7), dateRange[0].substring(8,10));
						end = new Date(dateRange[1].substring(0,4), dateRange[1].substring(5, 7), dateRange[1].substring(8,10));
					}else{
						start = brushBar.extent()[0] ;
						end = brushBar.extent()[1];
					}
					var t1 = document.getElementById("changefeature").getAttribute('class').indexOf('active');
					if(t1 == -1){
					}else{recreateFeature(start, end);		
					}	
					var t2 = document.getElementById("changeHM").getAttribute('class').indexOf('active');
					if(t2 == -1){					
					}else{recreateHeatmap(start, end);			
					}
	            },
	            range: r
	        };
	        dateslider(option);
	        $("#datecontrol").hide();
	        $("#pc").hide();
	       // document.getElementById("timedisp").textContent = "Current Time:"+new Date().Format("yyyy/MM/dd");
	        
// 	        TODO 添加 dageRange
	        // $("#datecontrol2").dateRangeSlider();
		// }
	// });

}

var parcoords = null;
//创建平行坐标
function createPC2(){
	var titles = {
      age: "Age",
      sex: "Gendar",
      occupation: "Occupation",
      status: "Status",
      date:"Date",
      province:"Province",
      latitude:"Latitude",
      longitude:"Longitude",
   };
   var colorgen = d3.scale.category20();
   var colors = {"Guangdong":colorgen(0),
   "Zhejiang":colorgen(1),
   "HongKong":colorgen(2),
   "Shanghai":colorgen(3),
   "Jiangxi":colorgen(4),
   "Fujian":colorgen(5),
   "Guizhou":colorgen(6),
   "Beijing":colorgen(7),
   "Jiangsu":colorgen(8),
   "Hunan":colorgen(9),
   "Guangxi":colorgen(10),
   "Jilin":colorgen(11),
   "Anhui":colorgen(12),
   "Shandong":colorgen(13)};
   
//   var colors = {"广东省":colorgen(0),
//		   "浙江省":colorgen(1),
//		   "香港":colorgen(2),
//		   "上海市":colorgen(3),
//		   "江西省":colorgen(4),
//		   "福建省":colorgen(5),
//		   "贵州省":colorgen(6),
//		   "北京市":colorgen(7),
//		   "江苏省":colorgen(8),
//		   "湖南省":colorgen(9),
//		   "广西":colorgen(10),
//		   "吉林省":colorgen(11),
//		   "安徽省":colorgen(12),
//		   "山东省":colorgen(13)};
   var color = function(d) {return colors[d.province]; };
	var parData = d3.parcoords()("#pc")
	  .data(dataPc).color(color).dimensionTitles(titles);//.legend(colors);
	parcoords = parData
	  .mode("queue").render()
	  .createAxes().createLegend().brushable().reorderable();
	  
	  parcoords.on("brush", function(d){
		recreateHeatmapByDateArray(d);
		recreateFeatureByDateArray(d);
	  });
	document.getElementById("pc").style.backgroundColor="rgba(184,215,210,0.85)";
}
function resizePc(){
	parcoords.__.width=$(window).width();
	// parcoords.__.
	// parcoords.resize({width:$(window).width();height:$(window).height();});
}
function recreateHeatmapByDateArray(d){
	heatmapData.data.splice(0,heatmapData.data.length);  
	for(var i = 0; i < d.length; i ++){
			heatmapData.data.push({
				lat:d[i].latitude,
				lon:d[i].longitude,
				count: 1
			});		
	}	
	
	var transformedTestData = { max: heatmapData.max , data: [] },
	data = heatmapData.data,
	datalen = data.length,
	nudata = [];
	while(datalen--){
		nudata.push({
		lonlat: new OpenLayers.LonLat(data[datalen].lon, data[datalen].lat).
			transform(new OpenLayers.Projection("EPSG:4326"),  map.getProjectionObject()),
		count: data[datalen].count
	});
	}
	transformedTestData.data = nudata;	
	heatmap.setDataSet(transformedTestData);
}


function reloadFeatureLegeadAge(){
	if(currentLengad == "age"){
		return;
	}
	patientsLayer.styleMap.addUniqueValueRules('default', 'settlement_type_age',symbolizers_lookup_age);
	
	patientsLayer.removeAllFeatures();
	var start = brushBar.extent()[0];
	var end = brushBar.extent()[1];
	if(start.getTime() == end.getTime()){
		start = new Date(dateRange[0].substring(0,4), dateRange[0].substring(5, 7), dateRange[0].substring(8,10));
		end = new Date(dateRange[1].substring(0,4), dateRange[1].substring(5, 7), dateRange[1].substring(8,10));
	}	
	

	
	var features = [];
	for ( var i = 0; i < birdfluen.length; ++i) {
		if(birdfluen[i].date > start & birdfluen[i].date < end){
			var patient = birdfluen[i];
			features.push(new OpenLayers.Feature.Vector(
					new OpenLayers.Geometry.Point(patient.longitude,patient.latitude).transform(new OpenLayers.Projection("EPSG:4326"),  map.getProjectionObject()),
				{  'settlement_type_age': ageRange[Math.floor(patient.age/10)], id: i }
					)
			);
		}
	}
	patientsLayer.addFeatures(features);
	currentLengad = "age";
}

function reloadFeatureLegeadSex(){
	if(currentLengad == "sex")
		return;
	patientsLayer.styleMap.addUniqueValueRules('default', 'settlement_type',symbolizers_lookup);
	
	patientsLayer.removeAllFeatures();
	var start = brushBar.extent()[0];
	var end = brushBar.extent()[1];
	if(start.getTime() == end.getTime()){
		start = new Date(dateRange[0].substring(0,4), dateRange[0].substring(5, 7), dateRange[0].substring(8,10));
		end = new Date(dateRange[1].substring(0,4), dateRange[1].substring(5, 7), dateRange[1].substring(8,10));
	}	
	

	
	var features = [];
	for ( var i = 0; i < birdfluen.length; ++i) {
		if(birdfluen[i].date > start & birdfluen[i].date < end){
			var patient = birdfluen[i];
			features.push(new OpenLayers.Feature.Vector(
					new OpenLayers.Geometry.Point(patient.longitude,patient.latitude).transform(new OpenLayers.Projection("EPSG:4326"),  map.getProjectionObject()),
				{  'settlement_type': gender[patient.sex], id: i }
					)
			);
		}
	}
	patientsLayer.addFeatures(features);
	currentLengad = "sex";
}

function reloadFeatureLegeadStatus(){
	if(currentLengad == "status")
		return;
	patientsLayer.styleMap.addUniqueValueRules('default', 'settlement_type_status',symbolizers_lookup_status);
	
	patientsLayer.removeAllFeatures();
	var start = brushBar.extent()[0];
	var end = brushBar.extent()[1];
	if(start.getTime() == end.getTime()){
		start = new Date(dateRange[0].substring(0,4), dateRange[0].substring(5, 7), dateRange[0].substring(8,10));
		end = new Date(dateRange[1].substring(0,4), dateRange[1].substring(5, 7), dateRange[1].substring(8,10));
	}	
	
	var features = [];
	for ( var i = 0; i < birdfluen.length; ++i) {
		if(birdfluen[i].date > start & birdfluen[i].date < end){
			var patient = birdfluen[i];
			features.push(new OpenLayers.Feature.Vector(
					new OpenLayers.Geometry.Point(patient.longitude,patient.latitude).transform(new OpenLayers.Projection("EPSG:4326"),  map.getProjectionObject()),
				{  'settlement_type_status': statusRange[patient.status], id: i }
					)
			);
		}
	}
	patientsLayer.addFeatures(features);
	currentLengad = "status";
}


function showLegeadAge(){
	console.log("show");
}

function showPc2(){
	$("#datecontrol").hide();
	$("#pc").show();
}
function showTimeSlider(){
	$("#pc").hide();
	$("#datecontrol").show();
}

var timerPlay;
//点击播放按钮
function play(){

	var t = document.getElementById("playButton").getAttribute('class').indexOf('active');
	if(t == -1){
	    		
	    		//console.log(time);	    		
	    		var start,end;
	            if(brushBar.extent()[0].getTime() == brushBar.extent()[1].getTime()){
					start = new Date(dateRange[0].substring(0,4), dateRange[0].substring(5, 7), dateRange[0].substring(8,10));
					end = new Date(dateRange[1].substring(0,4), dateRange[1].substring(5, 7), dateRange[1].substring(8,10));
				}else{
					start = brushBar.extent()[0] ;
					end = brushBar.extent()[1];
				}
				var current = start.getTime();
				var time = Math.round((end.getTime() - start.getTime())/30);
	    		timerPlay = setInterval(function(){
	    			if(current < end){
	    			current = current + time;
	    			$("#timedisp").show();
				    document.getElementById("timedisp").textContent = "Current Time:"+new Date(current).Format("yyyy/MM/dd");
				var t1 = document.getElementById("changefeature").getAttribute('class').indexOf('active');
				if(t1 == -1){
				}else{recreateFeature(start, new Date(current));					
				}	
				var t2 = document.getElementById("changeHM").getAttribute('class').indexOf('active');
				if(t2 == -1){					
				}else{recreateHeatmap(start, new Date(current));					
				}	    		
					    		
	    			}else{
	    				clearInterval(timerPlay);
	    				document.getElementById("timedisp").textContent = "Current Time:"+new Date().Format("yyyy/MM/dd");
	    				document.getElementById("playButton").setAttribute('class',
	    					document.getElementById("playButton").getAttribute('class').replace("active",""));
	    				$("#timedisp").hide();
	    			}
	    			}, 300);
	}else{
		clearInterval(timerPlay);
	}	
}

function showHelp(){
	 $("#helpButton" ).dialog();
}
