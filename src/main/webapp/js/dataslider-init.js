/**
 * 
 */
var zr;
var beginDate = '2014/01/01';
var endDate ='2014/01/15';
var availableDate = [];

function filteData(){
	availableDate = [];
	var bs = birdflu.length;
	for(var i = 0;i < bs;i++){
		var d = birdflu[i].suspected;
		if('' != d && ( new Date(d) >= new Date(beginDate) && new Date(d) <= new Date(endDate)))
			availableDate.push(birdflu[i]);
	}
}

function rerederMap(){
	filteData();
	bulidPatientsLayer(availableDate);
	//rerederPaints
	//rerederHeatMap
}

require.config({
	packages : [ {
		name : 'zrender',
		location : 'js/zrender-1.0.9/src',
		main : 'zrender'
	} ]
});
require([ 'zrender'],
		function(zrender) {
			var ds = document.getElementById('dataslider');
			ds.style.width = document.body.clientWidth + 'px';
			zr = zrender.init(document.getElementById('dataslider'));
			slider({
				startLeft:10,
				endRight : 10,
				dates:(function(){
					return ['2014-01-01','2014-01-02','2014-01-03','2014-01-04','2014-01-05','2014-01-06','2014-01-07','2014-01-08','2014-01-09','2014-01-10','2014-01-11','2014-01-12','2014-01-13','2014-01-14','2014-01-15'];
				})(),
				preSlide:function(date){
					beginDate = date;
					rerederMap();
				},aftSlide:function(date){
					endDate = date;
					rerederMap();
				}
			});
});