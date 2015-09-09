<!DOCTYPE html>
<%@page contentType="text/html;charset=UTF-8"%>
<html>
<head>
<title>H7N9病例时空分析</title>
<meta content="text/html; charset=UTF-8" http-equiv="Content-Type">

<script type="text/javascript" src='js/jquery.min.js'></script>

<script type="text/javascript" src="js/d3.js"></script>
<script type="text/javascript" src="js/birdflu.js"></script>
<script type="text/javascript" src="js/d3-dateslider.js"></script>
<script type="text/javascript" src="js/parallel-coordinates-master/d3.parcoords.js"></script>

<link rel="stylesheet" type="text/css"
	href="js/OpenLayers-2.13.1/theme/default/style.css" />
<link rel="stylesheet" type="text/css" href="css/page.css" />
<link rel="stylesheet" type="text/css" href="css/bubble.css" />
<link rel="stylesheet" type="text/css" href="css/button.css" />
<link rel="stylesheet" type="text/css" href="css/style.css" />
<link rel="stylesheet" type="text/css" href="css/dviz.css" />
<link rel="stylesheet" type="text/css" href="js/bootstrap-3.1.1-dist/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="js/parallel-coordinates-master/d3.parcoords.css">
	
<script type="text/javascript" src="js/OpenLayers-2.13.1/OpenLayers.js" ></script>
<!--  <script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script> -->
<script src="js/OpenlayersLayerTianditu.js" type="text/javascript"></script>
<script type="text/javascript" src='js/heatmap.js'></script>
<script type="text/javascript" src='js/heatmap-openlayers.js'></script>
<script type="text/javascript" src='js/vector.js'></script>
<script type="text/javascript" src='js/bootstrap-3.1.1-dist/js/bootstrap.js'></script>

<style type="text/css">
#dataslider {
	margin-top: 5px;
	width: 1000px;
	height: 130px;
}
</style>
<style type="text/css">
.datecontrol {
	height: 60px;
	width: 200px;
	position: fixed;
	bottom: 10px;
}

text {
	font-size: 12px;
}

rect {
	border: 1px solid #E3E3E3;
	border-radius: 4px;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05) inset;
}

.axis path,.axis line {
	fill: none;
	shape-rendering: crispedges;
	stroke: #000000;
}

.open {
	position: fixed;
	color: #f00;
	right: 5px;
	font-size: 21px;
	font-weight: 700;
	line-height: 1;
	text-shadow: 0 1px 0 #f00;
	bottom: 10px;
	cursor: pointer;
}

.open a {
	color: red;
}
</style>
</head>
<body onLoad="init()">
	<div class="pageheader">
		<div id="pageheader" class="pageheaderLeft">
			<b>H7N9病例时空分析</b>(数据来源：各省市卫计委与各大门户网站)
		</div>
		<div id="pageheader" class="pageheaderRight">
			<a href = "en/index.html">English</a>
		</div>
	</div>
	<div id="map"
		style="height: 0px; border: 1px solid #ccc; padding: 10px;"></div>
	<div class="pagefooter">
		<div class="pagefooterContent">
			<b> 中国科学院计算机网络信息中心 科学数据中心,北龙泽达(北京)数据科技有限公司 <a
				href="mailto:viz@cnic.cn?Subject=h7n9可视化">数据可视化组</a>
				<a href="http://weibo.com/dataviz" onclick="openwin()">微博</a>
			</b>
		</div>
	</div>
	<div id="pc" class="parcoords"
		style="position: fixed; bottom: 30px; left: 0px; right: 0px; height: 500px; margin-left: 0px;"></div>
	<div class='datecontrol' id='datecontrol'
		style="position: fixed; bottom: 30px;"></div>
	<!-- <div id='datecontrol2' style="position: fixed; left: 0px; right: 0px;bottom: 60px;"></div> -->
	<h3>
		<div style="text-align: center;">
			<span id="timedisp" class="label label-success" align="center"
				style="position: fixed; top: 50px; left:40px;text-align: center; width: 400px;display:none">当前时间</span>
		</div>
	</h3>
	<div class="btn-group" data-toggle="buttons"
		style="position: fixed; right: 10px; top: 40px">
		<label id="changefeature" class="btn btn-primary active"
			onclick="changeFeature();" style="width: 90px" title="显示或隐藏疫情的个体分布情况">
			<input type="checkbox">个体分布
		</label> <label id="changeHM" class="btn btn-primary active"
			onclick="changeHM();" style="width: 90px" title="显示或隐藏疫情的群体分布情况">
			<input type="checkbox">群体分布
		</label>
	</div>
	<div class="sigleLegend"
		style="position: fixed; right: 200px; top: 45px">
		<span class="lMan">男性</span> <span class="lWoman">女性</span>
	</div>
	<div class="btn-group" style="position: fixed; right: 10px; top: 90px;">
		<button id="showPc" type="button" class="btn btn-primary"
			onclick="showPc();" style="width: 90px" title="显示平行坐标选择器">平行坐标</button>
		<button id="showTime" type="button" class="btn btn-primary"
			onclick="showTimeSlider()" style="width: 90px" title="显示时间轴选择器">时间轴</button>
	</div>
	<div class="btn-group" data-toggle="buttons"
		style="position: fixed; right: 10px; top: 140px;">
		<label id="playButton" class="btn btn-primary" onclick="play();"
			style="width: 180px" title="选中时间轴的范围，点击播放该时间段动画"> <input
			type="checkbox">按时间播放动画
		</label>
	</div>

	<button class="btn btn-primary" data-toggle="modal"
		data-target="#myModal"
		style="position: fixed; right: 10px; top: 200px; width: 180px; font: 100% 微软雅黑">
		如何使用</button>

	<div class="modal fade" id="myModal" tabindex="-1" role="dialog"
		aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="myModalLabel">使用说明</h4>
				</div>
				<div class="modal-body">
					<b>概述:</b>本系统通过可视化的手段，将H7N9的发病情况进行可视化。<br /> <b>功能介绍:</b><br />1.点击"个体分布"与"群体分布"，显示发病人群在地图上的个体或群体分布情况。
					<br />2.个体分布情况中，圆点表示发病个体，圆点颜色代表性别，在地图上点击圆点，显示该个体详细信息。 <br />3.群体分布情况中，通过热力图的形式进行展现，颜色越深，表明发病人数越多。
					<br />4."平行坐标"与"时间轴"是两个过滤组件，点击选择某个过滤组件，在该组件上进行数据过滤，过滤结果显示在地图上。 <br />5.平行坐标与时间轴均可以通过在轴上的直接拖拽实现数据过滤。
					<br />6.在使用时间轴时，点击"按时间播放动画"，可以按时间从早到晚播放H7N9发病情况。 <br /> <b>浏览器支持：</b>Chrome,Firefox
					<br /> <b>QA:</b> <br />Q:为什么点击"平行坐标"或"时间轴"没有反应? <br />A:请关闭浏览器中的广告屏蔽插件后刷新页面尝试。
					<br />Q:我遇到了其它问题 <br />A:尝试清空浏览器缓存重试。
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
				</div>
			</div>
		</div>
	</div>



	<script type="text/javascript" src='js/parallel-coordinates.js'></script>
	<script type="text/javascript">
		$(function() {
			$('.close').click(function() {
				$('.tools').hide(1000);
			});
			$('.open').click(function() {
				$('.tools').show(1000);
			});
		})
	</script>
</body>
</html>